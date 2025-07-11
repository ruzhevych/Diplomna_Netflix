using Core.Models.Authentication;
using Data.Entities.Identity;

namespace Core.Interfaces
{
    public interface IJwtService
    {
        AuthResponse GenerateTokens(UserEntity user);
    }
}