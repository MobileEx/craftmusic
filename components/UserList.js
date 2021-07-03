import React from 'react';
import { StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler';
import { user } from '../global/Images';
import { METRICS } from '../global';

const UserList = ({ items, onUser }) => {
  return (
    <ScrollView
      horizontal
      contentContainerStyle={styles.wrapper}
      showsHorizontalScrollIndicator={false}
    >
      {items.map((item, index) => (
        <TouchableOpacity key={index} onPress={() => onUser(item.id)}>
          <FastImage source={item.avatar ? { uri: item.avatar } : user} style={styles.image} />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    paddingLeft: METRICS.marginNormal,
    paddingRight: METRICS.marginNormal,
  },
  image: {
    width: METRICS.avatarbig,
    height: METRICS.avatarbig,
    borderRadius: METRICS.avatarbig,
    marginHorizontal: 0.5 * METRICS.spacingNormal,
  },
});

export default UserList;
