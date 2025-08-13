using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Core.Interfaces;
using Core.Options;
using Data.Entities.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

public class JwtService : IJwtService
{
    private readonly JwtOptions _jwtOptions;
    private readonly UserManager<UserEntity> _userManager;

    public JwtService(IConfiguration configuration, UserManager<UserEntity> userManager)
    {
        _jwtOptions = configuration.GetSection(nameof(JwtOptions)).Get<JwtOptions>()
                      ?? throw new Exception("JwtOptions not configured");
        _userManager = userManager;
    }

    public string GenerateAccessToken(IEnumerable<Claim> claims)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtOptions.SecretKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var token = new JwtSecurityToken(
            issuer: _jwtOptions.Issuer,
            audience: _jwtOptions.Audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(_jwtOptions.ExpirationMinutes),
            signingCredentials: creds
        );
        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public string GenerateRefreshToken()
    {
        var randomBytes = new byte[64];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomBytes);
        return Convert.ToBase64String(randomBytes);
    }

    public async Task<IEnumerable<Claim>> GetUserClaimsAsync(UserEntity user)
    {
        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new ("id", user.Id.ToString()),
            new (ClaimTypes.Email, user.Email ?? ""),
            new ("fullName", user.FullName ?? "")
        };

        var roles = await _userManager.GetRolesAsync(user);
        claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));
        
        return claims;
    }
    
    public int GetRefreshTokenLiveTime() => _jwtOptions.ExpirationDays;

}