import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import CustomIcon from '../CustomIcon';
import Type from './Type';
import Colors from './Colors';
import SearchItem from '../SearchItem';
import SliderNumbers from '../SliderNumbers';
import { COLORS, METRICS } from '../../global';
import { CustomSlider } from '..';

class Users extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { onPress, setFilter, data } = this.props;
    return (
      <View>
        <View style={styles.header}>
          <TouchableOpacity style={styles.part} onPress={() => onPress()}>
            <CustomIcon name="back" style={styles.iconHeader} />
          </TouchableOpacity>
          <Text style={styles.title}>User Type</Text>
          <View style={styles.part} />
        </View>
        <View style={styles.content}>
          <Type setFilter={setFilter} data={data.type} />
          <Colors setFilter={setFilter} data={data.rank} />
          <View style={styles.section}>
            <Text style={styles.label}>Location</Text>
            <View style={styles.wrapper}>
              <SearchItem placeholder="Enter zip code, city or state " />
            </View>
          </View>
          <View style={styles.section}>
            <Text style={styles.radius}>Set Radius</Text>
          </View>
          <View style={styles.wrapper2}>
            <SliderNumbers
              min={0}
              max={200}
              value={this.props.data.radius}
              thumbBorderWidth={0}
              thumbRadius={METRICS.sliderthumb}
              style={styles.slider}
              rangeEnabled={false}
              setFilter={setFilter}
            />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  content: {
    paddingTop: METRICS.spacingNormal,
  },
  iconHeader: {
    color: COLORS.whiteColor,
    fontSize: METRICS.fontSizeNormal,
  },
  part: {
    width: 80 * METRICS.ratioX,
    paddingHorizontal: METRICS.spacingBig,
    paddingBottom: METRICS.spacingNormal,
  },
  title: {
    textAlign: 'center',
    color: COLORS.whiteColor,
    fontSize: METRICS.fontSizeMedium,
    fontFamily: 'lato-bold',
    flex: 1,
    paddingBottom: METRICS.spacingNormal,
  },
  section: {
    paddingTop: METRICS.spacingBig,
  },
  label: {
    color: COLORS.whiteColor,
    textAlign: 'center',
    fontSize: METRICS.fontSizeMedium,
    fontFamily: 'lato-bold',
  },
  radius: {
    color: COLORS.btnGrey,
    fontFamily: 'lato',
    fontSize: METRICS.fontSizeNormal,
    textAlign: 'center',
  },
  wrapper: {
    paddingTop: METRICS.spacingNormal,
    paddingLeft: METRICS.spacingBig,
    paddingRight: METRICS.spacingBig,
  },
  wrapper2: {
    paddingLeft: METRICS.spacingBig,
    paddingRight: METRICS.spacingBig,
  },
});

export default Users;
