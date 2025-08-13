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
    private readonly IMapper mapper;

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
        mapper = mapper;
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
            throw new UnauthorizedAccessException("Invalid credentials");

        var result = await _signInManager.CheckPasswordSignInAsync(user, dto.Password, false);
        if (!result.Succeeded)
            throw new UnauthorizedAccessException("Invalid credentials");

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

        var user = await _userManager.FindByEmailAsync(userInfo.Email);

        if (user == null)
        {
            user = mapper.Map<UserEntity>(userInfo);
            user.UserName = userInfo.Name;
            user.EmailConfirmed = true;

            var createResult = await _userManager.CreateAsync(user);
            if (!createResult.Succeeded)
                throw new Exception("Failed to create user from Google account: " +
                                    string.Join(", ", createResult.Errors.Select(e => e.Description)));

            await _userManager.AddToRoleAsync(user, "User");
        }

        return await GetAuthTokens(user);
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
        return new()
        {
            AccessToken = _jwtService.GenerateAccessToken(await _jwtService.GetUserClaimsAsync(user)),
            RefreshToken = await CreateRefreshToken(user.Id)
        };
    }
    
    private async Task<string> CreateRefreshToken(long userId)
    {
        var refeshToken = _jwtService.GenerateRefreshToken();
        var refreshTokenEntity = new RefreshTokenEntity
        {
            Token = refeshToken,
            UserId = userId,
            Expires = DateTime.UtcNow.AddDays(_jwtService.GetRefreshTokenLiveTime())
        };
        _dbContext.RefreshTokens.Add(refreshTokenEntity);
        await _dbContext.SaveChangesAsync();
        return refeshToken;
    }

}