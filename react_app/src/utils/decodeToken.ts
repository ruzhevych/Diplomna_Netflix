
export function decodeToken(token: string): any | null {
  try {
    const payload = token.split(".")[1];
    const decoded = atob(payload);
    return JSON.parse(decoded);
  } catch (e) {
    console.error("Не вдалося розпарсити токен", e);
    return null;
  }
}
