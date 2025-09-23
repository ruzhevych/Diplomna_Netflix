namespace Core.DTOs.CardsDTOs;

public class CardCreateDto
{
    public string CardNumber { get; set; } = null!;
    public int ExpMonth { get; set; }
    public int ExpYear { get; set; }
    public string Cvv { get; set; } = null!;
    public string CardholderName { get; set; } = null!;
    public bool MakeDefault { get; set; } = false;
}