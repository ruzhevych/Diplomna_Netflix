namespace Core.DTOs.ContentDTOs;

public class MediaItemDto
{
    public int Id { get; set; }
    public int MovieId { get; set; }
    public DateTime ViewedAt { get; set; }
    public string MediaType { get; set; }
}