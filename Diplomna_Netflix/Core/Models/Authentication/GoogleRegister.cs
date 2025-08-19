namespace Core.Models.Authentication;

public class GoogleRegister
{
    public string GoogleAccessToken { get; set; } = null!;
    public string SubscriptionType { get; set; } = null!;
}
