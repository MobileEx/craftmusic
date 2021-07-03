import React from 'react';
import PropTypes from 'prop-types';
import { PanResponder, View, StyleSheet, Text } from 'react-native';
import RangeSlider from 'rn-range-slider';
import { COLORS, METRICS } from '../global';

const Slider = ({
  min,
  max,
  rangeEnabled,
  style,
  blankColor,
  labelStyle,
  syntax,
  wrapperStyle,
  bottom,
  thumbBorderWidth,
  thumbRadius,
}) => {
  return (
    <View style={[styles.wrapper, wrapperStyle]}>
      <RangeSlider
        style={[styles.slider, style]}
        gravity="center"
        min={min}
        max={max}
        step={1}
        labelStyle={labelStyle}
        rangeEnabled={rangeEnabled}
        selectionColor={COLORS.primaryColor}
        blankColor={blankColor}
        thumbBorderWidth={thumbBorderWidth}
        labelBackgroundColor={COLORS.blackColor}
        labelBorderColor={COLORS.blackColor}
        labelTextColor={COLORS.selectedGrey}
        thumbRadius={thumbRadius}
        initialLowValue={30}
        onTouchStart={() => {
          // console.log('touch start for slider');
        }}
        onTouchEnd={() => {
          // console.log('touch END for slider');
        }}
      />
      {bottom && <Text style={styles.min}>0:00</Text>}

      {bottom && <Text style={styles.max}>2:53</Text>}
    </View>
  );
};

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

Slider.propTypes = {
  min: PropTypes.number,
  max: PropTypes.number,
  rangeEnabled: PropTypes.bool,
  labelStyle: PropTypes.string,
  syntax: PropTypes.string,
  bottom: PropTypes.bool,
  blankColor: PropTypes.string,
  thumbBorderWidth: PropTypes.number,
  thumbRadius: PropTypes.number,
};

Slider.defaultProps = {
  min: 0,
  max: 1000,
  rangeEnabled: true,
  labelStyle: 'bubble',
  syntax: '',
  bottom: true,
  blankColor: COLORS.nameDM,
  thumbBorderWidth: 0,
  thumbRadius: METRICS.sliderthumb,
};

export default Slider;
