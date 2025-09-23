using Data.Entities.Identity;

namespace Data.Entities.Payment;

public class PaymentEntity
{
    public long Id { get; set; }

    public long UserId { get; set; }
    public UserEntity User { get; set; } = null!;

    public string Token { get; set; } = null!;
    public string Last4 { get; set; } = null!;
    public string Brand { get; set; } = null!;
    public int ExpMonth { get; set; }
    public int ExpYear { get; set; }
    public string? CardholderName { get; set; }
    public bool IsDefault { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
