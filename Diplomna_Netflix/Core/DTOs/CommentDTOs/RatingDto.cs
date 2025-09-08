namespace Core.DTOs.CommentDTOs;

public class RatingDto
{
    public Guid Id { get; set; }
    public int Stars { get; set; }
    public DateTime CreatedAt { get; set; }
    public string UserName { get; set; } = null!;
    public string? UserProfilePictureUrl { get; set; }
    public string ContentType { get; set; }
}