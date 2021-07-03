import React from 'react';
import { connect } from 'react-redux';
import { SignLayout } from '../../components';
import StepOne from './StepOne';
import StepTwo from './StepTwo';
import StepThree from './StepThree';
import {
  registerUser,
  submitVerificationCode,
  resendSms,
  updateIsPlaying,
  updateBackScreen,
  updateCraftPlaying,
  setPlayingCrafts,
  updateProfileUserId,
  updateEditingCraftId,
  updateTitle,
  updateCurCraftId,
  updatePrevState,
} from '../../store/actions';
import store from '../../store/configureStore';

import CraftStateService from '../../services/CraftStateService';

class SignupScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 1,
      userForm: {
        username: null,
        email: null,
        birthday: null,
        phone: null,
        password: null,
        password_confirmation: null,
      },
      accountType: [],
      signupError: null,
    };
  }

  static navigationOptions = {
    header: null,
  };

  stepthree = React.createRef();

  changeStep = (value, payload = {}) => {
    let newValue = value;
    // user filled out signup form
    if (payload.change === true) {
      this.setState({
        step: newValue,
      });
      return;
    }
    if (value === 'storeAccountTypes') {
      this.setState({ accountType: payload });
      return;
    }
    if (value === 1) {
      // clear old errors
      this.setState({ signupError: null });
      const {
        username,
        email,
        birthday,
        phone,
        password,
        password_confirmation: passwordConfirmation,
      } = payload;
      this.setState({
        userForm: {
          username,
          email,
          birthday,
          phone,
          password,
          password_confirmation: passwordConfirmation,
        },
      });
      newValue = 2;
    }
    if (value === 2) {
      const accountType = payload;
      this.setState(() => {
        return { accountType };
      }, this.submit);
    }
    if (value === 3) {
      const verificationCode = payload;
      this.submitVerificationCode(verificationCode);
    }
    this.setState({
      step: newValue,
    });
  };

  submit() {
    const payload = { ...this.state.userForm, accountType: this.state.accountType };
    this.props.dispatch(registerUser(payload)).then(
      (data) => {
        // console.log('registration success', data);
      },
      (error) => {
        console.log('registration failed because:', error);
        // return to signup form and show error
        this.setState({ signupError: error, step: 1 });
      }
    );
  }

  resend = () => {
    this.props.dispatch(resendSms());
  };

  submitVerificationCode = (code) => {
    if (this.props.user.id) {
      this.props.dispatch(submitVerificationCode(code, this.props.user.id)).then(
        (verificationResult) => {
          // console.log('checked verification code:', verificationResult);
        },
        (error) => {
          // console.log('verif code error show it:', error);
          this.stepthree.current.clear();
        }
      );
    }
  };

  renderStep = () => {
    const { accountType } = this.state;
    // console.log('from renderStep show user', this.props.user);
    if (this.props.user.id && !this.props.user.phone_verified_at) {
      return (
        <StepThree
          ref={this.stepthree}
          onPress={this.changeStep}
          phoneVerificationFailed={this.props.phoneVerificationFailed}
          resend={this.resend}
        />
      );
    }
    if (this.props.user.id && this.props.user.phone_verified_at) {
      // console.log('user phone is verified navigating to main!!');
      const state = store.getState();
      if (!store.getState() || !this.props.previous) {
        CraftStateService.updateCraftState({});
        this.props.dispatch(updatePrevState({}));
        this.props.dispatch(updateProfileUserId(state.user.id));
        this.props.dispatch(updateIsPlaying(-1));
        this.props.dispatch(updateBackScreen('Home'));
      }
      this.props.navigation.navigate('Home');
    }
    switch (this.state.step) {
      case 1:
        return (
          <StepOne
            onPress={this.changeStep}
            username={this.state.userForm.username}
            phone={this.state.userForm.phone}
            email={this.state.userForm.email}
            birthday={this.state.userForm.birthday}
            password={this.state.userForm.password}
            password_confirmation={this.state.userForm.password_confirmation}
            error={this.state.signupError}
          />
        );
      default:
        return <StepTwo onPress={this.changeStep} accountType={accountType} />;
    }
  };

  render() {
    return <SignLayout>{this.renderStep()}</SignLayout>;
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    craftPlaying: state.craftPlaying,
    prevState: state.prevState,
    playingCrafts: state.playingCrafts,
    profileUserId: state.profileUserId,
    backScreen: state.backScreen,
    editingCraftId: state.editingCraftId,
    title: state.title,
    curCraftId: state.curCraftId,
    openComments: state.openComments,
    miniPlay: state.miniPlay,
    deepAlert: state.deepAlert,
    craftlistId: state.craftlistId,
    backupCraft: state.backupCraft,
    seekOnBack: state.seekOnBack,
    currentTime: state.currentTime,
    followId: state.followId,
    storeState: state.storeState,
    addMusicMethod: state.addMusicMethod,
    phoneVerificationFailed: state.phoneVerificationFailed,
  };
}

export default connect(mapStateToProps)(SignupScreen);
