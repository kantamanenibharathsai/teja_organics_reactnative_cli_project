import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {Component} from 'react';
import Toast from 'react-native-toast-message';
import {connect} from 'react-redux';
import Auth from '../components/authFlow/Auth';
import ForgotPassword from '../components/authFlow/ForgotPassword';
import OtpVerification from '../components/authFlow/OtpVerification';
import TermsAndConditions from '../components/authFlow/TermsAndConditions';
import SplashScreen from '../components/commonComponents/SplashScreen';
import Home from '../components/home/Home';
import {IAuthSlice, setUserData} from '../redux/slices/AuthSlice';
import {AppDispatch, RootState} from '../redux/store';
import Storage from '../utils/Storage';

const Stack = createStackNavigator();

interface IState {
  isSplashScreen: boolean;
}
interface IProps {}

interface PropsFromRedux {
  setUserData: (user: IAuthSlice['user'] | null) => void;
  user: IAuthSlice['user'] | null;
}

type CombinedProps = IProps & PropsFromRedux;

export class AppRoutes extends Component<CombinedProps, IState> {
  constructor(props: CombinedProps) {
    super(props);
    this.state = {isSplashScreen: true};
    this.getUserData = this.getUserData.bind(this);
  }

  async getUserData() {
    const userData = await Storage.get('user');
    if (userData) {
      this.props.setUserData(JSON.parse(userData));
    } else {
      this.props.setUserData(null);
    }
  }
  componentDidMount() {
    this.getUserData();
    setTimeout(() => {
      this.setState({isSplashScreen: false});
    }, 1500);
  }
  render() {
    return (
      <>
        {this.state.isSplashScreen ? (
          <SplashScreen />
        ) : (
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName={this.props.user === null ? 'auth' : 'home'}
              screenOptions={{headerShown: false}}>
              <Stack.Screen name="auth">
                {props => <Auth {...props} />}
              </Stack.Screen>
              <Stack.Screen name="home">
                {props => <Home {...props} />}
              </Stack.Screen>
              <Stack.Screen name="terms-and-conditions">
                {props => <TermsAndConditions {...props} />}
              </Stack.Screen>
              <Stack.Screen name="verify-otp">
                {props => <OtpVerification {...props} />}
              </Stack.Screen>
              <Stack.Screen name="forgot-password">
                {props => <ForgotPassword {...props} />}
              </Stack.Screen>
            </Stack.Navigator>
            <Toast />
          </NavigationContainer>
        )}
      </>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  user: state.AuthSlice.user,
});
const mapDispatchToProps = (dispatch: AppDispatch) => ({
  setUserData: (user: IAuthSlice['user'] | null) => dispatch(setUserData(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AppRoutes);
