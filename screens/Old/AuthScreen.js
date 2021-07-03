import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';

class AuthScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  render() {
    return (
      <FastImage source={require('../assets/images/splashbg.png')} style={styles.authContainer}>
        <SafeAreaView style={{ flex: 1 }}>
          <FastImage
            source={require('../assets/images/logo-big.png')}
            style={{ marginTop: 120, alignSelf: 'center' }}
          />
          {this.props.children}
        </SafeAreaView>
      </FastImage>
    );
  }
}

export default AuthScreen;

const styles = StyleSheet.create({
  authContainer: {
    backgroundColor: 'black',
    flex: 1,
  },
});
