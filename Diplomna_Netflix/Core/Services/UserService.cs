using AutoMapper;
using Core.DTOs.UsersDTOs;
using Core.Interfaces;
using Data.Entities.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Core.Services
{
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

        public async Task<UserDto> GetByIdAsync(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            return _mapper.Map<UserDto>(user);
        }

        public async Task UpdateUserAsync(UserUpdateDto dto)
        {
            var user = await _userManager.FindByIdAsync(dto.Id);
            if (user != null)
            {
                user.Email = dto.Email;
                user.UserName = dto.Email;

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
}
