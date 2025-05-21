import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  loadInitialAuthData,
  storeJWT,
  storeUser,
  clearJWT,
  clearUser,
} from '../utils/auth';

const API_URL = 'http://localhost:3000/api';

interface AuthState {
  user: { email: string } | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

// Başlangıçta boş state
const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  error: null,
};

// Async Thunks
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.message || 'Login failed');
      }

      await storeJWT(data.token);
      const user = { email: credentials.email };
      await storeUser(user);

      return { token: data.token, user };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.message || 'Registration failed');
      }

      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { dispatch }) => {
    await clearJWT();
    await clearUser();
    dispatch(performLogout());
  }
);

export const checkUserSession = createAsyncThunk(
  'auth/checkUserSession',
  async (_, { rejectWithValue }) => {
    try {
      const { token, user } = await loadInitialAuthData();
      if (token) {
        return { token, user };
      } else {
        return rejectWithValue('No active session found');
      }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    performLogout: (state) => {
      state.user = null;
      state.token = null;
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Check Session
      .addCase(checkUserSession.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkUserSession.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isLoading = false;
      })
      .addCase(checkUserSession.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.isLoading = false;
      });
  },
});

export const { performLogout } = authSlice.actions;
export default authSlice.reducer;
