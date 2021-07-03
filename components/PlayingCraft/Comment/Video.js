import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import CustomIcon from '../../CustomIcon';
import { COLORS, METRICS } from '../../../global';

const VideoComponent = ({ content }) => {
  return (
    <TouchableOpacity style={styles.videoWrapper}>
      <FastImage source={content} style={styles.image} />
      <View style={styles.iconWrapper}>
        <CustomIcon name="video1" style={styles.icon} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  videoWrapper: {
    width: METRICS.bigcrafts,
    height: METRICS.bigcrafts,
    position: 'relative',
  },
  image: {
    width: METRICS.bigcrafts,
    height: METRICS.bigcrafts,
    borderRadius: METRICS.craftborder,
    opacity: 0.59,
  },
  iconWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    color: COLORS.whiteColor,
    fontSize: METRICS.fontSizeHuge,
  },
});

export default VideoComponent;
