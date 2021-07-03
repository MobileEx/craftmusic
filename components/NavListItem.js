import React from 'react';
import PropTypes from 'prop-types';
import { Text, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import _ from 'lodash';
import { useDispatch, useStore } from 'react-redux';
import CustomIcon from './CustomIcon';
import { METRICS, COLORS } from '../global';
import { updatePrevState, updateTitle, updateBackScreen } from '../store/actions';

const NavListItem = (props) => {
  const { navigation, title, uppercase, moveTo, leftContent, pressHandler } = props;

  const dispatch = useDispatch();
  const store = useStore();
  const clickHandler = () => {
    if (moveTo !== '') {
      dispatch(updatePrevState(store.getState()));
      dispatch(updateTitle(moveTo));
      dispatch(updateBackScreen('Settings'));
      navigation.navigate(moveTo);
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={pressHandler || clickHandler}>
      {leftContent || (
        <Text
          style={
            uppercase
              ? { ...styles.textUppercase, ...styles.sectionTitleText }
              : styles.sectionTitleText
          }
        >
          {title}
        </Text>
      )}
      <TouchableOpacity onPress={clickHandler}>
        <CustomIcon
          name="angle-right"
          size={METRICS.rightarrow}
          style={{ color: COLORS.whiteColor }}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

NavListItem.propTypes = {
  uppercase: PropTypes.bool,
  title: PropTypes.string,
  moveTo: PropTypes.string,
};

NavListItem.defaultProps = {
  uppercase: false,
  title: '',
  moveTo: '',
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: METRICS.rowHeight,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitleText: {
    fontFamily: 'Lato-Semibold',
    fontSize: METRICS.fontSizeMedium,
    color: COLORS.whiteColor,
  },
  textUppercase: {
    textTransform: 'uppercase',
  },
  backButton: {
    display: 'none',
  },
});

export default NavListItem;
