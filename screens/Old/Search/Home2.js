import React from 'react';
import { View, StyleSheet } from 'react-native';
import { METRICS } from '../../global';
import Item from './Item';

const Home2 = ({ list, onPress, onCheck, onCollapse }) => {
  return (
    <View style={styles.content}>
      {list.map((item, index) => (
        <Item
          key={index}
          index={index}
          title={item.title}
          status={item.status}
          child={item.child}
          checked={item.checked}
          onPress={onPress}
          tab={item.tab}
          onCheck={onCheck}
          onCollapse={onCollapse}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    marginBottom: METRICS.spacingHuge,
    width: '100%',
  },
});

export default Home2;
