const BASE = 'http://localhost:5170/api/Users';
async function fetchAuth(input: string, init: RequestInit = {}) {
  const token = localStorage.getItem('token');
  const res = await fetch(input, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(init.headers || {}),
    },
  });
  if (res.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export const getProfile = (id: string) =>
  fetchAuth(`${BASE}/profile/${id}`);
