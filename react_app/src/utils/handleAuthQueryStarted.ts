import { jwtParse } from './jwtParse';
import { setCredentials } from '../store/slices/userSlice';
import type { IAuthResponse } from '../types/auth';
import type { BaseQueryApi } from '@reduxjs/toolkit/query';
import type { FormData } from 'formdata-node';

export const handleAuthQueryStarted = async (
  arg: FormData,
  api: BaseQueryApi,
  extraOptions: unknown,
  baseQueryPromise: Promise<{ data?: unknown; error?: unknown }>
) => {
  try {
    const result = await baseQueryPromise;
    if (result.data && (result.data as IAuthResponse).accessToken) {
      const { accessToken } = result.data as IAuthResponse;
      api.dispatch(setCredentials({ token: accessToken }));
    }
  } catch (err) {
    console.error('[handleAuthQueryStarted error]', err);
  }
};

