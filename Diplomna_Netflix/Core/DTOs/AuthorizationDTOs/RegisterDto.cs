namespace Core.DTOs.AuthorizationDTOs;

public class RegisterDto
{
    public string FullName { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string Password { get; set; } = null!;
    public string SubscriptionType { get; set; } = null!;
}