import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { CustomIcon, CustomSlider } from '..';
import { COLORS, METRICS } from '../../global';

const minimumVolumeValue = 0;
const maximumVolumeValue = 2;

class PlayerControls extends React.Component {
  componentDidMount() {}

  prepareAction(action, data, complete) {
    if (this.props.playerControlsCallback)
      this.props.playerControlsCallback(action, data, complete);
  }

  render() {
    let trackControls = null;
    if (this.props.trackControls) {
      const editColor = { color: COLORS.inActive };
      const effectsColor = { color: COLORS.inActive };

      if (this.props.activeView === 'effects') {
        effectsColor.color = COLORS.primaryColor;
      } else {
        editColor.color = COLORS.primaryColor;
      }
      trackControls = (
        <View style={styles.tertiaryControls}>
          <TouchableOpacity
            onPress={() => {
              this.prepareAction('toolbar');
            }}
          >
            <CustomIcon name="edit2" size={METRICS.fontSizeBig} style={editColor} />
          </TouchableOpacity>

          {this.props.trackType === 'audio' && (
            <TouchableOpacity
              onPress={() => {
                this.prepareAction('effects');
              }}
            >
              <CustomIcon name="magic" size={METRICS.fontSizeBigger} style={effectsColor} />
            </TouchableOpacity>
          )}
        </View>
      );
    }
    const recordBtnStyles = [styles.circleButton, styles.recordBtn];
    let recordIcon = 'circle';
    if (this.props.recording) {
      recordBtnStyles.push(styles.btnActive);
      recordIcon = 'stop';
    }
    const playBtnStyles = [styles.circleButton];
    let playIcon = 'audio-play';
    if (this.props.playing) {
      playBtnStyles.push(styles.btnActive);
      playIcon = 'pause';
    }
    return (
      <View style={styles.playerControlsContainer}>
        <View style={styles.sliderContainer}>
          <CustomSlider
            style={{ height: METRICS.studioBtns }}
            minimumValue={minimumVolumeValue}
            maximumValue={maximumVolumeValue}
            value={this.props.volume}
            callback={(val, complete) => {
              this.prepareAction('volume', val, complete);
            }}
          />
        </View>
        <View style={styles.playerControls}>
          <TouchableOpacity
            onPress={() => {
              this.prepareAction('rewind', { id: this.props.trackId });
            }}
            style={styles.circleButton}
          >
            <CustomIcon name="backward" size={METRICS.fontSizeBig} style={{ color: '#fff' }} />
          </TouchableOpacity>
          <TouchableOpacity
            style={recordBtnStyles}
            onPress={() => {
              this.prepareAction('record', { id: this.props.trackId });
            }}
          >
            <CustomIcon name={recordIcon} size={METRICS.fontSizeBig} style={{ color: '#f56358' }} />
          </TouchableOpacity>
          <TouchableOpacity
            style={playBtnStyles}
            onPress={() => {
              this.prepareAction('play');
            }}
          >
            <CustomIcon
              name={playIcon}
              size={METRICS.fontSizeBig}
              style={{
                color: '#fff',
                position: 'relative',
                justifyContent: 'center',
                textAlign: 'center',
              }}
            />
          </TouchableOpacity>
        </View>
        {trackControls}
      </View>
    );
  }
}

PlayerControls.propTypes = {
  trackControls: PropTypes.bool,
  pressRecord: PropTypes.func,
  pressPlay: PropTypes.func,
};

PlayerControls.defaultProps = {
  trackControls: false,
  pressRecord: () => {},
  pressPlay: () => {},
};

const styles = StyleSheet.create({
  playerControlsContainer: {
    width: '100%',
    flexDirection: 'row',
  },
  playerControls: {
    flexDirection: 'row',
    flex: -1,
  },
  circleButton: {
    height: METRICS.studioBtns,
    width: METRICS.studioBtns,
    backgroundColor: COLORS.btnGrey,
    borderRadius: 40 * METRICS.ratioX,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordBtn: {
    marginHorizontal: 10 * METRICS.ratioX,
  },
  btnActive: {
    backgroundColor: COLORS.primaryColor,
  },
  sliderContainer: {
    marginLeft: 12 * METRICS.ratioX,
    marginRight: 27 * METRICS.ratioX,
    width: 134 * METRICS.ratioX,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  tertiaryControls: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
});

export default PlayerControls;
