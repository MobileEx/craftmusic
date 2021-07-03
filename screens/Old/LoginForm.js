import { Field, Formik } from 'formik';
import React from 'react';
import {
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { withNavigation } from 'react-navigation';
import { FKTextInput } from './FKTextInput';
import { UsersLine } from './UsersLine';
import Env from '../helpers/environment';

class LoginForm extends React.Component {
  render() {
    return (
      <Formik
        initialValues={{ username: '', password: '' }}
        onSubmit={({ username, password }) => {
          // console.log('posting this payload:', {
          //     username,
          //     password
          // })
          fetch(`${Env.API_URL}/login`, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              username,
              password,
            }),
          })
            .then((response) => {
              // console.log('show response', response)
              if (response.status == 200) {
                return this.props.navigation.navigate('Main');
              }
              alert('Invalid username / password');

              return response.json();
            })
            .catch((error) => {
              console.error(error);
            });
        }}
        render={(props) => (
          <View style={styles.LoginForm}>
            <View style={{ paddingTop: 80 }}>
              <Text style={styles.highlight}>Sign in to your account</Text>
              <TextInput
                textContentType="username"
                onChangeText={props.handleChange('username')}
                onBlur={props.handleBlur('username')}
                value={props.values.email}
                keyboardType="email-address"
                placeholder="Username or email"
                placeholderTextColor="rgba(255,255,255,0.2)"
                style={styles.textInput}
              />
              <View style={{ position: 'relative' }}>
                <TextInput
                  textContentType="password"
                  secureTextEntry
                  onChangeText={props.handleChange('password')}
                  onBlur={props.handleBlur('password')}
                  value={props.values.password}
                  keyboardType="default"
                  placeholder="Password"
                  placeholderTextColor="rgba(255,255,255,0.2)"
                  style={[styles.textInput, styles.secondaryMargin]}
                />
                <TouchableOpacity title="Forgot?" style={styles.forgotBtn}>
                  <Text style={{ color: '#fff', fontSize: 12 }}>Forgot?</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                title="click me"
                onPress={props.handleSubmit}
                style={[styles.primaryBtn, styles.signInBtn]}
              >
                <Text style={styles.btnText}>Sign in</Text>
              </TouchableOpacity>
            </View>
            <View>
              <Text
                style={{ color: 'rgba(255,255,255,0.6)', textAlign: 'center', marginBottom: 20 }}
              >
                Don't have an account?
              </Text>
              <TouchableOpacity
                title="click me"
                onPress={() => this.props.navigation.navigate('ChooseUsername')}
                style={[styles.primaryBtn, styles.altBtn]}
              >
                <Text style={styles.btnText}>Sign up</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    );
  }
}

export default withNavigation(LoginForm);

const styles = StyleSheet.create({
  altBtn: {
    backgroundColor: '#72BF44',
  },
  forgotBtn: {
    position: 'absolute',
    right: 0,
    bottom: 20,
    color: '#fff',
  },
  highlight: {
    color: '#F37C21',
    fontSize: 12,
    marginBottom: 2,
  },
  LoginForm: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  primaryBtn: {
    borderRadius: 3,
    backgroundColor: '#006FB9',
    paddingVertical: 14,
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  secondaryMargin: {
    marginTop: 20,
  },
  signInBtn: {
    marginTop: 41,
    width: 250,
    alignSelf: 'center',
  },
  textInput: {
    fontSize: 18,
    paddingVertical: 16,
    color: 'rgba(255,255,255,0.2)',
    borderColor: 'rgba(255,255,255,0.2)',
    borderBottomWidth: 1,
  },
});
