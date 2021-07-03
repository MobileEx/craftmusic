import React from 'react';
import { Text } from 'react-native';
import { TabBar } from 'react-native-tab-view';

import { METRICS, COLORS } from '../global';

const CustomTabBar = (props) => (
  <TabBar
    {...props}
    indicatorStyle={{ backgroundColor: COLORS.primaryColor }}
    style={{
      backgroundColor: 'transparent',
      height: 44 * METRICS.ratioX,
      marginBottom: 15 * METRICS.ratioX,
    }}
    renderLabel={({ route, focused }) => (
      <Text
        style={{
          fontFamily: 'Lato-Bold',
          fontSize: METRICS.fontSizeMedium,
          color: focused ? COLORS.primaryColor : COLORS.inActive,
          marginBottom: METRICS.spacingSmall,
        }}
      >
        {route.title}
      </Text>
    )}
  />
);

export default CustomTabBar;
