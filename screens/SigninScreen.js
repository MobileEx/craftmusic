import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SignLayout, CustomIcon, CustomButton } from '../components';
import { COLORS, METRICS } from '../global';
import {
  login,
  updateIsPlaying,
  updateBackScreen,
  updateProfileUserId,
  updatePrevState,
} from '../store/actions';
import store from '../store/configureStore';
import CraftStateService from '../services/CraftStateService';

class SigninScreen extends React.Component {
  loginValue = null;

  passwordValue = null;

  constructor(props) {
    super(props);
    this.state = {
      loginResult: false,
    };
  }

  componentDidUpdate() {
    if (this.props.user.id && this.props.user.phone_verified_at) { //
      const state = store.getState();
      CraftStateService.updateCraftState({});
      this.props.dispatch(updatePrevState({}));
      this.props.dispatch(updateProfileUserId(this.props.user.id));
      this.props.dispatch(updateIsPlaying(-1));
      this.props.dispatch(updateBackScreen('Home'));
      this.props.navigation.navigate('Home');
    }
  }

  static navigationOptions = {
    header: null,
    footer: null,
  };

  login = () => {
    this.props
      .dispatch(login({ loginString: this.loginValue, password: this.passwordValue }))
      .then((res) => {
        if (!res) {
          this.setState({ loginResult: true });
        }
      });
  };

  render() {
    const { navigation } = this.props;
    const { loginResult } = this.state;
    return (
      <SignLayout>
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="handled"
          style={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Sign In</Text>
          {loginResult && <Text style={styles.failureText}>Incorrect username or password.</Text>}
          <View style={styles.formRow}>
            <View style={styles.iconWrapper}>
              <CustomIcon name="user-3" style={styles.icon} />
            </View>
            <TextInput
              placeholder="Email, Phone or Username"
              autoCompleteType="username"
              textContentType="username"
              selectionColor={COLORS.primaryColor}
              keyboardAppearance="dark"
              placeholderTextColor={COLORS.whiteColor}
              style={styles.formControl}
              returnKeyType="next"
              autoCapitalize="none"
              onChangeText={(text) => {
                this.loginValue = text;
              }}
            />
          </View>
          <View style={styles.formRow}>
            <View style={styles.iconWrapper}>
              <CustomIcon name="key" style={styles.icon} />
            </View>
            <TextInput
              placeholder="Password"
              textContentType="password"
              selectionColor={COLORS.primaryColor}
              keyboardAppearance="dark"
              autoCompleteType="password"
              placeholderTextColor={COLORS.whiteColor}
              style={styles.formControl}
              secureTextEntry
              returnKeyType="done"
              onSubmitEditing={this.login}
              onChangeText={(text) => {
                this.passwordValue = text;
              }}
            />
          </View>
          <View style={styles.buttonWrapper}>
            <CustomButton title="SUBMIT" style={styles.button} clickHandler={this.login} />
          </View>
          <View>
            <TouchableOpacity
              style={styles.forgetButton}
              onPress={() => navigation.navigate('Forgot1')}
            >
              <Text style={styles.forgetPassword}>Forgot Password?</Text>
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

function mapStateToProps(state) {
  const { loginFailed, isFetching, user, craftPlaying, craftState } = state;
  return { loginFailed, isFetching, user, craftPlaying, craftState };
}

export default connect(mapStateToProps)(SigninScreen);

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
  errorRow: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: COLORS.purpleColor,
    fontSize: METRICS.fontSizeNormal,
    fontFamily: 'lato',
  },
  failureText: {
    color: COLORS.purpleColor,
    fontSize: METRICS.fontSizeBig,
    fontFamily: 'lato',
    textAlign: 'center',
    marginTop: -METRICS.spacingGiant,
    marginBottom: METRICS.spacingBig,
  },
});
