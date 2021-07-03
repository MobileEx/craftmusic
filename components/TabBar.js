import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { NavigationActions, StackActions } from 'react-navigation';
import FastImage from 'react-native-fast-image';
import 'react-native-gesture-handler';
import { connect } from 'react-redux';
import CustomIcon from './CustomIcon';
import { user } from '../global/Images';
import { COLORS, METRICS } from '../global';
import ProfileService from '../services/ProfileService';
import SpotifylikePlayer from './SpotifylikePlayer.tsx';
import Environment from '../helpers/environment';
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
  updateIsPlaying,
  updateNotificationCount,
} from '../store/actions';
import store from '../store/configureStore';

class TabBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // current: this.props.backScreen,
      userProfile: Object,
    };
  }

  navigate = (state) => {
    this.setState(
      {
        current: state,
      },
      () => {
        this.props.navigation.navigate(state);
      }
    );
  };

  componentDidMount() {
    this.setState({});
    //console.log('user = ' , this.props.user)
    // if (this.props.user.id == null) {
    //   ProfileService.getUserProfile(this.props.user.id)
    //   .then((res) => {
    //     const userProfile = res.data;
    //     this.setState({
    //       userProfile,
    //     });
    //   })
    //   .catch((err) => {
    //     // console.log(err.response.data.error);
    //   });
    // }
  }

  highlighIcon = (state) => {
    const homeIconStyles = [styles.inActiveIconStyle];

    if (state === this.state.current) {
      homeIconStyles.push(styles.iconStyle);
    }
    return homeIconStyles;
  };

  onProfile = () => {
    this.props.updateProfileUserId(this.props.user.id);
    this.setState({
      current: 'Profile',
    });
    // this.props.updatePrevState(store.getState());
    this.props.updateTitle('Profile');
    this.props.navigation.navigate('Profile', { refresh: true, userId: this.props.user.id });
  };

  onClosePlayer = () => {
    this.setState({ ...this.state });
    this.props.updateIsPlaying(-1);
  };

  readNotifications() {
    if (this.props.title === 'Notifications') {
      ProfileService.checkReadNotifications()
        .then((res) => {
          const { setNotificationCount } = this.props;
          setNotificationCount(0);
        })
        .catch((err) => {
          // console.log('checkReadNotifications error', err.response.data.error);
        });
    }
  }

  render() {
    return (
      <SpotifylikePlayer
        navigation={this.props.navigation}
        onClosePlayer={this.onClosePlayer}
        isPlaying={this.props.isPlaying}
        updateCraftPlaying={this.props.craftPlaying}
      >
        <View style={{ height: 55, width: '100%', backgroundColor: '#000' }}>
          <View style={styles.footer}>
            <TouchableOpacity
              onPress={() => {
                this.readNotifications();
                this.props.updatePrevState(store.getState());
                this.props.updateTitle('Home');
                this.props.updateBackScreen('Home')
                // this.props.updateBackScreen('Home');
                this.navigate('Home');
              }}
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <CustomIcon name="menu-1" size={METRICS.tabbar} style={this.highlighIcon('Home')} />
              <Text style={styles.tab_label}>feed</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                this.props.updatePrevState(store.getState());
                this.props.updateTitle('Search');
                // this.props.updateBackScreen('Search');
                this.navigate('Search');
              }}
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <CustomIcon name="search" size={METRICS.tabbar} style={this.highlighIcon('Search')} />
              <Text style={styles.tab_label}>search</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                this.props.updatePrevState(store.getState());
                this.props.updateTitle('Studio');
                // this.props.updateBackScreen('Studio');
                this.setState(
                  {
                    current: 'Studio',
                  },
                  () => {
                    const resetAction = StackActions.reset({
                      index: 0,
                      key: 'Studio',
                      actions: [
                        NavigationActions.navigate({
                          routeName: 'StudioSplash',
                        }),
                      ],
                    });

                    this.props.navigation.dispatch(resetAction);
                  }
                );
              }}
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <CustomIcon name="add" size={METRICS.tabbar} style={this.highlighIcon('Studio')} />
              <Text style={styles.tab_label}>studio</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                this.props.updatePrevState(store.getState());
                this.props.updateTitle('Spotlight');
                // this.props.updateBackScreen('Spotlight');
                this.navigate('Spotlight');
              }}
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <CustomIcon
                name="crown"
                size={METRICS.tabbar}
                style={this.highlighIcon('Spotlight')}
              />
              <Text style={styles.tab_label}>spotlight</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => this.onProfile()}
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <FastImage
                source={
                  this.props.user.avatar ? { uri : this.props.user.avatar } : user
                }
                style={{
                  width: METRICS.tabavatar,
                  height: METRICS.tabavatar,
                  borderRadius: METRICS.fontSizeHuge,
                  borderWidth: 1,
                  borderColor:
                    this.state.current === 'Profile' ? COLORS.primaryColor : COLORS.blackColor,
                }}
              />
              <Text style={styles.tab_label}>profile</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SpotifylikePlayer>
    );
  }
}

const styles = StyleSheet.create({
  footerWrap: {
    backgroundColor: COLORS.blackColor,
  },
  iconStyle: {
    color: COLORS.primaryColor,
  },
  inActiveIconStyle: {
    color: COLORS.whiteColor,
  },
  footer: {
    backgroundColor: COLORS.blackColor,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 8 * METRICS.ratioX,
  },
  tab_label: {
    color: COLORS.inActive,
    fontSize: METRICS.fontTabBar,
    marginTop: 5 * METRICS.ratioX,
    fontFamily: 'lato',
    paddingBottom: 1 * METRICS.ratioY,
  },
});

function mapDispatchToProps(dispatch) {
  return {
    setPlayingCrafts: (data) => dispatch(setPlayingCrafts(data)),
    updateCurCraftId: (data) => dispatch(updateCurCraftId(data)),
    updatePrevState: (data) => dispatch(updatePrevState(data)),
    updateCraftPlaying: (data) => dispatch(updateCraftPlaying(data)),
    updateMiniPlay: (data) => dispatch(updateMiniPlay(data)),
    updateOpenComments: (data) => dispatch(updateOpenComments(data)),
    updateEditingCraftId: (data) => dispatch(updateEditingCraftId(data)),
    updateProfileUserId: (data) => dispatch(updateProfileUserId(data)),
    updateTitle: (data) => dispatch(updateTitle(data)),
    updateBackScreen: (data) => dispatch(updateBackScreen(data)),
    updateIsPlaying: (data) => dispatch(updateIsPlaying(data)),
    setNotificationCount: (data) => dispatch(updateNotificationCount(data)),
  };
}

function mapStateToProps(state) {
  return {
    user: state.user,
    craftPlaying: state.craftPlaying,
    isPlaying: state.isPlaying,
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

export default connect(mapStateToProps, mapDispatchToProps)(TabBar);
