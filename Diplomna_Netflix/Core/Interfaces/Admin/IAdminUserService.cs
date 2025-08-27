using Core.DTOs.AdminDTOs;
using Core.Models;

namespace Core.Interfaces.Admin
{
    public interface IAdminUserService
    {
        Task<PagedResult<UserDto>> GetUsersAsync(int page, int pageSize, string? search);
        /*Task BlockUserAsync(long userId);
        Task UnblockUserAsync(long userId);*/
        Task ChangeUserRoleAsync(long userId, string role);
        Task DeleteUserAsync(long userId);
        Task<bool> SendMessageAsync(SendMessageDto dto);
        Task BlockUserAsync(long userId, string? reason = null, int? durationDays = null, long? adminId = null);
        Task UnblockUserAsync(long userId, long? adminId = null);
    }
}