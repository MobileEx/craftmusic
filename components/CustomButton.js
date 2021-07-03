import React from 'react';
import PropTypes from 'prop-types';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, METRICS } from '../global';

const CustomButton = (props) => (
  <TouchableOpacity style={{ ...styles.container, ...props.style }} onPress={props.clickHandler}>
    <Text style={styles.titleText}>{props.title}</Text>
  </TouchableOpacity>
);

CustomButton.propTypes = {
  style: PropTypes.object, // eslint-disable-line
  clickHandler: PropTypes.func,
};

CustomButton.defaultProps = {
  style: {},
  clickHandler: () => {},
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: COLORS.btnGrey,
    width: 1.2 * METRICS.followbuttonwidth,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: METRICS.sendbuttonheight,
    borderRadius: METRICS.rowHeightSmall / 2,
  },
  titleText: {
    fontFamily: 'Lato',
    color: COLORS.whiteColor,
    fontSize: METRICS.fontSizeNormal,
    lineHeight: METRICS.fontSizeNormal,
  },
});

export default CustomButton;
