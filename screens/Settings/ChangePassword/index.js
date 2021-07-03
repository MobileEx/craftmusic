import React from 'react';
import { View, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { withNavigation } from 'react-navigation';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import {
  BaseScreen,
  ScreenHeader,
  SectionHeader,
  CustomPasswordInputField,
  CustomButton,
} from '../../../components';
import { METRICS, COLORS } from '../../../global';
import ProfileService from '../../../services/ProfileService';
import CustomInputUsername from '../../../components/CustomInputUsername';

class ChangePassword extends BaseScreen {
  navbarHidden = true;

  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      newPassword: '',
      confirmPassword: '',
      userId: 1,
    };
  }

  componentDidMount() {
    ProfileService.getUserProfile()
      .then((res) => {
        const userProfile = res.data;
        this.setState({ username: userProfile.username });
      })
      .catch((err) => {});
  }

  changeUsername = () => {
    const { username, userId } = this.state;
    ProfileService.changeUsername(username)
      .then((res) => {
        if (res.data === 'success')
          showMessage({
            message: 'Success',
            type: 'default',
          });
      })
      .catch((err) => {});
  };

  changePassword = () => {
    const { userId, password, newPassword, confirmPassword } = this.state;

    if (newPassword !== confirmPassword) {
      showMessage({
        message: 'Confirm password is incorrect.',
        type: 'default',
      });
      return;
    }
    ProfileService.changePassword(password, newPassword)
      .then((res) => {
        if (res.data === 'Current password not correct!') {
          showMessage({
            message: 'Current password is incorrect.',
            type: 'default',
          });
          return;
        }
        showMessage({
          message: 'Changed password.',
          type: 'default',
        });
      })
      .catch((err) => {});
  };

  render() {
    const { navigation } = this.props;
    const { username, password, newPassword, confirmPassword, userId } = this.state;

    return (
      <View style={{ height: '100%', backgroundColor: 'black' }}>
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.container}
        >
          <ScreenHeader navigation={navigation} pageTitle="Edit Username/Password" />
          <View style={styles.changeUsernameSection}>
            <SectionHeader title="Change Username" />
            <CustomInputUsername
              style={styles.inputFieldWrapper}
              labelText="Username"
              value={username}
              changeHandler={(text) => this.setState({ username: text })}
            />
            <View style={styles.buttonWrapper}>
              <CustomButton title="Apply" clickHandler={this.changeUsername} />
            </View>
          </View>
          <View style={styles.changePasswordSection}>
            <SectionHeader title="Change Password" />
            <CustomPasswordInputField
              style={styles.inputFieldWrapper}
              labelText="Current Password"
              value={password}
              changeHandler={(text) => this.setState({ password: text })}
            />
            <CustomPasswordInputField
              style={styles.inputFieldWrapper}
              labelText="New Password"
              value={newPassword}
              changeHandler={(text) => this.setState({ newPassword: text })}
            />
            <CustomPasswordInputField
              style={styles.inputFieldWrapper}
              labelText="Re-enter Password"
              value={confirmPassword}
              changeHandler={(text) => this.setState({ confirmPassword: text })}
            />
            <View style={styles.buttonWrapper}>
              <CustomButton title="Apply" clickHandler={this.changePassword} />
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
  changeUsernameSection: {
    marginBottom: 50 * METRICS.ratioY,
  },
  inputFieldWrapper: {
    marginBottom: 40 * METRICS.ratioY,
  },
  buttonWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default withNavigation(ChangePassword);
