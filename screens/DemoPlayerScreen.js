import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { COLORS, METRICS } from '../global';
import { AudioPlayer } from '../libs/rnsuperpowered';
import { CustomIcon, CustomSlider } from '../components';

class DemoPlayerScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playing: false,
      selected: null,
      durationMs: 0,
      selected: null,
      tracks: [
        {
          id: 1,
          title: `Chief Keef - Baby What's Wrong With You`,
          url:
            'https://craftmusic.nyc3.digitaloceanspaces.com/demo/14-Chief_Keef-Baby_Whats_Wrong_With_You.mp3',
          durationMs: null,
        },
        {
          id: 2,
          title: `Chief Keef - Blew My High`,
          url: 'https://craftmusic.nyc3.digitaloceanspaces.com/demo/07-Chief_Keef-Blew_My_High.mp3',
          durationMs: null,
        },
        {
          id: 3,
          title: `Chief Keef - Young Rambos`,
          url: 'https://craftmusic.nyc3.digitaloceanspaces.com/demo/06-Chief_Keef-Young_Rambos.mp3',
          durationMs: null,
        },
        {
          id: 4,
          title: `Chief Keef - In Love With The Gwop`,
          url:
            'https://craftmusic.nyc3.digitaloceanspaces.com/demo/05-Chief_Keef-In_Love_With_The_Gwop.mp3',
          durationMs: null,
        },
      ],
    };
  }

  componentDidMount() {
    this.audioEventsLoop();
    this.select(this.state.tracks[0]);
    // start audio player event loop
  }

  receiveDuration = (error, { durationMs }) => {
    // console.log('got duration!!', durationMs);
    this.setState({ durationMs });
  };

  togglePlay = () => {
    this.setState((state) => {
      return { playing: !state.playing };
    });
    AudioPlayer.togglePlayback();
  };

  receiveLatestEvent = (error, event) => {
    // console.log('show the audio player latest event', event);

    if (event === 'Opened') {
      // file was opened get duration now
      this.togglePlay();
      AudioPlayer.getDuration(this.receiveDuration);
    }
  };

  setPositionMs = (ms) => {
    AudioPlayer.setPositionMs(ms);
  };

  audioEventsLoop = () => {
    setInterval(() => {
      AudioPlayer.getLatestEvent(this.receiveLatestEvent);
    }, 150);
  };

  rewind = () => {
    this.setPositionMs(0);
  };

  select = (track) => {
    this.setState({ playing: false, selected: track, durationMs: null });
    AudioPlayer.loadFile(track.url);
  };

  render() {
    const { durationMs, tracks, selected, playing } = this.state;
    let trackDuration;
    if (durationMs >= 0) {
      trackDuration = durationMs;
    }
    const sources = tracks.map((track, index) => {
      const trackStyles = [styles.track];
      if (selected && selected.id == track.id) {
        trackStyles.push(styles.trackActive);
      }
      return (
        <TouchableOpacity onPress={() => this.select(track)} key={track.id} style={trackStyles}>
          <Text>{track.title}</Text>
        </TouchableOpacity>
      );
    });
    return (
      <View style={{ backgroundColor: COLORS.whiteColor }}>
        <View>
          <Text>Choose a track:</Text>
          {sources}
        </View>
        {trackDuration >= 0 && (
          <View style={{ backgroundColor: 'silver', padding: 10 }}>
            <Text>Duration: {trackDuration / 1000} seconds</Text>
            <CustomSlider
              style={{ height: METRICS.studioBtns }}
              minimumValue={0}
              maximumValue={1}
              value={0}
              callback={(val, complete) => {
                const newPosition = ((val * 100) / 100) * trackDuration;
                this.setPositionMs(newPosition);
              }}
            />
          </View>
        )}
        <View style={[styles.buttonsContainer]}>
          <TouchableOpacity onPress={this.togglePlay} style={styles.button}>
            {!playing ? (
              <CustomIcon name="audio-play" color={COLORS.blackColor} size={30} />
            ) : (
              <CustomIcon name="pause" color={COLORS.blackColor} size={30} />
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={this.rewind} style={styles.button}>
            <CustomIcon name="backward" color={COLORS.blackColor} size={30} />
          </TouchableOpacity>
        </View>
        <Text>PLAYER DEMO</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  trackActive: {
    borderWidth: 1,
    borderColor: COLORS.redColor,
  },
  button: {
    margin: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default DemoPlayerScreen;
