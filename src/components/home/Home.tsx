import React, {Component} from 'react';
import {DevSettings, Text, TouchableOpacity, View} from 'react-native';
import {connect} from 'react-redux';
import {IAuthSlice} from '../../redux/slices/AuthSlice';
import {AppDispatch, RootState} from '../../redux/store';
import Storage from '../../utils/Storage';
import {commonStyles} from '../commonComponents/CommonStyles';
interface IProps {
  navigation: any;
}

interface PropsFromRedux {
  user: IAuthSlice['user'];
}

type CombinedProps = IProps & PropsFromRedux;

interface IState {}

export class Home extends Component<CombinedProps, IState> {
  constructor(props: CombinedProps) {
    super(props);
    this.state = {};
    this.clearStorage = this.clearStorage.bind(this);
  }
  async clearStorage() {
    await Storage.remove('user');
  }
  render() {
    return (
      <View style={{flex: 1, justifyContent: 'space-between'}}>
        <Text>Hello {this.props.user?.data.fullName}</Text>
        <TouchableOpacity
          style={commonStyles.signUpButton}
          onPress={() => {
            this.clearStorage();
            DevSettings.reload();
          }}>
          <Text style={commonStyles.btnText}>Logout</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const mapStateToProps = (state: RootState) => ({user: state.AuthSlice.user});
const mapDispatchToProps = (dispatch: AppDispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
