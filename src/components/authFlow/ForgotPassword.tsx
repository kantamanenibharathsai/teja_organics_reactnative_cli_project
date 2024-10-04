import {Component} from 'react';
import {Image, SafeAreaView, View, StyleSheet} from 'react-native';
import {Text} from 'react-native-paper';
import StepIndicator from 'react-native-step-indicator';
import Toast from 'react-native-toast-message';
import Entypo from 'react-native-vector-icons/Entypo';
import {connect} from 'react-redux';
import {CompletedStep} from '../../assets';
import {
  IForgotPassword,
  sendingOtp,
} from '../../redux/slices/ForgotPasswordSlice';
import {AppDispatch, RootState} from '../../redux/store';
import HeaderComponent from '../commonComponents/HeaderComponent';
import KeyboardWrapper from '../commonComponents/KeyBoardWrapper';
import {stepperStyles, styles as externalStyles} from './ForgotPasswordStyles';
import NewPassword from './NewPassword';
import OTPVerificationForgotPassword from './OTPVerificationForgotPassword';
import SendingOTP from './SendingOTP';
import {NavigationProp} from '@react-navigation/native';

interface RootStackParamList {
  ForgotPassword: undefined;
  NewPassword: undefined;
  OTPVerificationForgotPassword: undefined;
}
interface IProps {
  navigation: NavigationProp<RootStackParamList>;
}

interface PropsFromRedux {
  sendOtp: (email: string) => void;
  email: IForgotPassword['email'];
  apiStatus: IForgotPassword['apiStatus'];
}

type CombinedProps = IProps & PropsFromRedux;

interface IState {
  currentStep: number;
}
const labels = ['Password', 'OTP', 'Set New'];
export class ForgotPassword extends Component<CombinedProps, IState> {
  constructor(props: CombinedProps) {
    super(props);
    this.state = {currentStep: 0};
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
      Toast.show({
        type: 'success',
        text1: 'OTP sent Successfully🤩',
        text2: 'Enter OTP that you received on your mail',
      });
      this.setState(prevState => ({
        ...prevState,
        currentStep: 1,
      }));
    } else if (
      this.props.apiStatus.verifyOtp === 'SUCCESS' &&
      prevProps.apiStatus.verifyOtp === 'LOADING'
    ) {
      Toast.show({
        type: 'success',
        text1: 'Success🥳',
        text2: 'OTP Verification Success',
      });
      this.setState(prevState => ({
        ...prevState,
        currentStep: 2,
      }));
    } else if (
      this.props.apiStatus.changePassword === 'SUCCESS' &&
      prevProps.apiStatus.changePassword === 'LOADING'
    ) {
      Toast.show({
        type: 'success',
        text1: 'Success🥳',
        text2: 'Password changed successfully',
      });
      this.props.navigation.navigate('ForgotPassword');
    }
  }
  render() {
    const renderInnerComponent = () => {
      switch (this.state.currentStep) {
        case 1:
          return <OTPVerificationForgotPassword />;
        case 2:
          return <NewPassword />;
        default:
          return <SendingOTP />;
      }
    };
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={externalStyles.wholeContainer}>
          <HeaderComponent
            text="Forgot Password"
            navigation={this.props.navigation}
          />
          <View style={styles.stepIndicatorContainer}>
            <StepIndicator
              stepCount={3}
              currentPosition={this.state.currentStep}
              labels={labels}
              customStyles={stepperStyles}
              renderLabel={({stepStatus, label}) => {
                switch (stepStatus) {
                  case 'finished':
                  case 'current':
                    return (
                      <Text style={externalStyles.currentLabel}>{label}</Text>
                    );
                  default:
                    return (
                      <Text style={externalStyles.stepperLabel}>{label}</Text>
                    );
                }
              }}
              renderStepIndicator={({stepStatus}) => {
                switch (stepStatus) {
                  case 'finished':
                    return (
                      <Image
                        source={CompletedStep}
                        style={styles.completedStepImage}
                      />
                    );
                  case 'current':
                    return (
                      <Entypo
                        name="controller-record"
                        size={15}
                        color="#A0E045"
                      />
                    );
                  default:
                    return (
                      <Entypo
                        name="controller-record"
                        size={15}
                        color="#D1D5DB"
                      />
                    );
                }
              }}
            />
          </View>
          <View style={styles.flexContainer}>
            <KeyboardWrapper>{renderInnerComponent()}</KeyboardWrapper>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  stepIndicatorContainer: {
    paddingVertical: 10,
  },
  completedStepImage: {
    width: 28,
    height: 28,
  },
  flexContainer: {
    flex: 1,
  },
});

const mapStateToProps = (state: RootState) => ({
  email: state.ForgotPasswordSlice.email,
  apiStatus: state.ForgotPasswordSlice.apiStatus,
});

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  sendOtp: (email: string) => dispatch(sendingOtp(email)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);
