export function getUserRole(decoded: any): string | null {
  if (!decoded) return null;

  if (decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]) {
    return decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
  }

  if (decoded.role) return decoded.role;

  return null;
}