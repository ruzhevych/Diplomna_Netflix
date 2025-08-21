using System.ComponentModel.DataAnnotations;

public class SeasonEntity
{
    [Required]
    public int Id { get; set; }
    [Required]
    public int SeasonNumber { get; set; }
    public int EpisodeCount { get; set; }
    public int SeriesId { get; set; }
    public SeriesEntity Series { get; set; }
}