namespace Core.DTOs.CommentDTOs;

public class CommentCreateDto
{
    public string Content { get; set; }
    public int MovieId { get; set; }
    public string MovieType{ get; set; }
}