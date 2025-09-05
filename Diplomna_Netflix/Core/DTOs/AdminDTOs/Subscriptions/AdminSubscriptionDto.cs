namespace Core.DTOs.AdminDTOs.Subscriptions;

public class AdminSubscriptionDto
{
    public Guid Id { get; set; }
    public string UserEmail { get; set; }
    public string Type { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public bool IsActive { get; set; }
}
