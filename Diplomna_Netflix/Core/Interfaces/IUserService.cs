using Core.DTOs.UsersDTOs;

namespace Core.Interfaces
{
    public interface IUserService
    {
        Task CreateUserAsync(UserCreateDTO dto);
        Task UpdateUserAsync(UserUpdateDTO dto);
        Task DeleteUserAsync(long id);
        Task<UserDTO?> GetByEmailAsync(string email);
        Task<UserDTO> GetByIdAsync(long id);
        Task<List<UserDTO>> GetAllAsync();
    }
}