namespace Core.Interfaces.Email;

public interface IEmailService
{
    Task SendResetPasswordEmailAsync(string email, string token);
    Task SendEmailAsync(string toEmail, string subject, string message);
}