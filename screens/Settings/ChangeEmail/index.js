import React from 'react';
import { connect } from 'react-redux';
import { View, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import ProfileService from '../../../services/ProfileService';
import {
  BaseScreen,
  ScreenHeader,
  SectionHeader,
  CustomButton,
  CustomInputFieldPhone,
  PinModal,
} from '../../../components';
import { METRICS, COLORS } from '../../../global';
import CustomInputFieldEmail from '../../../components/CustomInputFieldEmail';
import { resendSms, submitVerificationCode } from '../../../store/actions';

class ChangeEmail extends BaseScreen {
  navbarHidden = true;

  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      phone: '',
      email: '',
      userId: 1,
      phone_before: '',
      verify: false,
      verifyfailed: false,
    };
  }

  componentDidMount() {
    ProfileService.getUserProfile(this.props.user.id)
      .then((res) => {
        const userProfile = res.data;
        this.setState({
          phone_before: userProfile.phone,
          phone: userProfile.phone,
          email: userProfile.email,
        });
      })
      .catch((err) => {
        console.log(err.response.data.error);
      });
  }

  changePhoneNumber = () => {
    ProfileService.changePhone(this.state.phone)
      .then((res) => {
        this.closeModal();
      })
      .catch((err) => {
        console.log(err.response.data.error);
      });
  };

  changeEmail = () => {
    ProfileService.changeEmail(this.state.email)
      .then((res) => {
        showMessage({
          message: 'Email changed successfully',
          type: 'default',
        });
      })
      .catch((err) => {
        console.log(err.response.data.error);
      });
  };

  //------------------------------------------------------
  phoneVerify = React.createRef();

  changeStep = (value, payload = {}) => {
    if (value === 3) {
      const verificationCode = payload;
      this.submitVerificationCode(verificationCode);
    }
  };

  submitVerificationCode = (code) => {
    if (this.props.user.id) {
      this.props.dispatch(submitVerificationCode(code, this.props.user.id)).then(
        (verificationResult) => {
          this.phoneVerify.current.clear();
          this.setState({ phone_before: this.state.phone, verify: false });
          showMessage({
            message: 'Phone Number changed successfully',
            type: 'default',
          });
        },
        (error) => {
          this.setState({ verifyfailed: true });
          this.phoneVerify.current.clear();
        }
      );
    }
  };

  showVerifyModal = () => {
    if (this.state.phone_before != this.state.phone) {
      this.setState({ verify: true });
      ProfileService.changePhone(this.state.phone)
        .then((res) => {
          this.props.dispatch(resendSms());
        })
        .catch((err) => {
          console.log(err.response.data.error);
        });
    }
  };

  closeModal = () => {
    ProfileService.changePhone(this.state.phone_before)
      .then((res) => {
        this.phoneVerify.current.clear();
        this.setState({ verify: false, phone: this.state.phone_before, verifyfailed: false });
      })
      .catch((err) => {
        console.log(err.response.data.error);
      });
  };

  setModalVisible = (visible) => {
    this.setState({ verify: visible, verifyfailed: false });
  };

  //------------------------------------------------------
  render() {
    const { navigation } = this.props;
    const { phone, email, verify } = this.state;

    return (
      <View style={{ height: '100%', backgroundColor: 'black' }}>
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.container}
        >
          <PinModal
            status={verify}
            ref={this.phoneVerify}
            onPress={this.changeStep}
            phoneVerificationFailed={this.state.verifyfailed}
            onClose={this.closeModal}
            onCloseRequest={this.setModalVisible}
          />
          <ScreenHeader navigation={navigation} pageTitle="Edit Phone/Email" />
          <View style={styles.changePhoneSection}>
            <SectionHeader title="Change Phone Number" />
            <CustomInputFieldPhone
              style={styles.inputFieldWrapper}
              labelText="Phone Number"
              value={phone}
              changeHandler={(text) => this.setState({ phone: text })}
            />
            <View style={styles.buttonWrapper}>
              <CustomButton title="Apply" clickHandler={this.showVerifyModal} />
            </View>
          </View>
          <View style={styles.changeEmailSection}>
            <SectionHeader title="Change Email" />
            <CustomInputFieldEmail
              style={styles.inputFieldWrapper}
              labelText="Email"
              value={email}
              changeHandler={(text) => this.setState({ email: text })}
            />
            <View style={styles.buttonWrapper}>
              <CustomButton title="Apply" clickHandler={this.changeEmail} />
            </View>
          </View>
        </KeyboardAwareScrollView>
        <FlashMessage titleStyle={styles.flashStyle} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  flashStyle: {
    fontFamily: 'lato',
    fontSize: METRICS.fontSizeNormal,
  },
  container: {
    paddingLeft: METRICS.spaceNormal,
    paddingRight: METRICS.spaceNormal,
    backgroundColor: COLORS.blackColor,
    minHeight: '100%',
    marginTop: 40 * METRICS.ratioX,
    flex: 1,
  },
  changePhoneSection: {
    marginBottom: 100 * METRICS.ratioY,
  },
  inputFieldWrapper: {
    marginBottom: 40 * METRICS.ratioY,
  },
  buttonWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  wrapper: {
    backgroundColor: COLORS.blackColor,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
});

function mapStateToProps(state) {
  const { user, phoneVerificationFailed } = state;
  return { user, phoneVerificationFailed };
}

export default connect(mapStateToProps)(ChangeEmail);
