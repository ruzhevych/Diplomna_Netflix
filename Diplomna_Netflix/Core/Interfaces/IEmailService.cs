namespace Core.Interfaces
{
    public interface IEmailService
    {
        Task SendResetPasswordEmailAsync(string email, string token);
    }
}