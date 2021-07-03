import React from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SearchItem, FollowsItem } from '.';
import { COLORS, METRICS } from '../global';

export default class SearchList2 extends React.Component {
  render() {
    const {
      data,
      onChangeText,
      onEndEditing,
      showLoading,
      value,
      placeholder,
      onClear,
    } = this.props;
    return (
      <View style={styles.container}>
        <KeyboardAwareScrollView
          contentContainerStyle={styles.wrapper}
          keyboardShouldPersistTaps="handled"
        >
          <SearchItem
            placeholder={placeholder}
            showLoading={showLoading}
            value={value}
            onChangeText={onChangeText}
            onEndEditing={onEndEditing}
            autoCorrect={false}
            onClear={onClear}
          />
          <View style={styles.list}>
            <FlatList
              keyboardShouldPersistTaps="always"
              contentContainerStyle={{ paddingBottom: 80 }}
              data={data}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity>
                  <FollowsItem item={item}>{this.renderSelected(item.status)}</FollowsItem>
                </TouchableOpacity>
              )}
              {...this.props.listProps}
            />
          </View>
        </KeyboardAwareScrollView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: COLORS.blackColor,
    minHeight: '100%',
  },
  list: {
    marginTop: 15 * METRICS.ratioX,
    height: 'auto',
  },
  container: {
    // flex: 1,
    backgroundColor: COLORS.blackColor,
    height: '100%',
    width: '100%',
  },
  checkWrapper: {
    backgroundColor: COLORS.primaryColor,
    width: 26 * METRICS.ratioX,
    height: 26 * METRICS.ratioX,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50 * METRICS.ratioX,
  },
  checkIcon: {
    color: '#431717',
    fontSize: 17 * METRICS.ratioX,
  },
  buttonWrapper: {
    marginTop: 50 * METRICS.ratioX,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: METRICS.followbuttonwidth,
    height: METRICS.followbuttonheight,
    borderColor: COLORS.primaryColor,
  },
});
