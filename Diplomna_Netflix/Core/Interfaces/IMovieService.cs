public interface IMovieService
{
    Task<List<MovieDto>> GetAllAsync();
    Task<List<MovieDto>> GetByCategoryAsync(string category);
    Task<MovieDto?> GetByIdAsync(Guid id);
    Task CreateAsync(MovieCreateDto dto);
    Task UpdateAsync(MovieUpdateDto dto);
    Task DeleteAsync(Guid id);
}