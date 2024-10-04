import React, {Component} from 'react';
import {Image, ImageBackground, View} from 'react-native';
import {
  BottlesForSplash,
  SplashBg,
  SplashGradient,
  TejaOrganicsLogoWithText,
} from '../../assets';
import {responsiveWidth} from '../../utils/ResponsiveFunctions';
import {splashScreenStyle} from './SplashScreenStyles';
import {commonStyles} from './CommonStyles';

export class SplashScreen extends Component {
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
            <View style={splashScreenStyle.imagesContainer}>
              <Image
                source={TejaOrganicsLogoWithText}
                style={{width: responsiveWidth(90)}}
              />
              <Image
                source={BottlesForSplash}
                style={{width: responsiveWidth(70)}}
              />
            </View>
          </ImageBackground>
        </ImageBackground>
      </View>
    );
  }
}

export default SplashScreen;
