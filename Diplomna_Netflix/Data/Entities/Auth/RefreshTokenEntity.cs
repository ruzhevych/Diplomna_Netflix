using Data.Entities.Identity;
using Data.Entities;

namespace Data.Entities.Auth;

public class RefreshTokenEntity : BaseEntity<long>
{
    public string Token { get; set; }
    public long UserId { get; set; }
    public DateTime Expires { get; set; }
    public bool Revoked { get; set; } = false;
    public DateTime Created { get; set; } = DateTime.UtcNow;
    public UserEntity User { get; set; }
}