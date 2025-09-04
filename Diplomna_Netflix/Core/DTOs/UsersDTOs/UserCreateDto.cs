namespace Core.DTOs.UsersDTOs;

public class UserCreateDto
{
    public string FullName { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string Password { get; set; } = null!;
    public string ProfilePictureUrl { get; set; } = null!;
}