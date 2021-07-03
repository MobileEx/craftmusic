import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { Defs, LinearGradient, Stop } from 'react-native-svg';
import { LineChart } from 'react-native-svg-charts';
import { connect } from 'react-redux';
import Draggable from './Draggable';
import TrackSettings from './TrackSettings';
import StickyContainer from './StickyContainer';
import { COLORS, METRICS } from '../../global';

class Track extends React.Component {
  selectTrack = () => {
    this.props.selectedTrackCallback(this);
  };

  calcTrackWidth = (durationSeconds, timeScale, unitWidth) => {
    const durationMs = durationSeconds * 1000;
    return (durationMs / timeScale) * unitWidth;
  };

  msPositionToPageX = (msPosition) => {
    return (msPosition / this.props.timeScale) * this.props.rulerUnitWidth;
  };

  dragFinish = (xPosition) => {
    this.props.dragFinishCallback(this.props.id, xPosition);
  };

  setTrackActive(id) {
    if (!this.isTrackActive(id) && this.props.callback) {
      // console.log('calling callback set track active', id);
      const action = 'select';
      this.props.callback(action, { type: 'audio', id });
    }
  }

  isTrackActive(id) {
    return (
      this.props.activeTrack && this.props.activeTrack.id == id
      // this.props.activeTrack.type == type
    );
  }

  shouldAllowDragging() {
    if (this.props.playing) {
      return false;
    }
    return this.props.active;
    // return true;
  }

  onPress = (id) => {
    // console.log('on press show id', id);
    this.props.trackId = id;
    this.setTrackActive(id);
  };

  onTrackMove = (id) => {
    // console.log('on track move show id', id);
    this.setTrackActive(id);
  };

  TrackGradient = () => (
    <Defs key="gradient">
      <LinearGradient id="gradient" x1="0" y="0%" x2="100%" y2="0%">
        <Stop offset="0%" stopColor="rgb(148, 29, 169)" />
        <Stop offset="80%" stopColor="rgb(58, 206, 204)" />
      </LinearGradient>
    </Defs>
  );

  renderNestedAudioTracks = () => {
    // console.log('renderNestedAudioTracks')
    const { TrackGradient } = this;
    const { activeTrack } = this.props;
    const tracks = [];

    const minXPosition = this.props.activeTrack.start;
    const maxXPosition = this.props.activeTrack.end;

    const overlayStyles = [{ opacity: 0 }];

    let chart = null;

    // console.log('child track', this.props.childTracks)

    for (const [key, track] of Object.entries(this.props.childTracks)) {
      // console.log('renderNestedAudioTracks 11111')
      // console.log('track value', track)
      // console.log('child track waveform?', track);

      const trackWidth = this.calcTrackWidth(
        track.durationSeconds,
        this.props.timeScale,
        this.props.rulerUnitWidth
      );
      const trackWaveContainerStyles = [{ width: trackWidth, overflow: 'hidden' }];

      if (track.waveform) {
        chart = (
          <LineChart
            style={{ height: 80 * METRICS.ratioX }}
            data={track.waveform}
            contentInset={{ top: 20 * METRICS.ratioX, bottom: 20 * METRICS.ratioX }}
            svg={{
              strokeWidth: 2 * METRICS.ratioX,
              stroke: 'url(#gradient)',
            }}
            showGrid={false}
          >
            <TrackGradient />
          </LineChart>
        );
        if (activeTrack.id === track.id) {
          trackWaveContainerStyles.push(styles.trackWaveContainerActive);
        }
      }
      tracks.push(
        <Draggable
          key={track.id}
          style={[trackWaveContainerStyles]}
          vertical={false}
          dragFinish={this.dragFinish}
          onMove={() => this.onTrackMove(track.id)}
          active={this.shouldAllowDragging()}
          offset={this.msPositionToPageX(this.props.position.startPositionMs)}
          minXPosition={minXPosition}
        >
          <TouchableOpacity onPress={() => this.onPress(track.id)}>
            <View style={overlayStyles} />
            <View style={{ height: '100%', width: trackWidth }}>{chart}</View>
          </TouchableOpacity>
        </Draggable>
      );
    }
    return tracks;
  };

