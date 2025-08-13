using System.Net.Http.Headers;
using System.Text.Json;
using Core.Interfaces;
using Core.Models;
using Microsoft.Extensions.Configuration;

namespace Core.Services
{
    public class GoogleAuthService : IGoogleAuthService
    {
        private readonly IConfiguration _config;

        public GoogleAuthService( IConfiguration config)
        {
            _config = config;
        }

        public async Task<GoogleUserInfo?> GetUserInfoAsync(string googleAccessToken)
        {
            var userInfoUrl = _config["GoogleUserInfoUrl"];
            using var httpClient = new HttpClient();
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", googleAccessToken);

            var response = await httpClient.GetAsync(userInfoUrl);
            response.EnsureSuccessStatusCode();

            var json = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<GoogleUserInfo>(json);
        }
    }
}