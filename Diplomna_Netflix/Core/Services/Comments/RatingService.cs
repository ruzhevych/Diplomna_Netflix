using System.Security.Claims;
using AutoMapper;
using Core.DTOs.CommentDTOs;
using Core.Interfaces.Comments;
using Core.Interfaces.Repository;
using Data.Context;
using Data.Entities.Comments;
using Data.Entities.Identity;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Core.Services.Comments;

public class RatingService : IRatingService
{
    private readonly UserManager<UserEntity> _userManager;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly IRepository<RatingEntity> _ratingRepo;

    public RatingService(
        UserManager<UserEntity> userManager,
        IHttpContextAccessor httpContextAccessor,
        IRepository<RatingEntity> ratingRepo
    )
    {
        _userManager = userManager;
        _httpContextAccessor = httpContextAccessor;
        _ratingRepo = ratingRepo;
    }

    private async Task<UserEntity> GetCurrentUserAsync()
    {
        var userId = _httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) throw new UnauthorizedAccessException("User not authenticated");

        var user = await _userManager.FindByIdAsync(userId);
        if (user == null) throw new UnauthorizedAccessException("User not found");

        return user;
    }

    public async Task<RatingDto> AddOrUpdateRatingAsync(string userId, RatingCreateDto dto)
    {
        var user = await GetCurrentUserAsync();

        var existing = await _ratingRepo
            .GetAllQueryable()
            .FirstOrDefaultAsync(r => r.ContentId == dto.ContentId && 
                                      r.UserId == user.Id && 
                                      r.ContentType == dto.ContentType
                                      );

        if (existing != null)
        {
            existing.Stars = dto.Stars;
            _ratingRepo.Update(existing);
            await _ratingRepo.SaveChangesAsync();

            return new RatingDto
            {
                Id = existing.Id,
                Stars = existing.Stars,
                CreatedAt = existing.CreatedAt,
                UserName = user.UserName,
                UserProfilePictureUrl = user.ProfilePictureUrl
            };
        }

        var rating = new RatingEntity
        {
            Stars = dto.Stars,
            UserId = user.Id,
            ContentId = dto.ContentId,
            ContentType = dto.ContentType
        };

        await _ratingRepo.AddAsync(rating);
        await _ratingRepo.SaveChangesAsync();

        return new RatingDto
        {
            Id = rating.Id,
            Stars = rating.Stars,
            CreatedAt = rating.CreatedAt,
            UserName = user.UserName,
            UserProfilePictureUrl = user.ProfilePictureUrl,
            ContentType = rating.ContentType
        };
    }

    public async Task<List<RatingDto>> GetRatingsForMovieAsync(int movieId, string movieType)
    {
        return await _ratingRepo.GetAllQueryable()
            .Where(r => r.ContentId == movieId && r.ContentType == movieType)
            .Include(r => r.User)
            .OrderByDescending(r => r.CreatedAt)
            .Select(r => new RatingDto
            {
                Id = r.Id,
                Stars = r.Stars,
                CreatedAt = r.CreatedAt,
                UserName = r.User.UserName,
                UserProfilePictureUrl = r.User.ProfilePictureUrl,
                ContentType = r.ContentType
            })
            .ToListAsync();
    }

    public async Task<double?> GetAverageRatingForMovieAsync(int movieId, string movieType)
    {
        return await _ratingRepo.GetAllQueryable()
            .Where(r => r.ContentId == movieId && r.ContentType == movieType)
            .Select(r => (double?)r.Stars)
            .AverageAsync();
    }

    public async Task<RatingDto?> GetUserRatingForMovieAsync(int movieId, string userId, string movieType)
    {
        var rating = await _ratingRepo.GetAllQueryable()
            .Include(r => r.User)
            .FirstOrDefaultAsync(r => r.ContentId == movieId && 
                                      r.UserId.ToString() == userId && 
                                      r.ContentType == movieType
                                      );

        return rating == null ? null : new RatingDto
        {
            Id = rating.Id,
            Stars = rating.Stars,
            CreatedAt = rating.CreatedAt,
            UserName = rating.User.UserName,
            UserProfilePictureUrl = rating.User.ProfilePictureUrl,
            ContentType = rating.ContentType
        };
    }

    public async Task<bool> DeleteRatingsAsync(Guid id)
    {
        var user = await GetCurrentUserAsync();
        
        var rating = await _ratingRepo.GetAllQueryable()
            .FirstOrDefaultAsync(c => c.Id == id);
        
        if (rating == null) throw new KeyNotFoundException("Rating not found");
        if (rating.UserId != user.Id) throw new UnauthorizedAccessException("User not authenticated");
        
        _ratingRepo.Delete(rating);
        await _ratingRepo.SaveChangesAsync();
        return true;
    }
}