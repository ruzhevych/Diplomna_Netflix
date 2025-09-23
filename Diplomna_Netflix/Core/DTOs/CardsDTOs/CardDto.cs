namespace Core.DTOs.CardsDTOs;


public class CardDto
{
    public long Id { get; set; }
    public string Token { get; set; } = null!;
    public string Last4 { get; set; } = null!;
    public string Brand { get; set; } = null!;
    public int ExpMonth { get; set; }
    public int ExpYear { get; set; }
    public string? CardholderName { get; set; }
    public bool IsDefault { get; set; }
}