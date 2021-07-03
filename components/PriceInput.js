import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { COLORS, METRICS } from '../global';

const CustomInputField = ({ style, value, labelText, changeHandler }) => (
  <View style={{ ...styles.container, ...style }}>
    <Text style={styles.labelText}>{labelText}</Text>
    <View style={styles.inputWrapper}>
      <TextInput
        selectionColor={COLORS.primaryColor}
        keyboardAppearance="dark"
        value={value}
        style={styles.textInput}
        onChangeText={changeHandler}
      />
    </View>
  </View>
);

const styles = StyleSheet.create({
  labelText: {
    fontFamily: 'Lato',
    color: COLORS.whiteColor,
    fontSize: METRICS.fontSizeNormal,
    paddingVertical: METRICS.spacingSmall,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: COLORS.primaryColor,
    borderWidth: 1 * METRICS.ratioX,
    padding: 10 * METRICS.ratioX,
  },
  textInput: {
    flex: 1,
    color: COLORS.whiteColor,
    fontSize: METRICS.fontSizeNormal,
    fontFamily: 'Lato-Regular',
  },
  removeButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    color: COLORS.primaryColor,
    paddingLeft: METRICS.spacingHuge,
  },
});

export default CustomInputField;
