import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import Sound from 'react-native-sound';
import * as Progress from 'react-native-progress';
import { COLORS, METRICS } from '../../global';
import { CustomIcon, CustomSlider } from '../index';
import { getAudioTimeString } from '../../utils/chat';

export default class Player extends React.Component {
  constructor() {
    super();
    this.state = {
      playState: 'paused', // playing, paused
      playSeconds: 0,
      duration: 0.1,
      isBuffering: false,
    };
    this.sliderEditing = false;
  }

  componentDidMount() {
    this.timeout = setInterval(() => {
      if (
        this.sound &&
        this.sound.isLoaded() &&
        this.state.playState === 'playing' &&
        !this.sliderEditing
      ) {
        this.sound.getCurrentTime((seconds, isPlaying) => {
          this.setState({ playSeconds: seconds });
        });
      }
    }, 100);
  }

  componentWillUnmount() {
    if (this.sound) {
      this.sound.release();
      this.sound = null;
    }
    if (this.timeout) {
      clearInterval(this.timeout);
    }
  }

  onSliderEditing = (value) => {
    if (this.sound) {
      this.pause();
      this.sound.setCurrentTime(value);
      this.setState({ playSeconds: value, playState: 'playing' }, () =>
        this.sound.play(this.playComplete)
      );
    }
  };

  play = async () => {
    if (this.sound) {
      this.sound.play(this.playComplete);
      this.setState({ playState: 'playing' });
    } else {
      const { url = '' } = this.props.track;
      console.log('[Play]', url);
      this.setState({ isBuffering: true });

      this.sound = new Sound(url, '', (error) => {
        if (error) {
          console.log('failed to load the sound', error);
          // Alert.alert('Notice', 'audio file error. (Error code : 1)');
          this.setState({ playState: 'paused' });
        } else {
          this.setState({
            playState: 'playing',
            duration: this.sound.getDuration(),
            isBuffering: false,
          });
          this.sound.play(this.playComplete);
        }
      });
    }
  };

  playComplete = (success) => {
    if (this.sound) {
      if (success) {
        this.setState({ playState: 'paused', playSeconds: 0 });
        this.sound.setCurrentTime(0);
      } else {
        console.log('playback failed due to audio decoding errors');
      }
      this.setState({ playState: 'paused', playSeconds: 0 });
      this.sound.setCurrentTime(0);
    }
  };

  pause = () => {
    if (this.sound) {
      this.sound.pause();
    }

    this.setState({ playState: 'paused' });
  };

  handleProgressPress = (e) => {
    const position = e.nativeEvent.locationX;

    const progress = (position / (METRICS.screenWidth / 2.5)) * this.state.duration;
    // const isPlaying = !this.state.paused;

    console.log('progress == position', progress, position);
    this.onSliderEditing(progress);
  };

  render() {
    const currentTimeString = getAudioTimeString(this.state.playSeconds, this.state.duration);
    // eslint-disable-next-line no-unused-vars
    const durationString = getAudioTimeString(this.state.duration);
    return (
      <View style={styles.wrapper}>
        <View style={{ backgroundColor: COLORS.blackColor, flexDirection: 'row' }}>
          <View style={{ flexDirection: 'row' }}>
            {this.state.playState === 'playing' && (
              <TouchableOpacity onPress={this.pause} style={styles.button}>
                <CustomIcon name="pausethin" color={COLORS.whiteColor} size={25 * METRICS.ratioX} />
              </TouchableOpacity>
            )}
            {this.state.playState === 'paused' && (
              <TouchableOpacity onPress={this.play} style={[styles.button]}>
                <CustomIcon name="play" size={25 * METRICS.ratioX} color={COLORS.whiteColor} />
              </TouchableOpacity>
            )}
          </View>
          <View
            style={{ width: 16, justifyContent: 'center', position: 'absolute', top: 14, left: 14 }}
          >
            {this.state.isBuffering && <ActivityIndicator color={COLORS.whiteColor} size="small" />}
          </View>
          <View
            style={{
              flexDirection: 'row',

              backgroundColor: '#000',
              paddingVertical: 10,
              flex: 1,
              justifyContent: 'space-around',
              alignItems: 'center',
            }}
          >
            {/* <View style={styles.duration}>
              <Text style={styles.durationText}>{currentTimeString}</Text>
            </View> */}
            <TouchableWithoutFeedback
              style={{ width: METRICS.screenWidth / 2.2, backgroundColor: 'red' }}
              onPress={this.handleProgressPress}
              underlayColor="red"
              disabled={this.state.isBuffering}
            >
              <View>
                <Progress.Bar
                  progress={this.state.playSeconds / this.state.duration}
                  color={COLORS.primaryColor}
                  unfilledColor="rgba(255,255,255,.5)"
                  borderColor={COLORS.primaryColor}
                  width={METRICS.screenWidth / 2.2}
                  height={8}
                  style={{ marginBottom: 2 }}
                />
              </View>
            </TouchableWithoutFeedback>
            {/* <Progress.Bar
              progress={this.state.playSeconds / this.state.duration}
              color={COLORS.primaryColor}
              unfilledColor="rgba(255,255,255,.5)"
              borderColor={COLORS.primaryColor}
              width={METRICS.screenWidth / 2.5}
              height={8}
            /> */}
            <View style={styles.duration}>
              <Text style={styles.durationText}>{currentTimeString}</Text>
            </View>
            {/* <View style={styles.duration}>
              <Text style={styles.durationText}>{durationString}</Text>
            </View> */}
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    borderColor: COLORS.editingGrey,
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    height: 48,
    left: 0,
    bottom: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingHorizontal: 0,
    paddingVertical: 0,
    width: METRICS.screenWidth / 1.4,
  },
  trackActive: {
    borderWidth: 1,
    padding: 10,
  },
  button: {
    margin: 10,
    color: '#fff',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  duration: {
    color: COLORS.whiteColor,
    // marginLeft: 10 * METRICS.ratioX,
    // width: 60 * METRICS.ratioX,
    flex: 1,

    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'flex-end',
    marginHorizontal: 1,
  },
  durationText: {
    color: COLORS.whiteColor,
    textAlign: 'left',
    fontSize: 12,
    fontFamily: 'lato',
    lineHeight: 24,
    height: 24,
    fontVariant: ['tabular-nums'],
  },
});
