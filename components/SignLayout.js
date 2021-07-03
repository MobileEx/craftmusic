import React from 'react';
import { SafeAreaView, View, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import { logoRemake, signinBg } from '../global/Images';
import { COLORS, METRICS } from '../global';

export default ({ children }) => {
  return (
    <FastImage source={signinBg} style={styles.wrapper} resizeMode="contain">
      <SafeAreaView>
        <View style={styles.container}>
          <View style={styles.logoWrapper}>
            <FastImage source={logoRemake} style={styles.logo} resizeMode="contain" />
          </View>
          {children}
        </View>
      </SafeAreaView>
    </FastImage>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: METRICS.screenWidth,
    height: METRICS.screenHeight,
    backgroundColor: COLORS.blackColor,
  },
  container: {
    flexDirection: 'column',
    height: '100%',
    alignItems: 'center',
  },
  logoWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: METRICS.spacingHuge,
  },
  logo: {
    width: 165 * METRICS.ratioX,
    height: 85 * METRICS.ratioX,
  },
});
