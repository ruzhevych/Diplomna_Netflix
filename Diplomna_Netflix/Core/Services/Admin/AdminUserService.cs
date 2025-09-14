using AutoMapper;
using Core.DTOs.AdminDTOs.Users;
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
    private readonly IMapper _mapper;

    public AdminUserService(
        UserManager<UserEntity> userManager,
        IEmailService emailService,
        IRepository<UserBlockHistoryEntity> blockHistoryRepo,
        IRepository<AdminMessageEntity> adminMessageRepo,
        IMapper mapper)
    {
        _userManager = userManager;
        _emailService = emailService;
        _blockHistoryRepo = blockHistoryRepo;
        _adminMessageRepo = adminMessageRepo;
        _mapper = mapper;
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
    
    public async Task<UserDto> GetByIdAsync(string id)
    {
        var user = await _userManager.Users
            .Include(u => u.UserRoles)
            .ThenInclude(ur => ur.Role)
            .FirstOrDefaultAsync(u => u.Id.ToString() == id);

        if (user == null) return null;

        return _mapper.Map<UserDto>(user);
    }
    
    public async Task<PagedResult<BlockedUserDto>> GetBlockedUsersAsync(int page, int pageSize, string? search)
    {
        var query = _userManager.Users
            .Include(u => u.BlockHistory)
            .ThenInclude(b => b.Admin)
            .Where(u => u.IsBlocked)
            .AsQueryable();

        if (!string.IsNullOrEmpty(search))
        {
            query = query.Where(u => u.Email.Contains(search) ||
                                     u.FirstName.Contains(search) ||
                                     u.LastName.Contains(search));
        }

        var totalCount = await query.CountAsync();

        var users = await query
            .OrderByDescending(u => u.BlockHistory
                .OrderByDescending(b => b.BlockedAt)
                .Select(b => b.BlockedAt)
                .FirstOrDefault()) // сортуємо по даті останнього блокування
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var result = new List<BlockedUserDto>();

        foreach (var user in users)
        {
            var activeBlock = user.BlockHistory
                .OrderByDescending(b => b.BlockedAt)
                .FirstOrDefault(b => b.IsActive);

            if (activeBlock == null)
                continue; // без активного блокування пропускаємо

            result.Add(new BlockedUserDto
            {
                UserId = user.Id,
                UserEmail = user.Email!,
                AdminId = activeBlock.AdminId,
                AdminEmail = activeBlock.Admin?.Email ?? "Unknown",
                BlockedAt = activeBlock.BlockedAt,
                DurationDays = activeBlock.Duration.HasValue ? (int)activeBlock.Duration.Value.TotalDays : 0,
                Reason = activeBlock.Reason
            });
        }

        return new PagedResult<BlockedUserDto>(result, totalCount, page, pageSize);
    }

    public async Task<BlockedUserDto> GetBlockedUserAsync(long id)
    {
        // Дістаємо останній запис блокування (якщо є)
        var block = await _blockHistoryRepo
            .GetAllQueryable()
            .Where(b => b.UserId == id && b.IsActive)
            .OrderByDescending(b => b.BlockedAt)
            .Include(b => b.Admin)
            .FirstOrDefaultAsync();

        if (block == null) return null;

        return _mapper.Map<BlockedUserDto>(block);
    }

    public async Task BlockUserAsync(BlockUserDto dto, long adminId)
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
            AdminId = adminId,
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
