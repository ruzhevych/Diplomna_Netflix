using System.Threading.Tasks;
using Core.Interfaces;

namespace Core.Services
{
    public class EmailService : IEmailService
    {
        public Task SendResetPasswordEmailAsync(string email, string token)
        {
            // TODO: Implement real email sending
            Console.WriteLine($"Simulated email to {email} with token: {token}");
            return Task.CompletedTask;
        }
    }
}