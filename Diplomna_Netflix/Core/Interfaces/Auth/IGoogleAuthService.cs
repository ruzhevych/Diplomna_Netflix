using Core.Models;
using Core.Options;

namespace Core.Interfaces.Auth;

public interface IGoogleAuthService
{
    Task<GoogleUserInfo?> GetUserInfoAsync(string accessToken);
}