using System.Net.Http.Headers;
using System.Text.Json;
using Core.Interfaces.Auth;
using Core.Options;
using Microsoft.Extensions.Configuration;

namespace Core.Services.Auth;

public class GoogleAuthService : IGoogleAuthService
{
    private readonly IConfiguration _config;

    public GoogleAuthService( IConfiguration config)
    {
        _config = config;
    }

    public async Task<GoogleUserInfo?> GetUserInfoAsync(string googleAccessToken)
    {
        var userInfoUrl = _config["GoogleUserInfoUrl"] ?? "https://www.googleapis.com/oauth2/v3/userinfo";
        if (string.IsNullOrEmpty(userInfoUrl))
            throw new Exception("GoogleUserInfoUrl is not configured in appsettings.json");

        using var httpClient = new HttpClient();
        httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", googleAccessToken);

        var response = await httpClient.GetAsync(userInfoUrl);

        var json = await response.Content.ReadAsStringAsync();
        if (!response.IsSuccessStatusCode)
            throw new Exception($"Google API error: {response.StatusCode}, {json}");
            
        return JsonSerializer.Deserialize<GoogleUserInfo>(json);
    }
}
