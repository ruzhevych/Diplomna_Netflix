<<<<<<< HEAD

=======
>>>>>>> main
using Core.DTOs.AdminDTOs;
using Core.Interfaces;
using Core.Interfaces.Admin;
using Core.Models;
using Data.Context;
using Data.Entities;
using Data.Entities.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Core.Services.Admin
{
    public class AdminUserService : IAdminUserService
    {
        private readonly UserManager<UserEntity> _userManager;
        private readonly NetflixDbContext _context;
        private readonly IEmailService _emailService;

        public AdminUserService(UserManager<UserEntity> userManager, NetflixDbContext context, IEmailService emailService)
        {
            _userManager = userManager;
            _context = context;
            _emailService = emailService;
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
                .Select(u => new UserDto
                {
                    Id = u.Id,
                    Email = u.Email!,
                    FullName = u.FullName ?? "",
                    Role = _context.UserRoles
                        .Where(r => r.UserId == u.Id)
                        .Join(_context.Roles, ur => ur.RoleId, r => r.Id, (ur, r) => r.Name!)
                        .FirstOrDefault() ?? "User",
                    IsBlocked = u.IsBlocked
                })
                .ToListAsync();

            return new PagedResult<UserDto>(users, totalCount, page, pageSize);
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

            _context.UserBlockHistories.Add(blockHistory);
            await _userManager.UpdateAsync(user);
            await _context.SaveChangesAsync();
        }

        public async Task UnblockUserAsync(long userId, long adminId)
        {
            var user = await _userManager.FindByIdAsync(userId.ToString());
            if (user == null) throw new Exception("User not found");

            user.IsBlocked = false;
            user.BlockUntil = null;

            var lastBlock = await _context.UserBlockHistories
                .Where(b => b.UserId == userId && b.IsActive)
                .OrderByDescending(b => b.BlockedAt)
                .FirstOrDefaultAsync();

            if (lastBlock != null)
            {
                lastBlock.IsActive = false;
                lastBlock.UnblockedAt = DateTime.UtcNow;
            }

            await _userManager.UpdateAsync(user);
            await _context.SaveChangesAsync();
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
                // надсилаємо email
                await _emailService.SendEmailAsync(user.Email!, dto.Subject, dto.Message);
                adminMessage.IsSent = true;
            }
            catch
            {
                adminMessage.IsSent = false;
            }

            // зберігаємо в БД незалежно від того, чи успішно відправилось
            _context.AdminMessages.Add(adminMessage);
            await _context.SaveChangesAsync();

            return adminMessage.IsSent;
        }
    }
}