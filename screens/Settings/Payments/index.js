import React from 'react';
import { View, StyleSheet } from 'react-native';
import { withNavigation } from 'react-navigation';
import { TabView, SceneMap } from 'react-native-tab-view';
import { BaseScreen, ScreenHeader, CustomTabBar } from '../../../components';
import { METRICS } from '../../../global';
import Purchases from './Purchases';
import Sales from './Sales';

class Payments extends BaseScreen {
  navbarHidden = true;

  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      routes: [
        {
          key: 'purchases',
          title: 'Payment Method',
        },
        {
          key: 'sales',
          title: 'History',
        },
      ],
    };
  }

  renderScreen() {
    const { navigation } = this.props;

    return (
      <View style={styles.container}>
        <ScreenHeader
          navigation={navigation}
          pageTitle="Payments"
          style={{ marginHorizontal: METRICS.spacingNormal }}
        />
        <TabView
          navigationState={this.state}
          renderTabBar={(props) => <CustomTabBar {...props} />}
          renderScene={SceneMap({
            purchases: Purchases,
            sales: Sales,
          })}
          onIndexChange={(index) => this.setState({ index })}
          initialLayout={{ width: METRICS.screenWidth }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default withNavigation(Payments);
