import React from 'react';
import { StyleSheet } from 'react-native';
import CheckBox from 'react-native-check-box';
import { COLORS, METRICS } from '../global';
import CustomIcon from './CustomIcon';

const Checkbox = ({ value, clickHandler }) => {
  return (
    <CheckBox
      isChecked={value}
      style={styles.checkBox}
      checkBoxColor="transparent"
      checkedImage={
        <CustomIcon name="check" size={METRICS.fontSizeBig} style={styles.checkedIcon} />
      }
      unCheckedImage={null}
      onClick={clickHandler}
    />
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    borderWidth: 1 * METRICS.ratioX,
    borderColor: COLORS.inActive,
    marginRight: METRICS.spacingSmall,
    width: METRICS.checkbox,
    height: METRICS.checkbox,
  },
  label: {
    color: COLORS.whiteColor,
    fontSize: METRICS.fontSizeNormal,
    fontFamily: 'lato-regular',
  },
  checkBox: {
    width: 20 * METRICS.ratioX,
    borderWidth: 1 * METRICS.ratioX,
    borderColor: COLORS.whiteColor,
    marginRight: METRICS.spacingSmall,
    height: 20 * METRICS.ratioY,
  },
  checkedIcon: {
    color: COLORS.primaryColor,
  },
});

export default Checkbox;
