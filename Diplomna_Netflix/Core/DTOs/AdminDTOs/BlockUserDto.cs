namespace Core.DTOs.AdminDTOs;

public class BlockUserDto
{
    public long UserId { get; set; }
    public long AdminId { get; set; }
    public int DurationDays { get; set; }
    public string Reason { get; set; } = null!;
}