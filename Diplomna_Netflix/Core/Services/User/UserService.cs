using AutoMapper;
using Core.DTOs.UsersDTOs;
using Core.Interfaces.User;
using Data.Entities.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Core.Services.User;

public class UserService : IUserService
{
    private readonly UserManager<UserEntity> _userManager;
    private readonly IMapper _mapper;

    public UserService(UserManager<UserEntity> userManager, IMapper mapper)
    {
        _userManager = userManager;
        _mapper = mapper;
    }

    public async Task CreateUserAsync(UserCreateDto dto)
    {
        var user = new UserEntity
        {
            UserName = dto.Email,
            Email = dto.Email
        };

        var result = await _userManager.CreateAsync(user, dto.Password);
        if (!result.Succeeded)
        {
            throw new Exception(string.Join("; ", result.Errors.Select(e => e.Description)));
        }
    }

    public async Task DeleteUserAsync(string id)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user != null)
        {
            await _userManager.DeleteAsync(user);
        }
    }

    public async Task<List<UserDto>> GetAllAsync()
    {
        var users = await _userManager.Users.ToListAsync();
        return _mapper.Map<List<UserDto>>(users);
    }
    
    public async Task<BlockedUserDto?> GetActiveBlockInfoAsync(string userId)
    {
        var user = await _userManager.Users
            .Include(u => u.BlockHistory)
            .FirstOrDefaultAsync(u => u.Id.ToString() == userId);

        if (user == null)
            return null;

        var activeBlock = user.BlockHistory
            .OrderByDescending(b => b.BlockedAt)
            .FirstOrDefault(b => b.IsActive);

        if (activeBlock == null)
            return null;

        return new BlockedUserDto
        {
            UserId = activeBlock.UserId,
            UserEmail = GetByIdAsync(activeBlock.UserId.ToString()).Result.Email,
            AdminId = activeBlock.AdminId,
            AdminEmail = GetByIdAsync(activeBlock.AdminId.ToString()).Result.Email,
            BlockedAt = activeBlock.BlockedAt,
            DurationDays = activeBlock.Duration.HasValue ? (int)activeBlock.Duration.Value.TotalDays : 0,
            Reason = activeBlock.Reason
        };
    }

    public async Task<UserDto> GetByIdAsync(string id)
    {
        var user = await _userManager.Users
            .Include(u => u.Subscriptions)
            .Include(u => u.Cards)
            .FirstOrDefaultAsync(u => u.Id.ToString() == id);

        if (user == null) return null;

        var dto = _mapper.Map<UserDto>(user);

        var activeSub = user.Subscriptions.FirstOrDefault(s => s.IsActive);
        if (activeSub != null)
        {
            dto.SubscriptionId = activeSub.Id.ToString();
            dto.SubscriptionType = activeSub.Type;
            dto.SubscriptionStart = activeSub.StartDate;
            dto.SubscriptionEnd = activeSub.EndDate;
            dto.SubscriptionIsActive = activeSub.IsActive;
        }
        
        var card = user.Cards.FirstOrDefault(s => s.IsDefault);
        if (card != null)
        {
            dto.CardId = card.Id;
        }
        
        var roles = await _userManager.GetRolesAsync(user);
        dto.Role = roles.FirstOrDefault() ?? "User";

        dto.IsBlocked = user.IsBlocked;
        return dto;
    }

    public async Task UpdateUserAsync(UserUpdateDto dto)
    {
        var user = await _userManager.FindByIdAsync(dto.Id);
        if (user != null)
        {
            user.Email = dto.Email;
            user.UserName = dto.Email;
            user.FullName = dto.FullName;
                
            if (dto.ProfilePictureFile != null && dto.ProfilePictureFile.Length > 0)
            {
                var uploadsFolder = Path.Combine("wwwroot", "profile-pictures");
                Directory.CreateDirectory(uploadsFolder);

                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(dto.ProfilePictureFile.FileName);
                var filePath = Path.Combine(uploadsFolder, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await dto.ProfilePictureFile.CopyToAsync(stream);
                }

                user.ProfilePictureUrl = $"/profile-pictures/{fileName}";
            }
            else if (!string.IsNullOrWhiteSpace(dto.ProfilePictureUrl))
            {
                user.ProfilePictureUrl = dto.ProfilePictureUrl;
            }

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
            {
                throw new Exception(string.Join("; ", result.Errors.Select(e => e.Description)));
            }

            if (!string.IsNullOrWhiteSpace(dto.Password))
            {
                var token = await _userManager.GeneratePasswordResetTokenAsync(user);
                var passwordResult = await _userManager.ResetPasswordAsync(user, token, dto.Password);
                if (!passwordResult.Succeeded)
                {
                    throw new Exception(string.Join("; ", passwordResult.Errors.Select(e => e.Description)));
                }
            }
        }
    }

    public async Task<UserDto?> GetByEmailAsync(string email)
    {
        var user = await _userManager.FindByEmailAsync(email);
        return user == null ? null : _mapper.Map<UserDto>(user);
    }
}