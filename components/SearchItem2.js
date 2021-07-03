import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { SearchBar } from 'react-native-elements';
import CustomIcon from './CustomIcon';
import { METRICS, COLORS } from '../global';

export default class SearchItem2 extends Component {
  render() {
    const { placeholder, value, showLoading, onClear, showInput } = this.props;
    return !showInput ? (
      <View style={{ backgroundColor: '#333', marginTop: 10, marginHorizontal: 10, height: 1 }} />
    ) : (
      <SearchBar
        selectionColor={COLORS.primaryColor}
        keyboardAppearance="dark"
        autoCapitalize="none"
        autoCorrect={false}
        placeholder={placeholder}
        value={value}
        showLoading={showLoading}
        placeholderTextColor={COLORS.inActive}
        returnKeyType="search"
        searchIcon={
          <CustomIcon
            name="search"
            size={METRICS.fontSizeMedium}
            style={{ color: COLORS.btnGrey, paddingHorizontal: METRICS.spacingNormal }}
          />
        }
        clearIcon={{
          iconStyle: { backgroundColor: 'black' },
        }}
        onClear={onClear}
        leftIconContainerStyle={{
          marginLeft: 0,
        }}
        containerStyle={{
          backgroundColor: 'transparent',
          padding: 0,
          marginLeft: METRICS.spacingNormal,
          marginRight: METRICS.spacingNormal,
          marginTop: METRICS.spacingNormal,
          marginBottom: METRICS.spacingNormal,
        }}
        inputContainerStyle={{
          backgroundColor: 'transparent',
          borderWidth: 1 * METRICS.ratioX,
          height: 40 * METRICS.ratioX,
          borderRadius: 5 * METRICS.ratioX,
          borderColor: COLORS.btnGrey,
          borderBottomWidth: 1 * METRICS.ratioX,
        }}
        inputStyle={{
          fontSize: METRICS.fontSizeNormal,
          fontFamily: 'lato-regular',
          color: COLORS.whiteColor,
        }}
        {...this.props}
      />
    );
  }
}

const styles = StyleSheet.create({
  searchView: {
    flex: 1,
    flexDirection: 'row',
    height: 40 * METRICS.ratioX,
    alignItems: 'center',
    marginLeft: METRICS.marginNormal,
    marginRight: METRICS.marginNormal,
    borderRadius: 5 * METRICS.ratioX,
    borderWidth: 1 * METRICS.ratioX,
    borderColor: COLORS.btnGrey,
  },
  textInput: {
    flex: 1,
    color: COLORS.whiteColor,
    fontSize: METRICS.fontSizeNormal,
    fontFamily: 'lato-regular',
  },
  searchIcon: {
    color: COLORS.btnGrey,
    marginLeft: METRICS.marginNormal,
  },
});
