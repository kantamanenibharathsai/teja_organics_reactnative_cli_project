import {Formik} from 'formik';
import React, {Component} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {ActivityIndicator, HelperText, TextInput} from 'react-native-paper';
import {
  responsiveFontSize,
  responsiveHeight,
} from 'react-native-responsive-dimensions';
import {connect} from 'react-redux';
import * as Yup from 'yup';
import {
  IForgotPassword,
  sendingOtp,
} from '../../redux/slices/ForgotPasswordSlice';
import {AppDispatch, RootState} from '../../redux/store';
import {commonStyles} from '../commonComponents/CommonStyles';
import {newPasswordStyles} from './NewPasswordStyles';
import {sanitize} from './SignUp';

interface IProps {}

interface PropsFromRedux {
  sendingOtp: (email: string) => void;
  apiStatus: IForgotPassword['apiStatus'];
}

type CombinedProps = IProps & PropsFromRedux;

interface IState {
  emailOrPhone: string;
}

const sentOtpSchema = Yup.object().shape({
  emailOrMobile: Yup.string().required('Email Or Phone Number Required'),
});

export class SendingOTP extends Component<CombinedProps, IState> {
  constructor(props: CombinedProps) {
    super(props);
    this.state = {
      emailOrPhone: '',
    };
  }
  render() {
    return (
      <View
        style={{
          flex: 1,
          height: responsiveHeight(80),
          padding: 10,
        }}>
        <Text
          style={{
            color: '#343A40',
            fontSize: responsiveFontSize(3),
            fontWeight: '400',
          }}>
          Forgot Password
        </Text>
        <View style={{marginVertical: 20, flex: 1}}>
          <Formik
            validationSchema={sentOtpSchema}
            initialValues={{
              emailOrMobile: '',
            }}
            validateOnBlur
            validateOnChange={false}
            onSubmit={values => {
              this.props.sendingOtp(values.emailOrMobile);
            }}>
            {({
              handleBlur,
              handleChange,
              values,
              errors,
              touched,
              handleSubmit,
            }) => (
              <>
                <View>
                  <Text style={commonStyles.textFieldLabel}>
                    Phone No or email address
                  </Text>
                  <TextInput
                    value={values.emailOrMobile}
                    onChangeText={text => {
                      handleChange('emailOrMobile')(sanitize(text));
                    }}
                    onBlur={handleBlur('emailOrMobile')}
                    outlineColor="transparent"
                    error={Boolean(
                      errors.emailOrMobile && touched.emailOrMobile,
                    )}
                    mode="outlined"
                    theme={{roundness: 10}}
                    style={[
                      commonStyles.textFieldInput,
                      newPasswordStyles.textField,
                    ]}
                    placeholder="Enter Your Phone Number or Email Address"
                  />
                  <HelperText type="error">
                    {errors.emailOrMobile && touched.emailOrMobile
                      ? errors.emailOrMobile
                      : ''}
                  </HelperText>
                </View>
                <View
                  style={{
                    flex: 1,
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      this.props.apiStatus.sendOtp !== 'LOADING' &&
                        handleSubmit();
                    }}
                    style={[commonStyles.signUpButton, {marginTop: 'auto'}]}>
                    {this.props.apiStatus.sendOtp === 'LOADING' ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      <Text style={commonStyles.btnText}>Get OTP</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </>
            )}
          </Formik>
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  apiStatus: state.ForgotPasswordSlice.apiStatus,
});

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  sendingOtp: (email: string) => dispatch(sendingOtp(email)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SendingOTP);
