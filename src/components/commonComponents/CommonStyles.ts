import {Platform, StyleSheet} from 'react-native';
import {responsiveFontSize, responsiveHeight} from 'react-native-responsive-dimensions';
import { fonts } from '../../utils/config';

export const commonStyles = StyleSheet.create({
  fullVerticalFlex: {
    flex: 1,
    height: responsiveHeight(100),
  },
  fullHorizontalFlex: {
    flex: 1,
    flexDirection: 'row',
  },
  fullVerticalCenterFlex: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullHorizontalCenterFlex: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpButton: {
    backgroundColor: '#056839',
    width: '100%',
    height: responsiveFontSize(6),
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: responsiveFontSize(2),
  },
  textFieldLabel: {
    color: '#343A40',
    fontWeight: '400',
    fontFamily: fonts.montserratLight,
    fontSize: responsiveFontSize(2),
    marginBottom: responsiveFontSize(0.8),
  },
  textFieldInput: {
    height: responsiveHeight(8),
    backgroundColor: 'white',
  },
  otpDescriptionText: {
    fontWeight: '400',
    fontSize: responsiveFontSize(2),
    color: '#343A40',
    textAlign: 'center',
  },
  otpContainer: {
    width: responsiveHeight(8),
    height: responsiveHeight(8),
    borderColor: '#CFCFCF',
    backgroundColor: 'white',
    borderWidth: responsiveFontSize(0.25),
  },
  otpCircleBg: {
    width: responsiveHeight(15),
    height: responsiveHeight(15),
    justifyContent: 'center',
    alignItems: 'center',
  },
  otpDurationText: {
    color: 'white',
    fontSize: responsiveFontSize(4),
    fontWeight: '700',
  },
  otpSecondsText: {
    color: 'white',
    fontSize: responsiveFontSize(2.5),
    fontWeight: '500',
  },
  notReceivedText: {
    fontWeight: '400',
    fontSize: responsiveFontSize(2),
    color: '#909090',
    textAlign: 'center',
  },
  resendText: {
    textDecorationLine: 'underline',
    fontSize: responsiveFontSize(2),
    textAlign: 'center',
  },
  btnText: {
    color: 'white',
    fontSize: responsiveFontSize(2),
    // fontWeight: '500',
    fontFamily:
      Platform.OS === 'ios' ? fonts.montserratBold : fonts.montserratLight,
  },
});
