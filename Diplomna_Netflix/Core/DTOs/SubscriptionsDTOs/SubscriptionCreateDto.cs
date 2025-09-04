namespace Core.DTOs.SubscriptionsDTOs;

public class SubscriptionCreateDto
{
    public long UserId { get; set; }
    public string Type { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
}