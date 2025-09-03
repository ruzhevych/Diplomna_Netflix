namespace Core.DTOs.CommentDTOs;

public class CommentUpdateDto
{
    public Guid Id { get; set; }
    public string Content { get; set; }
    public int MovieId { get; set; }
}