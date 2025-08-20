import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  isActive: boolean | null
  
}

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  isActive: null,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setTokens: (state, action: PayloadAction<AuthState>) => {
      state.accessToken = action.payload.accessToken
      state.refreshToken = action.payload.refreshToken
      state.isActive = action.payload.isActive
    },
    clearTokens: (state) => {
      state.accessToken = null
      state.refreshToken = null
      state.isActive = null
    },
  },
})

export const { setTokens, clearTokens } = authSlice.actions
export default authSlice.reducer

