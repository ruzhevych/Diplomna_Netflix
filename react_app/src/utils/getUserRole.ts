export function getUserRole(decoded: any): string | null {
  if (!decoded) return null;

  // ASP.NET часто пише роль саме так
  if (decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]) {
    return decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
  }

  // Якщо твій бекенд ще якось інакше називає
  if (decoded.role) return decoded.role;

  return null;
}