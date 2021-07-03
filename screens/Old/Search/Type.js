import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import _ from 'lodash';
import CustomIcon from '../CustomIcon';
import { COLORS, METRICS } from '../../global';
import { userType } from '../../global/Seeds';

class Type extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  select = (value) => {
    this.props.setFilter('type', value);
  };

  render() {
    return (
      <View style={styles.type}>
        {userType.map((item, index) => (
          <TouchableOpacity style={styles.box} onPress={() => this.select(item.label)} key={index}>
            <CustomIcon name={item.icon} style={styles.checkIcon} />
            <Text style={styles.checkText}>{item.label}</Text>
            <View style={styles.checkedSide}>
              {_.includes(this.props.data, item.label) && (
                <CustomIcon name="check" style={styles.checked} />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  type: {
    borderBottomColor: COLORS.btnGrey,
    borderBottomWidth: 0.5 * METRICS.ratioX,
    paddingLeft: METRICS.spacingBig,
    paddingRight: METRICS.spacingBig,
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: METRICS.spacingNormal,
  },
  box: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: METRICS.spacingHuge,
    position: 'relative',
  },
  checkIcon: {
    color: COLORS.primaryColor,
    fontSize: METRICS.fontSizeBiggest,
    marginBottom: METRICS.spacingNormal,
  },
  checkText: {
    color: COLORS.whiteColor,
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
    bottom: 6 * METRICS.ratioY,
  },
});
export default Type;
