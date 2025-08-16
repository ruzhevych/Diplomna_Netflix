namespace Core.DTOs.Admin
{
    public class SendMessageDto
    {
        public long UserId { get; set; }
        public string Subject { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
    }
}