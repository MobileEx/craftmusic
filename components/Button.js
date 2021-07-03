import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, METRICS, STYLES } from '../global';

export default class Button extends Component {
  jewelStyle = (status) => {
    if (status === 1) {
      return {
        backgroundColor: COLORS.primaryColor,
      };
    }
    if (status === 2) {
      return {
        borderWidth: 1 * METRICS.ratioX,
        borderColor: COLORS.btnGrey,
      };
    }
    return {
      borderWidth: 1 * METRICS.ratioX,
      borderColor: COLORS.primaryColor,
      backgroundColor: COLORS.blackColor,
    };
  };

  render() {
    const { style, title, status } = this.props;
    const { item } = styles;
    const combineStyle = StyleSheet.flatten([item, style, this.jewelStyle(status)]);

    return (
      <View style={combineStyle}>
        <Text
          style={[
            STYLES.textStyle,
            { fontFamily: 'lato-bold', fontSize: METRICS.fontSizeNormal, color: COLORS.whiteColor },
          ]}
        >
          {title}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    height: METRICS.followbuttonheight,
    borderRadius: METRICS.rowHeightSmall / 2,
    flexDirection: 'row',
  },
});
