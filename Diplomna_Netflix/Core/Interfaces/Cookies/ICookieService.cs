using Microsoft.AspNetCore.Http;

namespace Core.Interfaces.Cookies;

public interface ICookieService
{
    CookieOptions GetRefreshTokenCookieOptions();
    void AppendRefreshTokenCookie(HttpResponse response, string refreshToken);
    void DeleteRefreshTokenCookie(HttpResponse response);
}