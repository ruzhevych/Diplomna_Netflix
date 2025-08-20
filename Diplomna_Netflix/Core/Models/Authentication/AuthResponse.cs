namespace Core.Models.Authentication
{
    public class AuthResponse
    {
        public string AccessToken { get; set; } = null!;
        public string RefreshToken { get; set; } = null!;
        public bool? IsActive { get; set; } = false;
    }
}