import React from 'react';
import CheckBox from 'react-native-check-box';
import { StyleSheet } from 'react-native';
import CustomIcon from './CustomIcon';

import { COLORS, METRICS } from '../global';

const CustomCheck = ({ value, clickHandler }) => (
  <CheckBox
    isChecked={value}
    style={styles.checkBox}
    checkedImage={
      <CustomIcon name="check" size={METRICS.fontSizeBiggest} style={styles.checkedIcon} />
    }
    unCheckedImage={null}
    onClick={clickHandler}
  />
);

const styles = StyleSheet.create({
  checkBox: {
    width: 30 * METRICS.ratioX,
  },
  checkedIcon: {
    color: COLORS.primaryColor,
  },
});

export default CustomCheck;
