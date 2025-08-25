using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Core.DTOs.AuthorizationDTOs;
using Core.Interfaces;
using Core.Interfaces.Core.Interfaces;
using Core.Models.Authentication;
using Diplomna_Netflix.ServiceExtensions;
using Microsoft.AspNetCore.Mvc;

namespace Diplomna_Netflix.Controllers.Account
{
    //[Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService authService;
        private readonly ICookieService _cookieService;

        public AuthController(IAuthService authService, ICookieService cookieService)
        {
            this.authService = authService;
            _cookieService = cookieService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            var result = await authService.RegisterAsync(dto);
            var refreshToken = result.RefreshToken;

            // Зберігаємо refresh токен у cookie
            _cookieService.AppendRefreshTokenCookie(Response, refreshToken);
            return Ok(result);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var result = await authService.LoginAsync(dto);
            var refreshToken = result.RefreshToken;

            // Зберігаємо refresh токен у cookie
            _cookieService.AppendRefreshTokenCookie(Response, refreshToken);
            return Ok(result);
        }

        [HttpPost("google-login")]
        public async Task<IActionResult> GoogleLogin([FromBody] GoogleLogin dto)
        {
            try
            {
                var response = await authService.GoogleLoginAsync(dto);
                var refreshToken = response.RefreshToken;

                // Зберігаємо refresh токен у cookie
                _cookieService.AppendRefreshTokenCookie(Response, refreshToken);
                return Ok(response);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
        }

        [HttpPost("google-register")]
        public async Task<IActionResult> GoogleRegister([FromBody] GoogleRegister dto)
        {
            try
            {
                var response = await authService.GoogleRegisterAsync(dto);
                var refreshToken = response.RefreshToken;

                // Зберігаємо refresh токен у cookie
                _cookieService.AppendRefreshTokenCookie(Response, refreshToken);
                return Ok(response);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
        }

        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken()
        {
            var refreshToken = Request.Cookies["refreshToken"];

            if (string.IsNullOrEmpty(refreshToken))
                return Unauthorized();

            var result = await authService.RefreshTokenAsync(refreshToken);

            _cookieService.AppendRefreshTokenCookie(Response, result.RefreshToken);

            return Ok(new
            {
                accessToken = result.AccessToken
            });
        }

        // [HttpGet("is-registered/{email}")]
        // public async Task<IActionResult> IsRegistered(string email)
        // {
        //     var result = await authService.IsRegisteredWithGoogleAsync(email);
        //     return Ok(result);
        // }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto dto)
        {
            await authService.ForgotPasswordAsync(dto);
            return Ok(new { message = "Лист для скидання пароля надіслано." });
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto dto)
        {
            try
            {
                await authService.ResetPasswordAsync(dto);
                return Ok(new { message = "Пароль успішно оновлено." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }


        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ??
                         User.FindFirstValue(JwtRegisteredClaimNames.Sub);
            if (userId == null) return Unauthorized();

            await authService.LogOutAsync(userId);
            return Ok();
        }
    }
}
