import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import FastImage from 'react-native-fast-image';
import { METRICS, COLORS } from '../global';
import CustomIcon from './CustomIcon';

const SectionHeader = (props) => {
  const {
    title,
    iconName,
    uppercase,
    avatar,
    navigation,
    moveTo,
    primary,
    navigateHandler: navigateHandlerProp,
    studioId,
  } = props;
  const navigateHandler =
    navigateHandlerProp ||
    (() => {
      if (navigation) navigation.navigate(moveTo, { studioId });
    });

  return (
    <TouchableOpacity style={styles.container} onPress={navigateHandler}>
      <View style={styles.sectionTitleContainer}>
        {iconName !== '' && (
          <CustomIcon
            name={iconName}
            size={METRICS.fontSizeBiggest}
            style={styles.sectionHeaderIcon}
          />
        )}
        {avatar && <FastImage source={{ uri: avatar }} style={styles.avatarImage} />}
        <Text
          style={[
            uppercase
              ? { ...styles.textUppercase, ...styles.sectionTitleText }
              : styles.sectionTitleText,
            { color: primary ? COLORS.primaryColor : COLORS.whiteColor },
          ]}
        >
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

SectionHeader.propTypes = {
  uppercase: PropTypes.bool,
  iconName: PropTypes.string,
  title: PropTypes.string,
  // avatar: PropTypes.string,
  primary: PropTypes.bool,
};

SectionHeader.defaultProps = {
  uppercase: false,
  iconName: '',
  title: '',
  // avatar: '',
  primary: true,
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    paddingVertical: METRICS.spacingNormal,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionHeaderIcon: {
    color: COLORS.primaryColor,
    marginRight: METRICS.spacingTiny,
  },
  sectionTitleText: {
    fontFamily: 'Lato-Bold',
    fontSize: METRICS.fontSizeMedium,
    color: COLORS.primaryColor,
  },
  textUppercase: {
    textTransform: 'uppercase',
  },
  avatarImage: {
    width: METRICS.avatarsmall,
    height: METRICS.avatarsmall,
    marginRight: METRICS.spacingTiny,
    borderRadius: METRICS.avatarsmall / 2,
  },
});

export default SectionHeader;
