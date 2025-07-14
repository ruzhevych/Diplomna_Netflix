using Core.Interfaces;
using Core.Models.Authentication;

namespace Core.Services
{
    namespace Core.Services
    {
        public class GoogleAuthService : IGoogleAuthService
        {
            public Task<AuthResponse> AuthenticateAsync(GoogleLogin dto)
            {
                // TODO: Validate token with Google API
                return Task.FromResult(new AuthResponse
                {
                    AccessToken = "google_access_token",
                    RefreshToken = "google_refresh_token"
                });
            }

            public Task<bool> IsRegisteredAsync(string email)
            {
                // TODO: Lookup user by email
                return Task.FromResult(true);
            }
        }
    }
}