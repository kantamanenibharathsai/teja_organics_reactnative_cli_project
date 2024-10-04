import React, {Component} from 'react';
import {Text, View} from 'react-native';
import IonIcons from 'react-native-vector-icons/Ionicons';
import {tAndCStyles} from '../authFlow/TermsAndConditionsStyles';

interface IProps {
  navigation: any;
  text: string;
}

export class HeaderComponent extends Component<IProps, {}> {
  render() {
    return (
      <View style={tAndCStyles.titleContainer}>
        <IonIcons
          name="chevron-back-outline"
          size={28}
          color={'gray'}
          onPress={() => this.props.navigation.goBack()}
        />
        <Text style={tAndCStyles.titleTex}>{this.props.text}</Text>
      </View>
    );
  }
}

export default HeaderComponent;
