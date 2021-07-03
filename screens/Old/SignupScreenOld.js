import React from 'react';
import { Image, StyleSheet, TouchableOpacity, Text, TextInput, View } from 'react-native';
import { Formik } from 'formik';
import PlainScreen from '../PlainScreen';
import Env from '../../helpers/environment';

class SignupScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  render() {
    const chosenUsername = this.props.navigation.getParam('username', null);
    return (
      <PlainScreen>
        <Formik
          initialValues={{ username: '' }}
          onSubmit={({ email, password, first_name, repeat_password }) => {
            if (!chosenUsername) {
              return;
            }
            fetch(`${Env.API_URL}/users`, {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email,
                password,
                password_confirmation: repeat_password,
                username: chosenUsername,
                first_name,
              }),
            })
              .then(response => response.json())
              .then(responseJson => {
                // console.log('got thsse signup response:', responseJson);
                if (responseJson.errors) {
                  return;
                }
                this.props.navigation.navigate('Main');
              })
              .catch(error => {
                console.error(error);
              });
          }}
          render={props => (
            <View
              style={{
                justifyContent: 'space-between',
                flex: 1,
                paddingHorizontal: 20,
                marginTop: 120,
              }}
            >
              <View>
                <View style={styles.iconInputWrap}>
                  <Image
                    style={styles.avatarSignup}
                    source={require('./../assets/images/avatarSignup.png')}
                  />
                  <TextInput
                    onChangeText={props.handleChange('first_name')}
                    onBlur={props.handleBlur('first_name')}
                    value={props.values.first_name}
                    placeholder="First Name"
                    placeholderTextColor="rgba(255,255,255,0.2)"
                    style={[styles.textInput, styles.secondaryMargin]}
                  />
                </View>
                <TextInput
                  onChangeText={props.handleChange('email')}
                  onBlur={props.handleBlur('email')}
                  value={props.values.email}
                  placeholder="Email Address"
                  placeholderTextColor="rgba(255,255,255,0.2)"
                  style={[styles.textInput, styles.secondaryMargin]}
                  autoCapitalize="none"
                />
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
                <TextInput
                  textContentType="password"
                  secureTextEntry
                  onChangeText={props.handleChange('repeat_password')}
                  onBlur={props.handleBlur('repeat_password')}
                  value={props.values.repeat_password}
                  keyboardType="default"
                  placeholder="Repeat Password"
                  placeholderTextColor="rgba(255,255,255,0.2)"
                  style={[styles.textInput, styles.secondaryMargin]}
                />
                <TouchableOpacity
                  title="click me"
                  onPress={props.handleSubmit}
                  style={[styles.primaryBtn, styles.altBtn]}
                >
                  <Text style={styles.btnText}>Finish Signup</Text>
                </TouchableOpacity>
              </View>
              <View>
                <Text
                  style={{ color: 'rgba(255,255,255,0.6)', textAlign: 'center', marginBottom: 20 }}
                >
                  Already have an account?
                </Text>
                <TouchableOpacity
                  title="click me"
                  onPress={() => this.props.navigation.navigate('Login')}
                  style={[styles.primaryBtn]}
                >
                  <Text style={styles.btnText}>Sign in</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </PlainScreen>
    );
  }
}

export default SignupScreen;

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
    marginBottom: 10,
  },
});
