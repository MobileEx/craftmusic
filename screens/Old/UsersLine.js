import React, { Component } from 'react';
import { Image, View, StyleSheet, Text } from 'react-native';

const userAvatarWidth = 36;

class UsersLine extends Component {
  render() {
    let userLeftPos = 0;
    const users = [];
    for ([index, user] of this.props.users.entries()) {
      if (index > 0) {
        userLeftPos -= userAvatarWidth - 10;
      }
      users.push(
        <View key={user.key} style={[styles.userAvatarWrap, styles[user.rank]]} left={userLeftPos}>
          <Image style={styles.userAvatar} source={user.img} />
        </View>
      );
    }
    return (
      <View style={styles.usersLine}>
        {users}
        <View left={userLeftPos} style={styles.statContainer}>
          <Text style={styles.textLine}>
            David Jenkins <Text style={styles.grey}>and</Text>
          </Text>
          <View>
            <Text style={styles.labelBg}>2 more</Text>
          </View>
        </View>
      </View>
    );
  }
}

export default UsersLine;

const styles = StyleSheet.create({
  alpha: {
    borderColor: '#EEE809',
  },
  beta: {
    borderColor: '#006FB9',
  },
  statContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 14,
  },
  usersLine: {
    flexDirection: 'row',
    position: 'relative',
    paddingHorizontal: 9,
    paddingVertical: 12.5,
  },
  textLine: {
    flex: 0,
    color: '#fff',
    fontSize: 13.8,
    fontWeight: '500',
  },
  userAvatarWrap: {
    width: userAvatarWidth,
    height: userAvatarWidth,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: 'green',
    justifyContent: 'center',
    left: 0,
    zIndex: 20,
    overflow: 'hidden',
  },
  userAvatar: {
    flex: 1,
  },
  labelBg: {
    marginLeft: 4,
    backgroundColor: '#1F2130',
    justifyContent: 'center',
    borderRadius: 13,
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 4,
    color: '#0B78E3',
    fontSize: 13.8,
    fontWeight: '500',
  },
  ContentTile: {
    backgroundColor: '#151625',
    borderRadius: 13.8,
    overflow: 'hidden',
  },
  grey: {
    color: '#CCC',
  },
});
