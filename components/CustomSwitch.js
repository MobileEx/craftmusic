import React from 'react';
import PropTypes from 'prop-types';
import Switch from 'react-native-switch-pro';
import { View, Text, StyleSheet } from 'react-native';
import { METRICS, COLORS } from '../global';

const CustomSwitch = ({ title, primary, fieldName, swipeHandler, value }) => (
  <View style={styles.customSwitchContainer}>
    <Text style={[styles.toggleText, { color: primary ? COLORS.primaryColor : COLORS.whiteColor }]}>
      {title}
    </Text>
    <Switch
      backgroundActive={COLORS.primaryColor}
      value={value}
      onSyncPress={(res) => {
        swipeHandler(fieldName, res);
      }}
    />
  </View>
);

CustomSwitch.propTypes = {
  title: PropTypes.string,
  primary: PropTypes.bool,
};

CustomSwitch.defaultProps = {
  title: '',
  primary: false,
};

const styles = StyleSheet.create({
  customSwitchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: METRICS.rowHeight,
  },
  toggleText: {
    fontFamily: 'Lato-Semibold',
    fontSize: METRICS.fontSizeMedium,
    marginRight: METRICS.spacingNormal,
  },
});

export default CustomSwitch;
