import { apiService } from '@/api';
import { ROUTE_PATH } from '@/common';
import type { IResponse } from '@/dtos';
import { clearStorage } from '@/lib';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

interface IProfileAccount {
  employeeId?: number;
  name?: string;
  email?: string;
  role?: string;
}

export interface UserState {
  profile?: IProfileAccount;
  isLoading?: boolean;
}

const initialState: UserState = {
  profile: undefined,
  isLoading: false,
};

const GET_PROFILE = 'auth/me';

const requestGetUserInfo = () => apiService.get(GET_PROFILE);

export const getUserInfo = createAsyncThunk('user/info', async () => {
  const response: IResponse<IProfileAccount> = await requestGetUserInfo();
  return response?.data;
});

export const userSlice = createSlice({
  name: 'user/info',
  initialState,
  reducers: {
    changeProfile: (state, action) => {
      state.profile = action.payload;
    },
    resetProfile: (state) => {
      state.profile = undefined;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getUserInfo.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getUserInfo.rejected, (state) => {
      state.isLoading = false;
      state.profile = undefined;
    });
    builder.addCase(getUserInfo.fulfilled, (state, action) => {
      const user: IProfileAccount = action.payload;
      if (user?.employeeId) {
        state.profile = user;
      } else {
        state.profile = undefined;
        clearStorage();
        window.location.href = ROUTE_PATH.AUTH.LOGIN.PATH();
      }
      state.isLoading = false;
    });
  },
});

export const { resetProfile, changeProfile } = userSlice.actions;

export default userSlice.reducer;
