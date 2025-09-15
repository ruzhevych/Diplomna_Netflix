using Core.DTOs.FavoritesDTOs;
using Data.Entities.Identity;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
using Core.Interfaces.Favorites;
using Core.Interfaces.Repository;
using Data.Entities.Favorites;

namespace Core.Services.Favorites;

public class FavoriteService : IFavoriteService
{
    private readonly IRepository<FavoriteEntity> _favoriteRepo;
    private readonly UserManager<UserEntity> _userManager;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public FavoriteService(
        IRepository<FavoriteEntity> favoriteRepo,
        UserManager<UserEntity> userManager,
        IHttpContextAccessor httpContextAccessor)
    {
        _favoriteRepo = favoriteRepo;
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

    public async Task<FavoriteDto> AddAsync(FavoriteCreateDto dto)
    {
        var user = await GetCurrentUserAsync();

        var favorite = new FavoriteEntity
        {
            UserId = user.Id,
            ContentId = dto.ContentId,
            ContentType = dto.ContentType,
            CreatedAt = DateTime.UtcNow
        };
        
        var exists = _favoriteRepo.GetAllQueryable()
            .Any(f => f.UserId == user.Id
                      && f.ContentId == dto.ContentId
                      && f.ContentType == dto.ContentType);

        if (exists)
            throw new InvalidOperationException("Цей контент уже доданий в обране.");
        
        await _favoriteRepo.AddAsync(favorite);
        await _favoriteRepo.SaveChangesAsync();

        return new FavoriteDto
        {
            Id = favorite.Id,
            ContentId = favorite.ContentId,
            ContentType = favorite.ContentType,
            CreatedAt = favorite.CreatedAt
        };
    }

    public async Task<IEnumerable<FavoriteDto>> GetUserFavoritesAsync()
    {
        var user = await GetCurrentUserAsync();

        var favorites = await _favoriteRepo.GetAllAsync(f => f.UserId == user.Id);

        return favorites.Select(f => new FavoriteDto
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

        var favorite = await _favoriteRepo.GetByIdAsync(id);
        if (favorite == null || favorite.UserId != user.Id)
            throw new UnauthorizedAccessException("Not your favorite");

        _favoriteRepo.DeleteAsync(id);
        await _favoriteRepo.SaveChangesAsync();
    }
}

