using System.Security.Claims;
using Core.DTOs.CommentDTOs;
using Core.Interfaces.Comments;
using Core.Interfaces.Repository;
using Data.Entities.Comments;
using Data.Entities.Identity;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Core.Services.Comments;

public class CommentService : ICommentService
{
    private readonly UserManager<UserEntity> _userManager;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly IRepository<CommentEntity> _commentRepo;

    public CommentService(
        UserManager<UserEntity> userManager,
        IHttpContextAccessor httpContextAccessor,
        IRepository<CommentEntity> commentRepo
    )
    {
        _userManager = userManager;
        _httpContextAccessor = httpContextAccessor;
        _commentRepo = commentRepo;
    }
    
    private async Task<UserEntity> GetCurrentUserAsync()
    {
        var userId = _httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) throw new UnauthorizedAccessException("User not authenticated");

        var user = await _userManager.FindByIdAsync(userId);
        if (user == null) throw new UnauthorizedAccessException("User not found");

        return user;
    }
    
    public async Task<CommentDto> AddCommentAsync(string userId, CommentCreateDto dto)
    {
        var user = await GetCurrentUserAsync();
        var comment = new CommentEntity
        {
            Content = dto.Content,
            UserId = user.Id,
            MovieId = dto.MovieId,
            ContentType = dto.MovieType,
        };

        await _commentRepo.AddAsync(comment);
        await _commentRepo.SaveChangesAsync();

        return new CommentDto
        {
            Id = comment.Id,
            Content = comment.Content,
            CreatedAt = comment.CreatedAt,
            UserName = user.FullName,
            UserProfilePictureUrl = user?.ProfilePictureUrl
        };
    }

    public async Task<List<CommentDto>> GetCommentsForMovieAsync(int movieId, string movieType)
    {
        return await _commentRepo.GetAllQueryable()
            .Where(c => c.MovieId == movieId && c.ContentType == movieType)
            .OrderByDescending(c => c.CreatedAt)
            .Select(c => new CommentDto
            {
                Id = c.Id,
                Content = c.Content,
                CreatedAt = c.CreatedAt,
                UserName = c.User.FullName,
                UserProfilePictureUrl = c.User.ProfilePictureUrl
            })
            .ToListAsync();
    }
    
    public async Task<CommentDto> UpdateCommentAsync(Guid commentId, string newContent)
    {
        var user = await GetCurrentUserAsync();
        var comment = await _commentRepo.GetAllQueryable()
            .FirstOrDefaultAsync(c => c.Id == commentId);

        if (comment == null)
            throw new KeyNotFoundException("Comment not found");

        if (comment.UserId != user.Id)
            throw new UnauthorizedAccessException("You can only edit your own comments");

        comment.Content = newContent;
        _commentRepo.Update(comment);
        await _commentRepo.SaveChangesAsync();

        return new CommentDto
        {
            Id = comment.Id,
            Content = comment.Content,
            CreatedAt = comment.CreatedAt,
            UserName = user.FullName,
            UserProfilePictureUrl = user.ProfilePictureUrl
        };
    }

    public async Task<bool> DeleteCommentAsync(Guid commentId)
    {
        var user = await GetCurrentUserAsync();
        var comment = await _commentRepo.GetAllQueryable()
            .FirstOrDefaultAsync(c => c.Id == commentId);

        if (comment == null)
            throw new KeyNotFoundException("Comment not found");

        if (comment.UserId != user.Id)
            throw new UnauthorizedAccessException("You can only delete your own comments");

        _commentRepo.Delete(comment);
        await _commentRepo.SaveChangesAsync();
        return true;
    }
}
