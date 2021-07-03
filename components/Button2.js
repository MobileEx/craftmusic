import React, { Component } from 'react';
import { Text, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { COLORS, METRICS, STYLES } from '../global';

export default class Button2 extends Component {
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
    if (status === 3) {
      return {
        borderWidth: 1 * METRICS.ratioX,
        borderColor: COLORS.blackColor,
      };
    }

    return {
      borderWidth: 1,
      borderColor: COLORS.primaryColor,
      backgroundColor: COLORS.blackColor,
    };
  };

  render() {
    const { style, title, status } = this.props;
    const { item } = styles;
    const combineStyle = StyleSheet.flatten([item, style, this.jewelStyle(status)]);

    return (
      <TouchableOpacity style={combineStyle} onPress={this.props.callback}>
        <Text
          style={[
            STYLES.textStyle,
            { fontFamily: 'lato-bold', fontSize: METRICS.fontSizeNormal, color: COLORS.whiteColor },
          ]}
        >
          {title}
        </Text>
      </TouchableOpacity>
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
