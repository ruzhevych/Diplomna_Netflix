using Core.DTOs.UsersDTOs;

namespace Core.Interfaces.User;

public interface IUserService
{
    //Task CreateUserAsync(UserCreateDto dto);
    Task UpdateUserAsync(UserUpdateDto dto);
    Task DeleteUserAsync(string id);
    Task<UserDto?> GetByEmailAsync(string email);
    Task<UserDto> GetByIdAsync(string id);
    //Task<List<UserDto>> GetAllAsync();
}