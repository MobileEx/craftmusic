import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import { COLORS, METRICS, STYLES } from '../global';
import Environment from '../helpers/environment';
import ProfileService from '../services/ProfileService';

const avatarImage = require('../assets/images/user.png');

const DisplayUserRow = ({ user, message, onPressUser }) => {
  const [userImage, setuserImage] = useState(avatarImage);

  useEffect(() => {
    // Update the document title using the browser API
    getUserImage();
  }, [user]);

  async function getUserImage() {
    if (typeof user.key === 'string') {
      const res = await ProfileService.getUserInfo(user.key);

      if (res.data.avatar != null) {
        return setuserImage({ uri: res.data.avatar });
      }
      return setuserImage(avatarImage);
    }
    const res = await ProfileService.getUserProfile(user.id);

    if (res.data.avatar != null) {
      return setuserImage({ uri: res.data.avatar });
    }
    return setuserImage(avatarImage);
  }
  return (
    <View style={[STYLES.horizontalAlign]}>
      <TouchableOpacity onPress={onPressUser}>
        <FastImage
          source={
            user.avatar
              ? {
                  uri: user.avatar.search('http')>=0 ? user.avatar : Environment.S3URL + user.avatar,
                }
              : userImage
          }
          style={styles.img}
        />
      </TouchableOpacity>
      <View>
        <Text style={styles.nameLabel}>{user.username}</Text>
        {message && <Text style={styles.content}>{message}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  img: {
    height: METRICS.avatarsmall,
    width: METRICS.avatarsmall,
    borderRadius: 20 * METRICS.ratioX,
  },
  content: {
    marginLeft: METRICS.marginNormal,
    fontSize: METRICS.fontSizeNormal,
    marginTop: METRICS.spacingTiny,
    color: COLORS.nameDM,
  },
  nameLabel: {
    marginLeft: METRICS.marginNormal,
    fontFamily: 'Lato-Semibold',
    fontSize: METRICS.fontSizeNormal,
    color: COLORS.whiteColor,
  },
});

export default DisplayUserRow;
