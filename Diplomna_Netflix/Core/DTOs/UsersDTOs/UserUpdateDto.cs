using Microsoft.AspNetCore.Http;

namespace Core.DTOs.UsersDTOs
{
    public class UserUpdateDto
    {
        public string Id { get; set; } = null!;
        public string FullName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string? Password { get; set; }
        public string? ProfilePictureUrl { get; set; } // якщо користувач вказує URL
        public IFormFile? ProfilePictureFile { get; set; } // якщо користувач завантажує файл
    }
}