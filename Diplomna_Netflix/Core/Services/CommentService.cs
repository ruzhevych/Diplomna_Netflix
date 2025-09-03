using System.Security.Claims;
using Core.DTOs.CommentDTOs;
using Core.Interfaces;
using Data.Context;
using Data.Entities;
using Data.Entities.Identity;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Core.Services;

public class CommentService : ICommentService
{
    private readonly UserManager<UserEntity> _userManager;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly IRepository<CommentEntity> _commentRepository;
    private readonly NetflixDbContext _context;

    public CommentService(
        UserManager<UserEntity> userManager,
        IHttpContextAccessor httpContextAccessor,
        IRepository<CommentEntity> commentRepository,
        NetflixDbContext context
    )
    {
        _userManager = userManager;
        _httpContextAccessor = httpContextAccessor;
        _commentRepository = commentRepository;
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
    
    public async Task<CommentDto> AddCommentAsync(string userId, CommentCreateDto dto)
    {
        var user = await GetCurrentUserAsync();
        var comment = new CommentEntity
        {
            Content = dto.Content,
            UserId = user.Id,
            MovieId = dto.MovieId
        };

        _context.Comments.Add(comment);
        await _context.SaveChangesAsync();

        return new CommentDto
        {
            Id = comment.Id,
            Content = comment.Content,
            CreatedAt = comment.CreatedAt,
            UserName = user.UserName,
            UserProfilePictureUrl = user?.ProfilePictureUrl
        };
    }

    public async Task<List<CommentDto>> GetCommentsForMovieAsync(int movieId)
    {
        return await _context.Comments
            .Where(c => c.MovieId == movieId)
            .OrderByDescending(c => c.CreatedAt)
            .Select(c => new CommentDto
            {
                Id = c.Id,
                Content = c.Content,
                CreatedAt = c.CreatedAt,
                UserName = c.User.UserName,
                UserProfilePictureUrl = c.User.ProfilePictureUrl
            })
            .ToListAsync();
    }
    
    public async Task<CommentDto> UpdateCommentAsync(Guid commentId, string newContent)
    {
        var user = await GetCurrentUserAsync();
        var comment = await _context.Comments.FirstOrDefaultAsync(c => c.Id == commentId);

        if (comment == null)
            throw new KeyNotFoundException("Comment not found");

        if (comment.UserId != user.Id)
            throw new UnauthorizedAccessException("You can only edit your own comments");

        comment.Content = newContent;
        await _context.SaveChangesAsync();

        return new CommentDto
        {
            Id = comment.Id,
            Content = comment.Content,
            CreatedAt = comment.CreatedAt,
            UserName = user.UserName,
            UserProfilePictureUrl = user.ProfilePictureUrl
        };
    }

    public async Task<bool> DeleteCommentAsync(Guid commentId)
    {
        var user = await GetCurrentUserAsync();
        var comment = await _context.Comments.FirstOrDefaultAsync(c => c.Id == commentId);

        if (comment == null)
            throw new KeyNotFoundException("Comment not found");

        if (comment.UserId != user.Id)
            throw new UnauthorizedAccessException("You can only delete your own comments");

        _context.Comments.Remove(comment);
        await _context.SaveChangesAsync();
        return true;
    }


}