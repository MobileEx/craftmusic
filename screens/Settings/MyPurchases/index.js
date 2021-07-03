import React from 'react';
import { View, StyleSheet } from 'react-native';
import { withNavigation } from 'react-navigation';
import { TabView } from 'react-native-tab-view';
import _ from 'lodash';
import { connect, useStore } from 'react-redux';
import { BaseScreen, ScreenHeader, CustomTabBar } from '../../../components';
import { METRICS } from '../../../global';
import Art from './Art';
import Music from './Music';
import PlayingCraftService from '../../../services/PlayingCraftService';
import {
  updateBackScreen,
  updateCraftPlaying,
  setPlayingCrafts,
  updateProfileUserId,
  updateEditingCraftId,
  updateTitle,
  updateCurCraftId,
  updatePrevState,
  updateOpenComments,
  updateMiniPlay,
  updateDeeplinkAlert,
  updateCraftListId,
  updateBackupCraft,
  updateSeekOnBack,
  updateCurrentTime,
  updateFollowId,
  updateStoreState,
  updateIsPlaying, updateAddMusicMethod,
} from '../../../store/actions';
import store from '../../../store/configureStore';

class MyPurchases extends BaseScreen {
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
          key: 'art',
          title: 'Art',
        },
        {
          key: 'music',
          title: 'Music',
        },
      ],
      isFromMusic: this.props.navigation.state.params
        ? this.props.navigation.state.params.isFromMusic
        : false,
      isFromArt: this.props.navigation.state.params
        ? this.props.navigation.state.params.isFromArt
        : false,
    };
  }

  componentDidMount() {
    if (this.state.isFromMusic) {
      this.setState({
        routes: [
          {
            key: 'music',
            title: 'Music',
          },
        ],
      });
    } else if (this.state.isFromArt) {
      this.setState({
        routes: [
          {
            key: 'art',
            title: 'Art',
          },
        ],
      });
    } else {
      this.setState({
        routes: [
          {
            key: 'music',
            title: 'Music',
          },
          {
            key: 'art',
            title: 'Art',
          },
        ],
      });
    }
  }

  onCraft = (id) => {
    PlayingCraftService.getCraft(id)
      .then((res) => {
        this.props.setPlayingCrafts([res.data]);
        this.props.updateCurCraftId(0);
        this.props.updatePrevState(store.getState());
        // this.props.updateTitle('PlayingCraft');
        this.props.updateIsPlaying(true);
        this.props.updateCraftPlaying(true);

        this.props.navigation.navigate('Home');
      })
      .catch((err) => {
        console.log(err.response.data.error);
      });
  };

  FirstRoute = () => {
    return (
      <Art
        onCraft={this.onCraft}
        isAdd={
          this.props.navigation.state.params ? this.props.navigation.state.params.isFromArt : false
        }
        craftId={this.props.navigation.state.params ? this.props.navigation.state.params.craftId : false}
        navigation={this.props.navigation}
        updateAddMusicMethod={(method)=>this.props.updateAddMusicMethod(method)}
      />
    );
  };

  SecondRoute = () => {
    return (
      <Music
        onCraft={this.onCraft}
        isAdd={
          this.props.navigation.state.params
            ? this.props.navigation.state.params.isFromMusic
            : false
        }
        craftId={this.props.navigation.state.params ? this.props.navigation.state.params.craftId : false}
        navigation={this.props.navigation}
        updateAddMusicMethod={(method)=>this.props.updateAddMusicMethod(method)}
      />
    );
  };

  renderScreen() {
    const { navigation } = this.props;

    return (
      <View style={styles.container}>
        <ScreenHeader
          navigation={navigation}
          pageTitle="My Purchases"
          style={{ marginHorizontal: METRICS.spacingNormal }}
        />
        <TabView
          navigationState={this.state}
          renderTabBar={(props) => <CustomTabBar {...props} />}
          renderScene={({ route }) => {
            switch (route.key) {
              case 'art':
                return this.FirstRoute();
              case 'music':
                return this.SecondRoute();
              default:
                return null;
            }
          }}
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

function mapDispatchToProps(dispatch) {
  return {
    setPlayingCrafts: (data) => dispatch(setPlayingCrafts(data)),
    updateCraftPlaying: (data) => dispatch(updateCraftPlaying(data)),
    updatePrevState: (data) => dispatch(updatePrevState(data)),
    updateCurCraftId: (data) => dispatch(updateCurCraftId(data)),
    updateTitle: (data) => dispatch(updateTitle(data)),
    updateCraftListId: (data) => dispatch(updateCraftListId(data)),
    updateProfileUserId: (data) => dispatch(updateProfileUserId(data)),
    updateBackScreen: (data) => dispatch(updateBackScreen(data)),
    updateIsPlaying: (data) => dispatch(updateIsPlaying(data)),
    updateAddMusicMethod: (data) => dispatch(updateAddMusicMethod(data)),
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

export default connect(mapStateToProps, mapDispatchToProps)(withNavigation(MyPurchases));
