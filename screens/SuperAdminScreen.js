import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { connect } from 'react-redux';
import { BaseScreen, ScreenHeader, SearchInput, CustomButton, CustomIcon } from '../components';
import { METRICS, STYLES, COLORS } from '../global';
import ProfileService from '../services/ProfileService';
import PlayingCraftService from '../services/PlayingCraftService';
import SearchService from '../services/SearchService';
import {
  updateBackScreen,
  updateCraftPlaying,
  setPlayingCrafts,
  updateProfileUserId,
  updateEditingCraftId,
  updateTitle,
  updateCurCraftId,
  updatePrevState,
  updateCraftListId,
  updateStoreState,
} from '../store/actions';
import store from '../store/configureStore';

class SuperAdminScreen extends BaseScreen {
  navbarHidden = true;

  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      nameFilterText: '',
      userId: 1,
      statusFlags: [],
      resUser: [],
      resCraft: [],
      resCraftlist: [],
      keyword: '',
      user: {
        type: [],
        rank: [],
        location: '',
        radius: 100,
        checked: false,
      },
      crafts: false,
      craftlists: false,
      hashtags: false,
      userFeatureStatus: [],
      craftFeatureStatus: [],
    };
  }

  componentDidMount() {
    const { statusFlags } = this.state;
  }

  search = () => {
    const { user, crafts, craftlists, keyword } = this.state;
    SearchService.search(keyword, user, crafts, craftlists)
      .then((res) => {
        const userFeatureStatus = [];
        const craftFeatureStatus = [];
        for (let i = 0; i < res.data.user.length; i++) {
          userFeatureStatus[res.data.user[i].id] = res.data.user[i].featured_at;
        }
        for (let i = 0; i < res.data.craft.length; i++) {
          craftFeatureStatus[res.data.craft[i].id] = res.data.craft[i].featured_at;
        }
        this.setState({
          resUser: res.data.user,
          resCraft: res.data.craft,
          resCraftlist: res.data.craftlist,
          searched: true,
          userFeatureStatus,
          craftFeatureStatus,
        });
      })
      .catch((err) => {
        console.log(err.response.data.error);
      });
  };

  onUser = (id) => {
    this.props.updateProfileUserId(id);

    this.props.navigation.navigate('Profile', { refresh: true });
  };

  onCraftlist = (id) => {
    this.props.updateCraftListId(id);
    this.props.updatePrevState(store.getState());
    this.props.updateTitle('Craftlist');
    this.props.navigation.navigate('Craftlist');
  };

  featureHandler = (type, id, action) => {
    const userStatus = this.state.userFeatureStatus;
    const craftStatus = this.state.craftFeatureStatus;
    if (type === 0) {
      if (action === 1) {
        ProfileService.setFeaturedUser(id)
          .then((res) => {
            // console.log(res.data);
          })
          .catch((err) => {
            // console.log(err.response.data.error);
          });
      } else {
        ProfileService.unsetFeaturedUser(id)
          .then((res) => {})
          .catch((err) => {
            // console.log(err.response.data.error);
          });
      }
      userStatus[id] = !userStatus[id];
      this.setState({
        userFeatureStatus: userStatus,
      });
    } else if (type === 1) {
      if (action === 1) {
        PlayingCraftService.setFeaturedCraft(id)
          .then((res) => {})
          .catch((err) => {
            // console.log(err.response.data.error);
          });
      } else {
        PlayingCraftService.unsetFeaturedCraft(id)
          .then((res) => {})
          .catch((err) => {
            // console.log(err.response.data.error);
          });
      }
      craftStatus[id] = !craftStatus[id];
      this.setState({
        craftFeatureStatus: craftStatus,
      });
    }
  };

  renderScreen() {
    const { navigation } = this.props;
    const { resUser, resCraft, resCraftlist } = this.state;
    const userAvatar2 = require('../assets/images/user.png');
    const craftImage = require('../assets/images/craft.png');
    const craftlistImage = require('../assets/images/craftlist.png');

    return (
      <SafeAreaView style={styles.contain}>
        <View style={{ paddingHorizontal: METRICS.spacingNormal }}>
          <ScreenHeader navigation={navigation} pageTitle="SuperAdmin Access" />
        </View>
        <View style={{ flexDirection: 'column', alignSelf: 'center' }}>
          <View style={STYLES.horizontalAlign}>
            <View style={styles.contestwrapper}>
              <CustomButton
                title="Contest"
                style={styles.contest}
                clickHandler={() => {
                  this.props.updatePrevState(store.getState());
                  this.props.updateTitle('ContestScreen');
                  this.props.navigation.navigate('ContestScreen');
                }}
              />
            </View>
            <View style={styles.contestwrapper}>
              <CustomButton
                title="Reports"
                style={styles.contest}
                clickHandler={() => {
                  this.props.updatePrevState(store.getState());
                  this.props.updateTitle('Reports');
                  this.props.navigation.navigate('Reports');
                }}
              />
            </View>
            <View style={styles.contestwrapper}>
              <CustomButton
                title="Verify"
                style={styles.contest}
                clickHandler={() => {
                  this.props.updatePrevState(store.getState());
                  this.props.updateTitle('Verify');
                  this.props.navigation.navigate('Verify');
                }}
              />
            </View>
            <View style={styles.contestwrapper}>
              <CustomButton
                title="Ban"
                style={styles.contest}
                clickHandler={() => {
                  this.props.updatePrevState(store.getState());
                  this.props.updateTitle('Ban');
                  this.props.navigation.navigate('Ban');
                }}
              />
            </View>
          </View>
        </View>
        <View style={styles.searchWrapper}>
          <View style={styles.searchItem}>
            <SearchInput
              placeholder="Search"
              value={this.state.keyword}
              onSubmit={this.search}
              changeHandler={(value) =>
                this.setState({ keyword: value }, () => {
                  this.search();
                })
              }
            />
          </View>
        </View>
        <KeyboardAwareScrollView
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 200 * METRICS.ratioY }}
          style={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.usersWrapper}>
            <View style={styles.searchResultWrapper}>
              {resUser.map((userItem, index) => (
                <View style={styles.userItem} key={index}>
                  <TouchableOpacity onPress={() => this.onUser(userItem.id)}>
                    <View style={STYLES.horizontalAlign}>
                      <FastImage
                        source={userItem.avatar ? { uri: userItem.avatar } : userAvatar2}
                        style={styles.avatar}
                      />
                      <Text style={styles.usernameText}>{userItem.username}</Text>
                    </View>
                  </TouchableOpacity>
                  {this.state.userFeatureStatus[userItem.id] ? (
                    <TouchableOpacity onPress={() => this.featureHandler(0, userItem.id, 0)}>
                      <CustomIcon name="cancel-button" style={styles.iconRight} />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity onPress={() => this.featureHandler(0, userItem.id, 1)}>
                      <CustomIcon name="plus1" style={styles.iconRight} />
                    </TouchableOpacity>
                  )}
                </View>
              ))}
              {resCraft.map((item, index) => (
                <View style={styles.userItem} key={index}>
                  <TouchableOpacity onPress={() => {}}>
                    <View style={STYLES.horizontalAlign}>
                      <FastImage
                        source={item.thumbnail_url ? { uri: item.thumbnail_url } : craftImage}
                        style={styles.craftImage}
                      />
                      <Text style={styles.usernameText}>{item.title}</Text>
                    </View>
                  </TouchableOpacity>
                  {this.state.craftFeatureStatus[item.id] ? (
                    <TouchableOpacity onPress={() => this.featureHandler(1, item.id, 0)}>
                      <CustomIcon name="cancel-button" style={styles.iconRight} />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity onPress={() => this.featureHandler(1, item.id, 1)}>
                      <CustomIcon name="plus1" style={styles.iconRight} />
                    </TouchableOpacity>
                  )}
                </View>
              ))}
              {/* {resCraftlist
              .map((item, index) => (
                <View style={styles.userItem} key={index}>
                  <TouchableOpacity onPress = {()=> this.onCraftlist(item.id)}>
                    <View style={STYLES.horizontalAlign}>
                      <FastImage source={item.image? {uri: item.image}: craftlistImage} style={styles.craftImage} />
                      <Text style={styles.usernameText}>{item.title}</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => this.addToFeatured()}>
                    <CustomIcon name="plus1" style={styles.iconRight} />
                  </TouchableOpacity>
                </View>
              ))} */}
            </View>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  contain: {
    backgroundColor: COLORS.blackColor,
    flex: 1,
  },
  searchWrapper: {
    flexDirection: 'row',
    paddingHorizontal: METRICS.marginNormal,
    paddingVertical: METRICS.marginSmall,
  },
  searchItem: {
    flex: 10,
    height: 40 * METRICS.ratioX,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: METRICS.followspacing,
  },
  avatar: {
    height: METRICS.avatarsmall,
    width: METRICS.avatarsmall,
    marginRight: METRICS.spacingSmall,
    borderRadius: METRICS.avatarsmall / 2,
  },
  usernameText: {
    fontFamily: 'Lato-Semibold',
    fontSize: METRICS.fontSizeNormal,
    color: COLORS.whiteColor,
  },
  contest: {
    justifyContent: 'center',
    alignSelf: 'center',
    maxWidth: '70%',
  },
  contestwrapper: {
    paddingVertical: METRICS.spacingNormal,
    marginHorizontal: -15 * METRICS.ratioX,
  },
  searchResultWrapper: {
    marginLeft: METRICS.marginNormal,
  },
  craftImage: {
    height: METRICS.avatarsmall,
    width: METRICS.avatarsmall,
    marginRight: METRICS.spacingSmall,
    borderRadius: 2,
  },
  iconRight: {
    fontSize: METRICS.fontSizeHuge,
    color: COLORS.primaryColor,
    marginHorizontal: METRICS.spacingBig,
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
    updateStoreState: (data) => dispatch(updateStoreState(data)),
    updateAddMusicMethod: (data) => dispatch(updateAddMusicMethod(data)),
    updateEditingCraftId: (data) => dispatch(updateEditingCraftId(data)),
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

export default connect(mapStateToProps, mapDispatchToProps)(SuperAdminScreen);
