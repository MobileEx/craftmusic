import React from 'react';
import CheckBox from 'react-native-check-box';
import { StyleSheet } from 'react-native';
import CustomIcon from './CustomIcon';
import { COLORS, METRICS } from '../global';

const CircleCheck = ({ value, clickHandler }) => (
  <CheckBox
    isChecked={value}
    style={[styles.checkBox, value ? styles.checked : styles.unChecked]}
    checkedImage={<CustomIcon name="check" size={18 * METRICS.ratioX} style={styles.checkedIcon} />}
    unCheckedImage={null}
    onClick={clickHandler}
  />
);

const styles = StyleSheet.create({
  checkBox: {
    width: 24 * METRICS.ratioX,
    height: 24 * METRICS.ratioX,
    borderRadius: 12 * METRICS.ratioX,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  checked: {
    backgroundColor: COLORS.btnGrey,
  },
  unChecked: {
    borderWidth: 1,
    borderColor: COLORS.whiteColor,
  },
  checkedIcon: {
    color: COLORS.blackColor,
  },
});

export default CircleCheck;
