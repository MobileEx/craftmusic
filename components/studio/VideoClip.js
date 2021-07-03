import React from 'react';
import { StyleSheet, TouchableHighlight, TouchableOpacity, View, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Draggable from './Draggable';
import { METRICS, STYLES } from '../../global';
import VideoThumbs from './VideoThumbs';
import { updateTrackPosition } from '../../store/actions';
import COLORS from '../../global/Colors';

class VideoClip extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      conflict: false,
    };
  }

  setTrackActive = () => {
    this.props.callback('select', { id: this.props.id });
  };

  // figure out width of each clip based on current timescale and clip duration
  calcTrackWidth = () => {
    return (this.props.duration / this.props.timeScale) * this.props.rulerUnitWidth;
  };

  dragFinish = (xPosition) => {
    let newPosition = xPosition;
    const videoIndex = this.props.videoKeysOrder.indexOf(this.props.id);

    // deduct previous video start position
    const previousVideoIndex = videoIndex - 1;
    const previousVideoId = this.props.videoKeysOrder[previousVideoIndex];

    // if (previousVideoId) {
    //   newPosition -= this.msPositionToPageX(
    //     this.props.videoTrackPositions[previousVideoId].startPositionMs
    //   );
    // }
    // offset original start position, calculate width of all other tracks before
    let cumulativeWidth = 0;
    // for (const videoKey of this.props.videoKeysOrder) {
    //   if (videoKey == this.props.id) {
    //     break;
    //   }
    //   const video = this.props.videos[videoKey];
    //   const videoWidth = (video.durationMs / this.props.timeScale) * this.props.rulerUnitWidth;
    //   cumulativeWidth += videoWidth;
    // }
    // console.log('show the cumulative width', cumulativeWidth);
    if (previousVideoId) {
      // subtract width of all previous videos
      for (const videoKey of this.props.videoKeysOrder) {
        if (videoKey == this.props.id) {
          break;
        }
        const video = this.props.videos[videoKey];
        let videoWidth = (video.durationMs / this.props.timeScale) * this.props.rulerUnitWidth;
        videoWidth = this.roundMaxDecimals(videoWidth);
        cumulativeWidth = this.roundMaxDecimals(cumulativeWidth + videoWidth);
      }
      // console.log('new position', newPosition);
      // console.log('subtracting cumulative width of ', cumulativeWidth);
      newPosition += cumulativeWidth;
      newPosition = this.roundMaxDecimals(newPosition);
    }
    // console.log('show final position', newPosition);
    this.props.videoClipDragFinishCallback(this.props.id, newPosition);
  };

  clipStyles = () => {
    // const marginLeft = this.msPositionToPageX(this.props.startPositionMs);
    // console.log('show margin lefg', marginLeft);
    const cS = [
      styles.clipContainer,
      {
        width: this.calcTrackWidth(),
      },
    ];
    return cS;
  };

  overlayStyles = () => {
    const { active } = this.props;
    const { conflict } = this.state;
    const oS = [styles.overlay];
    if (active) {
      oS.push(STYLES.trackActiveOverlay);
    } else {
      oS.push([STYLES.trackActiveOverlay, { borderColor: COLORS.editingGrey }]);
    }
    if (conflict) {
      oS.push(STYLES.trackConflictColors);
    }
    return oS;
  };

  handleMove = (xPosition) => {
    const { checkCollision } = this;

    // return checkCollision(xPosition);
  };

  calcStartPositionMs = (xPosition) => {
    return (
      (xPosition / this.props.rulerUnitWidth) * this.props.timeScale + this.props.startPosition
    );
  };

  msPositionToPageX = (msPosition) => {
    return (msPosition / this.props.timeScale) * this.props.rulerUnitWidth;
  };

  calcEndPositionMs = (startPositionMs) => {
    return startPositionMs + this.props.duration;
  };

  checkCollision = (xPosition) => {
    const { collisionConflict, calcStartPositionMs, calcEndPositionMs, relieveCollision } = this;
    const startPositionMs = calcStartPositionMs(xPosition);
    const endPositionMs = calcEndPositionMs(startPositionMs);

    const videoIndex = this.props.videoKeysOrder.indexOf(this.props.id);
    const nextVideoIndex = videoIndex + 1;

    if (this.props.videoKeysOrder[nextVideoIndex]) {
      const nextVideoPosition = this.props.videoTrackPositions[
        this.props.videoKeysOrder[nextVideoIndex]
      ];
      if (startPositionMs >= nextVideoPosition.startPositionMs) {
        return nextVideoPosition.startPositionMs;
      }
    }

    for (const [trackId, positionObject] of Object.entries(this.props.videoTrackPositions)) {
      if (trackId === this.props.id) {
        continue;
      }
      if (
        (startPositionMs < positionObject.endPositionMs &&
          startPositionMs > positionObject.startPositionMs) ||
        (endPositionMs > positionObject.startPositionMs &&
          endPositionMs < positionObject.endPositionMs)
      ) {
        collisionConflict();
        return true;
      }
    }

    // did not find a collision
    relieveCollision();
  };

  relieveCollision = () => this.setState({ conflict: false });

  collisionConflict = () => {
    this.setState({ conflict: true });
  };

  roundMaxDecimals = (floatInput) => {
    return parseFloat(floatInput.toFixed(3));
  };

  render() {
    // video.thumbs.forEach(thumb => {
    //   thumbs.push(
    //     <ImageBackground
    //       source={{ uri: thumb }}
    //       style={{ width: '100%', height: '100%' }}
    //       imageStyle={{ width: '100%' }}
    //     />
    //   );
    // });
    const videoIndex = this.props.videoKeysOrder.indexOf(this.props.id);
    const nextVideoIndex = videoIndex + 1;
    const previousVideoIndex = videoIndex - 1;
    let maxXPosition;
    let minXPosition = 0;
    let previousVideoPosition;
    const { height, width } = Dimensions.get('window');
    const offset = 0;
    let zIndex = 1;

    let cumulativeWidth;
    // console.log('show video positions', this.props.videoTrackPositions);
    if (this.props.videoKeysOrder[previousVideoIndex]) {
      const previousVideoId = this.props.videoKeysOrder[previousVideoIndex];

      previousVideoPosition = this.props.videoTrackPositions[previousVideoId];

      if (!cumulativeWidth) {
        cumulativeWidth = 0;
      }

      // subtract width of all previous videos
      for (const videoKey of this.props.videoKeysOrder) {
        const video = this.props.videos[videoKey];
        let videoWidth = (video.durationMs / this.props.timeScale) * this.props.rulerUnitWidth;
        videoWidth = this.roundMaxDecimals(videoWidth);
        cumulativeWidth = this.roundMaxDecimals(cumulativeWidth + videoWidth);
        if (videoKey == previousVideoId) {
          break;
        }
      }
      minXPosition = this.roundMaxDecimals(
        this.msPositionToPageX(previousVideoPosition.endPositionMs)
      );
      minXPosition = this.roundMaxDecimals(minXPosition - cumulativeWidth);
    } else {
      zIndex = 5;
    }
    // console.log('show videoKeysOrder', this.props.videoKeysOrder);
    // console.log('show videoTrackPositions', this.props.videoTrackPositions);
    // console.log('show trackwidth', this.calcTrackWidth());
    if (this.props.videoKeysOrder[nextVideoIndex]) {
      const nextVideoId = this.props.videoKeysOrder[nextVideoIndex];
      const nextVideoPosition = this.props.videoTrackPositions[nextVideoId];
      maxXPosition = 0;
      // if (!cumulativeWidth) {
      cumulativeWidth = 0;
      // subtract width of all previous videos before next
      for (const videoKey of this.props.videoKeysOrder) {
        if (videoKey == nextVideoId) {
          break;
        }
        const video = this.props.videos[videoKey];
        let videoWidth = (video.durationMs / this.props.timeScale) * this.props.rulerUnitWidth;
        videoWidth = this.roundMaxDecimals(videoWidth);
        cumulativeWidth = this.roundMaxDecimals(cumulativeWidth + videoWidth);
      }
      // } else {
      //   // only add on this current tracks width
      //   cumulativeWidth = this.roundMaxDecimals(
      //     cumulativeWidth + this.roundMaxDecimals(this.calcTrackWidth())
      //   );
      // }
      // console.log('got next video position', nextVideoPosition);
      maxXPosition = this.roundMaxDecimals(
        this.msPositionToPageX(nextVideoPosition.startPositionMs)
      );
      maxXPosition = this.roundMaxDecimals(maxXPosition - cumulativeWidth);
    }

    return (
      <View style={{ position: 'relative', zIndex: this.props.zIndex }}>
        <Draggable
          id={this.props.id}
          style={this.clipStyles()}
          vertical={false}
          dragFinish={this.dragFinish}
          active={this.props.allowDragging}
          onMove={this.handleMove}
          maxXPosition={maxXPosition}
          minXPosition={minXPosition}
          offset={0}
        >
          <TouchableOpacity onPress={this.setTrackActive}>
            <View
              style={{
                width: '100%',
                height: '100%',
                flexDirection: 'row',
                borderRadius: 10 * METRICS.ratioX,
                overflow: 'hidden',
              }}
            >
              <View style={this.overlayStyles()} />
              <VideoThumbs thumbs={this.props.thumbs} />
            </View>
          </TouchableOpacity>
        </Draggable>
      </View>
    );
  }
}

VideoClip.defaultProps = {
  videoClipDragFinishCallback: () => {},
};

VideoClip.propTypes = {
  id: PropTypes.any.isRequired,
  videoClipDragFinishCallback: PropTypes.func,
};

function mapStateToProps(state) {
  const { timeScale, rulerUnitWidth, videoTrackPositions, videoKeysOrder, videos } = state;
  return { timeScale, rulerUnitWidth, videoTrackPositions, videoKeysOrder, videos };
}

export default connect(mapStateToProps)(VideoClip);

const styles = StyleSheet.create({
  clipContainer: { height: METRICS.trackHeight },
  overlay: { zIndex: 1 },
});
