namespace Core.DTOs.AdminDTOs.Subscriptions;

public class AdminSubscriptionUpdateDto
{
    public string Type { get; set; }
    public DateTime? EndDate { get; set; }
    public bool? IsActive { get; set; }
}