namespace Core.DTOs.CardsDTOs;

public class CardUpdateDto
{
    public string CardNumber { get; set; }
    public string? CardholderName { get; set; }
    public int? ExpMonth { get; set; }
    public int? ExpYear { get; set; }
    public bool? MakeDefault { get; set; }
}