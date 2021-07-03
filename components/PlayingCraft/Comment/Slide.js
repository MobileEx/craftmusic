import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import CustomIcon from '../../CustomIcon';
import { COLORS, METRICS } from '../../../global';
import Slider from '../../Slider';

const SlideComponent = () => {
  return (
    <View style={styles.wrapper}>
      <TouchableOpacity>
        <CustomIcon name="play" style={styles.play} />
      </TouchableOpacity>
      <Slider
        style={styles.slider}
        labelStyle="none"
        rangeEnabled={false}
        syntax=""
        bottom={false}
        thumbBorderWidth={0}
        wrapperStyle={styles.wrapperStyle}
        blankColor={COLORS.whiteColor}
        thumbRadius={6}
      />
      <Text style={styles.time}>4:52</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    borderColor: COLORS.primaryColor,
    borderWidth: 1,
    borderRadius: METRICS.sliderthumb,
    paddingLeft: METRICS.sliderpadding,
    paddingRight: METRICS.sliderpadding,
    paddingTop: METRICS.sliderpadvertical,
    paddingBottom: METRICS.sliderpadvertical,
    alignItems: 'center',
  },
  play: {
    color: COLORS.whiteColor,
    fontSize: METRICS.fontSizeHuge,
  },
  time: {
    color: COLORS.whiteColor,
    fontSize: METRICS.fontSizeLight,
  },
  wrapperStyle: {
    flex: 1,
    marginBottom: 0,
    paddingBottom: 0,
    paddingLeft: METRICS.spacingSmall,
  },
  slider: {
    flex: 1,
    height: METRICS.spacingExtra,
  },
});

export default SlideComponent;
