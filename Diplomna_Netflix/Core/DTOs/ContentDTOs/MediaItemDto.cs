using Microsoft.AspNetCore.Mvc.Formatters;

namespace Core.DTOs.ContentDTOs;

public class MediaItemDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int Description { get; set; }
    public DateTime ReleaseDate { get; set; }
    public string MediaType { get; set; }
}