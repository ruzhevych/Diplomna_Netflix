using Data.Entities.Identity;

namespace Data.Entities.ForLater;

public class ForLaterEntity
{
    public long Id { get; set; }

    public long UserId { get; set; }
    public UserEntity User { get; set; } = null!;

    public string ContentId { get; set; } = null!; 
    public string ContentType { get; set; } = null!;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}