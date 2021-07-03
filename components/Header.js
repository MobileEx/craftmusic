import React, { Component } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { Badge } from 'react-native-elements';
import { connect } from 'react-redux';
import firebase from 'react-native-firebase';
import CustomIcon from './CustomIcon';
import { logo } from '../global/Images';
import { COLORS, METRICS } from '../global';
import ProfileService from '../services/ProfileService';
import {
  getAllChatGroups,
  updateDMCounter,
  updateCraftPlaying,
  setPlayingCrafts,
  updateTitle,
  updateCurCraftId,
  updatePrevState,
  updateOpenComments,
  updateNotificationCount,
  updateIsAdmin,
} from '../store/actions';

import store from '../store/configureStore';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dmcount: 0,
    };
  }

  componentDidMount() {
    this.props.navigation.addListener('didFocus', this.onFocusHeader);
  }

  onFocusHeader = () => {
    this.getDMCount();
    this.getNotificationCount();
  };

  get ref() {
    return firebase.database().ref('groups');
  }

  getDMCount() {
    let dmCount = 0;
    this.props.getAllChatGroups().then((res) => {
      this.props.groups.forEach((group) => {
        const groupId = group.group_details.id;
        const messagesRef = this.ref.child(`${groupId}/messages`);
        messagesRef.once('value', (snapshot) => {
          snapshot.forEach((message) => {
            (async () => {
              const readByRef = message.child('readBy').ref;
              const messageForRef = message.child('messageFor').ref;
              let readByVal = [];
              let messageForVal = [];

              await readByRef.once('value', (rSnapShot) => {
                readByVal = rSnapShot.val();
              });
              await messageForRef.once('value', (mfSnapShot) => {
                messageForVal = mfSnapShot.val();
              });
              if (messageForVal) {
                if (Array.isArray(messageForVal) && messageForVal.includes(this.props.user.id)) {
                  if (readByVal && !readByVal.includes(this.props.user.id)) {
                    dmCount += 1;
                    this.props.updateDMCounter(dmCount);
                  }
                } else if (!Array.isArray(messageForVal)) {
                  if (Object.values(messageForVal).indexOf(this.props.user.id) > -1) {
                    dmCount += 1;
                    this.props.updateDMCounter(dmCount);
                  }
                }
              }
            })();
          });
        });
      });
    });
  }

  getNotificationCount() {
    ProfileService.getUserProfile(this.props.user.id)
      .then((res) => {
        const { notificationcount } = res.data;
        const { setNotificationCount } = this.props;
        setNotificationCount(notificationcount);
        this.props.updateIsAdmin(res.data.is_admin);
      })
      .catch((err) => {
        // console.log(err.response.data.error);
      });
  }

  readNotifications() {
    ProfileService.checkReadNotifications()
      .then((res) => {
        const { setNotificationCount } = this.props;
        setNotificationCount(0);
      })
      .catch((err) => {
        // console.log('readNotifications error', err.response.data.error);
      });
  }

  render() {
    const { props } = this;
    const { notificationcount } = props.user;
    const { dmCount } = props;
    return (
      <SafeAreaView style={styles.header}>
        <View style={styles.headerWrap}>
          <View style={styles.iconWrapLeft}>
            <TouchableOpacity
              onPress={() => {
                this.props.updatePrevState(store.getState());
                this.props.updateTitle('DM');
                props.navigation.navigate('DM');
              }}
            >
              <CustomIcon name="sms" style={[styles.headerIcon, styles.headerIconLeft]} />
              {dmCount >= 1 ? (
                <Badge
                  value={<Text style={styles.badgetext}>{dmCount}</Text>}
                  containerStyle={{
                    position: 'absolute',
                    top: 15 * METRICS.ratioX,
                    left: 15 * METRICS.ratioX,
                  }}
                  badgeStyle={{
                    backgroundColor: COLORS.primaryColor,
                  }}
                />
              ) : null}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.readNotifications();
                this.props.updatePrevState(store.getState());
                this.props.updateTitle('Notifications');
                props.navigation.navigate('Notifications');
              }}
            >
              <CustomIcon style={styles.headerIcon} name="origami-1" />
              {notificationcount >= 1 ? (
                <Badge
                  value={<Text style={styles.badgetext}>{notificationcount}</Text>}
                  containerStyle={{
                    position: 'absolute',
                    top: 15 * METRICS.ratioX,
                    left: 15 * METRICS.ratioX,
                  }}
                  badgeStyle={{
                    backgroundColor: COLORS.primaryColor,
                  }}
                />
              ) : null}
            </TouchableOpacity>
          </View>
          <Image source={logo} style={styles.logo} />
          <View style={styles.iconWrapRight}>
            <TouchableOpacity
              onPress={() => {
                this.props.updatePrevState(store.getState());
                this.props.updateTitle('MyCart');
                props.navigation.navigate('MyCart', { screen: 'HomeScreen' });
              }}
            >
              <CustomIcon style={styles.headerIcon} name="gift-bag" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.props.updatePrevState(store.getState());
                this.props.updateTitle('Settings');
                props.navigation.navigate('Settings');
              }}
            >
              <CustomIcon style={[styles.headerIcon, styles.headerIconRight]} name="settings" />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: COLORS.blackColor,
  },
  headerWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.blackColor,
    paddingBottom: METRICS.spacingSmall,
  },
  logo: {
    height: 50 * METRICS.ratioX,
    width: 42 * METRICS.ratioX,
    marginLeft: METRICS.spacingNormal,
    marginRight: METRICS.spacingNormal,
  },
  iconWrapRight: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    flex: 1,
  },
  iconWrapLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    flex: 1,
  },
  headerIcon: {
    color: COLORS.whiteColor,
    fontSize: METRICS.fontSizeHuge,
  },
  badgetext: {
    color: COLORS.blackColor,
    fontFamily: 'lato',
  },
});

function mapDispatchToProps(dispatch) {
  return {
    setPlayingCrafts: (data) => dispatch(setPlayingCrafts(data)),
    updateTitle: (data) => dispatch(updateTitle(data)),
    updateCurCraftId: (data) => dispatch(updateCurCraftId(data)),
    updatePrevState: (data) => dispatch(updatePrevState(data)),
    updateCraftPlaying: (data) => dispatch(updateCraftPlaying(data)),
    updateOpenComments: (data) => dispatch(updateOpenComments(data)),
    getAllChatGroups: (data) => dispatch(getAllChatGroups(data)),
    updateDMCounter: (data) => dispatch(updateDMCounter(data)),
    setNotificationCount: (data) => dispatch(updateNotificationCount(data)),
    updateIsAdmin: (data) => dispatch(updateIsAdmin(data)),
  };
}

function mapStateToProps(state) {
  return {
    user: state.user,
    groups: state.groups.groups,
    dmCount: state.dmCount,
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
    craftPlaying: state.craftPlaying,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
