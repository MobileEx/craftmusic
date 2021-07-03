import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import { TouchableOpacity } from 'react-native-gesture-handler';
import CustomIcon from './CustomIcon';
import { METRICS, COLORS } from '../global';

const CraftItem = ({ title, image }) => {
  return (
    <View style={styles.wrapper}>
      <FastImage source={image} style={styles.image} />
      <View style={styles.contentWrapper}>
        <Text style={styles.title}>{title}</Text>
      </View>
      <TouchableOpacity>
        <CustomIcon name="angle-right" size={METRICS.rightarrow} style={styles.rightIcon} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: METRICS.spacingNormal,
    paddingRight: METRICS.spacingNormal,
    paddingBottom: METRICS.spacingNormal,
    paddingTop: METRICS.spacingNormal,
    backgroundColor: COLORS.blackColor,
  },
  image: {
    width: METRICS.smallcrafts,
    height: METRICS.smallcrafts,
    borderRadius: METRICS.craftborder,
    marginRight: METRICS.spacingBig,
    marginLeft: METRICS.spacingTiny,
  },
  contentWrapper: {
    flex: 1,
  },
  title: {
    color: COLORS.whiteColor,
    fontSize: METRICS.fontSizeNormal,
  },
  count: {
    color: COLORS.nameDM,
    fontSize: METRICS.fontSizeLight,
  },
  rightIcon: {
    color: COLORS.whiteColor,
  },
});

CraftItem.propTypes = {
  image: PropTypes.any,
  title: PropTypes.string,
};

CraftItem.defaultProps = {
  image: 'image',
  title: 'Title',
};

export default CraftItem;
