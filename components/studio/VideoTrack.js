import React from 'react';
import PropTypes from 'prop-types';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import { teal } from '../../styles/globals';
import TrackSettings from './TrackSettings';
import { METRICS, COLORS } from '../../global';
import Metrics from '../../global/Metrics';
import VideoClip from './VideoClip';
import StickyContainer from './StickyContainer';
import TrackMarker from './TrackMarker';

class VideoTrack extends React.Component {
  videoClipDragFinish = (id, xPosition) => {
    this.props.videoTrackDragFinishCallback(id, xPosition);
  };

  prepareAction = (action, { id, position }) => {
    if (this.props.callback) {
      this.props.callback(action, { type: 'video', id, position });
    }
  };

  shouldAllowDragging(id) {
    if (this.props.playing) {
      return false;
    }
    return this.isActive(id);
  }

  isActive(id) {
    return this.props.active.type === 'video' && this.props.active.id == id;
  }

  render() {
    let stickyMenu;
    const trackTabStyles = [
      styles.trackTab,
      { marginRight: this.props.width / 2 - METRICS.trackTab },
    ];
    if (this.props.active.type === 'video') {
      trackTabStyles.push(styles.trackTabActive);
      stickyMenu = (
        <TrackSettings
          scrollx={this.props.scrollx}
          studioControlsCallback={this.props.playerControlsCallback}
          playerControlsData={this.props.playerControlsData}
          track={this.props.id}
          trackType="video"
          childTracks={[]}
        />
      );
    }
    const videos = [];
    if (this.props.videos) {
      const startingPosition = 0;
      let nextVideoPosition;
      let zIndex = this.props.videoKeysOrder.length;
      Object.values(this.props.videos).forEach((video) => {
        let loader;
        if (video.loading) {
          loader = (
            <ActivityIndicator
              size="large"
              color={teal}
              style={{ marginLeft: 16 * METRICS.ratioX }}
            />
          );
        }
        const videoPosition = this.props.videoTrackPositions[video.id];
        // let previousIndex = this.props.videoKeysOrder.indexOf(video.id);
        // const nextIndex = previousIndex + 1;
        // const nextVideoPos = this.props.videoTrackPositions[this.props.videoKeysOrder[nextIndex]];
        // if (previousIndex >= 1) {
        //   previousIndex -= 1;
        //   console.log('show the video keys order:', this.props.videoKeysOrder, previousIndex);
        //   // get end time from previous video
        //   const previousVideoPos = this.props.videoTrackPositions[
        //     this.props.videoKeysOrder[previousIndex]
        //   ];
        //   startingPosition = previousVideoPos.endPositionMs;
        //   console.log('the starting position is', startingPosition);
        // }

        // if (nextVideoPos) {
        //   nextVideoPosition = nextVideoPos.startPositionMs;
        // }
        zIndex -= 1;
        videos.push(
          <VideoClip
            key={video.id}
            id={video.id}
            duration={video.durationMs}
            startPosition={videoPosition.startPositionMs}
            nextVideoPosition={nextVideoPosition}
            active={this.isActive(video.id)}
            allowDragging={this.shouldAllowDragging(video.id)}
            thumbs={video.thumbs}
            callback={this.prepareAction}
            videoClipDragFinishCallback={this.videoClipDragFinish}
            zIndex={zIndex}
          />
        );
      });
    }
    return (
      <View>
        <View>
          <View style={[styles.trackContainer]}>
            <StickyContainer style={{ zIndex: 1 }} scrollx={this.props.scrollx}>
              <View style={trackTabStyles}>
                <View style={styles.volumeMetersContainer}>
                  <View style={styles.volumeMeterWrap}>
                    <View style={[styles.volumeMeter, { height: 32 * METRICS.ratioX }]} />
                  </View>
                  <View style={[styles.volumeMeterWrap, { marginLeft: 1 * METRICS.ratioX }]}>
                    <View style={[styles.volumeMeter, { height: 54 * METRICS.ratioX }]} />
                  </View>
                </View>
                <View style={styles.trackInfoColumn} />
              </View>
            </StickyContainer>
            {/* <Draggable style={{width: trackWidth}} vertical={false} dragFinish={this.dragFinish}> */}
            <View style={{ position: 'relative', flexDirection: 'row' }}>{videos}</View>
            <TrackMarker scrollx={this.props.scrollx} />
          </View>
        </View>
        {stickyMenu}
      </View>
    );
  }
}

VideoTrack.defaultProps = {
  videoTrackDragFinishCallback: () => {},
};

VideoTrack.propTypes = {
  videoTrackDragFinishCallback: PropTypes.func,
};

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
    marginBottom: METRICS.trackVerticalMargin,
    height: METRICS.trackHeight,
  },
  trackTab: {
    backgroundColor: COLORS.btnGrey,
    width: METRICS.trackTab,
    height: METRICS.trackHeight,
    textAlign: 'right',
    paddingVertical: 3 * METRICS.ratioX,
    paddingHorizontal: 5 * METRICS.ratioX,
  },
  trackTabActive: {
    backgroundColor: COLORS.selectedGrey,
  },
  trackWaveContainer: {
    width: '100%',
    flex: 1,
  },
  trackWave: {
    height: Metrics.trackHeight,
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
    marginBottom: 3,
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
    height: '100%',
    width: 8 * METRICS.ratioX,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  volumeMeter: {
    backgroundColor: '#6ef284',
    width: '100%',
  },
});

function mapStateToProps(state) {
  const {
    timeScale,
    rulerUnitWidth,
    videoTrackPositions,
    videoKeysOrder,
    dimensions,
    playing,
  } = state;
  return {
    timeScale,
    rulerUnitWidth,
    videoTrackPositions,
    videoKeysOrder,
    width: dimensions.width,
    playing,
  };
}

export default connect(mapStateToProps)(VideoTrack);
