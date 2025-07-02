namespace Core.DTOs.SubscriptionsDTOs
{
    public class SubscriptionUpdateDto
    {
        public string Type { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public bool IsActive { get; set; }
    }
}