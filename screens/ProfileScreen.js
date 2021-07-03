import React from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Linking, Share } from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import _ from 'lodash';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import { connect } from 'react-redux';
import Env from '../helpers/environment';
import {
  MoreModal,
  CustomIcon,
  AboutModal,
  TipModal,
  PayModal,
  ReportModal,
  MyMoreModal,
} from '../components';
import Button from '../components/Button';
import { COLORS, METRICS, STYLES } from '../global';
import ProfileService from '../services/ProfileService';
import PaymentService from '../services/PaymentService';
import PlayingCraftService from '../services/PlayingCraftService';
import { craft, craftlistBg, user } from '../global/Images';
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
  updateIsPlaying,
  createChatGroup,
  getAllChatGroups,
  updateOnBackProfile,
} from '../store/actions';
import store from '../store/configureStore';
import CraftStateService from '../services/CraftStateService';

const radio_props = [
  { label: '  Miscategorized Content', value: 0 },
  { label: '  Inappropriate Content', value: 1 },
  { label: '  Abuse/Harassment', value: 2 },
  { label: '  Intellectual Property/Copyright Infringement', value: 3 },
];

class ProfileScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    const { params = {} } = this.props.navigation.state;
    const userId = params.userid || this.props.profileUserId;
    this.state = {
      aboutModalVisible: false,
      moreModalVisible: false,
      tipModalVisible: false,
      payModalVisible: false,
      reportModalVisible: false,
      userProfile: '',
      paypalUrl: String,
      followStatus: false,
      userId,
      followers: 0,
      followings: 0,
      reportOptionSelected: 0,
      blockStatus: false,
      crafts: [],
      craftlists: [],
      store: [],
      price: 0,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    // console.log('getDerivedStateFromProps');
    if (prevState.userId !== nextProps.profileUserId) {
      return {
        userId: nextProps.profileUserId,
      };
    }
    return null;
  }

  componentDidMount() {
    this.props.updateBackScreen('Profile'); // made by dongdong
    // console.log('profile didmount');
    const { navigation } = this.props;
    // Adding an event listner on focus
    // So whenever the screen will have focus it will set the state to zero
    this.focusListener = navigation.addListener('didFocus', () => {
      // console.log('didFocus');
      this.getProfileData();
      this.setState({ count: 0 });
      const backScreen = this.props.navigation.dangerouslyGetParent().getParam('back_screen');
      this.backAction = backScreen
        ? () => {
            navigation.navigate(backScreen);
          }
        : null;
    });
  }

  componentWillUnmount() {
    // console.warn('unmount');
    // Remove the event listener before removing the screen from the stack
    this.focusListener.remove();
  }

  componentDidUpdate(prevProps, prevState) {
    // console.log('update = ')
    if (prevState.userId !== this.state.userId) {
      this.getProfileData();
    }
    if (prevProps.isFocused !== this.props.isFocused) {
      // Use the `this.props.isFocused` boolean
      // Call any action
      this.getProfileData();
    }
  }

  renderScrollItem(item, index, type) {
    return (
      <View
        key={index}
        style={[
          {
            marginHorizontal: 9 * METRICS.ratioX,
            alignItems: 'center',
            justifyContent: 'center',
          },
        ]}
      >
        {type === 'craft' ? (
          <TouchableOpacity onPress={() => this.onCraft(item.id)}>
            <FastImage
              source={
                item.thumbnail_url
                  ? {
                      uri:
                        item.thumbnail_url.search('http') >= 0
                          ? item.thumbnail_url
                          : Env.S3URL + item.thumbnail_url,
                    }
                  : craft
              }
              style={{
                width: METRICS.smallcrafts,
                height: METRICS.smallcrafts,
                borderRadius: METRICS.craftborder,
              }}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => this.onCraftlist(item.id)}>
            <FastImage
              source={item.image ? { uri: item.image } : craftlistBg}
              style={{
                width: METRICS.smallcrafts,
                height: METRICS.smallcrafts,
                borderRadius: METRICS.craftborder,
              }}
            />
          </TouchableOpacity>
        )}
      </View>
    );
  }

  getProfileData = () => {
    ProfileService.getContributedCraftlist(this.state.userId, 8)
      .then((res) => {
        this.setState({
          craftlists: res.data,
        });
      })
      .catch((err) => {
        // console.log(err.response.data.error);
      });
    PlayingCraftService.getUserCraft(this.state.userId, 8)
      .then((res) => {
        this.setState({
          crafts: res.data.crafts,
          store: res.data.store,
        });
      })
      .catch((err) => {
        // console.log(err.response.data.error);
      });
    ProfileService.getFollow(this.state.userId)
      .then((res) => {
        const { followers } = res.data;
        let followStatus = false;
        for (let i = 0; i < followers.length; i++) {
          if (followers[i].id === this.props.user.id) {
            followStatus = true;
            break;
          }
        }
        this.setState({ followStatus });
      })
      .catch((err) => {
        // console.log(err.response.data.error);
      });
    ProfileService.getUserProfile(this.state.userId)
      .then((res) => {
        const userProfile = res.data;
        this.setState({
          userProfile,
          followers: userProfile.followers,
          followings: userProfile.followings,
          blockStatus: userProfile.isblock,
        });
      })
      .catch((err) => {
        // console.log('error = ' , err.response.data.error)
        // showMessage({
        // message: 'User does not exist.',
        // type: 'default',
        // });
        this.props.updateProfileUserId(this.props.user.id);
        this.setState({ userId: this.props.user.id });
        // console.log(err.response.data.error);
      });
  };

  actionNavigation = async (screens, index = 0) => {
    this.props.updatePrevState(store.getState());
    this.props.updateTitle(screens);
    this.props.updateBackScreen('Profile');
    if (!this.state.userId) {
      this.state.userId = this.props.followId;
    }
    this.props.updateFollowId(this.state.userId);
    if (screens === 'DM') {
      if (this.state.userId === this.props.user.id) {
        this.props.navigation.navigate(screens, {
          page: index,
          userId: this.state.userId,
        });
      } else {
        const currentUser = this.props.user;
        const chatUser = this.state.userProfile;

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
          usersid: user_list.map((user) => user.key),
          bi_ids: bi_user_list.map((user) => user.key),
          image: null,
          isPersonal: true,
        };
        const res = await this.props.createChatGroup(newChannel);

        const modifier = res.group_details ? res : { group_details: { ...res } };

        const channelData = {
          page: index,
          userId: this.state.userId,
          chatUser: { ...this.state.userProfile },
          channel: { data: { ...modifier } },
          chatId: modifier.group_details.id,
          user: {
            ...this.props.user,
          },
        };

        this.props.navigation.navigate('Channel', channelData);
      }
    } else {
      this.props.navigation.navigate(screens, {
        page: index,
        userId: this.state.userId,
      });
    }
  };

  showMore = () => {
    this.setState({ moreModalVisible: true });
  };

  moreModalDidClose = () => {
    this.setState({
      moreModalVisible: false,
    });
  };

  showAbout = () => {
    this.setState({ aboutModalVisible: true });
  };

  setAboutModalVisible = (visible) => {
    this.setState({ aboutModalVisible: visible });
  };

  aboutModalDidClose = () => {
    this.setState({
      aboutModalVisible: false,
    });
  };

  showTip = () => {
    this.setState({ tipModalVisible: true });
  };

  setTipModalVisible = (visible) => {
    this.setState({ tipModalVisible: visible });
  };

  tipModalDidClose = () => {
    this.setState({
      tipModalVisible: false,
    });
  };

  setPayModalVisible = (visible) => {
    this.setState({ payModalVisible: visible });
  };

  setReportModalVisible = (visible) => {
    this.setState({ reportModalVisible: visible });
  };

  payModalClose = () => {
    this.setState({
      payModalVisible: false,
    });
  };

  closeReportModal = () => {
    this.setState({
      reportModalVisible: false,
    });
  };

  onNavigationStateChange = (navState) => {
    // console.log('navigate url: ', navState.url);
    if (navState.url.indexOf('https://www.sandbox.paypal') !== 0) {
      this.payModalClose();
      if (navState.url.indexOf(`${Env.APIURL}/doCheckout`) === 0) {
        PaymentService.addTransactionHistory(
          this.props.user.id,
          this.state.userId,
          'Tip',
          this.state.price
        )
          .then((res) => {
            // console.log("success")
          })
          .catch((err) => {
            // console.log(err.response.data.error);
          });
      }
    }
  };

  sendTip = (price) => {
    if (!price) {
      showMessage({
        message: 'Please input amount.',
        type: 'default',
      });
      return;
    }
    this.setState({ price });
    // console.warn(this.state.userId);
    PaymentService.getPaymentAccount(this.state.userId)
      .then((res) => {
        // console.log("res = ", res.data);
        if (res.data.seller === '') {
          showMessage({
            message: `${this.state.userProfile.username} has not entered their PayPal seller account info.`,
            type: 'default',
          });
          return;
        }
        PaymentService.sendMoney(this.props.user.id, this.state.userId, parseFloat(price), 'tip')
          .then(
            function (response) {
              this.setState({
                tipModalVisible: false,
                payModalVisible: true,
                paypalUrl: response.data,
              });
            }.bind(this)
          )
          .catch(function (err) {
            if (err.response.status === 422) {
              alert(err.response.data.error);
            }
            // console.log(err.response.data.error);
          });
      })
      .catch(function (err) {
        alert(err.response.data.err);
      });
  };

  reportActionSelected = (index) => {
    this.setState({
      reportOptionSelected: index,
    });
    // console.log(index);
  };

  // add user profile link
  onShare = async () => {
    Share.share(
      {
        url: `craftmusicapp://profile/${this.props.profileUserId}`,
      },
      {
        excludedActivityTypes: [
          'com.apple.UIKit.activity.PostToWeibo',
          'com.apple.UIKit.activity.Print',
          'com.apple.UIKit.activity.AssignToContact',
          'com.apple.UIKit.activity.SaveToCameraRoll',
          'com.apple.UIKit.activity.AddToReadingList',
          'com.apple.UIKit.activity.PostToFlickr',
          'com.apple.UIKit.activity.PostToVimeo',
          'com.apple.UIKit.activity.PostToTencentWeibo',
          'com.apple.UIKit.activity.AirDrop',
          'com.apple.UIKit.activity.OpenInIBooks',
          'com.apple.UIKit.activity.MarkupAsPDF',
          'com.apple.reminders.RemindersEditorExtension',
          'com.apple.mobilenotes.SharingExtension',
          'com.apple.mobileslideshow.StreamShareService',
          'com.linkedin.LinkedIn.ShareExtension',
          'pinterest.ShareExtension',
          'com.google.GooglePlus.ShareExtension',
          'com.tumblr.tumblr.Share-With-Tumblr',
        ],
      }
    );
  };

  onSubmitReport = () => {
    ProfileService.reportUser(
      radio_props[this.state.reportOptionSelected].label,
      this.state.userId
    );
    this.closeReportModal();
  };

  onBlock = () => {
    this.setState({ blockStatus: !this.state.blockStatus });
    if (this.state.blockStatus) {
      ProfileService.unBlockUser(this.state.userId)
        .then((res) => {
          // console.log(res.data);
        })
        .catch((err) => console.log(err.response.data.error));
    } else {
      ProfileService.blockUser(this.state.userId)
        .then((res) => {
          // console.log(res.data);
        })
        .catch((err) => console.log(err.response.data.error));
    }
  };

  onReport = () => {
    this.setState({
      reportModalVisible: true,
    });
  };

  follow = () => {
    const { userId } = this.state;
    if (this.state.followStatus) {
      ProfileService.unFollow(userId)
        .then((res) => {
          this.updateFollowNumbers();
        })
        .catch((err) => console.log(err.response.data.error));
    } else {
      ProfileService.follow(userId)
        .then((res) => {
          this.updateFollowNumbers();
        })
        .catch((err) => console.log(err.response.data.error));
    }
  };

  updateFollowNumbers = () => {
    ProfileService.getFollowNumbers(this.state.userId)
      .then((res) => {
        this.setState({
          followStatus: !this.state.followStatus,
          followers: res.data.followers,
          followings: res.data.followings,
        });
      })
      .catch((err) => {
        // console.log(err.response.data.error);
      });
  };

  onWebsiteLink = (url) => {
    Linking.canOpenURL(url)
      .then((supported) => {
        if (!supported) {
        } else {
          return Linking.openURL(url);
        }
      })
      .catch((err) => console.log(err.response.data.error));
  };

  onCraft = (id) => {
    PlayingCraftService.getCraft(id)
      .then((res) => {
        this.props.updateCurCraftId(0);
        this.props.setPlayingCrafts([res.data]);
        this.props.updatePrevState(store.getState());
        this.props.updateIsPlaying(true);
        this.props.updateCraftPlaying(true);
      })
      .catch((err) => {
        // console.log(err.response.data.error);
      });
  };

  onCraftlist = (id) => {
    this.props.updateCraftListId(id);
    this.props.updatePrevState(store.getState());
    this.props.updateTitle('Craftlist');
    this.props.updateBackScreen('Profile');
    this.props.navigation.navigate('Craftlist');
  };

  onEditProfile = () => {
    this.props.updatePrevState(store.getState());
    this.props.updateTitle('EditProfile');
    this.props.updateBackScreen('Profile');
    this.props.navigation.navigate('EditProfile');
  };

  showUsertypeIcon(types, verified) {
    return (
      <>
        {types.map((item, index) => {
          return (
            <View key={index}>
              {item.id === 1 && (
                <CustomIcon name="brush" size={METRICS.fontSizeBigger} style={styles.iconStyle} />
              )}
              {item.id === 2 && (
                <CustomIcon name="music" size={METRICS.fontSizeBigger} style={styles.iconStyle} />
              )}
              {item.id === 3 && (
                <CustomIcon
                  name="briefcase"
                  size={METRICS.fontSizeBigger}
                  style={styles.iconStyle}
                />
              )}
              {item.id === 4 && (
                <CustomIcon name="heart" size={METRICS.fontSizeBigger} style={styles.iconStyle} />
              )}
            </View>
          );
        })}
        {verified && (
          <CustomIcon
            name="mark-as-favorite-star"
            size={METRICS.fontSizeBigger}
            style={[styles.iconStyle, { color: COLORS.starColor }]}
          />
        )}
      </>
    );
  }

  render() {
    const {
      aboutModalVisible,
      userProfile,
      moreModalVisible,
      tipModalVisible,
      payModalVisible,
      followStatus,
      reportModalVisible,
      reportOptionSelected,
    } = this.state;

    const crafts = this.state.crafts.map((item, index) => {
      return this.renderScrollItem(item, index, 'craft');
    });

    const craftLists = this.state.craftlists.map((item, index) => {
      return this.renderScrollItem(item, index, 'craftlist');
    });

    const storeList = this.state.store.map((item, index) => {
      return this.renderScrollItem(item, index, 'craft');
    });

    /*
    this.state.userId !== this.props.user.id &&
    this.props.backScreen &&
    this.props.prevState.title && (
    */

    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.wrapper} showsVerticalScrollIndicator={false}>
          <FastImage
            source={userProfile.avatar ? { uri: userProfile.avatar } : user}
            resizeMode="cover"
            style={styles.background}
          >
            <LinearGradient
              colors={['transparent', 'transparent', 'black']}
              style={styles.linearGradient}
            />
            {userProfile.usertype && (
              <View style={styles.topProfile}>
                {this.showUsertypeIcon(userProfile.usertype, userProfile.verified)}
              </View>
            )}

            <Text numberOfLines={1} adjustsFontSizeToFit style={styles.name}>
              {this.state.userProfile.username}
            </Text>
            {this.state.userId !== this.props.user.id &&
              this.props.backScreen &&
              this.props.prevState.title && (
                <TouchableOpacity
                  style={styles.backbutton}
                  onPress={() => {
                    const previous = _.clone(this.props.prevState);
                    previous.crafts = this.props.crafts;
                    previous.curCraftId = this.props.curCraftId;
                    previous.isPlaying = this.props.isPlaying;
                    previous.play = this.props.play;
                    CraftStateService.updateCraftState(previous);
                    if (typeof this.props.onBackProfile === 'function') {
                      this.props.onBackProfile();
                      this.props.updateOnBackProfile(null);
                    }
                    this.props.navigation.navigate(previous.title);
                  }}
                >
                  <CustomIcon
                    name="back"
                    style={styles.showmoreIcon}
                    size={METRICS.fontSizeBigger}
                  />
                </TouchableOpacity>
              )}

            <TouchableOpacity onPress={() => this.showMore()} style={styles.showmore}>
              <CustomIcon
                name="three-dots-more-indicator"
                size={METRICS.fontSizeBigger}
                style={styles.showmoreIcon}
              />
            </TouchableOpacity>
            {/* More Options */}
            {moreModalVisible &&
              (this.props.profileUserId === this.props.user.id ? (
                <MyMoreModal
                  onClose={this.moreModalDidClose}
                  onShow={this.showAbout}
                  onShare={this.onShare}
                  onBlock={this.onBlock}
                  onReport={this.onReport}
                  blockStatus={this.state.blockStatus}
                />
              ) : (
                <MoreModal
                  onClose={this.moreModalDidClose}
                  onShow={this.showAbout}
                  onShare={this.onShare}
                  onBlock={this.onBlock}
                  onReport={this.onReport}
                  blockStatus={this.state.blockStatus}
                />
              ))}
          </FastImage>

          <View style={styles.followWrapper}>
            <View style={{ marginTop: METRICS.marginNormal }}>
              {this.props.user.id === this.props.profileUserId ? (
                <TouchableOpacity onPress={this.onEditProfile}>
                  <Button
                    style={styles.followButton}
                    title="Edit Profile"
                    fontSize={METRICS.fontSizeNormal}
                    status={false}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={this.follow}>
                  <Button
                    style={styles.followButton}
                    title={followStatus ? 'Following' : 'Follow'}
                    fontSize={METRICS.fontSizeNormal}
                    status={followStatus ? 3 : 1}
                  />
                </TouchableOpacity>
              )}
            </View>

            <View style={[STYLES.horizontalAlign, styles.tipWrapper]}>
              <TouchableOpacity onPress={() => this.showTip()} style={styles.tipButton}>
                <CustomIcon name="rich" size={METRICS.fontSizeBigger} style={styles.iconStyle} />
                <Text style={styles.tipText}>TIP</Text>
              </TouchableOpacity>

              <View style={styles.followersWrapper}>
                <TouchableOpacity onPress={() => this.actionNavigation('Follows', 0)}>
                  <View style={{ alignItems: 'center' }}>
                    <Text style={styles.followerText}>Followers</Text>
                    <Text style={styles.followerCountText}>{this.state.followers}</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.actionNavigation('Follows', 1)}>
                  <View style={styles.followingWrapper}>
                    <Text style={styles.followerText}>Following</Text>
                    <Text style={styles.followerCountText}>{this.state.followings}</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={() => this.actionNavigation('DM')}>
                <View style={styles.dmWrapper}>
                  <CustomIcon
                    name="comment-2"
                    size={METRICS.fontSizeBigger}
                    style={styles.iconStyle}
                  />
                  <Text style={styles.dmText}>DM</Text>
                </View>
              </TouchableOpacity>
            </View>
            {this.state.store.length > 0 && (
              <>
                <TouchableOpacity
                  onPress={() => {
                    this.props.updatePrevState(store.getState());
                    this.props.updateTitle('StoreMain');
                    this.props.updateBackScreen('Profile');
                    this.props.navigation.navigate('StoreMain', {
                      userId: this.state.userId,
                    });
                  }}
                  style={styles.craftsWrapper}
                >
                  <Text style={styles.storeText}>STORE</Text>
                  <Text style={styles.seeall}>See all</Text>
                </TouchableOpacity>
                <View style={styles.scroll}>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {storeList}
                  </ScrollView>
                </View>
              </>
            )}
            {this.state.crafts.length > 0 && (
              <>
                <TouchableOpacity
                  style={styles.craftListWrapper}
                  onPress={() => {
                    this.props.updatePrevState(store.getState());
                    this.props.updateTitle('SeeAllCrafts');
                    this.props.updateBackScreen('Profile');
                    this.props.navigation.navigate('SeeAllCrafts', {
                      userId: this.state.userId,
                    });
                  }}
                >
                  <Text style={styles.craftsText}>CRAFTS</Text>

                  <Text style={styles.seeall}>See all</Text>

                  <TouchableOpacity>
                    <CustomIcon
                      name="ionicons_svg_ios-shuffle"
                      size={METRICS.fontSizeHuge}
                      style={styles.shuffleicon}
                    />
                  </TouchableOpacity>
                </TouchableOpacity>

                <View style={styles.scroll}>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {crafts}
                  </ScrollView>
                </View>
              </>
            )}

            {this.state.craftlists.length > 0 && (
              <>
                <TouchableOpacity
                  style={styles.craftListWrapper}
                  onPress={() => {
                    this.props.updatePrevState(store.getState());
                    this.props.updateTitle('SeeAllCraftlists');
                    this.props.updateBackScreen('Profile');
                    this.props.navigation.navigate('SeeAllCraftlists', {
                      userId: this.state.userId,
                    });
                  }}
                >
                  <Text style={styles.craftListText}>CRAFTLISTS</Text>
                  <Text style={styles.seeall}>See all</Text>
                </TouchableOpacity>

                <View style={styles.scroll}>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {craftLists}
                  </ScrollView>
                </View>
              </>
            )}
          </View>
          <View style={{ height: 50 * METRICS.ratioY }} />

          {/* About Modal */}
          <AboutModal
            onClose={this.aboutModalDidClose}
            status={aboutModalVisible}
            onCloseRequest={this.setAboutModalVisible}
            userProfile={this.state.userProfile}
            onWebsiteLink={this.onWebsiteLink}
          />

          {/* Tip artist */}
          <TipModal
            onClose={this.tipModalDidClose}
            onSend={this.sendTip}
            status={tipModalVisible}
            onCloseRequest={this.setTipModalVisible}
          />
          {/* Payment Verify Modal */}
          <PayModal
            onClose={this.payModalClose}
            status={payModalVisible}
            onNavigationStateChange={this.onNavigationStateChange}
            onCloseRequest={this.setPayModalVisible}
            paypalUrl={this.state.paypalUrl}
          />
          <ReportModal
            status={reportModalVisible}
            onClose={this.closeReportModal}
            onCloseRequest={this.setReportModalVisible}
            onPress={this.reportActionSelected}
            selectedOption={reportOptionSelected}
            radio_props={radio_props}
            onSubmitReport={this.onSubmitReport}
          />
        </ScrollView>
        <FlashMessage titleStyle={styles.flashStyle} />
      </View>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    updateCraftPlaying: (data) => dispatch(updateCraftPlaying(data)),
    setPlayingCrafts: (data) => dispatch(setPlayingCrafts(data)),
    updateProfileUserId: (data) => dispatch(updateProfileUserId(data)),
    updateBackScreen: (data) => dispatch(updateBackScreen(data)),
    updateEditingCraftId: (data) => dispatch(updateEditingCraftId(data)),
    updateTitle: (data) => dispatch(updateTitle(data)),
    updateCurCraftId: (data) => dispatch(updateCurCraftId(data)),
    updatePrevState: (data) => dispatch(updatePrevState(data)),
    updateOpenComments: (data) => dispatch(updateOpenComments(data)),
    updateMiniPlay: (data) => dispatch(updateMiniPlay(data)),
    updateDeeplinkAlert: (data) => dispatch(updateDeeplinkAlert(data)),
    updateCraftListId: (data) => dispatch(updateCraftListId(data)),
    updateBackupCraft: (data) => dispatch(updateBackupCraft(data)),
    updateSeekOnBack: (data) => dispatch(updateSeekOnBack(data)),
    updateCurrentTime: (data) => dispatch(updateCurrentTime(data)),
    updateFollowId: (data) => dispatch(updateFollowId(data)),
    updateStoreState: (data) => dispatch(updateStoreState(data)),
    updateAddMusicMethod: (data) => dispatch(updateAddMusicMethod(data)),
    createChatGroup: (data) => dispatch(createChatGroup(data)),
    getAllChatGroups: (data) => dispatch(getAllChatGroups(data)),
    updateOnBackProfile: (data) => dispatch(updateOnBackProfile(data)),
    updateIsPlaying: (data) => dispatch(updateIsPlaying(data)),
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
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen);

