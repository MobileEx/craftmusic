import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Text } from 'react-native';
import Slider from 'react-native-slider';
// import Slider from 'react-native-reanimated-slider';
import { COLORS, METRICS } from '../global';
import { changeFormatTime } from '../global/FormatTime';

class RangeSlider extends React.Component {
  render() {
    const {
      wrapperStyle,
      bottom,
      thumbColor,
      currentDuration,
      totalDuration,
      progress,
      onChangeSliderStatus, // this function
      onFinsihSliderStatus,
      playableDuration,
      seekableDuration,
      data,
    } = this.props;
    return (
      <View style={[styles.wrapper, wrapperStyle]}>
        <Slider
          value={progress}
          onSlidingStart={(value) => onChangeSliderStatus(value)}
          onSlidingComplete={(value) => onFinsihSliderStatus(value)}
          thumbTintColor={thumbColor}
          maximumTrackTintColor={COLORS.whiteColor}
          minimumTrackTintColor={COLORS.primaryColor}
        />
        {bottom && <Text style={styles.min}>{changeFormatTime(currentDuration)}</Text>}

        {bottom && <Text style={styles.max}>{changeFormatTime(totalDuration)}</Text>}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    paddingBottom: METRICS.spacingNormal,
    marginBottom: METRICS.spacingNormal,
  },
  min: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    color: COLORS.selectedGrey,
  },
  max: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    color: COLORS.selectedGrey,
  },
  slider: {
    width: '100%',
    height: METRICS.smallcrafts,
  },
});

RangeSlider.propTypes = {
  min: PropTypes.number,
  max: PropTypes.number,
  rangeEnabled: PropTypes.bool,
  labelStyle: PropTypes.string,
  syntax: PropTypes.string,
  bottom: PropTypes.bool,
  blankColor: PropTypes.string,
  isEnd: PropTypes.bool,
  thumbColor: PropTypes.string,
  thumbRadius: PropTypes.number,
  totalDuration: PropTypes.any,
  currentDuration: PropTypes.any,
  progress: PropTypes.number,
  onChangeSliderStatus: PropTypes.func,
  onFinsihSliderStatus: PropTypes.func,
};

RangeSlider.defaultProps = {
  min: 0,
  max: 100,
  rangeEnabled: true,
  labelStyle: 'bubble',
  syntax: '',
  bottom: true,
  blankColor: COLORS.nameDM,
  isEnd: false,
  thumbRadius: METRICS.sliderthumb,
  thumbColor: COLORS.whiteColor,
  totalDuration: 0,
  currentDuration: 0,
  progress: 0,
};

export default RangeSlider;
