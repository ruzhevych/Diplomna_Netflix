namespace Core.DTOs.ContentDTOs;

public class MediaItemDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int Description { get; set; }
    public DateTime ViewedAt { get; set; }
    public string MediaType { get; set; }
}