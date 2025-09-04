using Core.DTOs.CommentDTOs;

namespace Core.Interfaces.Comments;

public interface ICommentService
{
    Task<CommentDto> AddCommentAsync(string userId, CommentCreateDto dto);
    Task<List<CommentDto>> GetCommentsForMovieAsync(int movieId);
    Task<CommentDto> UpdateCommentAsync(Guid commentId, string newContent);
    Task<bool> DeleteCommentAsync(Guid commentId);
}