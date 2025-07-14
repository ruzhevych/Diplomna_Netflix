using Core.Models.Authentication;

namespace Core.Interfaces
{
    public interface IGoogleAuthService
    {
        Task<AuthResponse> AuthenticateAsync(GoogleLogin model);
        Task<bool> IsRegisteredAsync(string email);
    }
}