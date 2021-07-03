import React from 'react';
import PropTypes from 'prop-types';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Item from './Item';
import { COLORS, METRICS, STYLES } from '../../global';
import { craft } from '../../global/Images';

const StoreList = ({ title, items, onPress, onCraft, count }) => {
  return (
    <View style={styles.listWrapper}>
      <View style={styles.titleWrapper}>
        <TouchableOpacity style={STYLES.horizontalAlign} onPress={() => onPress()}>
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.title}>
            {title}
          </Text>
          <Text style={styles.count}>{count}</Text>
          <Text style={styles.seeAllTitle}>See all</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal style={styles.list} showsHorizontalScrollIndicator={false}>
        {items.map((item, index) => (
          <TouchableOpacity key={index} onPress={() => onCraft(item.id)}>
            <Item image={item.thumbnail_url ? { uri: item.thumbnail_url } : craft} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  listWrapper: {
    marginBottom: 0 * METRICS.ratioX,
  },
  titleWrapper: {
    flexDirection: 'row',
    paddingLeft: METRICS.marginBig,
    paddingRight: METRICS.marginBig,
    alignItems: 'flex-end',
    marginBottom: METRICS.marginBig,
    maxWidth: 0.65 * METRICS.screenWidth,
  },
  title: {
    marginRight: METRICS.spacingTiny,
    color: COLORS.primaryColor,
    fontSize: METRICS.fontSizeBig,
    fontFamily: 'Lato-Bold',
  },
  count: {
    marginRight: METRICS.craftborder,
    color: COLORS.primaryColor,
    fontSize: METRICS.fontSizeBig,
    fontFamily: 'Lato-Bold',
  },
  seeAllTitle: {
    color: COLORS.subTitle,
    fontSize: METRICS.fontSizeNormal,
    fontFamily: 'lato',
  },
  list: {
    paddingLeft: METRICS.craftborder,
    paddingRight: METRICS.marginNormal,
    marginBottom: -METRICS.marginNormalY,
  },
});

StoreList.propTypes = {
  title: PropTypes.string,
  onPress: PropTypes.func,
};

StoreList.defaultProps = {
  title: 'Screen',
  onPress: () => {},
};

export default StoreList;
