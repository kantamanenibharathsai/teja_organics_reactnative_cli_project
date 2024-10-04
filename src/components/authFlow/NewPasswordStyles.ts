import {StyleSheet} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
} from 'react-native-responsive-dimensions';

export const newPasswordStyles = StyleSheet.create({
  wholeContainer: {
    flex: 1,
    height: responsiveHeight(80),
    padding: 10,
  },
  forgotPasswordText: {
    color: '#343A40',
    fontSize: responsiveFontSize(3),
    fontWeight: '400',
  },
  textField: {
    borderColor: '#CFCFCF',
    borderWidth: 1,
    borderRadius: 12,
  },
});
