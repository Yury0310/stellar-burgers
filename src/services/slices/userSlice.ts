import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import {
  loginUserApi,
  registerUserApi,
  getUserApi,
  logoutApi,
  type TLoginData,
  type TRegisterData,
} from '../../utils/burger-api';
import type { TUser } from '@utils-types';
import { setCookie, deleteCookie } from '../../utils/cookie';

interface UserState {
  isAuthChecked: boolean;
  data: TUser | null;
  error: string | null;
  loading: boolean;
}

const initialState: UserState = {
  isAuthChecked: false,
  data: null,
  error: null,
  loading: false,
};

export const checkUserAuth = createAsyncThunk<TUser, void, { rejectValue: string }>(
  'user/checkUserAuth',
  async (_, { rejectWithValue }) => {
    try {
      const res = await getUserApi();
      return res.user;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Пользователь не авторизован');
    }
  }
);

export const registerUser = createAsyncThunk<
  TUser,
  TRegisterData,
  { rejectValue: string }
>('user/registerUser', async (data, { rejectWithValue }) => {
  try {
    const res = await registerUserApi(data);
    if (res.success) {
      localStorage.setItem('refreshToken', res.refreshToken);
      setCookie('accessToken', res.accessToken);
      return res.user;
    }
    return rejectWithValue('Ошибка регистрации');
  } catch (error: any) {
    return rejectWithValue(error.message || 'Ошибка регистрации');
  }
});

export const loginUser = createAsyncThunk<TUser, TLoginData, { rejectValue: string }>(
  'user/loginUser',
  async (data, { rejectWithValue }) => {
    try {
      const res = await loginUserApi(data);
      if (res.success) {
        localStorage.setItem('refreshToken', res.refreshToken);
        setCookie('accessToken', res.accessToken);
        return res.user;
      }
      return rejectWithValue('Неверный логин или пароль');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Ошибка авторизации');
    }
  }
);

export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  'user/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      const res = await logoutApi();
      if (res.success) {
        localStorage.removeItem('refreshToken');
        deleteCookie('accessToken');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Ошибка при выходе из аккаунта');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkUserAuth.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.data = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(checkUserAuth.rejected, (state) => {
        state.data = null;
        state.isAuthChecked = true;
      })

      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Ошибка входа';
      })

      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Ошибка регистрации';
      })

      .addCase(logoutUser.fulfilled, (state) => {
        state.data = null;
      });
  },
});

export const selectUserData = (state: any) => state.user.data;
export const selectIsAuthChecked = (state: any) => state.user.isAuthChecked;
export const selectUserError = (state: any) => state.user.error;
export const selectUserLoading = (state: any) => state.user.loading;

export const { clearUserError } = userSlice.actions;
export default userSlice.reducer;
