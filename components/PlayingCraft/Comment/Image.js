import React from 'react';
import { StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import { METRICS } from '../../../global';

const ImageComponent = ({ content }) => {
  return <FastImage source={content} style={styles.image} />;
};

const styles = StyleSheet.create({
  image: {
    width: METRICS.bigcrafts,
    height: METRICS.bigcrafts,
    borderRadius: METRICS.craftborder,
    marginBottom: METRICS.spacingTiny,
  },
});

export default ImageComponent;
