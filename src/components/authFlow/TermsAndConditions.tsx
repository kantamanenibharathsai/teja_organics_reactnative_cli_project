import React, {Component} from 'react';
import {FlatList, SafeAreaView, Text, View} from 'react-native';
import IonIcons from 'react-native-vector-icons/Ionicons';
import {translate} from '../../utils/i18n';
import HeaderComponent from '../commonComponents/HeaderComponent';
import {tAndCStyles} from './TermsAndConditionsStyles';

interface IState {}
interface IProps {
  navigation: any;
}

const eachCondition = ({item}: {item: string}) => {
  return (
    <View style={tAndCStyles.eachConditionContainer}>
      <IonIcons
        name="chevron-forward-outline"
        size={20}
        color={'gray'}
        style={{marginTop: 4}}
      />
      <Text style={tAndCStyles.eachCondionText}>{data}</Text>
    </View>
  );
};

const data =
  'This is Sample Terms and Conditions Data, We have to do Api Integration to get the Data from Backed';
export class TermsAndConditions extends Component<IProps, IState> {
  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <View style={tAndCStyles.wholeContainer}>
          <HeaderComponent
            navigation={this.props.navigation}
            text={translate('authFlow.terms&Conditions')}
          />
          <View style={tAndCStyles.flatlistConatiner}>
            <FlatList
              data={Array(5).map(each => data)}
              renderItem={eachCondition}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

export default TermsAndConditions;
