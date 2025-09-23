namespace Core.DTOs.UsersDTOs;

public class UserDto
{
    public string Id { get; set; } = null!;
    public string FullName { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string ProfilePictureUrl { get; set; } = null!;
    public long? CardId { get; set; }
    public string SubscriptionId { get; set; }
    public string? SubscriptionType { get; set; }
    public DateTime? SubscriptionStart { get; set; }
    public DateTime? SubscriptionEnd { get; set; }
    public bool? SubscriptionIsActive { get; set; }
    public string Role { get; set; } = null!;
    public bool IsBlocked { get; set; }
}