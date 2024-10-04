import {Formik} from 'formik';
import React, {Component, ReactNode} from 'react';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import {CountryPicker} from 'react-native-country-codes-picker';
import {ActivityIndicator, HelperText, TextInput} from 'react-native-paper';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import {connect} from 'react-redux';
import * as Yup from 'yup';
import {IAuthSlice, signingUpUser} from '../../redux/slices/AuthSlice';
import {AppDispatch, RootState} from '../../redux/store';
import {translate} from '../../utils/i18n';
import {commonStyles} from '../commonComponents/CommonStyles';
import {styles} from './SignUpStyles';
import Toast from 'react-native-toast-message';
interface IProps {
  navigation: any;
}

interface PropsFromRedux {
  signingUpUser: (detail: {
    name: string;
    email: string;
    password: string;
    mobile: string;
  }) => void;
  apiStuses: IAuthSlice['apiStuses'];
}

type CombinedProps = IProps & PropsFromRedux;
interface IState {
  name: string;
  mobile: string;
  email: string;
  password: string;
  confirmPassword: string;
  isAcceptedTandC: boolean;
  isPasswordVisible: boolean;
  isConfirmPasswordsVisible: boolean;
  referralCode: string;
  country: {
    flag: string;
    name: string;
  };
  isShowCountryPicker: boolean;
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
    label: translate('authFlow.name'),
    value: '',
    placeHolder: translate('authFlow.enterName'),
    icon: <FontAwesome6 name="user-large" size={21} color={'gray'} />,
    key: 'name',
  },
  {
    label: translate('authFlow.mobile'),
    value: '',
    placeHolder: translate('authFlow.enterMobile'),
    icon: <FontAwesome name="phone" size={25} color={'gray'} />,
    key: 'mobile',
  },
  {
    label: translate('authFlow.email'),
    value: '',
    placeHolder: translate('authFlow.enterEmail'),
    icon: <MaterialIcons name="email" size={25} color={'gray'} />,
    key: 'email',
  },
  {
    label: translate('authFlow.password'),
    value: '',
    placeHolder: translate('authFlow.enterPassword'),
    icon: <Entypo name="lock" size={25} color={'gray'} />,
    key: 'password',
  },
  {
    label: translate('authFlow.confirmPassword'),
    value: '',
    placeHolder: translate('authFlow.confirmPassword'),
    icon: <Entypo name="lock-open" size={25} color={'gray'} />,
    key: 'confirmPassword',
  },
  {
    label: translate('authFlow.referralCode'),
    value: '',
    placeHolder: translate('authFlow.enterReferralCode'),
    icon: <Octicons name="cross-reference" size={25} color={'gray'} />,
    key: 'referralCode',
  },
];

const signUpSchema = Yup.object().shape({
  name: Yup.string()
    .required(translate('authFlow.nameRequired'))
    .matches(/^[A-Za-z]+(?: [A-Za-z]+)*$/, translate('authFlow.alphabetsOnly'))
    .max(30, translate('authFlow.tooLong')),

  mobile: Yup.string()
    .required(translate('authFlow.mobileRequired'))
    .min(10, translate('authFlow.invalidMobile'))
    .max(10, translate('authFlow.invalidMobile')),

  email: Yup.string()
    .required(translate('authFlow.emailRequired'))
    .email(translate('authFlow.invalidEmail')),

  password: Yup.string()
    .required(translate('authFlow.passwordRequired'))
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/,
      translate('authFlow.passwordFormat'),
    ),

  confirmPassword: Yup.string()
    .required(translate('authFlow.confirmPasswordRequired'))
    .oneOf([Yup.ref('password')], translate('authFlow.passwordsMustMatch')),

  referralCode: Yup.string().required(
    translate('authFlow.referralCodeRequired'),
  ),

  isAcceptedTandC: Yup.boolean().oneOf(
    [true],
    translate('authFlow.acceptTermsAndConditions'),
  ),
});

export const sanitize = (text: string) =>
  text.replace(/^\s+/, '').replace(/\s+/g, ' ');

export class SignUp extends Component<CombinedProps, IState> {
  constructor(props: CombinedProps) {
    super(props);
    this.state = {
      name: '',
      mobile: '',
      email: '',
      password: '',
      confirmPassword: '',
      isAcceptedTandC: false,
      isPasswordVisible: false,
      isConfirmPasswordsVisible: false,
      referralCode: '',
      country: {
        name: 'IND',
        flag: '🇮🇳',
      },
      isShowCountryPicker: false,
    };
  }

  componentDidUpdate(
    prevProps: Readonly<CombinedProps>,
    prevState: Readonly<IState>,
    snapshot?: any,
  ): void {
    if (this.props.apiStuses.signUpUser === 'SUCCESS') {
      Toast.show({
        type: 'success',
        text1: 'OTP Sent Successfully🤩',
        text2: 'Please Enter OTP that you received on your email',
      });
      this.props.navigation.navigate('verify-otp');
    }
  }

