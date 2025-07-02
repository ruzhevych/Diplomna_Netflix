namespace Core.DTOs.SubscriptionsDTOs
{
    public class SubscriptionDto
    {
        public Guid Id { get; set; }
        public long UserId { get; set; }
        public string Type { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public bool IsActive { get; set; }
    }
}