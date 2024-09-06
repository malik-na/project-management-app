// src/store/slices/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from '../index';
import { authService } from '../../services/authService';

interface AuthState {
  isAuthenticated: boolean;
  user: { id: string; login: string; avatar_url: string } | null;
  token: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth(state, action: PayloadAction<{ user: AuthState['user']; token: string }>) {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    clearAuth(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
    },
  },
});

export const { setAuth, clearAuth } = authSlice.actions;

export const handleAuthCallback = (code: string): AppThunk => async (dispatch) => {
  try {
    const { user, token } = await authService.handleCallback(code);
    dispatch(setAuth({ user, token }));
    localStorage.setItem('token', token);
  } catch (error) {
    console.error('Authentication error:', error);
  }
};

export const logout = (): AppThunk => (dispatch) => {
  authService.logout();
  dispatch(clearAuth());
};

export default authSlice.reducer;