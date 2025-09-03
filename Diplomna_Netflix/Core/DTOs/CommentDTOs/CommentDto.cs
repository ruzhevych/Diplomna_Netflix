namespace Core.DTOs.CommentDTOs;

public class CommentDto
{
    public Guid Id { get; set; }
    public string Content { get; set; }
    public DateTime CreatedAt { get; set; }
    public string UserName { get; set; }
    public string? UserProfilePictureUrl { get; set; }
}