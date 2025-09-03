using Core.DTOs.ContentDTOs;

namespace Core.Interfaces.History;

public interface IMovieHistoryService
{
    Task AddToHistoryAsync(int movieId, string mediaType);
    Task<List<MediaItemDto>> GetUserHistoryAsync(string userId);
    Task<bool> DeleteFromHistoryAsync(int movieId);
    Task<int> ClearHistoryAsync();
}