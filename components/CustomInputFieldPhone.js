import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { TextInputMask } from 'react-native-masked-text';
import CustomIcon from './CustomIcon';
import { COLORS, METRICS } from '../global';

const CustomInputFieldPhone = ({ style, value, labelText, changeHandler }) => (
  <View style={{ ...styles.container, ...style }}>
    <Text style={styles.labelText}>{labelText}</Text>
    <View style={styles.inputWrapper}>
      <TextInputMask
        value={value}
        type="custom"
        options={{
          mask: '+999999999999999',
          validator: (value) => {
            return true;
          },
          getRawValue: (value, settings) => {
            return `${value.replace(/[^0-9]+/g, '')}`;
          },
        }}
        selectionColor={COLORS.primaryColor}
        keyboardAppearance="dark"
        textContentType="telephoneNumber"
        keyboardType="phone-pad"
        style={styles.textInput}
        onChangeText={changeHandler}
      />
      <TouchableOpacity style={styles.removeButton} onPress={() => changeHandler('')}>
        <CustomIcon name="close" size={METRICS.fontSizeSmall} style={styles.closeIcon} />
      </TouchableOpacity>
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

export default CustomInputFieldPhone;
