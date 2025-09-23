import { configureStore } from '@reduxjs/toolkit'
import { authApi } from '../services/authApi'
import { userApi } from '../services/userApi'
import { setupListeners } from '@reduxjs/toolkit/query'
import authReducer from './slices/authSlice'
import userReducer from './slices/userSlice';
import {favoritesApi} from "../services/favoritesApi.ts";
import { adminApi } from "../services/adminApi";
import { forLaterApi } from '../services/forLaterApi.ts'
import { commentsApi } from '../services/commentApi.ts'
import { adminSubscriptionsApi } from '../services/adminSubscriptionsApi.ts'
import { ratingApi } from '../services/ratingApi.ts'
import { historyApi } from '../services/historyApi.ts'
import { paymentApi } from '../services/paymentApi.ts'
import { subscriptionApi } from '../services/subscriptionApi.ts'


export const store = configureStore({
  reducer: {
    [adminApi.reducerPath]: adminApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    auth: authReducer,
    [userApi.reducerPath]: userApi.reducer,
    user: userReducer,
    [favoritesApi.reducerPath]: favoritesApi.reducer,
    [forLaterApi.reducerPath]: forLaterApi.reducer,
    [commentsApi.reducerPath]: commentsApi.reducer,
    [adminSubscriptionsApi.reducerPath]: adminSubscriptionsApi.reducer,
    [ratingApi.reducerPath]: ratingApi.reducer,
    [historyApi.reducerPath]: historyApi.reducer,
    [paymentApi.reducerPath]: paymentApi.reducer,
    [subscriptionApi.reducerPath]: subscriptionApi.reducer,

  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      userApi.middleware,
      adminApi.middleware,
      favoritesApi.middleware, 
      forLaterApi.middleware,
      commentsApi.middleware,
      adminSubscriptionsApi.middleware,
      ratingApi.middleware,
      historyApi.middleware,
      paymentApi.middleware,
      subscriptionApi.middleware,
    ),
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

