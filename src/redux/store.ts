import userReducer from '@/redux/slices/userSlice';
import {
  type Action,
  type ThunkAction,
  configureStore,
} from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
