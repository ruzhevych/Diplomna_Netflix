using Core.DTOs.AdminDTOs;
using Core.Interfaces.Admin;
using Core.Interfaces.Email;
using Core.Interfaces.Repository;
using Core.Models;
using Data.Entities.Admin;
using Data.Entities.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Core.Services.Admin;

public class AdminUserService : IAdminUserService
{
    private readonly UserManager<UserEntity> _userManager;
    private readonly IEmailService _emailService;

    private readonly IRepository<UserBlockHistoryEntity> _blockHistoryRepo;
    private readonly IRepository<AdminMessageEntity> _adminMessageRepo;

    public AdminUserService(
        UserManager<UserEntity> userManager,
        IEmailService emailService,
        IRepository<UserBlockHistoryEntity> blockHistoryRepo,
        IRepository<AdminMessageEntity> adminMessageRepo)
    {
        _userManager = userManager;
        _emailService = emailService;
        _blockHistoryRepo = blockHistoryRepo;
        _adminMessageRepo = adminMessageRepo;
    }

    public async Task<PagedResult<UserDto>> GetUsersAsync(int page, int pageSize, string? search)
    {
        var query = _userManager.Users.AsQueryable();

        if (!string.IsNullOrEmpty(search))
        {
            query = query.Where(u => u.Email.Contains(search) ||
                                     u.FirstName.Contains(search) ||
                                     u.LastName.Contains(search));
        }

        var totalCount = await query.CountAsync();

        var users = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var userDtos = new List<UserDto>();

        foreach (var user in users)
        {
            var roles = await _userManager.GetRolesAsync(user);

            userDtos.Add(new UserDto
            {
                Id = user.Id,
                Email = user.Email!,
                FullName = user.FullName ?? "",
                Role = roles.FirstOrDefault() ?? "User",
                IsBlocked = user.IsBlocked
            });
        }

        return new PagedResult<UserDto>(userDtos, totalCount, page, pageSize);
    }


    public async Task BlockUserAsync(BlockUserDto dto)
    {
        var user = await _userManager.FindByIdAsync(dto.UserId.ToString());
        if (user == null) throw new Exception("User not found");

        user.IsBlocked = true;
        user.BlockUntil = dto.DurationDays > 0
            ? DateTime.UtcNow.AddDays(dto.DurationDays)
            : null;

        var blockHistory = new UserBlockHistoryEntity
        {
            UserId = user.Id,
            AdminId = dto.AdminId,
            BlockedAt = DateTime.UtcNow,
            Duration = dto.DurationDays > 0 ? TimeSpan.FromDays(dto.DurationDays) : null,
            Reason = dto.Reason,
            IsActive = true
        };

        await _blockHistoryRepo.AddAsync(blockHistory);
        await _userManager.UpdateAsync(user);
        await _blockHistoryRepo.SaveChangesAsync();
    }

    public async Task UnblockUserAsync(long userId, long adminId)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user == null) throw new Exception("User not found");

        user.IsBlocked = false;
        user.BlockUntil = null;

        var lastBlock = await _blockHistoryRepo
            .GetAllQueryable()
            .Where(b => b.UserId == userId && b.IsActive)
            .OrderByDescending(b => b.BlockedAt)
            .FirstOrDefaultAsync();

        if (lastBlock != null)
        {
            lastBlock.IsActive = false;
            lastBlock.UnblockedAt = DateTime.UtcNow;
            _blockHistoryRepo.Update(lastBlock);
        }

        await _userManager.UpdateAsync(user);
        await _blockHistoryRepo.SaveChangesAsync();
    }

    public async Task ChangeUserRoleAsync(long userId, string role)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString())
            ?? throw new Exception("User not found");

        var currentRoles = await _userManager.GetRolesAsync(user);
        await _userManager.RemoveFromRolesAsync(user, currentRoles);
        await _userManager.AddToRoleAsync(user, role);
    }

    public async Task DeleteUserAsync(long userId)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString())
            ?? throw new Exception("User not found");

        await _userManager.DeleteAsync(user);
    }

    public async Task<bool> SendMessageAsync(SendMessageDto dto)
    {
        var user = await _userManager.Users.FirstOrDefaultAsync(u => u.Id == dto.UserId);
        if (user == null || string.IsNullOrEmpty(user.Email))
            throw new Exception("User not found or email is empty.");

        var adminMessage = new AdminMessageEntity
        {
            UserId = user.Id,
            Email = user.Email!,
            Subject = dto.Subject,
            Message = dto.Message,
            SentAt = DateTime.UtcNow
        };

        try
        {
            await _emailService.SendEmailAsync(user.Email!, dto.Subject, dto.Message);
            adminMessage.IsSent = true;
        }
        catch
        {
            adminMessage.IsSent = false;
        }

        await _adminMessageRepo.AddAsync(adminMessage);
        await _adminMessageRepo.SaveChangesAsync();

        return adminMessage.IsSent;
    }
}
