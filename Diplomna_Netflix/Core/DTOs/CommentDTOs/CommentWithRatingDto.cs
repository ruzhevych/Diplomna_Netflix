namespace Core.DTOs.CommentDTOs;

public class CommentWithRatingDto
{
    public Guid Id { get; set; }
    public string Content { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }

    public string UserName { get; set; } = string.Empty;

    public int? Rating { get; set; } // null якщо користувач не оцінював фільм
}