  render() {
    const {isPasswordVisible, isConfirmPasswordsVisible} = this.state;
    const getIcon = (field: EachField) => {
      if (field.key === 'password') {
        return (
          <Entypo
            name={isPasswordVisible ? 'lock-open' : 'lock'}
            size={25}
            color={'gray'}
            onPress={() =>
              this.setState(prev => ({
                ...prev,
                isPasswordVisible: !isPasswordVisible,
              }))
            }
          />
        );
      } else if (field.key === 'confirmPassword') {
        return (
          <Entypo
            name={isConfirmPasswordsVisible ? 'lock-open' : 'lock'}
            size={25}
            color={'gray'}
            onPress={() =>
              this.setState(prev => ({
                ...prev,
                isConfirmPasswordsVisible: !isConfirmPasswordsVisible,
              }))
            }
          />
        );
      } else return field.icon;
    };
    const formSubmission = (values: {
      name: string;
      mobile: string;
      email: string;
      password: string;
      confirmPassword: string;
      isAcceptedTandC: boolean;
      referralCode: string;
    }) => {
      const {name, mobile, email, password} = values;
      this.props.signingUpUser({
        name,
        email,
        password,
        mobile,
      });
    };

    return (
      <ScrollView
        style={{marginVertical: 35}}
        showsVerticalScrollIndicator={false}>
        <Formik
          validationSchema={signUpSchema}
          initialValues={{
            name: '',
            mobile: '',
            email: '',
            password: '',
            confirmPassword: '',
            isAcceptedTandC: false,
            referralCode: '',
          }}
          validateOnBlur
          validateOnChange={false}
          onSubmit={formSubmission}>
          {({
            handleBlur,
            handleChange,
            values,
            errors,
            touched,
            handleSubmit,
          }) => (
            <View style={styles.fieldsContainer}>
              {fields.map(each => (
                <View key={each.key}>
                  <Text style={commonStyles.textFieldLabel}>{each.label}</Text>
                  <TextInput
                    value={values[each.key as keyof typeof values] as string}
                    onChangeText={text => {
                      handleChange(each.key)(sanitize(text));
                      delete errors[each.key as keyof typeof errors];
                    }}
                    onBlur={handleBlur(each.key)}
                    keyboardType={each.key === 'mobile' ? 'numeric' : 'default'}
                    outlineColor="transparent"
                    error={Boolean(
                      errors[each.key as keyof typeof errors] &&
                        touched[each.key as keyof typeof errors],
                    )}
                    mode="outlined"
                    maxLength={each.key === 'mobile' ? 10 : undefined}
                    theme={{roundness: 10}}
                    autoCapitalize="none"
                    style={commonStyles.textFieldInput}
                    placeholder={each.placeHolder}
                    secureTextEntry={
                      (each.key === 'password' && !isPasswordVisible) ||
                      (each.key === 'confirmPassword' &&
                        !isConfirmPasswordsVisible)
                    }
                    right={<TextInput.Icon icon={() => getIcon(each)} />}
                    left={
                      each.key === 'mobile' && (
                        <TextInput.Icon
                          onPress={() =>
                            this.setState(prev => ({
                              ...prev,
                              isShowCountryPicker: true,
                            }))
                          }
                          style={{width: responsiveWidth(18)}}
                          icon={() => {
                            return (
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'center',
                                }}>
                                <Text>{this.state.country.flag}</Text>
                                <Text style={{color: '#343A40'}}>
                                  {this.state.country.name.slice(0, 3)}
                                </Text>
                              </View>
                            );
                          }}
                        />
                      )
                    }
                  />
                  <HelperText type="error">
                    {errors[each.key as keyof typeof errors] &&
                    touched[each.key as keyof typeof errors]
                      ? errors[each.key as keyof typeof errors]
                      : ''}
                  </HelperText>
                </View>
              ))}
              <View style={styles.tAndCContainer}>
                <BouncyCheckbox
                  onPress={(isChecked: boolean) => {
                    this.setState(prev => ({
                      ...prev,
                      isAcceptedTandC: !this.state.isAcceptedTandC,
                    }));
                    if (isChecked) {
                      values.isAcceptedTandC = true;
                      delete errors['isAcceptedTandC'];
                    } else {
                      values.isAcceptedTandC = false;
                      errors['isAcceptedTandC'] =
                        'You must accept the terms and conditions';
                    }
                  }}
                  iconStyle={{borderRadius: 0}}
                  innerIconStyle={{borderRadius: 0}}
                  style={{borderRadius: 0}}
                  size={18}
                  fillColor="#A0E045"
                />
                <Text
                  onPress={() =>
                    this.props.navigation.navigate('terms-and-conditions')
                  }
                  style={styles.tAndCText}>
                  {translate('authFlow.termsAndConditions')}
                </Text>
              </View>
              <HelperText type="error">
                {errors.isAcceptedTandC ?? ''}
              </HelperText>
              <TouchableOpacity
                onPress={() => {
                  this.props.apiStuses.signUpUser !== 'LOADING' &&
                    handleSubmit();
                }}
                style={commonStyles.signUpButton}>
                {this.props.apiStuses.signUpUser === 'LOADING' ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={commonStyles.btnText}>
                    {translate('authFlow.signUp')}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </Formik>
        <CountryPicker
          show={this.state.isShowCountryPicker}
          lang="en"
          onBackdropPress={() =>
            this.setState(prev => ({...prev, isShowCountryPicker: false}))
          }
          style={{
            modal: {
              height: responsiveHeight(50),
            },
          }}
          pickerButtonOnPress={item => {
            this.setState(prev => ({
              ...prev,
              isShowCountryPicker: false,
              country: {
                name: item.name.en,
                flag: item.flag,
              },
            }));
          }}
        />
      </ScrollView>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  signUpFormData: state.AuthSlice.signUpFormData,
  apiStuses: state.AuthSlice.apiStuses,
});
const mapDispatchToProps = (dispatch: AppDispatch) => ({
  signingUpUser: (detail: {
    name: string;
    email: string;
    password: string;
    mobile: string;
  }) => dispatch(signingUpUser(detail)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
