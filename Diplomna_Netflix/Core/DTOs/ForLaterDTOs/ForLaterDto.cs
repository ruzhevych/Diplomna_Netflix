namespace Core.DTOs.ForLaterDTOs;

public class ForLaterDto
{
    public long Id { get; set; }
    public string ContentId { get; set; } = null!;
    public string ContentType { get; set; } = null!;
    public DateTime CreatedAt { get; set; }
}