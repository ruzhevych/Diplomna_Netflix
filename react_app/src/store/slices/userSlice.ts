import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { jwtParse } from '../../utils/jwtParse';
import type { RootState } from '../store';
import type { IUser, IUserAuth, IUserState } from '../../types/user';
import { APP_ENV } from '../../env';

const getUserFromToken = (token: string | null): IUser | null =>
  token ? jwtParse(token) : null;

const getUserAuth = (user: IUser | null): IUserAuth => ({
  isAdmin: user?.roles.includes('Admin') || false,
  isUser: user?.roles.includes('User') || false,
  isAuth: user !== null,
  roles: user?.roles || [],
});

const userInit = (): IUserState => {
  const token = localStorage.getItem(APP_ENV.ACCESS_KEY);
  const user = getUserFromToken(token);
  const auth = getUserAuth(user);

  return {
    user,
    token,
    auth,
  };
};

const initialState: IUserState = userInit();

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ token: string }>) => {
      const { token } = action.payload;
      state.user = getUserFromToken(token);
      state.token = token;
      state.auth = getUserAuth(state.user);

      if (state.user) {
        localStorage.setItem(APP_ENV.ACCESS_KEY, token);
      }
    },
    logOut: (state) => {
      localStorage.removeItem(APP_ENV.ACCESS_KEY);
      state.user = null;
      state.token = null;
      state.auth = getUserAuth(null);
    },
  },
});

export const getUser = (state: RootState) => state.user.user;
export const getAuth = (state: RootState) => state.user.auth;
export const getToken = (state: RootState) => state.user.token;

export const { setCredentials, logOut } = userSlice.actions;
export default userSlice.reducer;
