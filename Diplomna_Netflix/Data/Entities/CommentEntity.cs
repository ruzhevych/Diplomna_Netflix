using Data.Entities.Identity;

namespace Data.Entities;

public class CommentEntity
{
    public Guid Id { get; set; }
    public string Content { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public long UserId { get; set; }
    public UserEntity User { get; set; }

    public int MovieId { get; set; }
}
