import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';

class AuthScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  render() {
    return (
      <View style={styles.container}>
        <SafeAreaView style={{ flex: 1 }}>{this.props.children}</SafeAreaView>
      </View>
    );
  }
}

export default AuthScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#202238',
    flex: 1,
  },
});
