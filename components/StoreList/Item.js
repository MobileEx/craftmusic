import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Text } from 'react-native';
import FastImage from 'react-native-fast-image';
import { METRICS, COLORS } from '../../global';
import { CraftBg } from '../../global/Images';

const StoreItem = ({ image, title }) => {
  return (
    <View style={styles.wrapper}>
      <FastImage source={image} style={styles.image} />
      <Text numberOfLines={1} ellipsizeMode="tail" style={styles.title}>
        {title}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingLeft: 15 * METRICS.ratioX,
    paddingRight: 15 * METRICS.ratioX,
  },
  image: {
    width: METRICS.storecrafts,
    height: METRICS.storecrafts,
    borderRadius: METRICS.craftborder,
  },
  title: {
    fontFamily: 'Lato-Bold',
    fontSize: METRICS.fontSizeNormal,
    textAlign: 'center',
    color: COLORS.primaryColor,
    marginTop: 14 * METRICS.ratioX,
    marginBottom: 20 * METRICS.ratioX,
    overflow: 'hidden',
    width: METRICS.storecrafts,
  },
});

StoreItem.propTypes = {
  image: PropTypes.string,
  title: PropTypes.string,
};

StoreItem.defaultProps = {
  image: CraftBg,
  title: null,
};

export default StoreItem;
