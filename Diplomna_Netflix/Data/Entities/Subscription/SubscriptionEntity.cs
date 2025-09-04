using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Data.Entities.Subscription;

public class SubscriptionEntity
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    [ForeignKey("User")]
    public long UserId { get; set; }

    public Identity.UserEntity User { get; set; } = null!;

    [Required]
    [MaxLength(20)]
    public string Type { get; set; } = null!; // Basic, Standard, Premium

    [Required]
    public DateTime StartDate { get; set; }

    [Required]
    public DateTime EndDate { get; set; }

    public bool IsActive { get; set; } = true;
}