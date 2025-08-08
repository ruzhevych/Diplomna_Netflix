using Data.Context;
using Microsoft.EntityFrameworkCore;
public class MovieService : IMovieService
{
    private readonly NetflixDbContext _context;

    public MovieService(NetflixDbContext context)
    {
        _context = context;
    }

    public async Task<List<MovieDto>> GetAllAsync() =>
        await _context.Movies.Select(m => new MovieDto
        {
            Id = m.Id,
            Title = m.Title,
            Year = m.Year,
            PosterUrl = m.PosterUrl,
            Category = m.Category,
            Genre = m.Genre,
            SubGenre = m.SubGenre
        }).ToListAsync();

    public async Task<List<MovieDto>> GetByCategoryAsync(string category) =>
        await _context.Movies
            .Where(m => m.Category == category)
            .Select(m => new MovieDto
            {
                Id = m.Id,
                Title = m.Title,
                Year = m.Year,
                PosterUrl = m.PosterUrl,
                Category = m.Category,
                Genre = m.Genre,
                SubGenre = m.SubGenre
            }).ToListAsync();

    public async Task<MovieDto?> GetByIdAsync(Guid id)
    {
        var movie = await _context.Movies.FindAsync(id);
        if (movie == null) return null;

        return new MovieDto
        {
            Id = movie.Id,
            Title = movie.Title,
            Year = movie.Year,
            PosterUrl = movie.PosterUrl,
            Category = movie.Category,
            Genre = movie.Genre,
            SubGenre = movie.SubGenre
        };
    }

    public async Task CreateAsync(MovieCreateDto dto)
    {
        var movie = new MovieEntity
        {
            Id = Guid.NewGuid(),
            Title = dto.Title,
            Description = dto.Description,
            Year = dto.Year,
            VideoUrl = dto.VideoUrl,
            PosterUrl = dto.PosterUrl,
            Category = dto.Category,
            Genre = dto.Genre,
            SubGenre = dto.SubGenre
        };
        _context.Movies.Add(movie);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(MovieUpdateDto dto)
    {
        var movie = await _context.Movies.FindAsync(dto.Id);
        if (movie == null) throw new Exception("Movie not found");

        movie.Title = dto.Title;
        movie.Description = dto.Description;
        movie.Year = dto.Year;
        movie.VideoUrl = dto.VideoUrl;
        movie.PosterUrl = dto.PosterUrl;
        movie.Category = dto.Category;
        movie.Genre = dto.Genre;
        movie.SubGenre = dto.SubGenre;

        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Guid id)
    {
        var movie = await _context.Movies.FindAsync(id);
        if (movie == null) throw new Exception("Movie not found");

        _context.Movies.Remove(movie);
        await _context.SaveChangesAsync();
    }
}
