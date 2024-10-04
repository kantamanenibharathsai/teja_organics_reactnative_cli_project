import {Platform, StyleSheet} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {fonts} from '../../utils/config';

export const signInStyles = StyleSheet.create({
  wholeConainer: {
    alignItems: 'center',
    paddingTop: 10,
    position: 'relative',
    flex: 1,
  },
  logo: {width: responsiveWidth(70), height: responsiveHeight(20)},
  fieldsAndTextContainer: {
    justifyContent: 'center',
    width: '100%',
    gap: responsiveFontSize(1),
  },
  signInAccountText: {
    color: 'white',
    fontSize: responsiveFontSize(2.5),
    textAlign: 'center',
    fontWeight: '700',
    fontFamily:
      Platform.OS !== 'android'
        ? fonts.montserratExtraBold
        : fonts.montserratLight,
  },
  fieldsContainer: {gap: 4},
  signInButton: {
    color: 'white',
    fontSize: responsiveFontSize(2),
    fontWeight: '500',
  },
  bottles: {
    height: responsiveHeight(30),
    width: responsiveWidth(70),
    marginTop: 'auto',
    position: 'relative',
    bottom: -60,
  },
});
