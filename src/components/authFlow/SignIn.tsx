import {Formik} from 'formik';
import React, {Component, ReactNode} from 'react';
import {Image, TouchableOpacity, View} from 'react-native';
import {
  ActivityIndicator,
  HelperText,
  Text,
  TextInput,
} from 'react-native-paper';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import {connect} from 'react-redux';
import * as Yup from 'yup';
import {BottlesForSplash, TejaOrganicsLogoWithText} from '../../assets';
import {IAuthSlice, signingIn} from '../../redux/slices/AuthSlice';
import {AppDispatch, RootState} from '../../redux/store';
import {translate} from '../../utils/i18n';
import {commonStyles} from '../commonComponents/CommonStyles';
import {signInStyles} from './SignInStyle';
import {sanitize} from './SignUp';
interface IProps {
  navigation: any;
}

interface PropsFromRedux {
  signingIn: (details: {email: string; password: string}) => void;
  apiStatus: IAuthSlice['apiStuses'];
}

type CombinedProps = IProps & PropsFromRedux;

interface IState {
  passwordVisibility: boolean;
}
interface EachField {
  label: string;
  value: string;
  placeHolder: string;
  icon: ReactNode;
  key: string;
}
const fields: EachField[] = [
  {
    label: 'User Name',
    value: '',
    placeHolder: translate('authFlow.enterUserName'),
    icon: <FontAwesome6 name="user-large" size={21} color={'gray'} />,
    key: 'userName',
  },
  {
    label: 'Password',
    value: '',
    placeHolder: translate('authFlow.enterPassword'),
    icon: <Entypo name="lock" size={25} color={'gray'} />,
    key: 'password',
  },
];

const signInSchema = Yup.object().shape({
  userName: Yup.string().required(translate('authFlow.userNameRequired')),
  password: Yup.string().required(translate('authFlow.passwordRequired')),
});
export class SignIn extends Component<CombinedProps, IState> {
  state: IState = {
    passwordVisibility: false,
  };

  componentDidUpdate(
    prevProps: Readonly<CombinedProps>,
    prevState: Readonly<IState>,
    snapshot?: any,
  ): void {
    if (
      this.props.apiStatus.signingIn === 'SUCCESS' &&
      prevProps.apiStatus.signingIn === 'LOADING'
    ) {
      this.props.navigation.navigate('home');
    }
  }

  render() {
    const {passwordVisibility} = this.state;
    const getIcon = (field: EachField) => {
      if (field.key === 'password') {
        return (
          <Entypo
            name={passwordVisibility ? 'lock-open' : 'lock'}
            size={25}
            color={'gray'}
            onPress={() =>
              this.setState(prev => ({
                ...prev,
                passwordVisibility: !passwordVisibility,
              }))
            }
          />
        );
      }
      return field.icon;
    };
    return (
      <View style={signInStyles.wholeConainer}>
        <Image source={TejaOrganicsLogoWithText} style={signInStyles.logo} />
        <View style={signInStyles.fieldsAndTextContainer}>
          <Text style={signInStyles.signInAccountText}>
            {translate('authFlow.signInAccount')}
          </Text>
          <Formik
            validationSchema={signInSchema}
            initialValues={{
              userName: '',
              password: '',
            }}
            validateOnBlur
            validateOnChange={false}
            onSubmit={values => {
              this.props.signingIn({
                email: values.userName,
                password: values.password,
              });
            }}>
            {({
              handleBlur,
              handleChange,
              values,
              errors,
              touched,
              handleSubmit,
            }) => (
              <View style={signInStyles.fieldsContainer}>
                {fields.map(each => (
                  <View key={each.key}>
                    <TextInput
                      value={values[each.key as keyof typeof values]}
                      onChangeText={text => {
                        handleChange(each.key)(sanitize(text));
                        delete errors[each.key as keyof typeof errors];
                      }}
                      onBlur={handleBlur(each.key)}
                      keyboardType={
                        each.key === 'mobile' ? 'numeric' : 'default'
                      }
                      outlineColor="transparent"
                      error={Boolean(
                        errors[each.key as keyof typeof errors] &&
                          touched[each.key as keyof typeof errors],
                      )}
                      mode="outlined"
                      autoCapitalize="none"
                      theme={{roundness: 10}}
                      style={commonStyles.textFieldInput}
                      placeholder={each.placeHolder}
                      secureTextEntry={
                        each.key === 'password' && !passwordVisibility
                      }
                      right={<TextInput.Icon icon={() => getIcon(each)} />}
                    />
                    <HelperText type="error">
                      {errors[each.key as keyof typeof errors] &&
                      touched[each.key as keyof typeof errors]
                        ? errors[each.key as keyof typeof errors]
                        : ''}
                    </HelperText>
                  </View>
                ))}
                <TouchableOpacity
                  onPress={() => {
                    this.props.apiStatus.signUpUser !== 'LOADING' &&
                      handleSubmit();
                  }}
                  style={commonStyles.signUpButton}>
                  {this.props.apiStatus.signingIn === 'LOADING' ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text style={signInStyles.signInButton}>
                      {translate('authFlow.signIn')}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </Formik>
          <Text
            style={signInStyles.signInAccountText}
            onPress={() => this.props.navigation.navigate('forgot-password')}>
            {translate('authFlow.forgotPassword')}
          </Text>
        </View>
        <Image source={BottlesForSplash} style={signInStyles.bottles} />
      </View>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  apiStatus: state.AuthSlice.apiStuses,
});
const mapDispatchToProps = (dispatch: AppDispatch) => ({
  signingIn: (deatails: {email: string; password: string}) =>
    dispatch(signingIn(deatails)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
