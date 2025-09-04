using System.Security.Claims;
using Data.Entities.Identity;

namespace Core.Interfaces.Auth;

public interface IJwtService
{
    string GenerateAccessToken(IEnumerable<Claim> claims);
    string GenerateRefreshToken();
    Task<IEnumerable<Claim>> GetUserClaimsAsync(UserEntity user);
    int GetRefreshTokenLiveTime();
}