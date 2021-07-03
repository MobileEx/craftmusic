import * as Progress from 'react-native-progress';

import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';

class LoadingBar extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Progress.CircleSnail
          size={100}
          indeterminate
          color={['#f6c731']}
          direction="clockwise"
          style={styles.loading}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignSelf: 'center',
  },
  loading: {
    marginTop: '60%',
    color: 'red',
    backgroundColor: 'white',
  },
});

export default LoadingBar;
