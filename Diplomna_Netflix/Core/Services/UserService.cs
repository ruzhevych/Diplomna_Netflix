using AutoMapper;
using Core.DTOs.UsersDTOs;
using Core.Interfaces;
using Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace Core.Services
{
    public class UserService : IUserService
    {
        private readonly IRepository<UserEntity> _repository;
        private readonly IMapper _mapper;

        public UserService(IRepository<UserEntity> repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task CreateUserAsync(UserCreateDTO dto)
        {
            var user = _mapper.Map<UserEntity>(dto);
            user.UserName = user.Email;
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);
            await _repository.Insert(user);
            await _repository.SaveAsync();
        }

        public async Task DeleteUserAsync(long id)
        {
            await _repository.DeleteAsync(id);
            await _repository.SaveAsync();
        }

        public async Task<List<UserDTO>> GetAllAsync()
        {
            var users = await _repository.GetAllQueryable().ToListAsync();
            return _mapper.Map<List<UserDTO>>(users);
        }

        public async Task<UserDTO> GetByIdAsync(long id)
        {
            var user = await _repository.GetByID(id);
            return _mapper.Map<UserDTO>(user);
        }

        public async Task UpdateUserAsync(UserUpdateDTO dto)
        {
            var user = await _repository.GetByID(dto.Id);
            if (user != null)
            {
                _mapper.Map(dto, user);
                if (!string.IsNullOrWhiteSpace(dto.Password))
                {
                    user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);
                }

                await _repository.Update(user);
                await _repository.SaveAsync();
            }
        }

        public async Task<UserDTO?> GetByEmailAsync(string email)
        {
            var user = await _repository.GetAllQueryable()
                                        .FirstOrDefaultAsync(u => u.Email == email);

            return user == null ? null : _mapper.Map<UserDTO>(user);
        }
    }
}
