using AutoMapper;
using Core.DTOs.AdminDTOs.Users;
using Core.DTOs.AuthorizationDTOs;
using Core.Interfaces.Auth;
using Core.Interfaces.Email;
using Core.Interfaces.Repository;
using Core.Models.Authentication;
using Data.Entities.Auth;
using Data.Entities.Identity;
using Data.Entities.Subscription;
using MailKit;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Core.Services.Auth;

public class AuthService : IAuthService
{
    private readonly UserManager<UserEntity> _userManager;
    private readonly SignInManager<UserEntity> _signInManager;
    private readonly IJwtService _jwtService;
    private readonly IEmailService _emailService;
    private readonly IGoogleAuthService _googleAuthService;
    private readonly IMapper _mapper;

    private readonly IRepository<SubscriptionEntity> _subscriptionRepo;
    private readonly IRepository<RefreshTokenEntity> _refreshTokenRepo;

    public AuthService(
        UserManager<UserEntity> userManager,
        SignInManager<UserEntity> signInManager,
        IJwtService jwtService,
        IEmailService emailService,
        IGoogleAuthService googleAuthService,
        IMapper mapper,
        IRepository<SubscriptionEntity> subscriptionRepo,
        IRepository<RefreshTokenEntity> refreshTokenRepo)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _jwtService = jwtService;
        _emailService = emailService;
        _googleAuthService = googleAuthService;
        _mapper = mapper;

        _subscriptionRepo = subscriptionRepo;
        _refreshTokenRepo = refreshTokenRepo;
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

        await _subscriptionRepo.AddAsync(subscription);
        await _subscriptionRepo.SaveChangesAsync();

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
        var storedToken = await _refreshTokenRepo
            .GetAllQueryable()
            .Include(t => t.User)
            .FirstOrDefaultAsync(t => t.Token == refreshToken);

        if (storedToken == null || storedToken.Revoked || storedToken.Expires < DateTime.UtcNow)
            throw new UnauthorizedAccessException("Invalid or expired refresh token");

        storedToken.Revoked = true;
        _refreshTokenRepo.Update(storedToken);
        await _refreshTokenRepo.SaveChangesAsync();

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

        await _refreshTokenRepo.AddAsync(refreshTokenEntity);
        await _refreshTokenRepo.SaveChangesAsync();

        return new AuthResponse
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            IsBlocked = user.IsBlocked
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

        await _subscriptionRepo.AddAsync(subscription);
        await _subscriptionRepo.SaveChangesAsync();

        return await GetAuthTokens(user);
    }
    
    public async Task<AuthResponse> GoogleLoginAsync(GoogleLogin model)
    {
        if (string.IsNullOrWhiteSpace(model.GoogleAccessToken))
            throw new ArgumentException("Google access token is required.");
        
        var userInfo = await _googleAuthService.GetUserInfoAsync(model.GoogleAccessToken);
        if (userInfo == null || string.IsNullOrWhiteSpace(userInfo.Email))
            throw new Exception("Google login failed.");

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

        return new AuthResponse { IsActive = false };
    }

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
        var token = await _refreshTokenRepo
            .GetAllQueryable()
            .FirstOrDefaultAsync(t => t.Token == refreshToken);

        if (token != null)
        {
            token.Revoked = true;
            _refreshTokenRepo.Update(token);
            await _refreshTokenRepo.SaveChangesAsync();
        }
    }
    
    private async Task<AuthResponse> GetAuthTokens(UserEntity user)
    {
        var accessToken = _jwtService.GenerateAccessToken(await _jwtService.GetUserClaimsAsync(user));
        var refreshToken = await CreateRefreshToken(user.Id);

        var subscription = await _subscriptionRepo
            .GetAllQueryable()
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

        await _refreshTokenRepo.AddAsync(refreshTokenEntity);
        await _refreshTokenRepo.SaveChangesAsync();

        return refreshToken;
    }
}
