import {StyleSheet} from 'react-native';
import {responsiveFontSize} from 'react-native-responsive-dimensions';

export const styles = StyleSheet.create({
  tAndCContainer: {
    flexDirection: 'row',
    gap: 0,
    marginLeft: responsiveFontSize(1),
  },
  tAndCText: {
    color: '#343A40',
  },
  fieldsContainer: {gap: 4},
});
