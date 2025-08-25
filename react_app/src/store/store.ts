import { configureStore } from '@reduxjs/toolkit'
import { authApi } from '../services/authApi'
import { userApi } from '../services/userApi'
import { setupListeners } from '@reduxjs/toolkit/query'
import authReducer from './slices/authSlice'
import userReducer from './slices/userSlice';
import {favoritesApi} from "../services/favoritesApi.ts";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    auth: authReducer,
    [userApi.reducerPath]: userApi.reducer,
    user: userReducer,
    [favoritesApi.reducerPath]: favoritesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, userApi.middleware, favoritesApi.middleware),
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

