import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, StyleSheet } from 'react-native';
import CustomIcon from './CustomIcon';
import { STYLES, METRICS, COLORS } from '../global';

const CicleClose = ({ clickHandler, style }) => (
  <TouchableOpacity style={{ ...style, ...STYLES.centerAlign }} onPress={clickHandler}>
    <CustomIcon name="cancel-button" size={METRICS.fontSizeBiggest} style={styles.closeIcon} />
  </TouchableOpacity>
);

CicleClose.propTypes = {
  clickHandler: PropTypes.func,
};

CicleClose.defaultProps = {
  clickHandler: () => {},
};

const styles = StyleSheet.create({
  closeIcon: {
    color: COLORS.whiteColor,
  },
});

export default CicleClose;
