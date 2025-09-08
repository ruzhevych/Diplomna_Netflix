namespace Core.DTOs.CommentDTOs;

public class RatingCreateDto
{
    public int ContentId { get; set; }
    public string ContentType { get; set; }
    public int Stars { get; set; }
}