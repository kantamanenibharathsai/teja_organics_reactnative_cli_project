import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Toast from 'react-native-toast-message';
import { endpoints } from '../../utils/constants';
import networkCall from '../../utils/networkCall';
import Storage from '../../utils/Storage';
import { RootState } from '../store';
export interface UserResponse {
  status: boolean;
  statusCode: string;
  message: string;
  data: Data;
  token: string;
  loginId: number;
  email: string;
  sidebar: Sidebar;
  isGroupMember: boolean;
  groupId: any;
  twoStepVerified: boolean;
}
type ApiStatus = 'SUCCESS' | 'ERROR' | 'LOADING' | 'INITIAL';
export interface Data {
  id: number;
  fullName: string;
  email: string;
  mobileNumber: string;
  password: string;
  roleId: number;
  createdAt: string;
  updatedAt: string;
  active: boolean;
  countryCode: any;
  commission: any;
  amountOrPercentage: any;
  organizationName: string;
  image: string;
  twoStepVerificationEnabled: boolean;
  wallet: any;
  status: any;
  screenCount: number;
  isDeleted: any;
  screenGroups: any[];
  count: number;
  investedAmount: any;
}

export interface Sidebar {
  id: number;
  sidemenu: Sidemenu[];
  path: any;
  sidebar: any;
}

export interface Sidemenu {
  id: number;
  name: string;
  path: string;
  iconImage: string;
  permission: Permission;
  submenus: any[];
  tabs: any[];
}

export interface Permission {
  moduleName: string;
  userId: number;
  create: boolean;
  update: boolean;
  view: boolean;
  delete: boolean;
}

export interface SignUpData {
  name: string;
  mobile: string;
  email: string;
}

export interface IAuthSlice {
  user: UserResponse | null;
  signUpFormData: SignUpData | null;
  apiStuses: {
    signUpUser: ApiStatus;
    verifyOtp: ApiStatus;
    signingIn: ApiStatus;
    signUpReSendOtp: ApiStatus;
  };
}

const initialState: IAuthSlice = {
  user: null,
  signUpFormData: null,
  apiStuses: {
    signUpUser: 'INITIAL',
    verifyOtp: 'INITIAL',
    signingIn: 'INITIAL',
    signUpReSendOtp: 'INITIAL',
  },
};

export const signingUpUser = createAsyncThunk(
  'signing Up User',
  async (
    details: { name: string; mobile: string; email: string; password: string },
    { rejectWithValue, fulfillWithValue, dispatch },
  ) => {
    try {
      const body = new FormData();
      body.append('name', details.name);
      body.append('mobileNumber', details.mobile);
      body.append('email', details.email);
      body.append('password', details.password);
      body.append('roleId', '9');
      const { response, error } = await networkCall(
        endpoints.SIGN_UP,
        'POST',
        body,
      );
      if (response.statusCode !== '200') {
        return rejectWithValue(response.message);
      }
      dispatch(
        storeEmailAndMobile({
          email: details.email,
          name: details.name,
          mobile: details.mobile,
        }),
      );
      return fulfillWithValue(response);
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const verifyOtp = createAsyncThunk(
  'verifyOtp',
  async (otp: string, { fulfillWithValue, rejectWithValue, getState }) => {
    try {
      const emailOrmobile = (getState() as RootState).AuthSlice.signUpFormData
        ?.email;
      const body = JSON.stringify({ emailOrmobile, otp });
      const { response, error } = await networkCall(
        endpoints.SIGN_UP_VERIFY_OTP,
        'POST',
        body,
      );
      if (response.statusCode !== '200') {
        return rejectWithValue(response.message);
      }
      return fulfillWithValue(response.message);
    } catch (error) {
      return rejectWithValue(JSON.stringify(error));
    }
  },
);

export const signingIn = createAsyncThunk(
  'signingIn',
  async (
    { email, password }: { email: string; password: string },
    { fulfillWithValue, rejectWithValue },
  ) => {
    try {
      const body = JSON.stringify({ email, password });
      const { response, error } = await networkCall(
        endpoints.LOGIN,
        'POST',
        body,
      );
      if (response.statusCode !== '200') {
        return rejectWithValue(response.message);
      }
      await Storage.set('user', response);
      return fulfillWithValue(response);
    } catch (error) {
      return rejectWithValue(JSON.stringify(error));
    }
  },
);

export const signUpResendOtp = createAsyncThunk(
  'signUpResendOtp',
  async (_, { rejectWithValue, fulfillWithValue, getState }) => {
    try {
      const emailOrmobile = (getState() as RootState).AuthSlice.signUpFormData
        ?.email;
      const body = JSON.stringify({ emailOrmobile });
      const { response, error } = await networkCall(
        endpoints.SIGN_UP_RESENT_OTP,
        'POST',
        body,
      );
      if (response.statusCode !== '200' || error) {
        return rejectWithValue(response.message);
      }
      return fulfillWithValue(response.message);
    } catch (error) {
      return rejectWithValue(JSON.stringify(error));
    }
  },
);

const authSlice = createSlice({
  name: 'authSlice',
  initialState,
  reducers: {
    storeEmailAndMobile: (
      state,
      action: {
        payload: { email: string; mobile: string; name: string };
        type: string;
      },
    ) => {
      state.signUpFormData = action.payload;
    },
    setUserData: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(signingUpUser.pending, state => {
        state.apiStuses.signUpUser = 'LOADING';
      })
      .addCase(signingUpUser.fulfilled, (state, action) => {
        state.apiStuses.signUpUser = 'SUCCESS';

      })
      .addCase(signingUpUser.rejected, (state, action) => {
        Toast.show({
          type: 'error',
          text1: 'Oops!🥺',
          text2: action.payload as string,
        });
        state.apiStuses.signUpUser = 'ERROR';
      });
    builder
      .addCase(verifyOtp.pending, state => {
        state.apiStuses.verifyOtp = 'LOADING';
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.apiStuses.verifyOtp = 'SUCCESS';

      })
      .addCase(verifyOtp.rejected, (state, action) => {
        Toast.show({
          type: 'error',
          text1: 'Oops!🥹',
          text2: action.payload as string,
        });
        state.apiStuses.verifyOtp = 'ERROR';
      });
    builder
      .addCase(signingIn.pending, state => {
        state.apiStuses.signingIn = 'LOADING';
      })
      .addCase(signingIn.fulfilled, (state, action) => {
        state.apiStuses.signingIn = 'SUCCESS';
        state.user = action.payload;
        Toast.show({
          type: 'success',
          text1: 'Success🥳',
          text2: 'You have successfully signed in',
        });
      })
      .addCase(signingIn.rejected, (state, action) => {
        Toast.show({
          type: 'error',
          text1: 'Ooops!🥹',
          text2: action.payload as string,
        });
        state.apiStuses.signingIn = 'ERROR';
      });
    builder
      .addCase(signUpResendOtp.pending, state => {
        state.apiStuses.signUpReSendOtp = 'LOADING';
      })
      .addCase(signUpResendOtp.fulfilled, (state, action) => {
        Toast.show({
          type: 'success',
          text1: 'OTP Sent Successfully🤩',
          text2: 'We have Just Sent a OTP to your mail',
        });
        state.apiStuses.signUpReSendOtp = 'SUCCESS';
      })
      .addCase(signUpResendOtp.rejected, (state, action) => {
        Toast.show({
          type: 'error',
          text1: 'OopsOops🥹',
          text2: action.payload as string,
        });
        state.apiStuses.signUpReSendOtp = 'ERROR';
      });
  },
});
export const { storeEmailAndMobile, setUserData } = authSlice.actions;
export default authSlice.reducer;
