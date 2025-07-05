using Core.DTOs.SubscriptionsDTOs;
using Core.Interfaces;
using Data.Context;
using Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace Core.Services
{
    public class SubscriptionService : ISubscriptionService
    {
        private readonly NetflixDbContext _context;

        public SubscriptionService(NetflixDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<SubscriptionDto>> GetAllAsync()
        {
            return await _context.Subscriptions
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
            var s = await _context.Subscriptions.FindAsync(id);
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

            _context.Subscriptions.Add(entity);
            await _context.SaveChangesAsync();

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
            var entity = await _context.Subscriptions.FindAsync(id);
            if (entity == null) return false;

            entity.Type = dto.Type;
            entity.StartDate = dto.StartDate;
            entity.EndDate = dto.EndDate;
            entity.IsActive = dto.IsActive;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var entity = await _context.Subscriptions.FindAsync(id);
            if (entity == null) return false;

            _context.Subscriptions.Remove(entity);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
