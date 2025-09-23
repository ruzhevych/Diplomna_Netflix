using Core.DTOs.SubscriptionsDTOs;

namespace Core.Interfaces.Subscription;

public interface ISubscriptionService
{
    Task<IEnumerable<SubscriptionDto>> GetAllAsync();
    Task<SubscriptionDto?> GetByIdAsync(string id);
    Task<SubscriptionDto?> GetByUserIdAsync(long userId);
    Task<SubscriptionDto> CreateAsync(SubscriptionCreateDto dto, long userId);
    Task<bool> UpdateAsync(Guid id, SubscriptionUpdateDto dto);
    Task<bool> DeleteAsync(Guid id);
}