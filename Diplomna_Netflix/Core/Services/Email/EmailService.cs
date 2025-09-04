using Core.Interfaces.Email;
using Microsoft.Extensions.Configuration;
using MimeKit;
using MailKit.Net.Smtp;
using MailKit.Security;

namespace Core.Services.Email;

public class EmailService : IEmailService
{
    private readonly IConfiguration _configuration;

    public EmailService(IConfiguration configuration)
    {
        _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
    }

    public async Task SendEmailAsync(string toEmail, string subject, string message)
    {
        var emailSettings = _configuration.GetSection("EmailSettings");

        string smtpServer = emailSettings["SmtpServer"];
        string senderEmail = emailSettings["SenderEmail"];
        string senderName = emailSettings["SenderName"];
        string password = emailSettings["Password"];
        if (!int.TryParse(emailSettings["Port"], out int port))
            port = 0;

        if (string.IsNullOrWhiteSpace(smtpServer) ||
            string.IsNullOrWhiteSpace(senderEmail) ||
            string.IsNullOrWhiteSpace(password) ||
            port <= 0)
        {
            throw new Exception("Email settings are not configured properly.");
        }

        var emailMessage = new MimeMessage();
        emailMessage.From.Add(new MailboxAddress(senderName ?? senderEmail, senderEmail));
        emailMessage.To.Add(MailboxAddress.Parse(toEmail));
        emailMessage.Subject = subject;
        emailMessage.Body = new BodyBuilder { HtmlBody = message }.ToMessageBody();

        using var smtpClient = new SmtpClient();

        smtpClient.ServerCertificateValidationCallback = (s, c, h, e) => true;

        try
        {
            SecureSocketOptions options = port switch
            {
                465 => SecureSocketOptions.SslOnConnect,
                587 => SecureSocketOptions.StartTls,
                _ => SecureSocketOptions.Auto
            };

            await smtpClient.ConnectAsync(smtpServer, port, options);
            await smtpClient.AuthenticateAsync(senderEmail, password);
            await smtpClient.SendAsync(emailMessage);
        }
        catch (Exception ex)
        {
            throw new Exception($"SMTP error while sending email: {ex.Message}", ex);
        }
        finally
        {
            await smtpClient.DisconnectAsync(true);
        }
    }

    public async Task SendResetPasswordEmailAsync(string toEmail, string resetToken)
    {
        var frontendUrl = _configuration["App:FrontendUrl"];
        var resetUrl = $"{frontendUrl}/reset-password?email={Uri.EscapeDataString(toEmail)}&token={Uri.EscapeDataString(resetToken)}";

        var subject = "Відновлення пароля";
        var body = $@"
            <p>Ви запросили скинути пароль.</p>
            <p>Щоб змінити пароль, перейдіть за цим посиланням:</p>
            <p><a href='{resetUrl}'>Скинути пароль</a></p>
            <p>Якщо ви не надсилали цей запит — просто ігноруйте лист.</p>
        ";

        await SendEmailAsync(toEmail, subject, body);
    }
}