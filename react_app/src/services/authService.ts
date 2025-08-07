import { APP_ENV } from '../env';
import type { IAuthResponse, LoginPayload, RegisterPayload } from '../types/auth';


export const login = async (data: LoginPayload): Promise<IAuthResponse> => {
  const res = await fetch(`http://localhost:5170/api/Auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error('Невірний email або пароль');

  return await res.json();
};

export const register = async (data: RegisterPayload): Promise<boolean> => {
  const res = await fetch(`${APP_ENV.REMOTE_BASE_URL}api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...data,
      subscriptionType: data.plan,
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err[0]?.description || 'Помилка реєстрації');
  }

  return true;
};
