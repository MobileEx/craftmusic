import React from 'react';
import { StyleSheet, SafeAreaView, View, TouchableHighlight, Dimensions } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import Orientation from 'react-native-orientation-locker';
import firebase from 'react-native-firebase';
import AsyncStorage from '@react-native-community/async-storage';
import { connect } from 'react-redux';
import { HomeItem, CustomIcon } from '../components';
import Header from '../components/Header';
import PlayingCraftService from '../services/PlayingCraftService';
import ProfileService from '../services/ProfileService';
import { METRICS, COLORS } from '../global';
import Environment from '../helpers/environment';
import {
  fetchNotifications,
  updateBackScreen,
  updateCraftPlaying,
  setPlayingCrafts,
  updateTitle,
  updateCurCraftId,
  updatePrevState,
  updateIsPlaying,
  updateNotificationCount,
  updateIsCraftInit,
} from '../store/actions';
import store from '../store/configureStore';

class HomeScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    header: null,
  });

  constructor(props) {
    super(props);
    this.state = {
      crafts: [],
      device_token: '',
    };
  }

  componentDidMount() {
    Orientation.lockToPortrait();
    this._isMounted = true;
    this.props.navigation.addListener('didFocus', this.onScreenFocus);
    this.checkPermission();
    this.createNotificationListeners();
  }

  isPortrait = () => {
    const dim = Dimensions.get('screen');
    return dim.height >= dim.width;
  };

  onScreenFocus = () => {
    if (this._isMounted) this.getData();
  };

  componentWillUnmount() {
    this._isMounted = false;
    this.notificationListener();
    this.notificationOpenedListener();
  }

  getData = async () => {
    // console.log('HomeScreen = ' , this.props.user)
    if (this.props.user.id == null || this.props.user.id == '') {
      const user = JSON.parse(await AsyncStorage.getItem('user_info'));
      PlayingCraftService.getUserCraft(user.id)
        .then((res) => {
          this.setState({
            crafts: res.data.all,
          });
        })
        .catch((err) => {
          // console.log('getUserCraft Error', err.response.data.error);
        });
    } else {
      PlayingCraftService.getUserCraft(this.props.user.id)
        .then((res) => {
          this.setState({
            crafts: res.data.all,
          });
        })
        .catch((err) => {
          // console.log('getUserCraft Error', err.response.data.error);
        });
    }
  };

  onPressCraft = (index) => {
    const { navigation } = this.props;
    this.props.updatePrevState(store.getState());
    this.props.updateCurCraftId(index);
    this.props.setPlayingCrafts(this.state.crafts);
    this.props.updateIsPlaying(true);
    this.props.updateCraftPlaying(true);
    this.props.isCraftInit(-1);
    this.props.updateTitle('PlayingCraft');
    this.props.updateBackScreen('Home');
  };

  showUsertypeIcon(types, verified) {
    return (
      <>
        {types.map((item, index) => {
          return (
            <View key={index}>
              {item.id === 1 && (
                <CustomIcon name="brush" size={METRICS.fontSizeSmall} style={styles.iconStyle} />
              )}
              {item.id === 2 && (
                <CustomIcon name="music" size={METRICS.fontSizeSmall} style={styles.iconStyle} />
              )}
              {item.id === 3 && (
                <CustomIcon name="briefcase" size={METRICS.fontSmall} style={styles.iconStyle} />
              )}
              {item.id === 4 && (
                <CustomIcon name="heart" size={METRICS.fontSizeSmall} style={styles.iconStyle} />
              )}
            </View>
          );
        })}
        {verified && (
          <CustomIcon
            name="mark-as-favorite-star"
            size={METRICS.fontSizeOK}
            style={[styles.iconStyle, { color: COLORS.starColor }]}
          />
        )}
      </>
    );
  }

  // 1
  async checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      this.getToken();
    } else {
      this.requestPermission();
    }
  }

  // 2
  async requestPermission() {
    try {
      await firebase.messaging().requestPermission();
      // User has authorised
      this.getToken();
    } catch (error) {
      // User has rejected permissions
    }
  }

  // 3
  async getToken() {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken();
      if (fcmToken) {
        // user has a device token
        await AsyncStorage.setItem('fcmToken', fcmToken);
      }
    }
    this.setState({ device_token: fcmToken });
    this.update_device_token();
  }

  update_device_token() {
    const { device_token } = this.state;
    PlayingCraftService.updateDeviceToken(device_token)
      .then((res) => {})
      .catch((err) => {});
  }

  async createNotificationListeners() {
    this.notificationListener = firebase.notifications().onNotification((notification) => {
      setTimeout(() => {
        this.props.fetchNotifications();
      }, 2500);

      const localNotification = new firebase.notifications.Notification()
        .setNotificationId(notification.notificationId)
        .setTitle(notification.title)
        .setSubtitle(notification.subtitle)
        .setBody(notification.body)
        .setData(notification.data);

      firebase
        .notifications()
        .displayNotification(localNotification)
        .catch((err) => console.error('Firebase Error', err));
    });

    this.notificationOpenedListener = firebase
      .notifications()
      .onNotificationOpened((notificationOpen) => {
        this.props.fetchNotifications();
        this.readNotifications();
        this.props.navigation.push('Notifications');
      });

    const notificationOpen = await firebase.notifications().getInitialNotification();
    if (notificationOpen) {
      this.props.navigation.fetchNotifications();
      this.readNotifications();
      this.props.navigation.push('Notifications');
    }

    this.messageListener = firebase.messaging().onMessage((message) => {
      console.log(JSON.stringify(message));
    });
  }

  readNotifications() {
    ProfileService.checkReadNotifications()
      .then((res) => {
        const { setNotificationCount } = this.props;
        setNotificationCount(0);
      })
      .catch((err) => {
        // console.log('Read Notification Error', err.response.data.error);
      });
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Header navigation={this.props.navigation} />
        <View style={{ backgroundColor: COLORS.blackColor }}>
          <FlatList
            style={{ backgroundColor: COLORS.blackColor }}
            showsVerticalScrollIndicator={false}
            data={this.state.crafts}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{ paddingBottom: 60 }}
            renderItem={({ item, index }) => (
              <TouchableHighlight onPress={() => this.onPressCraft(index)}>
                <HomeItem
                  image={
                    item.thumbnail_url
                      ? item.thumbnail_url.search('http') >= 0
                        ? item.thumbnail_url
                        : Environment.S3URL + item.photo_url
                      : null
                  }
                  title={item.title}
                  count={0}
                  like={item.likes.length}
                  play={item.views}
                  comment={item.comments.length}
                  type={item.craft_type_id}
                  owner={item.craft_owner}
                  showUsertypeIcon={this.showUsertypeIcon}
                  explicit={item.explicit}
                />
              </TouchableHighlight>
            )}
          />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  flashStyle: {
    fontFamily: 'lato',
    fontSize: METRICS.fontSizeNormal,
  },
  container: {
    flex: 1,
    height: '100%',
    backgroundColor: COLORS.blackColor,
  },
  iconStyle: {
    color: COLORS.nameDM,
    paddingRight: METRICS.marginTiny,
    flexDirection: 'row',
  },
});

function mapDispatchToProps(dispatch) {
  return {
    setPlayingCrafts: (data) => dispatch(setPlayingCrafts(data)),
    fetchNotifications: () => dispatch(fetchNotifications()),
    updateCraftPlaying: (data) => dispatch(updateCraftPlaying(data)),
    updatePrevState: (data) => dispatch(updatePrevState(data)),
    updateCurCraftId: (data) => dispatch(updateCurCraftId(data)),
    updateTitle: (data) => dispatch(updateTitle(data)),
    updateBackScreen: (data) => dispatch(updateBackScreen(data)),
    updateIsPlaying: (data) => dispatch(updateIsPlaying(data)),
    setNotificationCount: (data) => dispatch(updateNotificationCount(data)),
    // made by dongdong
    isCraftInit: (data) => dispatch(updateIsCraftInit(data)),
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
    craftlistId: state.craftlistId,
    backupCraft: state.backupCraft,
    seekOnBack: state.seekOnBack,
    currentTime: state.currentTime,
    followId: state.followId,
    storeState: state.storeState,
    addMusicMethod: state.addMusicMethod,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
