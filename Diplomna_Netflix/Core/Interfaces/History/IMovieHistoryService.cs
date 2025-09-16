using Core.DTOs.ContentDTOs;

namespace Core.Interfaces.History;

public interface IMovieHistoryService
{
    Task AddToHistoryAsync(MediaItemDto mediaItemDto);
    Task<List<MediaItemDto>> GetUserHistoryAsync(string userId);
    Task<bool> DeleteFromHistoryAsync(int movieId);
    Task<int> ClearHistoryAsync();
}