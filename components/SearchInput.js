import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import CustomIcon from './CustomIcon';
import { COLORS, METRICS } from '../global';

const SearchInput = ({ style, value, changeHandler, placeholder, onSubmit }) => (
  <View style={{ ...styles.container, ...style }}>
    <CustomIcon name="search" size={METRICS.fontSizeMedium} style={styles.searchIcon} />
    <TextInput
      selectionColor={COLORS.primaryColor}
      keyboardAppearance="dark"
      autoCapitalize="none"
      returnKeyType="search"
      autoCorrect={false}
      placeholder={placeholder}
      placeholderTextColor={COLORS.inActive}
      value={value}
      style={styles.textInput}
      onChangeText={changeHandler}
      onSubmitEditing={onSubmit}
    />
    <TouchableOpacity style={styles.removeButton} onPress={() => changeHandler('')}>
      <CustomIcon name="close" size={METRICS.fontSizeSmall} style={styles.closeIcon} />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    borderColor: COLORS.btnGrey,
    borderWidth: 1 * METRICS.ratioX,
    borderRadius: 5 * METRICS.ratioX,
    height: 40 * METRICS.ratioX,
    alignItems: 'center',
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
  searchIcon: {
    color: COLORS.btnGrey,
    paddingHorizontal: METRICS.spacingNormal,
  },
  closeIcon: {
    color: COLORS.btnGrey,
    paddingLeft: METRICS.spacingHuge,
    paddingRight: METRICS.spacingSmall,
  },
});

export default SearchInput;
