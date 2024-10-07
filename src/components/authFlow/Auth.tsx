import {Component} from 'react';
import {ImageBackground, Platform, View, StyleSheet} from 'react-native';
import {responsiveHeight} from 'react-native-responsive-dimensions';
import {SplashBg, SplashGradient} from '../../assets';
import AuthBtns from '../commonComponents/AuthBtns';
import {commonStyles} from '../commonComponents/CommonStyles';
import SignIn from './SignIn';
import SignUp from './SignUp';
import {NavigationProp} from '@react-navigation/native';

interface RootStackParamList {
  auth: undefined;
  home: undefined;
  'terms-and-conditions': undefined;
  'verify-otp': undefined;
  'forgot-password': undefined;
}
interface IRouteParams {
  isSignIn?: boolean;
}

interface IRoute {
  params?: IRouteParams;
}

interface IProps {
  navigation: NavigationProp<RootStackParamList>;
  route: IRoute;
}
interface IState {
  isSignIn: boolean;
}
export class Auth extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      isSignIn: true,
    };
    this.signUpClickHandler = this.signUpClickHandler.bind(this);
    this.signInClickHandler = this.signInClickHandler.bind(this);
  }
  static getDerivedStateFromProps(props: IProps) {
    if (props.route.params) {
      return {
        isSignIn: props.route.params?.isSignIn,
      };
    }
    return null;
  }
  signUpClickHandler() {
    if (this.state.isSignIn) {
      this.setState({isSignIn: false});
    }
  }
  signInClickHandler() {
    if (this.state.isSignIn) return;
    this.setState({isSignIn: true});
  }
  render() {
    return (
      <View style={commonStyles.fullVerticalFlex}>
        <ImageBackground
          source={SplashGradient}
          style={commonStyles.fullVerticalFlex}
          resizeMode="cover">
          <ImageBackground
            style={commonStyles.fullVerticalFlex}
            source={SplashBg}
            resizeMode="cover">
            <View
              style={[
                styles.container,
                {
                  backgroundColor: this.state.isSignIn
                    ? 'transparent'
                    : '#eaeef3',
                },
              ]}>
              <AuthBtns
                isSignIn={this.state.isSignIn}
                signUpClickHandler={this.signUpClickHandler}
                signInClickHandler={this.signInClickHandler}
              />
              {this.state.isSignIn ? (
                <SignIn navigation={this.props.navigation} />
              ) : (
                <SignUp navigation={this.props.navigation} />
              )}
            </View>
          </ImageBackground>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    paddingBottom: 0,
    marginBottom: -20,
    paddingTop: Platform.OS === 'ios' ? responsiveHeight(7) : 15,
  },
});

export default Auth;
