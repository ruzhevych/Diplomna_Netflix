using Core.DTOs.AuthorizationDTOs;
using Core.Interfaces.Core.Interfaces;
using Core.Models.Authentication;
using Microsoft.AspNetCore.Mvc;

namespace Diplomna_Netflix.Controllers.Account
{
    //[Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService authService;

        public AuthController(IAuthService authService)
        {
            this.authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            var result = await authService.RegisterAsync(dto);
            return Ok(result);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var result = await authService.LoginAsync(dto);
            return Ok(result);
        }

        [HttpPost("google-login")]
        public async Task<IActionResult> GoogleLogin(GoogleLogin dto)
        {
            var result = await authService.GoogleLoginAsync(dto);
            return Ok(result);
        }

        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken(RefreshTokenRequest dto)
        {
            var result = await authService.RefreshTokenAsync(dto.RefreshToken);
            return Ok(result);
        }

        [HttpGet("is-registered/{email}")]
        public async Task<IActionResult> IsRegistered(string email)
        {
            var result = await authService.IsRegisteredWithGoogleAsync(email);
            return Ok(result);
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword(ForgotPasswordDto dto)
        {
            await authService.ForgotPasswordAsync(dto);
            return Ok();
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword(ResetPasswordDto dto)
        {
            await authService.ResetPasswordAsync(dto);
            return Ok();
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            var userId = User.FindFirst("uid")?.Value;
            if (userId == null) return Unauthorized();

            await authService.LogOutAsync(userId);
            return Ok();
        }
    }
}
