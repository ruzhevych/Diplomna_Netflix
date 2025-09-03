using Data.Entities.Identity;

namespace Data.Entities;

public class HistoryEntity
{
    public int Id { get; set; }
    public long UserId { get; set; }
    public UserEntity User { get; set; }
    public int MovieId { get; set; }
    public string MediaType { get; set; }
    public DateTime ViewedAt { get; set; } = DateTime.UtcNow;
}