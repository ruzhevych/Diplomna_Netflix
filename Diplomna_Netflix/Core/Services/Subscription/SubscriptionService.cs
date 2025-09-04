using Core.DTOs.SubscriptionsDTOs;
using Core.Interfaces.Subscription;
using Core.Interfaces.Repository;
using Data.Entities.Subscription;
using Microsoft.EntityFrameworkCore;

namespace Core.Services.Subscription;

public class SubscriptionService : ISubscriptionService
{
    private readonly IRepository<SubscriptionEntity> _subscriptionRepo;

    public SubscriptionService(IRepository<SubscriptionEntity> subscriptionRepo)
    {
        _subscriptionRepo = subscriptionRepo;
    }

    public async Task<IEnumerable<SubscriptionDto>> GetAllAsync()
    {
        return await _subscriptionRepo.Query()
            .Select(s => new SubscriptionDto
            {
                Id = s.Id,
                UserId = s.UserId,
                Type = s.Type,
                StartDate = s.StartDate,
                EndDate = s.EndDate,
                IsActive = s.IsActive
            })
            .ToListAsync();
    }

    public async Task<SubscriptionDto?> GetByIdAsync(Guid id)
    {
        var s = await _subscriptionRepo.GetByIdAsync(id);
        if (s == null) return null;

        return new SubscriptionDto
        {
            Id = s.Id,
            UserId = s.UserId,
            Type = s.Type,
            StartDate = s.StartDate,
            EndDate = s.EndDate,
            IsActive = s.IsActive
        };
    }

    public async Task<SubscriptionDto> CreateAsync(SubscriptionCreateDto dto)
    {
        var entity = new SubscriptionEntity
        {
            Id = Guid.NewGuid(),
            UserId = dto.UserId,
            Type = dto.Type,
            StartDate = dto.StartDate,
            EndDate = dto.EndDate,
            IsActive = true
        };

        await _subscriptionRepo.AddAsync(entity);
        await _subscriptionRepo.SaveChangesAsync();

        return new SubscriptionDto
        {
            Id = entity.Id,
            UserId = entity.UserId,
            Type = entity.Type,
            StartDate = entity.StartDate,
            EndDate = entity.EndDate,
            IsActive = entity.IsActive
        };
    }

    public async Task<bool> UpdateAsync(Guid id, SubscriptionUpdateDto dto)
    {
        var entity = await _subscriptionRepo.GetByIdAsync(id);
        if (entity == null) return false;

        entity.Type = dto.Type;
        entity.StartDate = dto.StartDate;
        entity.EndDate = dto.EndDate;
        entity.IsActive = dto.IsActive;

        _subscriptionRepo.Update(entity);
        await _subscriptionRepo.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var entity = await _subscriptionRepo.GetByIdAsync(id);
        if (entity == null) return false;

        _subscriptionRepo.Delete(entity);
        await _subscriptionRepo.SaveChangesAsync();
        return true;
    }
}
