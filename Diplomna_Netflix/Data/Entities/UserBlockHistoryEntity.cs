using Data.Entities.Identity;

namespace Data.Entities
{
    public class UserBlockHistoryEntity
    {
        public long Id { get; set; }

        public long UserId { get; set; }
        public UserEntity User { get; set; } = null!;

        public long AdminId { get; set; }
        public UserEntity Admin { get; set; } = null!;

        public DateTime BlockedAt { get; set; }
        public DateTime? UnblockedAt { get; set; }

        public TimeSpan? Duration { get; set; } 
        public string Reason { get; set; } = null!;
        public bool IsActive { get; set; } = true;
    }
}