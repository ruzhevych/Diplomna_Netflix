using System;
using Data.Entities.Identity;

namespace Data.Entities
{
    public class AdminMessageEntity
    {
        public long Id { get; set; }

        public long UserId { get; set; }
        public string Email { get; set; } = string.Empty;

        public string Subject { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;

        public DateTime SentAt { get; set; } = DateTime.UtcNow;
        public bool IsSent { get; set; } = false;
        public UserEntity User { get; set; } = null!;
    }
}