  render() {
    // console.log('show active track', this.props.activeTrack);

    const minXPosition = this.props.activeTrack.start;
    const maxXPosition = this.props.activeTrack.end;

    const { TrackGradient } = this;
    const trackTabStyles = [
      styles.trackTab,
      { marginRight: this.props.width / 2 - METRICS.trackTab },
    ];
    const { track, childTracks, activeTrack } = this.props;
    const trackIds = { [track.id]: true };
    for (const [key, value] of Object.entries(childTracks)) {
      trackIds[value.id] = true;
    }
    let isAnyTrackActive = false;
    if (activeTrack.id && trackIds[activeTrack.id]) {
      isAnyTrackActive = true;
    }
    let chart = null;
    if (this.props.waveform) {
      chart = (
        <LineChart
          style={{ height: 80 * METRICS.ratioX }}
          data={this.props.waveform}
          contentInset={{ top: 20 * METRICS.ratioX, bottom: 20 * METRICS.ratioX }}
          svg={{
            strokeWidth: 2 * METRICS.ratioX,
            stroke: 'url(#gradient)',
          }}
          showGrid={false}
        >
          <TrackGradient />
        </LineChart>
      );
    }
    const trackWidth = this.calcTrackWidth(
      this.props.durationSeconds,
      this.props.timeScale,
      this.props.rulerUnitWidth
    );

    let stickyMenu = null;
    const overlayStyles = [{ opacity: 0 }];
    const trackWaveContainerStyles = [{ width: trackWidth, overflow: 'hidden' }];
    if (isAnyTrackActive) {
      trackTabStyles.push(styles.trackTabActive);
      stickyMenu = (
        <TrackSettings
          track={this.props.track}
          trackType="audio"
          scrollx={this.props.scrollx}
          activeEffects={this.props.activeEffects}
          studioControlsCallback={this.props.studioControlsCallback}
          playerControlsData={this.props.playerControlsData}
          childTracks={childTracks}
        />
      );
      // only add active outline when we have a waveform to show
      // check if parent track is active
      // console.log('show parent track id', track.id);
      if (this.props.waveform && activeTrack.id == track.id) {
        // console.log('parent track is active');
        overlayStyles.push(styles.trackActiveOverlay);
        trackWaveContainerStyles.push(styles.trackWaveContainerActive);
      }
    }

    const childTracksJSX = this.renderNestedAudioTracks();

    return (
      <View>
        <View style={{ position: 'relative' }}>
          <View style={[styles.trackContainer]}>
            <StickyContainer style={{ zIndex: 1 }} scrollx={this.props.scrollx}>
              <View>
                <View style={trackTabStyles}>
                  <View style={styles.volumeMetersContainer}>
                    <View style={styles.volumeMeterWrap}>
                      <View style={[styles.volumeMeter, { height: 32 * METRICS.ratioY }]} />
                    </View>
                    <View style={[styles.volumeMeterWrap, { marginLeft: 1 }]}>
                      <View style={[styles.volumeMeter, { height: 54 * METRICS.ratioY }]} />
                    </View>
                  </View>
                </View>
              </View>
            </StickyContainer>
            <Draggable
              style={[trackWaveContainerStyles]}
              vertical={false}
              dragFinish={this.dragFinish}
              // onMove={() => this.onTrackMove(track.id)}
              active={this.shouldAllowDragging()}
              offset={this.msPositionToPageX(this.props.position.startPositionMs)}
              minXPosition={minXPosition}
              // maxXPosition={maxXPosition}
              // offset={0}
            >
              <TouchableOpacity onPress={() => this.onPress(track.id)}>
                <View style={overlayStyles} />
                <View style={{ height: '100%', width: trackWidth }}>{chart}</View>
              </TouchableOpacity>
            </Draggable>
            {childTracksJSX}

            <StickyContainer
              style={[
                {
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  width: '100%',
                  height: '100%',
                  paddingLeft: this.props.width / 2,
                },
              ]}
              scrollx={this.props.scrollx}
            >
              <View
                style={{
                  borderColor: COLORS.whiteColor,
                  borderLeftWidth: 2 * METRICS.ratioX,
                  height: '100%',
                }}
              />
            </StickyContainer>
          </View>
        </View>
        {stickyMenu}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  userAvatar: {
    height: METRICS.avatarsmall,
    width: METRICS.avatarsmall,
    borderRadius: METRICS.avatarsmall,
  },
  trackInfoColumn: {
    textAlign: 'right',
    alignItems: 'flex-end',
    paddingRight: 4 * METRICS.ratioX,
    marginTop: 4 * METRICS.ratioX,
  },
  muteWrap: {
    backgroundColor: '#151625',
    justifyContent: 'center',
    borderRadius: 10 * METRICS.ratioX,
    flex: 0,
    padding: 7 * METRICS.ratioX,
    flexGrow: 0,
    flexDirection: 'row',
    width: 34 * METRICS.ratioX,
    marginTop: 10 * METRICS.ratioX,
  },
  trackContainer: {
    width: '100%',
    flexDirection: 'row',
    height: METRICS.trackHeight,
    marginBottom: METRICS.trackVerticalMargin,
  },
  trackWaveContainerActive: {
    borderWidth: 2 * METRICS.ratioX,
    borderColor: COLORS.primaryColor,
    borderRadius: 10 * METRICS.ratioX,
  },
  trackTab: {
    backgroundColor: COLORS.btnGrey,
    height: METRICS.trackHeight,
    width: METRICS.trackTab,
    textAlign: 'right',
    paddingVertical: 3 * METRICS.ratioX,
    paddingHorizontal: 5 * METRICS.ratioX,
  },
  trackTabActive: {
    backgroundColor: COLORS.selectedGrey,
  },
  trackActiveOverlay: {
    opacity: 1,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.primaryColorRgb(0.2),
  },
  trackWaveContainer: {
    height: '100%',
    width: '100%',
    flex: 1,
  },
  trackWave: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
  },
  decorationWrap: {
    width: 47 * METRICS.ratioX,
    position: 'absolute',
    left: 0,
    top: 35 * METRICS.ratioX,
  },
  trackTabDecoration: {
    width: '100%',
    height: 1 * METRICS.ratioX,
    borderColor: 'rgba(0,0,0,0.5)',
    borderTopWidth: 1 * METRICS.ratioX,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginBottom: 3 * METRICS.ratioX,
  },
  trackLabel: {
    textAlign: 'right',
    color: '#fff',
    fontSize: METRICS.fontSizeSmall,
    fontWeight: 'bold',
  },
  volumeMetersContainer: {
    flexDirection: 'row',
  },
  volumeMeterWrap: {
    backgroundColor: '#000',
    height: 97 * METRICS.ratioY,
    width: 8 * METRICS.ratioX,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  volumeMeter: {
    backgroundColor: '#6ef284',
    width: '100%',
  },
});

const audioTrackShape = PropTypes.shape({
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  title: PropTypes.string,
  filename: PropTypes.string.isRequired,
  filepath: PropTypes.string.isRequired,
  durationSeconds: PropTypes.number.isRequired,
  volume: PropTypes.number.isRequired,
  pitch: PropTypes.number.isRequired,
  flanger: PropTypes.number.isRequired,
  reverb: PropTypes.number.isRequired,
  echo: PropTypes.number.isRequired,
  waveform: PropTypes.array.isRequired,
  parentId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
});

Track.propTypes = {
  // define AudioTrack shape
  track: audioTrackShape.isRequired,
  childTracks: PropTypes.arrayOf(audioTrackShape),
  dragFinishCallback: PropTypes.func.isRequired,
};

Track.defaultProps = {
  childTracks: [],
  activeTrack: { id: undefined },
};

function mapDispatchToProps(dispatch) {
  return {
    playingTrackId: (data) => dispatch(playingTrackId(data)),
  }
}

function mapStateToProps(state, ownProps) {
  const {
    timeScale,
    rulerUnitWidth,
    audioTrackEffects,
    dimensions,
    playing,
    audioTrackPositions,
    trackId
  } = state;
  const { id } = ownProps;
  const activeEffects = audioTrackEffects[id];
  const position = audioTrackPositions[id];
  return { width: dimensions.width, timeScale, rulerUnitWidth, activeEffects, playing, position, trackId };
}

export default connect(mapStateToProps, mapDispatchToProps)(Track);
