export const baseURL = 'http://122.175.39.120:8087/dadz-api';

export const endpoints = {
  LOGIN: 'user/emaillogin',
  SIGN_UP_VERIFY_OTP: 'user/verifyOtp',
  SIGN_UP: 'user',
  SIGN_UP_RESENT_OTP: 'user/sendOtp/emailMobile',
  FORGOT_PASSWORD_SEND_OTP: 'user/sendOtp',
  FORGOT_PASSWORD_VERIFY_OTP: 'user/verifyOtp/emailMobile',
  FORGOT_PASSWORD_CHANGE_PASSWORD: 'user/forgotpassword',
};
