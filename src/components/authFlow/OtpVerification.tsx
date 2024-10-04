import React, {Component} from 'react';
import {
  ImageBackground,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {OtpInput} from 'react-native-otp-entry';
import {ActivityIndicator} from 'react-native-paper';
import {responsiveWidth} from 'react-native-responsive-dimensions';
import Toast from 'react-native-toast-message';
import {connect} from 'react-redux';
import {OtpCircle} from '../../assets';
import {
  IAuthSlice,
  signUpResendOtp,
  verifyOtp,
} from '../../redux/slices/AuthSlice';
import {AppDispatch, RootState} from '../../redux/store';
import {commonStyles} from '../commonComponents/CommonStyles';
import HeaderComponent from '../commonComponents/HeaderComponent';
import {tAndCStyles} from './TermsAndConditionsStyles';

interface IState {
  timer: number;
  otp: string;
}
interface IProps {
  navigation: any;
}
interface PropsFromRedux {
  email?: string;
  verifyOtp: (otp: string) => void;
  apiStatus: IAuthSlice['apiStuses'];
  signUpResendOtp: () => void;
}

type CombinedProps = IProps & PropsFromRedux;
export class OtpVerification extends Component<CombinedProps, IState> {
  private timerId: NodeJS.Timeout | null = null;
  constructor(props: CombinedProps) {
    super(props);
    this.state = {timer: 30, otp: ''};
    this.startTimer = this.startTimer.bind(this);
    this.resendHandler = this.resendHandler.bind(this);
    this.verifyHandler = this.verifyHandler.bind(this);
    this.otpTextHandler = this.otpTextHandler.bind(this);
  }

  componentDidMount() {
    this.startTimer();
  }

  componentDidUpdate(
    prevProps: Readonly<CombinedProps>,
    prevState: Readonly<IState>,
    snapshot?: any,
  ): void {
    if (
      this.props.apiStatus.verifyOtp === 'SUCCESS' &&
      prevProps.apiStatus.verifyOtp === 'LOADING'
    ) {
      Toast.show({
        type: 'success',
        text1: 'OTP Verification Success',
        text2: 'Now You Are A User of Teja Organincs..',
      });
      this.props.navigation.navigate('auth', {isSignIn: true});
    } else if (
      this.props.apiStatus.signUpReSendOtp === 'SUCCESS' &&
      prevProps.apiStatus.signUpReSendOtp === 'LOADING'
    ) {
      this.setState({timer: 30});
      this.startTimer();
    }
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
      this.props.signUpResendOtp();
    }
  }

  verifyHandler() {
    if (this.state.otp.length < 4)
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'OTP Length must be 4',
      });
    else this.props.verifyOtp(this.state.otp);
  }

  otpTextHandler = (otp: string) => this.setState(prev => ({...prev, otp}));

  render() {
    const {timer} = this.state;
    return (
      <SafeAreaView style={{flex: 1}}>
        <View
          style={[
            tAndCStyles.wholeContainer,
            {flex: 1, justifyContent: 'space-between', alignItems: 'center'},
          ]}>
          <HeaderComponent
            navigation={this.props.navigation}
            text={'OTP Verification'}
          />
          <Text style={commonStyles.otpDescriptionText}>
            Please enter the verification code send to {this.props.email ?? ''}
          </Text>
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
              <Text style={commonStyles.otpDurationText}>
                {this.state.timer}
              </Text>
              <Text style={commonStyles.otpSecondsText}>Sec</Text>
            </ImageBackground>
            <View>
              <Text style={commonStyles.notReceivedText}>
                Didn't Receive an OTP?
              </Text>
              {this.props.apiStatus.signUpReSendOtp !== 'LOADING' ? (
                <Text
                  onPress={this.resendHandler}
                  style={[
                    commonStyles.resendText,
                    {color: timer == 0 ? '#A0E045' : '#909090'},
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
              this.props.apiStatus.verifyOtp !== 'LOADING'
                ? this.verifyHandler
                : undefined
            }
            style={commonStyles.signUpButton}>
            {this.props.apiStatus.verifyOtp === 'LOADING' ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={commonStyles.btnText}>Verify</Text>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  apiStatus: state.AuthSlice.apiStuses,
  email: state.AuthSlice.signUpFormData?.email,
});
const mapDispatchToProps = (dispatch: AppDispatch) => ({
  verifyOtp: (otp: string) => dispatch(verifyOtp(otp)),
  signUpResendOtp: () => dispatch(signUpResendOtp()),
});
export default connect(mapStateToProps, mapDispatchToProps)(OtpVerification);
