import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, METRICS } from '../global';

const Radio = ({ children }) => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.checkbox} />
      <View>
        <Text style={styles.label}>{children}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    borderWidth: 1,
    borderColor: COLORS.whiteColor,
    marginRight: METRICS.spacingSmall,
    borderRadius: METRICS.circlecheck,
    width: METRICS.circlecheck,
    height: METRICS.circlecheck,
  },
  label: {
    color: COLORS.whiteColor,
    fontSize: METRICS.fontSizeLight,
  },
});

export default Radio;
