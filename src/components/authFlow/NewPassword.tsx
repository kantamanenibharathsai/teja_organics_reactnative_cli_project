import {Formik} from 'formik';
import React, {Component} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {ActivityIndicator, HelperText, TextInput} from 'react-native-paper';
import Entypo from 'react-native-vector-icons/Entypo';
import {connect} from 'react-redux';
import * as Yup from 'yup';
import {
  changePassword,
  IForgotPassword,
} from '../../redux/slices/ForgotPasswordSlice';
import {AppDispatch, RootState} from '../../redux/store';
import {commonStyles} from '../commonComponents/CommonStyles';
import {newPasswordStyles} from './NewPasswordStyles';
import {sanitize} from './SignUp';

interface IProps {}

interface PropsFromRedux {
  changePassword: (password: string) => void;
  apiStatus: IForgotPassword['apiStatus'];
}

type CombinedProps = IProps & PropsFromRedux;

interface IState {
  newPassword: string;
  confirmPassword: string;
  newPasswordVisibility: boolean;
  confirmPasswordVisibility: boolean;
}

const sentOtpSchema = Yup.object().shape({
  newPassword: Yup.string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/,
      'Password must be combination of capital, small alphabets,and digits and special characters',
    )
    .required('Password is required'),
  confirmPassword: Yup.string()
    .required('Confirm password is required')
    .oneOf([Yup.ref('newPassword')], 'Passwords must match'),
});
export class NewPassword extends Component<CombinedProps, IState> {
  constructor(props: CombinedProps) {
    super(props);
    this.state = {
      newPassword: '',
      confirmPassword: '',
      newPasswordVisibility: false,
      confirmPasswordVisibility: false,
    };
  }
  render() {
    const {newPasswordVisibility, confirmPasswordVisibility} = this.state;
    return (
      <View style={newPasswordStyles.wholeContainer}>
        <Text style={newPasswordStyles.forgotPasswordText}>
          Forgot Password
        </Text>
        <View style={{marginVertical: 20, flex: 1}}>
          <Formik
            validationSchema={sentOtpSchema}
            initialValues={{
              newPassword: '',
              confirmPassword: '',
            }}
            validateOnBlur
            validateOnChange={false}
            onSubmit={values => this.props.changePassword(values.newPassword)}>
            {({
              handleBlur,
              handleChange,
              values,
              errors,
              touched,
              handleSubmit,
            }) => (
              <>
                <View>
                  <Text style={commonStyles.textFieldLabel}>New Password</Text>
                  <TextInput
                    value={values.newPassword}
                    onChangeText={text => {
                      handleChange('newPassword')(sanitize(text));
                    }}
                    onBlur={handleBlur('newPassword')}
                    outlineColor="transparent"
                    error={Boolean(errors.newPassword && touched.newPassword)}
                    mode="outlined"
                    secureTextEntry={!newPasswordVisibility}
                    right={
                      <TextInput.Icon
                        onPress={() =>
                          this.setState(prev => ({
                            ...prev,
                            newPasswordVisibility: !prev.newPasswordVisibility,
                          }))
                        }
                        icon={() => (
                          <Entypo
                            name={
                              newPasswordVisibility ? 'eye' : 'eye-with-line'
                            }
                            size={25}
                            color={'#babbbc'}
                          />
                        )}
                      />
                    }
                    theme={{roundness: 10}}
                    style={[
                      commonStyles.textFieldInput,
                      newPasswordStyles.textField,
                    ]}
                    placeholder="Please Enter Your New Password"
                  />
                  <HelperText type="error">
                    {errors.newPassword && touched.newPassword
                      ? errors.newPassword
                      : ''}
                  </HelperText>
                </View>
                <View>
                  <Text style={commonStyles.textFieldLabel}>
                    Confirm Password
                  </Text>
                  <TextInput
                    value={values.confirmPassword}
                    onChangeText={text => {
                      handleChange('confirmPassword')(sanitize(text));
                    }}
                    secureTextEntry={!confirmPasswordVisibility}
                    onBlur={handleBlur('confirmPassword')}
                    outlineColor="transparent"
                    error={Boolean(
                      errors.confirmPassword && touched.confirmPassword,
                    )}
                    mode="outlined"
                    right={
                      <TextInput.Icon
                        onPress={() =>
                          this.setState(prev => ({
                            ...prev,
                            confirmPasswordVisibility:
                              !prev.confirmPasswordVisibility,
                          }))
                        }
                        icon={() => (
                          <Entypo
                            name={
                              confirmPasswordVisibility
                                ? 'eye'
                                : 'eye-with-line'
                            }
                            color={'#babbbc'}
                            size={25}
                          />
                        )}
                      />
                    }
                    theme={{roundness: 10}}
                    style={[
                      commonStyles.textFieldInput,
                      newPasswordStyles.textField,
                    ]}
                    placeholder="Confirm Your Password"
                  />
                  <HelperText type="error">
                    {errors.confirmPassword && touched.confirmPassword
                      ? errors.confirmPassword
                      : ''}
                  </HelperText>
                </View>
                <View
                  style={{
                    flex: 1,
                  }}>
                  <TouchableOpacity
                    onPress={() => handleSubmit()}
                    style={[commonStyles.signUpButton, {marginTop: 'auto'}]}>
                    {this.props.apiStatus.changePassword === 'LOADING' ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      <Text style={commonStyles.btnText}>Reset Password</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </>
            )}
          </Formik>
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  apiStatus: state.ForgotPasswordSlice.apiStatus,
});

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  changePassword: (password: string) => dispatch(changePassword(password)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NewPassword);
