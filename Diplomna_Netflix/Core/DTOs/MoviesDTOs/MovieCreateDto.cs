public class MovieCreateDto
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int Year { get; set; }
    public string VideoUrl { get; set; } = string.Empty;
    public string PosterUrl { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Genre { get; set; } = string.Empty;
    public string? SubGenre { get; set; }
    
}