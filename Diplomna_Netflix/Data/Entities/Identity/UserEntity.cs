using Data.Entities.Auth;
using Microsoft.AspNetCore.Identity;

namespace Data.Entities.Identity
{
    public class UserEntity : IdentityUser<long>
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? FullName { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string? ProfilePictureUrl { get; set; }
        public virtual ICollection<UserRoleEntity> UserRoles { get; set; } = new List<UserRoleEntity>();
        public virtual ICollection<SubscriptionEntity> Subscriptions { get; set; } = new List<SubscriptionEntity>();
        public virtual ICollection<RefreshTokenEntity> RefreshTokens { get; set; } = new List<RefreshTokenEntity>();
        public ICollection<AdminMessageEntity> AdminMessages { get; set; } = new List<AdminMessageEntity>();



    }
}