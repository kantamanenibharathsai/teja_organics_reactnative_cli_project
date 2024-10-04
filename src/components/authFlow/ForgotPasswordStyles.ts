import {StyleSheet} from 'react-native';
import {responsiveScreenWidth} from 'react-native-responsive-dimensions';

export const styles = StyleSheet.create({
  wholeContainer: {
    flex: 1,
    paddingHorizontal: responsiveScreenWidth(3),
    paddingVertical: responsiveScreenWidth(2),
  },
  currentLabel: {color: '#3F4343', fontWeight: '500'},
  stepperLabel: {color: '#909090', fontWeight: '500'},
});

export const stepperStyles = {
  separatorStrokeWidth: 4,
  currentStepStrokeWidth: 3,
  currentStepIndicatorSize: 31,
  stepIndicatorSize: 31,
  stepStrokeCurrentColor: '#A0E045',
  stepStrokeWidth: 3,
  stepStrokeUnFinishedColor: '#909090',
  separatorFinishedColor: '#A0E045',
  stepStrokeFinishedColor: '#A0E045',
  separatorUnFinishedColor: '#D1D5DB',
  stepIndicatorFinishedColor: '#ffffff',
  stepIndicatorUnFinishedColor: '#ffffff',
  stepIndicatorLabelCurrentColor: 'red',
  stepIndicatorLabelFinishedColor: '#ffffff',
  stepIndicatorLabelUnFinishedColor: '#aaaaaa',
  currentStepLabelColor: '#3F4343',
};
