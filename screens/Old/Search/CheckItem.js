import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, METRICS } from '../../global';
import CustomIcon from '../CustomIcon';

const CheckItem = ({ status, label, onPress }) => {
  return (
    <TouchableOpacity style={styles.checkWrapper} onPress={() => onPress(label)}>
      <View style={styles.checkIcon}>
        {status && <CustomIcon name="check" style={styles.check} />}
      </View>
      <Text style={styles.labelCheck}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  checkWrapper: {
    flexDirection: 'row',
    marginTop: METRICS.spacingHuge,
    alignItems: 'center',
  },
  checkIcon: {
    width: METRICS.fontSizeBiggest,
    marginRight: METRICS.spacingBig,
    marginLeft: METRICS.spacingNormal,
  },
  check: {
    color: COLORS.primaryColor,
    fontSize: METRICS.fontSizeBiggest,
  },
  labelCheck: {
    color: COLORS.whiteColor,
    fontSize: METRICS.fontSizeNormal,
    fontFamily: 'lato',
  },
});

CheckItem.propTypes = {
  status: PropTypes.bool,
  label: PropTypes.string,
  onPress: PropTypes.func,
};

CheckItem.defaultProps = {
  status: false,
  label: 'label',
  onPress: () => {},
};
export default CheckItem;
