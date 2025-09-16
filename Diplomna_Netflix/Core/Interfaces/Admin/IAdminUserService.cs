using Core.DTOs.AdminDTOs.Users;
using Core.Models;

namespace Core.Interfaces.Admin;

public interface IAdminUserService
{
    Task<PagedResult<UserDto>> GetUsersAsync(int page, int pageSize, string? search);
    Task<UserDto> GetByIdAsync(string id);
    Task<PagedResult<BlockedUserDto>> GetBlockedUsersAsync(int page, int pageSize, string? search);
    Task<BlockedUserDto> GetBlockedUserAsync(long id);
    Task BlockUserAsync(BlockUserDto dto, long adminId);
    Task UnblockUserAsync(long userId, long adminId);
    Task ChangeUserRoleAsync(long userId, string role);
    Task DeleteUserAsync(long userId);
    Task<bool> SendMessageAsync(SendMessageDto dto);
        
}