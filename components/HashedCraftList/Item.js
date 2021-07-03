import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import FastImage from 'react-native-fast-image';
import { METRICS, COLORS } from '../../global';

const CraftItem = ({ image, title, empty, numColumns }) => {
  const imagePadding = 15 * METRICS.ratioX;
  const imageWidth =
    (Dimensions.get('window').width - METRICS.craftborder * 2) / numColumns - imagePadding * 2;

  const styles = StyleSheet.create({
    item: {
      paddingLeft: imagePadding,
      paddingRight: imagePadding,
      flex: 1,
    },
    itemInvisible: {
      backgroundColor: 'transparent',
    },
    image: {
      width: imageWidth,
      height: imageWidth,
      borderRadius: METRICS.craftborder,
    },
    title: {
      fontFamily: 'Lato-Bold',
      fontSize: METRICS.fontSizeNormal,
      textAlign: 'center',
      color: COLORS.primaryColor,
      marginTop: 14 * METRICS.ratioX,
      marginBottom: 20 * METRICS.ratioX,
      overflow: 'hidden',
      width: imageWidth,
    },
  });

  if (empty) {
    return <View style={[styles.item, styles.itemInvisible]} />;
  }

  return (
    <View style={styles.item}>
      <FastImage source={image} style={styles.image} />
      <Text numberOfLines={1} ellipsizeMode="tail" style={styles.title}>
        {title}
      </Text>
    </View>
  );
};

CraftItem.propTypes = {
  image: PropTypes.string,
  title: PropTypes.string,
  empty: PropTypes.bool,
  numColumns: PropTypes.number,
};

CraftItem.defaultProps = {
  image: '../../assets/images/new-logo.png',
  title: null,
};

export default CraftItem;
