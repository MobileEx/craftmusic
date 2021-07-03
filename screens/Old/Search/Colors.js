import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import _ from 'lodash';
import CustomIcon from '../CustomIcon';
import { colors } from '../../global/Seeds';
import { COLORS, METRICS } from '../../global';

class Colors extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  select = (value) => {
    this.props.setFilter('rank', value);
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>User Rank</Text>
        <View style={styles.wrapper}>
          {colors.map((item, index) => (
            <TouchableOpacity
              style={styles.colorWrapper}
              onPress={() => this.select(item.color)}
              key={index}
            >
              <View style={[styles.colorElement, { backgroundColor: item.color }]}>
                <Text />
              </View>
              <View style={styles.checkedSide}>
                {_.includes(this.props.data, item.color) && (
                  <CustomIcon name="check" style={styles.checked} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: METRICS.spacingBig,
    paddingBottom: METRICS.spacingBig,
    borderBottomColor: COLORS.btnGrey,
    borderBottomWidth: 0.5 * METRICS.ratioX,
  },
  wrapper: {
    flexDirection: 'row',
    paddingTop: METRICS.spacingBig,
    paddingLeft: METRICS.spacingBig,
    paddingRight: METRICS.spacingBig,
  },
  label: {
    color: COLORS.whiteColor,
    textAlign: 'center',
    fontFamily: 'lato-bold',
    fontSize: METRICS.fontSizeMedium,
  },
  colorWrapper: {
    flex: 1,
    flexDirection: 'column',
    paddingBottom: METRICS.spacingHuge,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorElement: {
    width: 32 * METRICS.ratioX,
    height: 32 * METRICS.ratioX,
    borderRadius: 16 * METRICS.ratioX,
    borderWidth: 1 * METRICS.ratioX,
    borderColor: COLORS.whiteColor,
    position: 'relative',
  },
  checked: {
    color: COLORS.primaryColor,
    fontSize: METRICS.fontSizeBiggest,
  },
  checkedSide: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 6 * METRICS.ratioX,
  },
});

export default Colors;
