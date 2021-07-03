import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SignLayout, CustomIcon, CustomButton } from '../components';
import { COLORS, METRICS } from '../global';
import ProfileService from '../services/ProfileService';

class Forgot2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      passwordFailed: '',
    };
  }

  static navigationOptions = {
    header: null,
    footer: null,
  };

  changePassword = (formData) => {
    if (formData.password.length < 6) {
      this.setState({ passwordFailed: 'Password must be at least 6 characters.' });
      return;
    }
    if (formData.password != formData.password_confirmation) {
      this.setState({ passwordFailed: 'Please confirm your password correctly.' });
      return;
    }
    this.setState({ passwordFailed: '' });
    ProfileService.changeForgotPassword(
      this.props.navigation.state.params.userId,
      formData.password
    )
      .then((res) => {
        // console.log(res.data);
        this.props.navigation.navigate('Signin');
      })
      .catch((err) => {
        console.log(err.response.data.error);
      });
  };

  render() {
    const { navigation } = this.props;
    const formData = {
      password: null,
      password_confirmation: null,
    };

    function updateState(field, value) {
      formData[field] = value;
    }

    return (
      <SignLayout>
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="handled"
          style={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Enter New Password</Text>
          <View style={styles.formRow}>
            <View style={styles.iconWrapper}>
              <CustomIcon name="user-3" style={styles.icon} />
            </View>
            <TextInput
              placeholder="Password"
              selectionColor={COLORS.primaryColor}
              keyboardAppearance="dark"
              placeholderTextColor={COLORS.whiteColor}
              style={styles.formControl}
              secureTextEntry
              onChangeText={(val) => {
                updateState('password', val);
              }}
            />
          </View>
          <View style={styles.formRow}>
            <View style={styles.iconWrapper}>
              <CustomIcon name="key" style={styles.icon} />
            </View>
            <TextInput
              placeholder="Re-enter Password"
              selectionColor={COLORS.primaryColor}
              keyboardAppearance="dark"
              textContentType="newPassword"
              placeholderTextColor={COLORS.whiteColor}
              style={styles.formControl}
              secureTextEntry
              onChangeText={(val) => {
                updateState('password_confirmation', val);
              }}
            />
          </View>
          {this.state.passwordFailed != '' && (
            <Text style={styles.failureText}>{this.state.passwordFailed}</Text>
          )}
          <View style={styles.buttonWrapper}>
            <CustomButton
              title="SUBMIT"
              style={styles.button}
              clickHandler={() => this.changePassword(formData)}
            />
            {this.props.isFetching && (
              <ActivityIndicator
                size="small"
                color="#3acecc"
                style={{ paddingTop: METRICS.spacingNormal }}
              />
            )}
          </View>
          <View>
            <TouchableOpacity
              style={styles.forgetButton}
              onPress={() => navigation.navigate('Signin')}
            >
              <Text style={styles.forgetPassword}>Back to Sign In</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={styles.forgetPassword}>Need an account? Sign Up</Text>
            </TouchableOpacity>
          </View>
          <View style={{ height: METRICS.spacingHuge }} />
        </KeyboardAwareScrollView>
      </SignLayout>
    );
  }
}

export default Forgot2;

const styles = StyleSheet.create({
  content: {
    flexDirection: 'column',
    flex: 1,
    width: 0.32 * METRICS.screenHeight,
    marginTop: 1.1 * METRICS.spacingHuge * METRICS.ratioY * METRICS.ratioY,
  },
  title: {
    fontSize: METRICS.fontSizeBig,
    color: COLORS.whiteColor,
    textAlign: 'center',
    marginBottom: 1.8 * METRICS.spacingGiant * METRICS.ratioY,
    fontFamily: 'lato-bold',
  },
  formRow: {
    flexDirection: 'row',
    marginBottom: METRICS.spacingHuge,
    width: '100%',
  },
  iconWrapper: {
    marginRight: METRICS.spacingNormal,
  },
  icon: {
    color: COLORS.whiteColor,
    fontSize: METRICS.fontSizeBig,
  },
  failureText: {
    color: COLORS.purpleColor,
    fontSize: METRICS.fontSizeNormal,
    fontFamily: 'lato',
    textAlign: 'center',
    marginTop: 1.8 * METRICS.spacingGiant,
  },
  formControl: {
    color: COLORS.whiteColor,
    fontSize: METRICS.fontSizeNormal,
    fontFamily: 'lato',
    borderBottomColor: COLORS.whiteColor,
    paddingBottom: METRICS.spacingSmall,
    borderBottomWidth: 1 * METRICS.ratioX,
    flex: 1,
  },
  formField: {
    width: '100%',
  },
  forgetButton: {
    marginTop: METRICS.spacingHuge,
    marginBottom: METRICS.spacingHuge,
  },
  forgetPassword: {
    fontSize: METRICS.fontSizeOK,
    color: COLORS.nameDM,
    textAlign: 'center',
    fontFamily: 'lato',
  },
  buttonWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1.8 * METRICS.spacingGiant - METRICS.spacingHuge,
  },
  button: {
    backgroundColor: COLORS.primaryColor,
    borderColor: COLORS.primaryColor,
    fontSize: METRICS.fontSizeMedium,
  },
});
