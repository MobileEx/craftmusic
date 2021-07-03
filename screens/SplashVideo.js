import React from 'react';
import { View, StyleSheet } from 'react-native';
import Video from 'react-native-video';
import { StackActions, NavigationActions } from 'react-navigation';
import SplashScreen from 'react-native-splash-screen';
import { METRICS } from '../global';
import store from '../store/configureStore';

export default class SplashVideo extends React.Component {
  static navigationOptions = {
    header: null,
    footer: null,
  };

  async componentDidMount() {
    SplashScreen.hide();
  }

  componentWillUnmount() {}

  // After completion of the video app wil navigate to the Auth screen
  async onVideoEnd() {
    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: 'Splash' })],
    });

    const userState = await store.getState().user;

    const state = store.getState();
    if (userState.id == null) {
      this.props.navigation.dispatch(resetAction);
    }
  }

  render() {
    const { navigation } = this.props;
    return (
      <View style={styles.contentWrapper}>
        <Video
          source={require('../assets/media/superpowered.mp4')}
          ignoreSilentSwitch="obey"
          ref={(ref) => {
            this.player = ref;
          }}
          style={{
            height: METRICS.screenHeight,
            width: METRICS.screenWidth,
            backgroundColor: 'rgb(148,211,240)',
          }}
          onEnd={() => this.onVideoEnd()}
          repeat={false}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  contentWrapper: {
    flex: 1,
  },
});
