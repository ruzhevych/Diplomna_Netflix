using System.Security.Claims;
using Core.DTOs.ForLaterDTOs;
using Core.Interfaces.ForLater;
using Core.Interfaces.Repository;
using Data.Entities.ForLater;
using Data.Entities.Identity;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;

namespace Core.Services.ForLater;

public class ForLaterService : IForLaterService
{
    private readonly IRepository<ForLaterEntity> _forLaterRepo;
    private readonly UserManager<UserEntity> _userManager;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public ForLaterService(
        IRepository<ForLaterEntity> forLaterRepo,
        UserManager<UserEntity> userManager,
        IHttpContextAccessor httpContextAccessor)
    {
        _forLaterRepo = forLaterRepo;
        _userManager = userManager;
        _httpContextAccessor = httpContextAccessor;
    }

    private async Task<UserEntity> GetCurrentUserAsync()
    {
        var userId = _httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) throw new UnauthorizedAccessException("User not authenticated");

        var user = await _userManager.FindByIdAsync(userId);
        if (user == null) throw new UnauthorizedAccessException("User not found");

        return user;
    }

    public async Task<ForLaterDto> AddAsync(ForLaterCreateDto dto)
    {
        var user = await GetCurrentUserAsync();

        var forLater = new ForLaterEntity
        {
            UserId = user.Id,
            ContentId = dto.ContentId,
            ContentType = dto.ContentType,
            CreatedAt = DateTime.UtcNow
        };
        
        var isNew = _forLaterRepo.GetAllQueryable()
            .Where(f => f.ContentId == dto.ContentId && f.ContentType == dto.ContentType);
        if (isNew.Any())
            throw new Exception("Alredy exist");

        await _forLaterRepo.AddAsync(forLater);
        await _forLaterRepo.SaveChangesAsync();

        return new ForLaterDto
        {
            Id = forLater.Id,
            ContentId = forLater.ContentId,
            ContentType = forLater.ContentType,
            CreatedAt = forLater.CreatedAt
        };
    }

    public async Task<IEnumerable<ForLaterDto>> GetUserForLaterAsync()
    {
        var user = await GetCurrentUserAsync();

        var forLaters = await _forLaterRepo.GetAllAsync(f => f.UserId == user.Id);

        return forLaters.Select(f => new ForLaterDto
        {
            Id = f.Id,
            ContentId = f.ContentId,
            ContentType = f.ContentType,
            CreatedAt = f.CreatedAt
        });
    }

    public async Task RemoveAsync(long id)
    {
        var user = await GetCurrentUserAsync();

        var forLater = await _forLaterRepo.GetByIdAsync(id);
        if (forLater == null || forLater.UserId != user.Id)
            throw new UnauthorizedAccessException("Not your for later");

        _forLaterRepo.DeleteAsync(id);
        await _forLaterRepo.SaveChangesAsync();
    }
}