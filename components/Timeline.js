import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { METRICS, COLORS } from '../global';

const Timeline = ({ text, number }) => {
  return (
    <View style={styles.wrapper}>
      {text !== null && <Text style={styles.text}>{text}</Text>}
      {number !== null && (
        <View style={styles.numberWrapper}>
          <Text style={styles.number}>{number}</Text>
        </View>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: 55 * METRICS.ratioX,
  },
  text: {
    fontSize: METRICS.fontSizeSmall,
    color: COLORS.nameDM,
    fontFamily: 'lato',
  },
  numberWrapper: {
    borderRadius: 25 * METRICS.ratioX,
    borderWidth: 1 * METRICS.ratioX,
    borderColor: COLORS.primaryColor,
    marginTop: METRICS.spacingTiny,
    width: 25 * METRICS.ratioX,
    height: 25 * METRICS.ratioX,
    alignItems: 'center',
    justifyContent: 'center',
  },
  number: {
    fontSize: METRICS.fontSizeLight,
    color: COLORS.primaryColor,
  },
});

Timeline.propTypes = {
  text: PropTypes.string,
  number: PropTypes.string,
};

Timeline.defaultProps = {
  text: null,
  number: null,
};

export default Timeline;
