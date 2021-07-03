import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import { BaseScreen, ScreenHeader, CustomTabBar } from '../components';
import { COLORS, METRICS } from '../global';
import VerifyTabs from './VerifyTabs/RequestsTab';
import SearchVerify from './VerifyTabs/SearchVerifyTab';

export default class VerifyScreen extends BaseScreen {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      routes: [
        {
          key: 'requests',
          title: 'Requests',
        },
        {
          key: 'searchverify',
          title: 'Search',
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
          pageTitle="Verify"
          style={{ marginHorizontal: METRICS.spacingNormal }}
        />
        <TabView
          navigationState={this.state}
          renderTabBar={(props) => <CustomTabBar {...props} />}
          renderScene={SceneMap({
            requests: VerifyTabs,
            searchverify: SearchVerify,
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
