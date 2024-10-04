import {configureStore} from '@reduxjs/toolkit';
import AuthSlice from './slices/AuthSlice';
import ForgotPasswordSlice from './slices/ForgotPasswordSlice';

const store = configureStore({
  reducer: {
    AuthSlice,
    ForgotPasswordSlice,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
