import {Platform, StyleSheet} from 'react-native';
import {
  responsiveFontSize,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import {fonts} from '../../utils/config';

export const tAndCStyles = StyleSheet.create({
  eachConditionContainer: {
    flexDirection: 'row',
    gap: 2,
    marginBottom: 3,
  },
  eachCondionText: {
    fontSize: responsiveFontSize(2),
    flex: 1,
    flexWrap: 'wrap',
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? fonts.interSemiBold : fonts.interLight,
    color: '#909090',
    lineHeight: 30,
  },
  wholeContainer: {
    paddingHorizontal: responsiveScreenWidth(5),
    paddingVertical: responsiveScreenWidth(2),
    gap: 30,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  titleTex: {
    fontWeight: '600',
    fontSize: responsiveFontSize(2.5),
    justifyContent: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
    color: '#343A40',
  },
  flatlistConatiner: {
    borderRadius: 10,
    padding: 10,
    borderColor: '#CFCFCF',
    borderWidth: 1.5,
  },
});
