using Core.DTOs.AdminDTOs.Subscriptions;
using Core.DTOs.SubscriptionsDTOs;
using Core.Interfaces.Admin;
using Core.Interfaces.Repository;
using Core.Interfaces.Subscription;
using Core.Repositories;
using Data.Context;
using Data.Entities.Identity;
using Data.Entities.Subscription;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace Core.Services.Subscription;

public class AdminSubscriptionService : IAdminSubscriptionService
{
    private readonly IRepository<SubscriptionEntity> _subscriptionRepo;
    private readonly UserManager<UserEntity> _userManager;

    public AdminSubscriptionService(IRepository<SubscriptionEntity> subscriptionRepo, UserManager<UserEntity> userManager)
    {
        _subscriptionRepo = subscriptionRepo;
        _userManager = userManager;
    }

    public async Task<IEnumerable<AdminSubscriptionDto>> GetAllAsync(string? search = null, string? type = null)
    {
        var query = _subscriptionRepo.Query().Include(s => s.User).AsQueryable();

        if (!string.IsNullOrEmpty(search))
            query = query.Where(s => s.User.Email.Contains(search));

        if (!string.IsNullOrEmpty(type))
            query = query.Where(s => s.Type == type);

        return await query.Select(s => new AdminSubscriptionDto
        {
            Id = s.Id,
            UserEmail = s.User.Email,
            Type = s.Type,
            StartDate = s.StartDate,
            EndDate = s.EndDate,
            IsActive = s.IsActive
        }).ToListAsync();
    }

    public async Task<AdminSubscriptionDto?> GetByIdAsync(int id)
    {
        
        var user = await _userManager.FindByIdAsync(id.ToString());
        if (user == null)
            throw new Exception("User not found");

        var sub = await _subscriptionRepo.Query()
            .FirstOrDefaultAsync(s => s.UserId == user.Id);

        if (sub == null) return null;

        return new AdminSubscriptionDto
        {
            Id = sub.Id,
            UserEmail = sub.User.Email,
            Type = sub.Type,
            StartDate = sub.StartDate,
            EndDate = sub.EndDate,
            IsActive = sub.IsActive
        };
    }

    public async Task<AdminSubscriptionDto> CreateAsync(AdminSubscriptionCreateDto dto)
    {
        var user = await _userManager.FindByIdAsync(dto.UserId.ToString());
        if (user == null) throw new Exception("User not found");

        var sub = new SubscriptionEntity
        {
            UserId = dto.UserId,
            Type = dto.Type,
            StartDate = dto.StartDate,
            EndDate = dto.EndDate,
            IsActive = true
        };

        await _subscriptionRepo.AddAsync(sub);
        await _subscriptionRepo.SaveChangesAsync();

        return new AdminSubscriptionDto
        {
            Id = sub.Id,
            UserEmail = user.Email,
            Type = sub.Type,
            StartDate = sub.StartDate,
            EndDate = sub.EndDate,
            IsActive = sub.IsActive
        };
    }

    public async Task<bool> UpdateAsync(int id, AdminSubscriptionUpdateDto dto)
    {
        var user = await _userManager.FindByIdAsync(id.ToString());
        if (user == null)
            throw new Exception("User not found");

        var sub = await _subscriptionRepo.Query()
            .FirstOrDefaultAsync(s => s.UserId == user.Id);

        if (sub == null) return false;

        if (dto.EndDate.HasValue)
            sub.EndDate = dto.EndDate.Value;

        if (dto.IsActive.HasValue)
            sub.IsActive = dto.IsActive.Value;

        if (!string.IsNullOrEmpty(dto.Type))
            sub.Type = dto.Type;

        _subscriptionRepo.Update(sub);
        await _subscriptionRepo.SaveChangesAsync();

        return true;
    }


    public async Task<bool> DeleteAsync(int id)
    {
        var user = await _userManager.FindByIdAsync(id.ToString());
        if (user == null)
            throw new Exception("User not found");

        var sub = await _subscriptionRepo.Query()
            .FirstOrDefaultAsync(s => s.UserId == user.Id);
        if (sub == null) return false;

        _subscriptionRepo.Delete(sub);
        await _subscriptionRepo.SaveChangesAsync();
        return true;
    }
}
