import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, FlatList } from 'react-native-gesture-handler';
import Item from './Item';
import { METRICS } from '../../global';
import { craft } from '../../global/Images';
import Environment from '../../helpers/environment';

const formatData = (data, numColumns) => {
  const numberOfFullRows = Math.floor(data.length / numColumns);

  let numberOfElementsLastRow = data.length - numberOfFullRows * numColumns;
  while (numberOfElementsLastRow !== numColumns && numberOfElementsLastRow !== 0) {
    data.push({ id: null, empty: true });
    numberOfElementsLastRow++;
  }
  return data;
};

const HashedCraftList = ({ items, onCraft, numColumns }) => {
  renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity key={index} onPress={() => onCraft(item.id)}>
        <Item
          image={
            item.thumbnail_url
              ? {
                  uri:
                    item.thumbnail_url.search('http') >= 0
                      ? item.thumbnail_url
                      : Environment.S3URL + item.thumbnail_url,
                }
              : craft
          }
          title={item.title}
          empty={item.empty}
          numColumns={numColumns}
        />
      </TouchableOpacity>
    );
  };
  return (
    <FlatList
      data={formatData(items, numColumns)}
      style={styles.container}
      keyExtractor={(item, index) => index.toString()}
      renderItem={this.renderItem}
      numColumns={numColumns}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: METRICS.marginSmall,
    flex: 1,
    paddingLeft: METRICS.craftborder,
    paddingRight: METRICS.craftborder,
  },
});

HashedCraftList.propTypes = {
  items: PropTypes.array,
  onCraft: PropTypes.func,
  numColumns: PropTypes.number,
};

HashedCraftList.defaultProps = {
  title: 'Screen',
  onPress: () => {},
};

export default HashedCraftList;
