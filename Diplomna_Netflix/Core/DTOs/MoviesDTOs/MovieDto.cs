public class MovieDto
{
    public Guid Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public int Year { get; set; }

    public string PosterUrl { get; set; } = string.Empty;

    public string Category { get; set; } = string.Empty;

    public string Genre { get; set; } = string.Empty;
    
    public string? SubGenre { get; set; }
}