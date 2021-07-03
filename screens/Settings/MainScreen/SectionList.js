import React from 'react';
import { Text, Linking, ScrollView, View, FlatList, SafeAreaView, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {
  BaseScreen,
  ScreenHeader,
  SectionHeader,
  CollapseSettings,
  NavListItem,
  CustomSwitch,
} from '../../../components';
import { STYLES, METRICS, COLORS } from '../../../global';
import ProfileService from '../../../services/ProfileService';
import { accountNavListData, shopNavListData } from '../MockData';
import { user } from '../../../global/Images';
import {
  updateBackScreen,
  updateCraftPlaying,
  setPlayingCrafts,
  updateProfileUserId,
  updateTitle,
  updateCurCraftId,
  updatePrevState,
  updateCraftListId,
  createChatGroup,
  getAllChatGroups,
  logout,
} from '../../../store/actions';
import store from '../../../store/configureStore';

class SettingsMainScreen extends BaseScreen {
  navbarHidden = true;

  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      userProfile: Object,
      explicitContent: true,
      allowDm: false,
      allowCollabRequests: false,
      profilePublic: false,
      userId: 1,
      notificationSetting: [
        { notification_type: 0, status: true, fieldName: 'dm' },
        { notification_type: 1, status: true, fieldName: 'comment' },
        { notification_type: 2, status: true, fieldName: 'tag' },
        { notification_type: 3, status: true, fieldName: 'like' },
        {
          notification_type: 4,
          status: true,
          fieldName: 'newFollower',
        },
        { notification_type: 5, status: true, fieldName: 'purchase' },
        {
          notification_type: 6,
          status: true,
          fieldName: 'collaborationRequest',
        },
        {
          notification_type: 7,
          status: true,
          fieldName: 'craftlistInvitation',
        },
      ],
    };
  }

  componentDidMount() {
    ProfileService.getSetting()
      .then((res) => {
        const setting = res.data;
        if (setting) {
          this.setState({
            explicitContent: setting.explicit_content,
            allowDm: setting.allow_dm,
            allowCollabRequests: setting.allow_collab,
            profilePublic: setting.allow_profile,
          });
        }
      })
      .catch((err) => {});

    ProfileService.getPushnotificationSetting()
      .then((res) => {
        const getSettings = res.data;
        const { notificationSetting } = this.state;
        for (let i = 0; i < getSettings.length; i++) {
          for (let j = 0; j < notificationSetting.length; j++) {
            if (getSettings[i].notification_type === notificationSetting[j].notification_type) {
              if (getSettings[i].status === 0) {
                notificationSetting[j].status = false;
              }
              this.setState({ notificationSetting });
            }
          }
        }
      })
      .catch((err) => {
        // console.log('Error getPushnotificationSetting', err.response.data.error);
      });

    ProfileService.getUserProfile(this.props.user.id)
      .then((res) => {
        const userProfile = res.data;
        this.setState({
          userProfile,
        });
      })
      .catch((err) => {
        // console.log(err.response.data.error);
      });
  }

  componentWillUnmount() {
    const { userId, allowDm, allowCollabRequests, profilePublic, explicitContent } = this.state;
    ProfileService.updateSetting({
      // allowDm,
      // allowCollab: allowCollabRequests,
      // allowProfile: profilePublic,
      explicitContent,
    });
  }

  updateExplicitSwitch = (fieldName, value) => {
    this.setState((preState) => {
      const newState = preState;
      newState[fieldName] = value;
      this.setState({ explicitContent: value });
      return newState;
    });
  };

  handleProfilePublic = () => {
    this.setState((prevState) => {
      return { profilePublic: !prevState.profilePublic };
    });
  };

  handleAllowCollabRequest = () => {
    this.setState((prevState) => {
      return { allowCollabRequests: !prevState.allowCollabRequests };
    });
  };

  handleAllowDm = () => {
    this.setState((prevState) => {
      return { allowDm: !prevState.allowDm };
    });
  };

  // End Account//

  logout = () => {
    this.props.logoutApp();
  };

  // Push Notifications
  updateSetting = (fieldName, value) => {
    const { notificationSetting } = this.state;

    let notification_type;
    let status = false;
    switch (fieldName) {
      case 'dm':
        notification_type = 0;
        if (value == true) {
          status = 1;
        } else {
          status = 0;
        }
        break;
      case 'comment':
        notification_type = 1;
        if (value == true) {
          status = 1;
        } else {
          status = 0;
        }
        break;
      case 'tag':
        notification_type = 2;
        if (value == true) {
          status = 1;
        } else {
          status = 0;
        }
        break;
      case 'like':
        notification_type = 3;
        if (value == true) {
          status = 1;
        } else {
          status = 0;
        }
        break;
      case 'newFollower':
        notification_type = 4;
        if (value == true) {
          status = 1;
        } else {
          status = 0;
        }
        break;
      case 'purchase':
        notification_type = 5;
        if (value == true) {
          status = 1;
        } else {
          status = 0;
        }
        break;
      case 'collaborationRequest':
        notification_type = 6;
        if (value == true) {
          status = 1;
        } else {
          status = 0;
        }
        break;
      case 'craftlistInvitation':
        notification_type = 7;
        if (value == true) {
          status = 1;
        } else {
          status = 0;
        }
        break;
    }

    ProfileService.notification_permission(notification_type, status)
      .then((res) => {
        // console.log('notification_permission res........', res)
      })
      .catch((err) => {
        // console.log('notification_permission ERROR.......', err.response.data.error);
      });

    for (let n = 0; n < notificationSetting.length; n++) {
      if (notificationSetting[n].fieldName === fieldName) {
        notificationSetting[n].status = value;
      }
    }
    this.setState({ notificationSetting });

    this.setState((preState) => {
      const newState = preState;
      newState[fieldName] = value;
      return newState;
    });
  };

  onSuperAdmin = () => {
    this.props.updatePrevState(store.getState());
    this.props.updateTitle('AdminScreen');
    this.props.navigation.navigate('AdminScreen');
  };

  onSupport = async () => {
    const SupportId = 1; // Later On Admin // Fix id (Do not give to any other user)
    const SupportName = 'Craft Music';
    const currentUser = this.props.user;
    if (currentUser.id === SupportId) {
      // Will be Remove in Production  %%  Support Should have An Id which will be not given to any user (may be '0')  %%
      alert(`You Don't Need Support As You Are The Support Yourself`);
      return;
    }
    const chatUser = { username: SupportName, id: SupportId, key: SupportId };

    const user_list = [
      {
        member: false,
        username: currentUser.username,
        key: currentUser.id,
      },
      {
        member: false,
        username: chatUser.username,
        key: chatUser.id,
      },
    ];

    const bi_user_list = [
      {
        member: false,
        username: chatUser.username,
        key: chatUser.id,
      },
      {
        member: false,
        username: currentUser.username,
        key: currentUser.id,
      },
    ];

    const newChannel = {
      name: null,
      user_list,
      usersid: user_list.map((u) => u.key),
      bi_ids: bi_user_list.map((user) => user.key),
      image: null,
      isPersonal: true,
    };

    const res = await this.props.createChatGroup(newChannel);
    const modifier = res.group_details ? res : { group_details: { ...res } };
    const channelData = {
      userId: SupportId,
      chatUser: { ...chatUser },
      channel: { data: { ...modifier } },
      chatId: modifier.group_details.id,
      user: {
        ...this.props.user,
      },
      prevScreen: 'Settings',
    };

    this.props.navigation.navigate('Channel', channelData);
  };

  openUrl(url) {
    Linking.openURL(url).catch((err) => console.error('An error occurred', err));
  }

  renderScreen() {
    const { navigation } = this.props;
    const { logout, onSuperAdmin, onSupport } = this;
    const { explicitContent, notificationSetting } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={STYLES.contentWrapper}
          style={{ backgroundColor: 'black' }}
          showsVerticalScrollIndicator={false}
        >
          <ScreenHeader pageTitle="Settings" navigation={navigation} />
          <View>
            <CollapseSettings
              avatar={this.state.userProfile.avatar ? { uri: this.state.userProfile.avatar } : user}
              uppercase
              title=" Account"
            >
              <FlatList
                data={accountNavListData}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <NavListItem title={item.value} navigation={navigation} moveTo={item.moveTo} />
                )}
              />
              <CustomSwitch
                value={explicitContent}
                title="Explicit Content"
                fieldName="explicitContent"
                swipeHandler={this.updateExplicitSwitch}
              />
            </CollapseSettings>

            <CollapseSettings uppercase title="Shop" iconName="gift-bag">
              <FlatList
                data={shopNavListData}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <NavListItem title={item.value} navigation={navigation} moveTo={item.moveTo} />
                )}
              />
            </CollapseSettings>

            <CollapseSettings uppercase title="Push Notifications" iconName="origami-1">
              <CustomSwitch
                value={notificationSetting[0].status}
                title="DM"
                fieldName="dm"
                swipeHandler={this.updateSetting}
              />
              <CustomSwitch
                value={notificationSetting[1].status}
                title="Comment"
                fieldName="comment"
                swipeHandler={this.updateSetting}
              />
              <CustomSwitch
                value={notificationSetting[2].status}
                title="Tag"
                fieldName="tag"
                swipeHandler={this.updateSetting}
              />
              <CustomSwitch
                value={notificationSetting[3].status}
                title="Like"
                fieldName="like"
                swipeHandler={this.updateSetting}
              />
              <CustomSwitch
                value={notificationSetting[4].status}
                title="New follower"
                fieldName="newFollower"
                swipeHandler={this.updateSetting}
              />
              <CustomSwitch
                value={notificationSetting[5].status}
                title="Purchase"
                fieldName="purchase"
                swipeHandler={this.updateSetting}
              />
              <CustomSwitch
                value={notificationSetting[6].status}
                title="Collaboration request"
                fieldName="collaborationRequest"
                swipeHandler={this.updateSetting}
              />
              <CustomSwitch
                value={notificationSetting[7].status}
                title="Craftlist invitation"
                fieldName="craftlistInvitation"
                swipeHandler={this.updateSetting}
              />
            </CollapseSettings>

            <CollapseSettings uppercase title="About" iconName="info">
              <Text
                style={{
                  ...STYLES.mediumText,
                  height: METRICS.rowHeightSmall,
                }}
              >
                Craft Music © 2020
              </Text>
              <NavListItem title="Ranking System" navigation={navigation} />
              <TouchableOpacity>
                <NavListItem
                  title="Terms of Service"
                  pressHandler={() => this.openUrl('https://craftmusicapp.com/terms')}
                />
              </TouchableOpacity>
              <TouchableOpacity>
                <NavListItem
                  title="Privacy Policy"
                  pressHandler={() => this.openUrl('https://craftmusicapp.com/privacy')}
                />
              </TouchableOpacity>
              <TouchableOpacity>
                <NavListItem
                  title="Email Us"
                  pressHandler={() => this.openURL('mailto:info@craftmusicapp.com')}
                />
              </TouchableOpacity>
            </CollapseSettings>
            <SectionHeader
              uppercase
              title="DM Support"
              navigateHandler={onSupport}
              iconName="sms"
            />
            {this.props.isAdmin === true && (
              <SectionHeader uppercase title="Super Admin Access" navigateHandler={onSuperAdmin} />
            )}
            <SectionHeader uppercase title="Log out" navigateHandler={logout} />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    backgroundColor: COLORS.blackColor,
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
    logoutApp: () => dispatch(logout()),
    createChatGroup: (data) => dispatch(createChatGroup(data)),
    getAllChatGroups: (data) => dispatch(getAllChatGroups(data)),
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
    onBackProfile: state.onBackProfile,
    isPlaying: state.isPlaying,
    isAdmin: state.isAdmin,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsMainScreen);
