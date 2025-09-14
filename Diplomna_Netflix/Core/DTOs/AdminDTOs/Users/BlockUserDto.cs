namespace Core.DTOs.AdminDTOs.Users;

public class BlockUserDto
{
    public long UserId { get; set; }
    public int DurationDays { get; set; }
    public string Reason { get; set; } = null!;
}