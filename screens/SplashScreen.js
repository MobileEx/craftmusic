import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CustomButton, SignLayout } from '../components';
import { COLORS, METRICS } from '../global';

export default class SplashScreen extends React.Component {
  static navigationOptions = {
    header: null,
    footer: null,
  };

  render() {
    const { navigation } = this.props;
    return (
      <SignLayout>
        <View style={styles.contentWrapper}>
          <View style={styles.textWrapper}>
            <Text style={styles.text}>
              CRAFT YOUR <Text style={styles.textStyle1}>BRAND</Text>
            </Text>
            <Text style={[styles.text, styles.rightText]}>
              <Text style={styles.textStyle2}>BRAND</Text> YOUR CRAFT
            </Text>
          </View>
          <View style={styles.buttonWrapper}>
            <CustomButton
              title="SIGN UP"
              style={styles.signUp}
              clickHandler={() => navigation.navigate('Signup')}
            />
            <CustomButton
              title="SIGN IN"
              style={styles.signIn}
              clickHandler={() => navigation.navigate('Signin')}
            />
            <TouchableOpacity onPress={() => navigation.navigate('Forgot1')}>
              <Text style={styles.forgetPassword}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SignLayout>
    );
  }
}

const styles = StyleSheet.create({
  textWrapper: {
    width: 250 * METRICS.ratioY,
  },
  text: {
    fontSize: METRICS.fontSizeMedium,
    color: COLORS.whiteColor,
    fontFamily: 'lato',
  },
  rightText: {
    marginTop: METRICS.spacingNormal,
    textAlign: 'right',
  },
  textStyle1: {
    color: COLORS.primaryColor,
    fontFamily: 'lato',
  },
  textStyle2: {
    color: COLORS.secondColor,
    fontFamily: 'lato',
  },
  signUp: {
    borderRadius: 20 * METRICS.ratioX,
    borderWidth: 1 * METRICS.ratioX,
    borderColor: COLORS.primaryColor,
    width: 150 * METRICS.ratioX,
    height: 40 * METRICS.ratioX,
    marginBottom: METRICS.spacingHuge,
  },
  signIn: {
    borderRadius: 20 * METRICS.ratioX,
    borderWidth: 1 * METRICS.ratioX,
    borderColor: COLORS.primaryColor,
    backgroundColor: COLORS.primaryColor,
    width: 150 * METRICS.ratioX,
    height: 40 * METRICS.ratioX,
    marginBottom: METRICS.spacingBig,
  },
  forgetPassword: {
    fontSize: METRICS.fontSizeOK,
    fontFamily: 'lato',
    color: COLORS.nameDM,
    textAlign: 'center',
  },
  contentWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});
