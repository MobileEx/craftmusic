import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { TabView } from 'react-native-tab-view';
import { connect } from 'react-redux';
import { COLORS, METRICS } from '../global';
import { BaseScreen, CustomTabBar, ScreenHeader } from '../components';
import FollowersTab from './CraftlistFollowScreen/FollowersTab';
import ContributorsTab from './CraftlistFollowScreen/ContributorsTab';
import { updateProfileUserId } from '../store/actions';

class FollowsScreen extends BaseScreen {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      index: 0,
      craftlistId: 1,
      routes: [
        {
          key: 'followers',
          title: 'Followers',
        },
        {
          key: 'contributors',
          title: 'Contributors',
        },
      ],
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.setState({
      index: navigation.getParam('page'),
      craftlistId: navigation.getParam('craftlistId'),
    });
  }

  FirstRoute = () => {
    return <FollowersTab refresh craftlistId={this.state.craftlistId} onUser={this.onUser} />;
  };

  SecondRoute = () => {
    return <ContributorsTab refresh craftlistId={this.state.craftlistId} onUser={this.onUser} />;
  };

  onUser = (id) => {
    this.props.updateProfileUserId(id);
    this.props.navigation.push('Profile', { refresh: true });
  };

  render() {
    const { navigation } = this.props;
    return (
      <SafeAreaView style={styles.authContainer}>
        <ScreenHeader
          navigation={navigation}
          pageTitle="Craftlist"
          style={{ marginHorizontal: 1.5 * METRICS.spacingNormal }}
        />

        <TabView
          navigationState={this.state}
          renderTabBar={(props) => <CustomTabBar {...props} />}
          renderScene={({ route }) => {
            switch (route.key) {
              case 'followers':
                return this.FirstRoute();
              case 'contributors':
                return this.SecondRoute();
              default:
                return null;
            }
          }}
          onIndexChange={(index) => this.setState({ index })}
          initialLayout={{ width: METRICS.screenWidth }}
        />
      </SafeAreaView>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    updateProfileUserId: (data) => dispatch(updateProfileUserId(data)),
  };
}

function mapStateToProps(state) {
  return {
    user: state.user,
    craftPlaying: state.craftPlaying,
    prevState: state.prevState,
    playingCrafts: state.playingCrafts,
    profileUserId: state.profileUserId,
    backScreen: state.backScreen,
    editingCraftId: state.editingCraftId,
    title: state.title,
    curCraftId: state.curCraftId,
    openComments: state.openComments,
    miniPlay: state.miniPlay,
    deepAlert: state.deepAlert,
    craftlistId: state.craftlistId,
    backupCraft: state.backupCraft,
    seekOnBack: state.seekOnBack,
    currentTime: state.currentTime,
    followId: state.followId,
    storeState: state.storeState,
    addMusicMethod: state.addMusicMethod,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(FollowsScreen);

const styles = StyleSheet.create({
  authContainer: {
    flex: 1,
    backgroundColor: COLORS.blackColor,
  },
});
