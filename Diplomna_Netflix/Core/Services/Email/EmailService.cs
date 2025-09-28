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
        var subject = "Відновлення пароля – ваш кіносвіт чекає 🎬";

        var body = $@"
        <div style='font-family: Arial, sans-serif; color: #333; line-height: 1.6;'>
            <h2 style='color: #333;'>Відновлення пароля</h2>
            <p>Вітаємо! Ви запросили скинути пароль до свого акаунта на нашому сайті <a href='{frontendUrl}'>bingatch.com</a></p>

            <p>Натисніть на кнопку нижче, щоб створити новий пароль:</p>
            <p>
                <a href='{resetUrl}' 
                   style='display:inline-block; padding:10px 20px; background-color:#C4FF00; color:#333; 
                          text-decoration:none; border-radius:4px; font-weight:bold;'>
                    Скинути пароль
                </a>
            </p>

            <hr style='margin:20px 0;' />

            <h3>Чому обирають нас? 🍿</h3>
            <ul>
                <li>Величезна бібліотека фільмів і серіалів у HD-якості.</li>
                <li>Персональні рекомендації, щоб ви завжди знаходили щось цікаве.</li>
                <li>Зручний перегляд на будь-якому пристрої.</li>
            </ul>

            <p>Якщо ви не надсилали цей запит — просто проігноруйте цей лист.</p>
            <p style='margin-top:20px; font-size:0.9em; color:#666;'>
                З любов'ю, команда <strong>bingatch</strong> 🎥
            </p>
        </div>
    ";

        await SendEmailAsync(toEmail, subject, body);
    }
}