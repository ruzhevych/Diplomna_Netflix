using Core.DTOs.AuthorizationDTOs;
using Core.Models.Authentication;

namespace Core.Interfaces
{
    namespace Core.Interfaces
    {
        public interface IAuthService
        {
            Task<AuthResponse> RegisterAsync(RegisterDto dto);
            Task<AuthResponse> LoginAsync(LoginDto dto);
            Task<AuthResponse> GoogleLoginAsync(GoogleLogin model);
            Task<AuthResponse> RefreshTokenAsync(string refreshToken);
            Task<bool> IsRegisteredWithGoogleAsync(string email);
            Task ForgotPasswordAsync(ForgotPasswordDto dto);
            Task ResetPasswordAsync(ResetPasswordDto dto);
            Task LogOutAsync(string userId);
        }
    }
}