import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import StickyContainer from './StickyContainer';
import { COLORS, METRICS } from '../../global';

const TrackMarker = ({ scrollx }) => {
  const screenWidth = useSelector((state) => state.dimensions.width);
  const paddingLeft = { paddingLeft: screenWidth / 2 };
  return (
    <StickyContainer style={[styles.stickyContainer, paddingLeft]} scrollx={scrollx}>
      <View style={styles.view} />
    </StickyContainer>
  );
};

const styles = StyleSheet.create({
  stickyContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  view: {
    borderColor: COLORS.whiteColor,
    borderLeftWidth: 2 * METRICS.ratioX,
    height: '100%',
  },
});

export default TrackMarker;
