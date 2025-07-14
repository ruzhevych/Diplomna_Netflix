using System.ComponentModel.DataAnnotations;


public class MovieEntity
{
    [Key]
    public Guid Id { get; set; }
    [Required]
    public string Title { get; set; } = string.Empty;
    [Required]
    [MaxLength(500)]
    public string Description { get; set; } = string.Empty;
    [Required]
    public int Year { get; set; }
    public string VideoUrl { get; set; } = string.Empty;
    public string PosterUrl { get; set; } = string.Empty;
    [Required]
    public string Category { get; set; } = string.Empty;
    [Required]
    public string Genre { get; set; } = string.Empty;

    public string? SubGenre { get; set; }
    
    

}