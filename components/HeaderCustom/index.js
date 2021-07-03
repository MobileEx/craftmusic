import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, Image } from 'react-native';
import { COLORS, METRICS } from '../../global';
import { logo } from '../../global/Images';

const DMHeader = ({ title, groupIcon }) => {
  const groupImage = groupIcon ? { uri: groupIcon } : logo;
  return (
    <View style={styles.wrapper}>
      <Image source={groupImage} style={groupIcon ? styles.avatar : styles.logo} />
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.blackColor,
  },
  avatar: {
    width: METRICS.logosize,
    height: METRICS.logosize,
    borderRadius: METRICS.logosize,
    resizeMode: 'cover',
  },
  logo: {
    width: METRICS.logosize,
    height: METRICS.logosize,
    resizeMode: 'contain',
  },
  title: {
    fontFamily: 'Lato-Semibold',
    fontSize: METRICS.fontSizeBig,
    color: COLORS.whiteColor,
    maxWidth: 0.7 * METRICS.screenWidth,
    marginLeft: METRICS.spacingTiny,
  },
});

DMHeader.propTypes = {
  title: PropTypes.string,
};

DMHeader.defaultProps = {
  title: 'Title',
};

export default DMHeader;
