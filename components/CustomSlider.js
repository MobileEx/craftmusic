import React from 'react';
import Slider from '@react-native-community/slider';
import _ from 'lodash';
import { COLORS, METRICS } from '../global';

const CustomSlider = ({ style, callback, minimumValue, maximumValue, step, value }) => {
  let cbFn;
  if (callback) {
    // cbFn = _.throttle(val => {
    //   const updateCallbackComplete = false;
    //   callback(val, updateCallbackComplete);
    // }, 30);
  }
  const completeCallback = (val) => {
    const finalComplete = true;
    callback(val, finalComplete);
  };
  return (
    <Slider
      style={{ ...style, height: METRICS.fontSizeNormal }}
      minimumValue={minimumValue}
      maximumValue={maximumValue}
      minimumTrackTintColor={COLORS.primaryColor}
      maximumTrackTintColor={COLORS.selectedGrey}
      thumbImage={require('../assets/images/sliderIcon16.png')}
      onValueChange={(val) => {
        const updateComplete = false;
        callback(val, updateComplete);
      }}
      onSlidingComplete={completeCallback}
      step={0}
      value={value}
    />
  );
};

export default CustomSlider;
