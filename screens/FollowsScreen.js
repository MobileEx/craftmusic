import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { TabView } from 'react-native-tab-view';
import { connect } from 'react-redux';
import { COLORS, METRICS } from '../global';
import { BaseScreen, CustomTabBar, ScreenHeader } from '../components';
import FollowersTab from './FollowScreen/FollowersTab';
import FollowingTab from './FollowScreen/FollowingTab';
import {
  updateCraftPlaying,
  setPlayingCrafts,
  updateProfileUserId,
  updateTitle,
  updateCurCraftId,
  updatePrevState,
  updateBackScreen,
} from '../store/actions';
import store from '../store/configureStore';

class FollowsScreen extends BaseScreen {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.init();
  }

  init() {
    this.state = {
      index: 0,
      userId: 1,
      routes: [
        {
          key: 'followers',
          title: 'Followers',
        },
        {
          key: 'following',
          title: 'Following',
        },
      ],
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    const index = navigation.getParam('page');
    const userId = navigation.getParam('userId');
    this.setState({
      index,
      userId: userId || this.props.user.id,
    });
  }

  FirstRoute = () => {
    return <FollowersTab refresh userId={this.state.userId} onUser={this.onUser} />;
  };

  SecondRoute = () => {
    return <FollowingTab refresh userId={this.state.userId} onUser={this.onUser} />;
  };

  onUser = (id) => {
    this.props.updatePrevState(store.getState());
    this.props.updateProfileUserId(id);
    this.props.updateTitle('Profile');
    this.props.updateBackScreen('Follows');
    this.props.navigation.navigate('Profile', { refresh: true });
  };

  render() {
    const { navigation } = this.props;
    return (
      <SafeAreaView style={styles.authContainer}>
        <ScreenHeader
          navigation={navigation}
          pageTitle="Follows"
          style={{ marginHorizontal: 1.5 * METRICS.spacingNormal }}
        />

        <TabView
          navigationState={this.state}
          renderTabBar={(props) => <CustomTabBar {...props} />}
          renderScene={({ route }) => {
            switch (route.key) {
              case 'followers':
                return this.FirstRoute();
              case 'following':
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
    setPlayingCrafts: (crafts) => dispatch(setPlayingCrafts(crafts)),
    updateCraftPlaying: (playing) => dispatch(updateCraftPlaying(playing)),
    updatePrevState: (playing) => dispatch(updatePrevState(playing)),
    updateCurCraftId: (playing) => dispatch(updateCurCraftId(playing)),
    updateTitle: (playing) => dispatch(updateTitle(playing)),
    updateProfileUserId: (playing) => dispatch(updateProfileUserId(playing)),
    updateBackScreen: (playing) => dispatch(updateBackScreen(playing)),
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