const styles = StyleSheet.create({
  flashStyle: {
    fontFamily: 'lato',
    fontSize: METRICS.fontSizeNormal,
  },
  linearGradient: {
    flex: 1,
  },
  container: {
    backgroundColor: COLORS.blackColor,
    flex: 1,
  },
  wrapper: {
    backgroundColor: COLORS.blackColor,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  background: {
    height: 400 * METRICS.ratioX,
  },
  topProfile: {
    flexDirection: 'row',
    position: 'absolute',
    left: 0,
    bottom: 40 * METRICS.ratioX,
    paddingLeft: METRICS.spacingSmall,
  },
  name: {
    flexDirection: 'row',
    justifyContent: 'center',
    textAlign: 'center',
    alignSelf: 'center',
    fontSize: 30 * METRICS.ratioX,
    fontFamily: 'Cantarell',
    color: COLORS.whiteColor,
    position: 'absolute',
    bottom: -5 * METRICS.ratioX,
    width: '90%',
    textTransform: 'uppercase',
    paddingHorizontal: METRICS.spacingSmall,
  },
  showmore: {
    position: 'absolute',
    top: 33 * METRICS.ratioX,
    right: 0,
    paddingHorizontal: METRICS.spacingHuge,
    paddingTop: METRICS.spacingNormal,
    paddingBottom: METRICS.spacingHuge,
  },
  showmoreIcon: {
    color: COLORS.primaryColor,
  },
  followWrapper: {
    backgroundColor: COLORS.blackColor,
  },
  followButton: {
    width: METRICS.followbuttonwidth,
    height: METRICS.followbuttonheight,
    fontFamily: 'lato-bold',
  },
  tipWrapper: {
    flexDirection: 'row',
    marginTop: METRICS.marginNormal,
  },
  tipButton: {
    flexDirection: 'row',
    marginLeft: METRICS.marginNormal,
  },
  followersWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    marginLeft: METRICS.marginNormal,
  },
  followingWrapper: {
    alignItems: 'center',
    marginLeft: METRICS.marginNormal,
  },
  dmWrapper: {
    flexDirection: 'row',
    marginRight: METRICS.marginNormal,
  },
  craftsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20 * METRICS.ratioX,
  },
  craftListWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: METRICS.marginBig,
  },
  tipText: {
    fontSize: METRICS.fontSizeNormal,
    marginLeft: METRICS.marginTiny,
    color: COLORS.whiteColor,
    fontFamily: 'lato',
  },
  followerText: {
    fontSize: METRICS.fontSizeNormal,
    color: COLORS.whiteColor,
    fontFamily: 'lato',
  },
  followerCountText: {
    fontSize: METRICS.fontSizeLight,
    color: COLORS.whiteColor,
    fontFamily: 'lato',
  },
  dmText: {
    fontSize: METRICS.fontSizeNormal,
    marginLeft: METRICS.marginTiny,
    marginRight: METRICS.marginTiny,
    color: COLORS.whiteColor,
    fontFamily: 'lato',
  },
  craftsText: {
    fontSize: METRICS.fontSizeNormal,
    marginLeft: METRICS.marginHuge,
    color: COLORS.whiteColor,
    fontFamily: 'lato',
  },
  craftListText: {
    fontSize: METRICS.fontSizeNormal,
    marginLeft: METRICS.marginHuge,
    color: COLORS.whiteColor,
    fontFamily: 'lato',
  },
  storeText: {
    fontSize: METRICS.fontSizeNormal,
    marginLeft: METRICS.marginHuge,
    color: COLORS.whiteColor,
    fontFamily: 'lato',
  },
  authContainer: {
    flex: 1,
    backgroundColor: COLORS.blackColor,
  },
  iconStyle: {
    color: COLORS.primaryColor,
    paddingHorizontal: METRICS.marginTiny,
  },
  scroll: {
    marginTop: METRICS.marginNormal,
    marginHorizontal: METRICS.marginNormal,
  },
  dmLables: {
    color: COLORS.primaryColor,
    fontSize: METRICS.fontSizeHuge,
    marginLeft: METRICS.marginHuge,
    marginTop: METRICS.marginHuge,
  },
  subLables: {
    color: COLORS.whiteColor,
    marginLeft: METRICS.marginHuge,
    marginTop: METRICS.marginTiny,
  },
  moreItem: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
  moreSubItemView: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 100 * METRICS.ratioX,
  },
  moreSubItemLable: {
    color: COLORS.whiteColor,
    marginLeft: METRICS.marginSmall,
    fontSize: METRICS.fontSizeBig,
  },
  backbutton: {
    position: 'absolute',
    top: 33 * METRICS.ratioX,
    left: 0,
    paddingHorizontal: METRICS.spacingBig,
    paddingTop: METRICS.spacingNormal,
    paddingBottom: METRICS.spacingHuge,
  },
  seeall: {
    color: COLORS.subTitle,
    fontSize: METRICS.fontSizeLight,
    fontFamily: 'lato',
    marginHorizontal: METRICS.spacingSmall,
  },
  shuffleicon: {
    color: COLORS.primaryColor,
    paddingRight: METRICS.spacingHuge,
  },
});
