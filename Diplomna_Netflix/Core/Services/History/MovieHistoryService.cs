using System.Security.Claims;
using Core.DTOs.ContentDTOs;
using Core.Interfaces;
using Core.Interfaces.History;
using Data.Context;
using Data.Entities;
using Data.Entities.Identity;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;


namespace Core.Services.History;

public class MovieHistoryService : IMovieHistoryService
{
    private readonly UserManager<UserEntity> _userManager;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly IRepository<HistoryEntity> _historyRepository;
    private readonly NetflixDbContext _context;

    public MovieHistoryService(
        UserManager<UserEntity> userManager,
        IHttpContextAccessor httpContextAccessor,
        IRepository<HistoryEntity> historyRepository,
        NetflixDbContext context
    )
    {
        _userManager = userManager;
        _httpContextAccessor = httpContextAccessor;
        _historyRepository = historyRepository;
        _context = context;
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
        _context.History.Add(entry);
        await _context.SaveChangesAsync();
    }

    public async Task<List<MediaItemDto>> GetUserHistoryAsync(string userId)
    {
        return await _context.History
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
        var history = await _context.History
            .FirstOrDefaultAsync(h => h.MovieId == movieId && h.UserId == user.Id);

        if (history == null)
            return false;

        _context.History.Remove(history);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<int> ClearHistoryAsync()
    {
        var user = await GetCurrentUserAsync();
        var items = _context.History.Where(h => h.UserId == user.Id);

        _context.History.RemoveRange(items);
        var deleted = await _context.SaveChangesAsync();
        return deleted;
    }


}