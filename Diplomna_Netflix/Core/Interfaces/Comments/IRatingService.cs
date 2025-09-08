using Core.DTOs.CommentDTOs;

namespace Core.Interfaces.Comments;

public interface IRatingService
{
    Task<RatingDto> AddOrUpdateRatingAsync(string userId, RatingCreateDto dto);
    Task<List<RatingDto>> GetRatingsForMovieAsync(int movieId, string movieType);
    Task<double?> GetAverageRatingForMovieAsync(int movieId, string movieType);
    Task<RatingDto?> GetUserRatingForMovieAsync(int movieId, string userId, string movieType);
    Task<bool> DeleteRatingsAsync(Guid id);
}