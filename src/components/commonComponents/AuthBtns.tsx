import {Component} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveScreenFontSize,
} from 'react-native-responsive-dimensions';
import {fonts} from '../../utils/config';
import {translate} from '../../utils/i18n';

interface IProps {
  isSignIn: boolean;
  signUpClickHandler: () => void;
  signInClickHandler: () => void;
}
interface IState {}
export class AuthBtns extends Component<IProps, IState> {
  render() {
    return (
      <View style={styles.authBtnsContainer}>
        <TouchableOpacity
          onPress={this.props.signInClickHandler}
          style={[
            styles.authBtn,
            {
              backgroundColor: this.props.isSignIn ? 'white' : '#32373C',
            },
          ]}>
          <Text
            style={[
              styles.authBtnText,
              {color: this.props.isSignIn ? '#3F4343' : 'white'},
            ]}>
            {translate('authFlow.signIn')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={this.props.signUpClickHandler}
          style={[
            styles.authBtn,
            {
              backgroundColor: !this.props.isSignIn ? 'white' : '#32373C',
            },
          ]}>
          <Text
            style={[
              styles.authBtnText,
              {color: this.props.isSignIn ? 'white' : '#3F4343'},
            ]}>
            {translate('authFlow.signUp')}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  authBtnsContainer: {
    backgroundColor: '#32373C',
    flexDirection: 'row',
    width: '100%',
    height: responsiveFontSize(6),
    borderRadius: responsiveFontSize(4),
    padding: responsiveHeight(0.5),
  },
  authBtn: {
    borderRadius: responsiveFontSize(4),
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '50%',
  },
  authBtnText: {
    textAlign: 'center',
    fontFamily: fonts.montserratSemiBold,
    fontSize: responsiveScreenFontSize(2),
  },
});

export default AuthBtns;
