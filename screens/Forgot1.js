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
import { connect } from 'react-redux';
import { SignLayout, CustomIcon, CustomButton } from '../components';
import { COLORS, METRICS } from '../global';
import ProfileService from '../services/ProfileService';
import StepThree from './SignupScreen/StepThree';
import { submitVerificationCode, login } from '../store/actions';

class Forgot1 extends React.Component {
  key = null;

  static navigationOptions = {
    header: null,
    footer: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      phone: '',
      userId: 1,
      step: 1,
    };
  }

  stepthree = React.createRef();

  changeStep = (value, payload = {}) => {
    if (this.state.step === 1) {
      // clear old errors
      ProfileService.getUserInfo(this.key)
        .then((res) => {
          // console.log(res.data);
          if (res.data.id) {
            this.setState({ phone: res.data.phone, userId: res.data.id, step: 2 });
          }
        })
        .catch((err) => {
          console.log(err.response.data.error);
        });
    }
    if (value === 3) {
      const verificationCode = payload;
      this.submitVerificationCode(verificationCode);
    }
  };

  resend = () => {
    console.warn('resend', this.state.userId);
    ProfileService.resendSms(this.state.userId)
      .then((res) => {
        // console.log(res.data);
      })
      .catch((err) => {
        console.log(err.response.data.error);
      });
  };

  submitVerificationCode = (code) => {
    if (this.state.userId) {
      // console.log("id = ", this.state.userId);
      this.props.dispatch(submitVerificationCode(code, this.state.userId)).then(
        (verificationResult) => {
          // console.log('checked verification code:', verificationResult);
          this.props.navigation.navigate('Forgot2', { userId: this.state.userId });
        },
        (error) => {
          // console.log('verif code error show it:', error);
          this.stepthree.current.clear();
        }
      );
    }
  };

  renderStep = () => {
    const { navigation } = this.props;
    // console.log('phone', this.state.phone);
    if (this.state.step === 2) {
      return (
        <StepThree
          ref={this.stepthree}
          onPress={this.changeStep}
          phoneVerificationFailed={this.props.phoneVerificationFailed}
          resend={this.resend}
        />
      );
    }
    return (
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Forgot Password</Text>
        <View style={styles.formRow}>
          <View style={styles.iconWrapper}>
            <CustomIcon name="user-3" style={styles.icon} />
          </View>
          <TextInput
            placeholder="Email, Phone or Username"
            placeholderTextColor={COLORS.whiteColor}
            style={styles.formControl}
            selectionColor={COLORS.primaryColor}
            keyboardAppearance="dark"
            returnKeyType="next"
            autoCapitalize="none"
            onChangeText={(text) => {
              this.key = text;
            }}
          />
        </View>
        <View style={styles.buttonWrapper}>
          <CustomButton title="SUBMIT" style={styles.button} clickHandler={this.changeStep} />
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
    );
  };

  render() {
    return <SignLayout>{this.renderStep()}</SignLayout>;
  }
}

function mapStateToProps(state) {
  const { phoneVerificationFailed } = state;
  return { phoneVerificationFailed };
}

export default connect(mapStateToProps)(Forgot1);

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
    marginBottom: 2.5 * METRICS.spacingGiant * METRICS.ratioY,
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
    marginTop: 2.5 * METRICS.spacingGiant - METRICS.spacingHuge,
  },
  button: {
    backgroundColor: COLORS.primaryColor,
    borderColor: COLORS.primaryColor,
    fontSize: METRICS.fontSizeMedium,
  },
});
