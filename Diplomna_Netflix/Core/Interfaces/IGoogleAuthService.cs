using Core.Models;
using Core.Options;

namespace Core.Interfaces
{
    public interface IGoogleAuthService
    {
        Task<GoogleUserInfo?> GetUserInfoAsync(string accessToken);
    }

}