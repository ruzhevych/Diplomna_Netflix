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

    public async Task<SubscriptionDto?> GetByIdAsync(string id)
    {
        if (!Guid.TryParse(id, out var guidId))
            return null; // некоректний формат id
        
        var s = await _subscriptionRepo.Query()
            .FirstOrDefaultAsync(x => x.Id == guidId);
        
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
    
    public async Task<SubscriptionDto?> GetByUserIdAsync(long userId)
    {
        var s = await _subscriptionRepo.Query()
            .FirstOrDefaultAsync(x => x.UserId == userId);

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


    public async Task<SubscriptionDto> CreateAsync(SubscriptionCreateDto dto, long userId)
    {
        var entity = new SubscriptionEntity
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Type = dto.Type,
            StartDate = DateTime.UtcNow,
            EndDate = DateTime.UtcNow.AddDays(30),
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
