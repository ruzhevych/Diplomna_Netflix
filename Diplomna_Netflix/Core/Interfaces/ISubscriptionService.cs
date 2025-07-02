using Core.DTOs.SubscriptionsDTOs;

namespace Core.Interfaces
{
    public interface ISubscriptionService
    {
        Task<IEnumerable<SubscriptionDto>> GetAllAsync();
        Task<SubscriptionDto?> GetByIdAsync(Guid id);
        Task<SubscriptionDto> CreateAsync(SubscriptionCreateDto dto);
        Task<bool> UpdateAsync(Guid id, SubscriptionUpdateDto dto);
        Task<bool> DeleteAsync(Guid id);
    }
}