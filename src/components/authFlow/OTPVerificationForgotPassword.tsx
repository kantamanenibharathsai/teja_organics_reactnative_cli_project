import React, {Component} from 'react';
import {ImageBackground, Text, TouchableOpacity, View} from 'react-native';
import {OtpInput} from 'react-native-otp-entry';
import {ActivityIndicator} from 'react-native-paper';
import {
  responsiveFontSize,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Toast from 'react-native-toast-message';
import {connect} from 'react-redux';
import {OtpCircle} from '../../assets';
import {
  IForgotPassword,
  sendingOtp,
  verifyOtp,
} from '../../redux/slices/ForgotPasswordSlice';
import {AppDispatch, RootState} from '../../redux/store';
import {commonStyles} from '../commonComponents/CommonStyles';

interface IProps {}

interface PropsFromRedux {
  verifyOtpHandler: (otp: string) => void;
  resendHandler: () => void;
  apiStatus: IForgotPassword['apiStatus'];
  email: string;
}

type CombinedProps = IProps & PropsFromRedux;
interface IState {
  timer: number;
  otp: string;
}

export class OTPVerificationForgotPassword extends Component<
  CombinedProps,
  IState
> {
  private timerId: NodeJS.Timeout | null = null;
  constructor(props: CombinedProps) {
    super(props);
    this.state = {timer: 30, otp: ''};
    this.startTimer = this.startTimer.bind(this);
    this.resendHandler = this.resendHandler.bind(this);
    this.verifyHandler = this.verifyHandler.bind(this);
    this.otpTextHandler = this.otpTextHandler.bind(this);
  }

  componentDidUpdate(
    prevProps: Readonly<CombinedProps>,
    prevState: Readonly<IState>,
    snapshot?: any,
  ): void {
    if (
      this.props.apiStatus.sendOtp === 'SUCCESS' &&
      prevProps.apiStatus.sendOtp === 'LOADING'
    ) {
      this.setState(prev => ({...prev, timer: 30}));
      this.startTimer();
    }
  }

  componentDidMount() {
    this.startTimer();
  }

  componentWillUnmount(): void {
    if (this.timerId) clearInterval(this.timerId);
  }

  startTimer() {
    this.timerId = setInterval(() => {
      if (this.state.timer > 0)
        this.setState(({timer}) => ({timer: timer - 1}));
      else if (this.timerId) clearInterval(this.timerId);
    }, 1000);
  }

  resendHandler() {
    if (this.state.timer > 0) {
      Toast.show({
        type: 'info',
        text1: 'Info',
        text2: 'Wait Until Timer Finished',
      });
    } else {
      this.props.resendHandler();
    }
  }

  verifyHandler() {
    if (this.state.otp.length < 4)
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'OTP Length must be 4',
      });
    else {
      this.props.verifyOtpHandler(this.state.otp);
    }
  }

  otpTextHandler = (otp: string) => this.setState(prev => ({...prev, otp}));

  render() {
    const {timer} = this.state;
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'space-around',
        }}>
        <View style={{gap: 10}}>
          <Text
            style={{
              color: '#343A40',
              fontSize: responsiveFontSize(3),
              fontWeight: '400',
            }}>
            OTP Verification
          </Text>
          <Text style={[commonStyles.otpDescriptionText, {textAlign: 'left'}]}>
            Please enter the verification code send to {this.props.email}
          </Text>
        </View>
        <OtpInput
          focusColor={'#A0E045'}
          theme={{
            pinCodeContainerStyle: commonStyles.otpContainer,
            containerStyle: {width: responsiveWidth(75), alignSelf: 'center'},
          }}
          numberOfDigits={4}
          onTextChange={this.otpTextHandler}
        />
        <View style={{alignItems: 'center', gap: 20}}>
          <ImageBackground
            source={OtpCircle}
            style={commonStyles.otpCircleBg}
            resizeMode="cover">
            <Text style={commonStyles.otpDurationText}>{this.state.timer}</Text>
            <Text style={commonStyles.otpSecondsText}>Sec</Text>
          </ImageBackground>
          <View>
            <Text style={commonStyles.notReceivedText}>
              Didn't Receive an OTP?
            </Text>
            {this.props.apiStatus.sendOtp !== 'LOADING' ? (
              <Text
                onPress={this.resendHandler}
                style={[
                  commonStyles.resendText,
                  {color: timer === 0 ? '#A0E045' : '#909090'},
                ]}>
                Resend
              </Text>
            ) : (
              <Text style={[commonStyles.resendText, {color: '#A0E045'}]}>
                Loading...
              </Text>
            )}
          </View>
        </View>

        <TouchableOpacity
          onPress={
            this.props.apiStatus.verifyOtp ? this.verifyHandler : undefined
          }
          style={commonStyles.signUpButton}>
          {this.props.apiStatus.verifyOtp === 'LOADING' ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={commonStyles.btnText}>Verify OTP</Text>
          )}
        </TouchableOpacity>
      </View>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  apiStatus: state.ForgotPasswordSlice.apiStatus,
  email: state.ForgotPasswordSlice.email,
});

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  verifyOtpHandler: (otp: string) => dispatch(verifyOtp(otp)),
  resendHandler: () => dispatch(sendingOtp(null)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(OTPVerificationForgotPassword);
