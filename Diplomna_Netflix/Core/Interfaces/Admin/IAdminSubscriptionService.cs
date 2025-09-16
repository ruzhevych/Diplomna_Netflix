using Core.DTOs.AdminDTOs.Subscriptions;

namespace Core.Interfaces.Admin;

public interface IAdminSubscriptionService
{
    Task<IEnumerable<AdminSubscriptionDto>> GetAllAsync(string? userEmail = null, string? subscriptionType = null);
    Task<AdminSubscriptionDto?> GetByIdAsync(int id);
    Task<AdminSubscriptionDto> CreateAsync(AdminSubscriptionCreateDto dto);
    Task<bool> UpdateAsync(int id, AdminSubscriptionUpdateDto dto);
    Task<bool> DeleteAsync(Guid id);
}