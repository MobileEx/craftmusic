import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import { BaseScreen, ScreenHeader, CustomTabBar } from '../components';
import { COLORS, METRICS } from '../global';
import UserReports from './ReportsTabs/UserReportsTab';
import CraftReports from './ReportsTabs/CraftReportsTab';
import CommentReports from './ReportsTabs/CommentReportsTab';

export default class ReportsScreen extends BaseScreen {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      routes: [
        {
          key: 'userreports',
          title: 'Users',
        },
        {
          key: 'craftreports',
          title: 'Crafts',
        },
        {
          key: 'commentreports',
          title: 'Comments',
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
          pageTitle="Reports"
          style={{ marginHorizontal: METRICS.spacingNormal }}
        />
        <TabView
          navigationState={this.state}
          renderTabBar={(props) => <CustomTabBar {...props} />}
          renderScene={SceneMap({
            userreports: UserReports,
            craftreports: CraftReports,
            commentreports: CommentReports,
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
