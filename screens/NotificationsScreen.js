import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import { BaseScreen, ScreenHeader, CustomTabBar } from '../components';
import { COLORS, METRICS } from '../global';
import Notifications from './NotificationScreen/NotificationsTab';

export default class NotificationsScreen extends BaseScreen {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      routes: [
        {
          key: 'notification',
          title: 'Notifications',
        },
        {
          key: 'invite',
          title: 'Invites',
        },
      ],
    };
  }

  static navigationOptions = {
    header: null,
  };

  render() {
    const { navigation } = this.props;
    return (
      <SafeAreaView style={styles.container}>
        <ScreenHeader
          navigation={navigation}
          pageTitle="Notifications"
          style={{ marginHorizontal: 1.5 * METRICS.spacingNormal }}
        />
        <TabView
          navigationState={this.state}
          renderTabBar={(props) => <CustomTabBar {...props} />}
          renderScene={SceneMap({
            notification: Notifications,
            invite: Notifications,
          })}
          onIndexChange={(index) => this.setState({ index })}
          initialLayout={{ width: METRICS.screenWidth }}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.blackColor,
  },
});
