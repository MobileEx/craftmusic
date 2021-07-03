import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import CustomIcon from './CustomIcon';
import { METRICS, COLORS, STYLES } from '../global';
import { craft } from '../global/Images';
import { countmask } from '../helpers/countmask';

const HomeItem = ({
  image,
  title,
  owner,
  count,
  like,
  play,
  comment,
  type,
  showUsertypeIcon,
  explicit,
}) => {
  return (
    <>
      <FastImage source={image ? { uri: image } : craft} style={styles.image} />
      <View
        style={[STYLES.horizontalAlign, { flexDirection: 'row', flex: 1, alignSelf: 'center' }]}
      >
        <Text style={styles.title}>{title}</Text>
        {explicit && <CustomIcon name="explicit" style={styles.explicitIcon} />}
      </View>
      <View
        style={[
          STYLES.horizontalAlign,
          { flexDirection: 'row', flex: 1, alignSelf: 'center', marginTop: METRICS.marginTiny },
        ]}
      >
        <Text style={styles.subTitle}>
          {owner.username.length > 21
            ? `${owner.username.substring(0, 21 - 3)}...`
            : owner.username}
        </Text>
        {owner.types && showUsertypeIcon(owner.types, owner.verified_at)}
        <Text style={styles.count}>+ {count}</Text>
      </View>
      <View style={[STYLES.horizontalAlign, styles.countWrapper]}>
        <View style={styles.countBox}>
          <CustomIcon name="heart" style={styles.icon} />
          <Text style={styles.countText}>{countmask(like)}</Text>
        </View>
        {type != 1 && (
          <View style={styles.countBox}>
            <CustomIcon name="audio-play" style={styles.icon} />
            <Text style={styles.countText}>{countmask(play)}</Text>
          </View>
        )}
        <View style={styles.countBox}>
          <CustomIcon name="comment-1" style={styles.icon} />
          <Text style={styles.countText}>{countmask(comment)}</Text>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: METRICS.fontSizeNormal,
    color: COLORS.primaryColor,
    marginTop: METRICS.spacingSmall,
    textAlign: 'center',
    fontFamily: 'lato-bold',
  },
  subTitle: {
    fontSize: METRICS.fontSizeOK,
    color: COLORS.nameDM,
    textAlign: 'center',
    fontFamily: 'lato',
    paddingRight: METRICS.marginTiny,
  },
  count: {
    color: COLORS.primaryColor,
    fontFamily: 'lato',
    fontSize: METRICS.fontSizeOK,
  },
  countWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: METRICS.spacingSmall,
    marginBottom: METRICS.spacingNormal,
  },
  countBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: METRICS.spacingTiny,
    marginRight: METRICS.spacingTiny,
  },
  icon: {
    color: COLORS.primaryColor,
    marginRight: 4 * METRICS.ratioX,
    fontSize: METRICS.fontSizeOK,
  },
  countText: {
    color: COLORS.nameDM,
    fontSize: METRICS.fontSizeOK,
    fontFamily: 'lato',
  },
  image: {
    width: METRICS.screenWidth,
    height: METRICS.screenWidth,
    resizeMode: 'cover',
  },
  iconStyle: {
    color: COLORS.primaryColor,
  },
  explicitIcon: {
    fontSize: METRICS.fontSizeMedium,
    color: COLORS.primaryColor,
    marginTop: METRICS.spacingSmall,
    textAlign: 'center',
    marginLeft: 8 * METRICS.ratioX,
    alignSelf: 'center',
  },
});

HomeItem.propTypes = {
  image: PropTypes.any,
  title: PropTypes.string,
  subTitle: PropTypes.string,
  count: PropTypes.number,
  like: PropTypes.number,
  play: PropTypes.number,
  comment: PropTypes.number,
};

HomeItem.defaultProps = {
  image: 'image',
  title: 'Title',
  subTitle: 'Sub Title',
  count: 5,
  like: 100000,
  play: 100000,
  comment: 100000,
};

export default HomeItem;
