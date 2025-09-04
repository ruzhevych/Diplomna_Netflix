using System.Security.Claims;
using Core.DTOs.ContentDTOs;
using Core.Interfaces.History;
using Core.Interfaces.Repository;
using Data.Entities.History;
using Data.Entities.Identity;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Core.Services.History;

public class MovieHistoryService : IMovieHistoryService
{
    private readonly UserManager<UserEntity> _userManager;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly IRepository<HistoryEntity> _historyRepo;

    public MovieHistoryService(
        UserManager<UserEntity> userManager,
        IHttpContextAccessor httpContextAccessor,
        IRepository<HistoryEntity> historyRepo
    )
    {
        _userManager = userManager;
        _httpContextAccessor = httpContextAccessor;
        _historyRepo = historyRepo;
    }

    private async Task<UserEntity> GetCurrentUserAsync()
    {
        var userId = _httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) throw new UnauthorizedAccessException("User not authenticated");

        var user = await _userManager.FindByIdAsync(userId);
        if (user == null) throw new UnauthorizedAccessException("User not found");

        return user;
    }

    public async Task AddToHistoryAsync(int movieId, string mediaType)
    {
        var user = await GetCurrentUserAsync();
        var entry = new HistoryEntity
        {
            UserId = user.Id,
            MovieId = movieId,
            MediaType = mediaType
        };

        await _historyRepo.AddAsync(entry);
        await _historyRepo.SaveChangesAsync();
    }

    public async Task<List<MediaItemDto>> GetUserHistoryAsync(string userId)
    {
        // Використовуємо Query() із репозиторію, щоб уникнути проблем з контекстом
        return await _historyRepo.Query()
            .Where(h => h.UserId.ToString() == userId)
            .OrderByDescending(h => h.ViewedAt)
            .Select(h => new MediaItemDto
            {
                Id = h.MovieId,
                MediaType = h.MediaType
            })
            .ToListAsync();
    }

    public async Task<bool> DeleteFromHistoryAsync(int movieId)
    {
        var user = await GetCurrentUserAsync();
        var history = await _historyRepo.Query()
            .FirstOrDefaultAsync(h => h.MovieId == movieId && h.UserId == user.Id);

        if (history == null)
            return false;

        _historyRepo.Delete(history);
        await _historyRepo.SaveChangesAsync();
        return true;
    }

    public async Task<int> ClearHistoryAsync()
    {
        var user = await GetCurrentUserAsync();
        var items = await _historyRepo.Query()
            .Where(h => h.UserId == user.Id)
            .ToListAsync();

        _historyRepo.RemoveRange(items);
        return await _historyRepo.SaveChangesAsync();
    }
}
