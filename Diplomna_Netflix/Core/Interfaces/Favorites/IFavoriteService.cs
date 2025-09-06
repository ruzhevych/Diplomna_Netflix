using Core.DTOs.FavoritesDTOs;

namespace Core.Interfaces.Favorites;

public interface IFavoriteService
{
    Task<FavoriteDto> AddAsync(FavoriteCreateDto dto);
    Task<IEnumerable<FavoriteDto>> GetUserFavoritesAsync();
    Task RemoveAsync(long id);
}