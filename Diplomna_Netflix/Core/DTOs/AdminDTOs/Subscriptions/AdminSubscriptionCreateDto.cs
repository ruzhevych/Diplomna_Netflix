namespace Core.DTOs.AdminDTOs.Subscriptions;

public class AdminSubscriptionCreateDto
{
    public long UserId { get; set; } 
    public string Type { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
}