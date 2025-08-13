using Core.Interfaces;
using Microsoft.Extensions.Configuration;
using System.Net;
using System.Net.Mail;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using SmtpClient = MailKit.Net.Smtp.SmtpClient;

namespace Core.Services
{
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
                var errMsg = "Email settings are not configured properly.";
                Console.Error.WriteLine(errMsg);
                throw new Exception(errMsg);
            }

            var emailMessage = new MimeMessage();
            emailMessage.From.Add(new MailboxAddress(senderName ?? senderEmail, senderEmail));
            emailMessage.To.Add(MailboxAddress.Parse(toEmail));
            emailMessage.Subject = subject;

            var bodyBuilder = new BodyBuilder { HtmlBody = message };
            emailMessage.Body = bodyBuilder.ToMessageBody();

            using var smtpClient = new SmtpClient();

            try
            {
                await smtpClient.ConnectAsync(smtpServer, port, SecureSocketOptions.SslOnConnect);
                await smtpClient.AuthenticateAsync(senderEmail, password);
                await smtpClient.SendAsync(emailMessage);
            }
            catch (SmtpCommandException ex)
            {
                throw new Exception($"SMTP command error: {ex.Message}", ex);
            }
            catch (SmtpProtocolException ex)
            {
                throw new Exception($"SMTP protocol error: {ex.Message}", ex);
            }
            catch (Exception ex)
            {
                throw new Exception($"Unexpected error while sending email: {ex.Message}", ex);
            }
            finally
            {
                await smtpClient.DisconnectAsync(true);
            }
        }

        public async Task SendResetPasswordEmailAsync(string toEmail, string resetToken)
        {
            var frontendUrl = _configuration["App:FrontendUrl"];
            var resetUrl = $"{frontendUrl}/reset-password?email={WebUtility.UrlEncode(toEmail)}&token={WebUtility.UrlEncode(resetToken)}";

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
}
