import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import Toast from 'react-native-toast-message';
import {endpoints} from '../../utils/constants';
import networkCall from '../../utils/networkCall';
import {RootState} from '../store';

type ApiStatus = 'INITIAL' | 'SUCCESS' | 'ERROR' | 'LOADING';

export interface IForgotPassword {
  email: string;
  otp: string;
  apiStatus: {
    sendOtp: ApiStatus;
    verifyOtp: ApiStatus;
    changePassword: ApiStatus;
  };
}

export const sendingOtp = createAsyncThunk(
  'sendingOtp',
  async (
    emailOrmobile: string | null,
    {fulfillWithValue, rejectWithValue, dispatch, getState},
  ) => {
    try {
      const email =
        emailOrmobile ?? (getState() as RootState).ForgotPasswordSlice.email;
      const body = JSON.stringify({emailOrmobile: email});
      const {response} = await networkCall(
        endpoints.FORGOT_PASSWORD_SEND_OTP,
        'POST',
        body,
      );
      if (response.statusCode === '200') {
        if (emailOrmobile !== null) dispatch(storeEmail(emailOrmobile));
        return fulfillWithValue(response);
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const verifyOtp = createAsyncThunk(
  'verifyOtpForgotPassword',
  async (
    otp: string,
    {fulfillWithValue, rejectWithValue, getState, dispatch},
  ) => {
    try {
      const emailOrmobile = (getState() as RootState).ForgotPasswordSlice.email;
      const body = JSON.stringify({emailOrmobile, otp});
      const {response} = await networkCall(
        endpoints.FORGOT_PASSWORD_VERIFY_OTP,
        'POST',
        body,
      );
      if (response.statusCode === '200' || response.statusCode === 'Success') {
        dispatch(storeOtp(otp));
        return fulfillWithValue(response.message);
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const changePassword = createAsyncThunk(
  'changePassword',
  async (password: string, {fulfillWithValue, rejectWithValue, getState}) => {
    try {
      const {email, otp} = (getState() as RootState).ForgotPasswordSlice;
      const body = JSON.stringify({email, password, otp});
      const {response} = await networkCall(
        endpoints.FORGOT_PASSWORD_CHANGE_PASSWORD,
        'PUT',
        body,
      );
      if (response.statusCode === '200' || response.statusCode === 'Success') {
        return fulfillWithValue(response.message);
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const initialState: IForgotPassword = {
  email: '',
  otp: '',
  apiStatus: {
    sendOtp: 'INITIAL',
    verifyOtp: 'INITIAL',
    changePassword: 'INITIAL',
  },
};

const forgotPasswordSlice = createSlice({
  name: 'forgotPassword',
  initialState,
  reducers: {
    storeEmail: (state, action: {type: unknown; payload: string}) => {
      state.email = action.payload;
    },
    storeOtp: (state, action: {type: unknown; payload: string}) => {
      state.otp = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(sendingOtp.pending, state => {
        state.apiStatus.sendOtp = 'LOADING';
      })
      .addCase(sendingOtp.fulfilled, (state, action) => {
        state.apiStatus.sendOtp = 'SUCCESS';
      })
      .addCase(sendingOtp.rejected, (state, action) => {
        Toast.show({
          type: 'error🥹',
          text1: 'Oops!',
          text2: action.payload as string,
        });
        state.apiStatus.sendOtp = 'ERROR';
      });
    builder
      .addCase(verifyOtp.pending, state => {
        state.apiStatus.verifyOtp = 'LOADING';
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.apiStatus.verifyOtp = 'SUCCESS';
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        Toast.show({
          type: 'error',
          text1: 'Oops!🥹',
          text2: action.payload as string,
        });
        state.apiStatus.verifyOtp = 'ERROR';
      });
    builder
      .addCase(changePassword.pending, state => {
        state.apiStatus.changePassword = 'LOADING';
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.apiStatus.changePassword = 'SUCCESS';
      })
      .addCase(changePassword.rejected, (state, action) => {
        Toast.show({
          type: 'error',
          text1: 'Oops!🥹',
          text2: action.payload as string,
        });
        state.apiStatus.changePassword = 'ERROR';
      });
  },
});

export const {storeEmail, storeOtp} = forgotPasswordSlice.actions;
export default forgotPasswordSlice.reducer;
