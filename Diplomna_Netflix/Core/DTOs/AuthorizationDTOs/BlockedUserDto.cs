namespace Core.DTOs.AuthorizationDTOs;

public class BlockedUserDto
{
    public string UserId { get; set; }
    public string UserEmail { get; set; }
    public long AdminId { get; set; }
    public string AdminEmail { get; set; }
    public DateTime BlockedAt { get; set; }
    public int DurationDays { get; set; }
    public string Reason { get; set; } = null!;
}