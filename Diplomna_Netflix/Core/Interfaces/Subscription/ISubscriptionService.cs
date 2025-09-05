using Core.DTOs.SubscriptionsDTOs;

namespace Core.Interfaces.Subscription;

public interface ISubscriptionService
{
    Task<IEnumerable<SubscriptionDto>> GetAllAsync();
    Task<SubscriptionDto?> GetByIdAsync(string id);
    Task<SubscriptionDto> CreateAsync(SubscriptionCreateDto dto);
    Task<bool> UpdateAsync(int id, SubscriptionUpdateDto dto);
    Task<bool> DeleteAsync(string id);
}