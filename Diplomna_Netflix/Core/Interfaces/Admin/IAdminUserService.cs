using Core.DTOs.Admin;
using Core.Models;

namespace Core.Interfaces.Admin
{
    public interface IAdminUserService
    {
        Task<PagedResult<UserDto>> GetUsersAsync(int page, int pageSize, string? search);
        Task BlockUserAsync(long userId);
        Task UnblockUserAsync(long userId);
        Task ChangeUserRoleAsync(long userId, string role);
        Task DeleteUserAsync(long userId);
        Task<bool> SendMessageAsync(SendMessageDto dto);
    }
}