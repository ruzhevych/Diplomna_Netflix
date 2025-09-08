using Data.Entities.Identity;

namespace Data.Entities.Comments;

public class RatingEntity
{
    public Guid Id { get; set; }
    public int Stars { get; set; } // 1–5
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public long UserId { get; set; }
    public UserEntity User { get; set; }
    
    public long ContentId { get; set; }
    public string ContentType { get; set; } = null!;
    
}