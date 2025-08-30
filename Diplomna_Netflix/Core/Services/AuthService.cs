using AutoMapper;
using Core.DTOs.AuthorizationDTOs;
using Core.Interfaces;
using Core.Interfaces.Core.Interfaces;
using Core.Models;
using Core.Models.Authentication;
using Data.Context;
using Data.Entities;
using Data.Entities.Auth;
using Data.Entities.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Core.Services;

public class AuthService : IAuthService
{
    private readonly UserManager<UserEntity> _userManager;
    private readonly SignInManager<UserEntity> _signInManager;
    private readonly IJwtService _jwtService;
    private readonly IEmailService _emailService;
    private readonly IGoogleAuthService _googleAuthService;
    private readonly NetflixDbContext _dbContext;
    private readonly IMapper _mapper;

    public AuthService(
        UserManager<UserEntity> userManager,
        SignInManager<UserEntity> signInManager,
        IJwtService jwtService,
        IEmailService emailService,
        IGoogleAuthService googleAuthService,
        NetflixDbContext dbContext,
        IMapper mapper)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _jwtService = jwtService;
        _emailService = emailService;
        _googleAuthService = googleAuthService;
        _dbContext = dbContext;
        _mapper = mapper;
    }

    public async Task<AuthResponse> RegisterAsync(RegisterDto dto)
    {
        var user = new UserEntity
        {
            Email = dto.Email,
            UserName = dto.Email,
            FullName = dto.FullName,
        };

        var result = await _userManager.CreateAsync(user, dto.Password);
        if (!result.Succeeded)
            throw new Exception(string.Join("; ", result.Errors.Select(e => e.Description)));
        
        var subscription = new SubscriptionEntity
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            Type = dto.SubscriptionType,
            StartDate = DateTime.UtcNow,
            EndDate = DateTime.UtcNow.AddDays(30),
            IsActive = true
        };

        _dbContext.Subscriptions.Add(subscription);
        await _dbContext.SaveChangesAsync();

        return await GenerateTokensAsync(user);
    }

    public async Task<AuthResponse> LoginAsync(LoginDto dto)
    {
        var user = await _userManager.FindByEmailAsync(dto.Email);
        if (user == null)
            throw new UnauthorizedAccessException("Invalid email or password.");

        if (!await _userManager.HasPasswordAsync(user))
            throw new UnauthorizedAccessException("This account uses Google login only.");
        
        var result = await _signInManager.CheckPasswordSignInAsync(user, dto.Password, false);
        if (!result.Succeeded)
            throw new UnauthorizedAccessException("Invalid email or password.");

        return await GenerateTokensAsync(user);
    }

    public async Task<AuthResponse> RefreshTokenAsync(string refreshToken)
    {
        var storedToken = await _dbContext.RefreshTokens
            .Include(t => t.User)
            .FirstOrDefaultAsync(t => t.Token == refreshToken);

        if (storedToken == null || storedToken.Revoked || storedToken.Expires < DateTime.UtcNow)
            throw new UnauthorizedAccessException("Invalid or expired refresh token");

        // Revoke old token
        storedToken.Revoked = true;

        // Generate new tokens
        return await GenerateTokensAsync(storedToken.User);
    }
    
    private async Task<AuthResponse> GenerateTokensAsync(UserEntity user)
    {
        var claims = await _jwtService.GetUserClaimsAsync(user);
        var accessToken = _jwtService.GenerateAccessToken(claims);
        var refreshToken = _jwtService.GenerateRefreshToken();
        

        var refreshTokenEntity = new RefreshTokenEntity
        {
            Token = refreshToken,
            UserId = user.Id,
            Expires = DateTime.UtcNow.AddDays(7)
        };

        _dbContext.RefreshTokens.Add(refreshTokenEntity);
        await _dbContext.SaveChangesAsync();

        return new AuthResponse
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken
        };
    }
    
    public async Task<AuthResponse> GoogleRegisterAsync(GoogleRegister model)
    {
        var userInfo = await _googleAuthService.GetUserInfoAsync(model.GoogleAccessToken);
        var user = new UserEntity
        {
            UserName = userInfo.Email,
            Email = userInfo.Email,
            FullName = userInfo.Name,
            FirstName = userInfo.GivenName,
            LastName = userInfo.FamilyName,
            ProfilePictureUrl = userInfo.Picture,
        };

        var result = await _userManager.CreateAsync(user);
        if (!result.Succeeded)
            throw new ApplicationException(string.Join(", ", result.Errors.Select(e => e.Description)));

        var subscription = new SubscriptionEntity
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            Type = model.SubscriptionType,
            StartDate = DateTime.UtcNow,
            EndDate = DateTime.UtcNow.AddDays(30),
            IsActive = true
        };

        _dbContext.Subscriptions.Add(subscription);
        return await GetAuthTokens(user);
    }
    
    public async Task<AuthResponse> GoogleLoginAsync(GoogleLogin model)
    {
        if (string.IsNullOrWhiteSpace(model.GoogleAccessToken))
            throw new ArgumentException("Google access token is required.");
        
        var userInfo = await _googleAuthService.GetUserInfoAsync(model.GoogleAccessToken);
        
        if (userInfo == null)
        {
            throw new Exception($"Google login failed: no user info returned. Token: {model.GoogleAccessToken}");
        }
        
        if (string.IsNullOrWhiteSpace(userInfo.Email))
        {
            throw new Exception($"Google login failed: email not provided. Full user info: {System.Text.Json.JsonSerializer.Serialize(userInfo)}");
        }
        
        var existingUser = await _userManager.FindByEmailAsync(userInfo.Email);
        if (existingUser != null)
        {
            var userLoginGoogle = await _userManager.FindByLoginAsync("Google", userInfo.Sub);
        
            if (userLoginGoogle == null)
            {
                await _userManager.AddLoginAsync(existingUser, new UserLoginInfo("Google", userInfo.Sub, "Google"));
            }
            
            return await GetAuthTokens(existingUser);
        }
        else
        {
            return new AuthResponse
            { 
                IsActive = false,
            };
        }
    }

    
    // public async Task<bool> IsRegisteredWithGoogleAsync(string email)
    // {
    //     return await _googleAuthService.IsRegisteredAsync(email);
    // }

    public async Task ForgotPasswordAsync(ForgotPasswordDto dto)
    {
        var user = await _userManager.FindByEmailAsync(dto.Email);
        if (user == null) return;

        var token = await _userManager.GeneratePasswordResetTokenAsync(user);
        await _emailService.SendResetPasswordEmailAsync(dto.Email, token);
    }

    public async Task ResetPasswordAsync(ResetPasswordDto dto)
    {
        var user = await _userManager.FindByEmailAsync(dto.Email);
        if (user == null)
            throw new Exception("User not found");

        var result = await _userManager.ResetPasswordAsync(user, dto.Token, dto.NewPassword);
        if (!result.Succeeded)
            throw new Exception(string.Join("; ", result.Errors.Select(e => e.Description)));
    }

    public async Task LogOutAsync(string refreshToken)
    {
        var token = await _dbContext.RefreshTokens
            .FirstOrDefaultAsync(t => t.Token == refreshToken);

        Console.WriteLine($"Токен перед видаленням:  Id: {token.Id}, Token: {token.Token}, Expires: {token.Expires}");
        
        if (token != null)
        {
            token.Revoked = true;
            await _dbContext.SaveChangesAsync();
        }
    }
    
    private async Task<AuthResponse> GetAuthTokens(UserEntity user)
    {
        var accessToken = _jwtService.GenerateAccessToken(await _jwtService.GetUserClaimsAsync(user));
        var refreshToken = await CreateRefreshToken(user.Id);

        // 🔎 Перевірка підписки
        var subscription = await _dbContext.Subscriptions
            .Where(s => s.UserId == user.Id && s.IsActive && s.EndDate > DateTime.UtcNow)
            .OrderByDescending(s => s.EndDate)
            .FirstOrDefaultAsync();

        return new AuthResponse
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            IsActive = subscription != null
        };
    }
    
    private async Task<string> CreateRefreshToken(long userId)
    {
        var refreshToken = _jwtService.GenerateRefreshToken();
        var refreshTokenEntity = new RefreshTokenEntity
        {
            Token = refreshToken,
            UserId = userId,
            Expires = DateTime.UtcNow.AddDays(_jwtService.GetRefreshTokenLiveTime())
        };
        _dbContext.RefreshTokens.Add(refreshTokenEntity);
        await _dbContext.SaveChangesAsync();
        return refreshToken;
    }

}