import React from 'react';
import PropTypes from 'prop-types';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import CustomIcon from './CustomIcon';
import { COLORS, METRICS } from '../global';

const IconButton = ({ style, clickHandler, title, iconName }) => (
  <TouchableOpacity style={{ ...styles.container, ...style }} onPress={clickHandler}>
    <CustomIcon name={iconName} size={METRICS.fontSizeBig} style={styles.iconButtonPlaceholder} />
    <Text style={styles.titleText}>{title}</Text>
  </TouchableOpacity>
);

IconButton.propTypes = {
  style: PropTypes.object, // eslint-disable-line
  clickHandler: PropTypes.func,
};

IconButton.defaultProps = {
  style: {},
  clickHandler: () => {},
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: COLORS.primaryColor,
    width: 110 * METRICS.ratioX,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10 * METRICS.ratioX,
    paddingVertical: 5 * METRICS.ratioX,
  },
  iconButtonPlaceholder: {
    color: COLORS.whiteColor,
    marginRight: METRICS.spacingSmall,
  },
  titleText: {
    fontFamily: 'Lato',
    color: COLORS.whiteColor,
    fontSize: METRICS.fontSizeNormal,
  },
});

export default IconButton;
