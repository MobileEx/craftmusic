import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Button from './Button';
import { METRICS, COLORS } from '../global';

export default ({ item, message, children }) => {
  return (
    <View style={styles.item}>
      <Image source={item.avatar} style={styles.img} />
      <View style={styles.contentWrapper}>
        <Text style={styles.nameLabel}>{item.name}</Text>
        {message && <Text style={styles.content}>{item.message}</Text>}
      </View>
      {children || (
        <Button
          style={styles.button}
          title={item.status === 1 ? 'Follow' : 'Following'}
          fontSize={METRICS.fontSizeNormal}
          status={item.status === 1 ? 1 : 2}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    height: 55,
    marginLeft: METRICS.marginNormal,
    marginRight: METRICS.marginNormal,
    alignItems: 'center',
  },
  nameLabel: {
    fontSize: METRICS.fontSizeNormal,
    marginLeft: METRICS.marginNormal,
    color: COLORS.whiteColor,
  },
  img: {
    height: 40,
    width: 40,
    borderRadius: 20,
  },
  content: {
    fontSize: METRICS.fontSizeNormal,
    marginLeft: METRICS.marginNormal,
    marginTop: METRICS.spacingTiny,
    color: COLORS.nameDM,
  },
  contentWrapper: {
    flexDirection: 'column',
    flex: 1,
  },
  button: {
    width: 120,
    height: 30,
    color: COLORS.whiteColor,
  },
});
