using Core.DTOs.AdminDTOs.Users;
using Core.Models;

namespace Core.Interfaces.Admin;

public interface IAdminUserService
{
    Task<PagedResult<UserDto>> GetUsersAsync(int page, int pageSize, string? search);
    Task BlockUserAsync(BlockUserDto dto);
    Task UnblockUserAsync(long userId, long adminId);
    Task ChangeUserRoleAsync(long userId, string role);
    Task DeleteUserAsync(long userId);
    Task<bool> SendMessageAsync(SendMessageDto dto);
        
}