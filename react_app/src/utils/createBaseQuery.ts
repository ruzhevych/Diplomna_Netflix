import { fetchBaseQuery, type FetchArgs, type BaseQueryApi } from '@reduxjs/toolkit/query';
import { Mutex } from 'async-mutex';
import type { RootState } from '../store/store';
import { setCredentials, logOut } from '../store/slices/userSlice';
import { APP_ENV } from '../env';

export const createBaseQuery = (endpoint: string) => {
  return fetchBaseQuery({
    baseUrl: `${APP_ENV.REMOTE_BASE_URL}/api/${endpoint}/`,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).user.token;
      console.log("[API] sending token:", {token});
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  });
};

const mutex = new Mutex();

export const createBaseQueryWithReauth = (endpoint: string) => {
  const baseQuery = createBaseQuery(endpoint);

  return async (
    args: string | FetchArgs,
    api: BaseQueryApi,
    extraOptions: Record<string, unknown>
  ) => {
    await mutex.waitForUnlock();
    let result = await baseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
      console.warn('[AUTH] 401 — trying refresh...');
      if (!mutex.isLocked()) {
        const release = await mutex.acquire();
        try {
          const refreshQuery = createBaseQuery('Auth');
          const refreshResult = await refreshQuery(
            { url: 'refresh-token', method: 'POST' },
            api,
            extraOptions
          );
          console.log("[AUTH] Refresh response:", refreshResult);
          console.log("[AUTH] Refresh response ✅");
          if ((refreshResult.data as { accessToken?: string })?.accessToken) {
            const newToken = (refreshResult.data as { accessToken: string }).accessToken;
            api.dispatch(setCredentials({ token: newToken }));
            result = await baseQuery(args, api, extraOptions);
          } else {
            api.dispatch(logOut());
          }
        } finally {
          release();
        }
      } else {
        await mutex.waitForUnlock();
        result = await baseQuery(args, api, extraOptions);
      }
    }

    return result;
  };
};
