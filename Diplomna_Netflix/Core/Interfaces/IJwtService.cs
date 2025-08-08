using System.Security.Claims;
using Data.Entities.Identity;

namespace Core.Interfaces
{
    public interface IJwtService
    {
        string GenerateAccessToken(IEnumerable<Claim> claims);
        string GenerateRefreshToken();
        Task<IEnumerable<Claim>> GetUserClaimsAsync(UserEntity user);
    }
}