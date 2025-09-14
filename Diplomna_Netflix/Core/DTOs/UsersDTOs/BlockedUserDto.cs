namespace Core.DTOs.UsersDTOs;

public class BlockedUserDto
{
    public long UserId { get; set; }
    public string UserEmail { get; set; }
    public long AdminId { get; set; }
    public string AdminEmail { get; set; }
    public DateTime BlockedAt { get; set; }
    public int DurationDays { get; set; }
    public string Reason { get; set; } = null!;
}