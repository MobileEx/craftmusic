import React from 'react';
import AuthScreen from './AuthScreen';
import LoginForm from '../components/LoginForm';

class LoginScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  render() {
    return (
      <AuthScreen>
        <LoginForm />
        {this.props.children}
      </AuthScreen>
    );
  }
}

export default LoginScreen;
