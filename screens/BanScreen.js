import React from 'react';
import { withNavigation } from 'react-navigation';
import { SafeAreaView, View, Text, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import FastImage from 'react-native-fast-image';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { connect } from 'react-redux';
import { BaseScreen, ScreenHeader, SearchInput, Button, CustomButton } from '../components';
import { METRICS, STYLES, COLORS } from '../global';
import ProfileService from '../services/ProfileService';
import SearchService from '../services/SearchService';
import { updateProfileUserId } from '../store/actions';

class BanScreen extends BaseScreen {
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
      keyword: '',
      user: {
        type: [],
        rank: [],
        location: '',
        radius: 100,
        checked: false,
      },
      userFeatureStatus: [],
    };
  }

  componentDidMount() {
    const { statusFlags } = this.state;
  }

  search = () => {
    const { user, keyword } = this.state;
    SearchService.search(keyword, user, ...Array(3), true)
      .then((res) => {
        const userFeatureStatus = [];
        for (let i = 0; i < res.data.user.length; i++) {
          userFeatureStatus[res.data.user[i].id] = res.data.user[i].is_banned;
        }
        this.setState({
          resUser: res.data.user,
          searched: true,
          userFeatureStatus,
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

  onClickDelete = (id, index) => {
    const { resUser } = this.state;
    ProfileService.deleteUser(id)
      .then((res) => {
        resUser.splice(index, 1);
        this.setState({ resUser });
      })
      .catch((err) => {
        console.log(err.data.response.error);
      });
  };

  featureHandler = (type, id, action) => {
    const userStatus = this.state.userFeatureStatus;
    if (type === 0) {
      if (action === 1) {
        ProfileService.banUser(id)
          .then((res) => {})
          .catch((err) => {
            // console.log(err.response.data.error);
          });
      } else {
        ProfileService.unBanUser(id)
          .then((res) => {})
          .catch((err) => {
            // console.log(err.response.data.error);
          });
      }
      userStatus[id] = !userStatus[id];
      this.setState({
        userFeatureStatus: userStatus,
      });
    }
  };

  renderScreen() {
    const { navigation } = this.props;
    const { resUser } = this.state;
    const userAvatar2 = require('../assets/images/user.png');

    return (
      <SafeAreaView style={styles.contain}>
        <View style={{ paddingHorizontal: METRICS.spacingNormal }}>
          <ScreenHeader navigation={navigation} pageTitle="Ban Users" />
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
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.usersWrapper}>
            <View style={styles.searchResultWrapper}>
              {resUser.map((userItem, index) => (
                <View style={styles.column}>
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
                  </View>
                  <View style={styles.buttonrow}>
                    <CustomButton
                      style={styles.button}
                      title="Delete"
                      clickHandler={() => this.onClickDelete(userItem.id, index)}
                    />
                    {this.state.userFeatureStatus[userItem.id] ? (
                      <TouchableOpacity onPress={() => this.featureHandler(0, userItem.id, 0)}>
                        <Button
                          title="Un-Ban"
                          fontSize={METRICS.fontSizeNormal}
                          style={styles.button}
                          status={3}
                        />
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity onPress={() => this.featureHandler(0, userItem.id, 1)}>
                        <Button
                          title="Ban"
                          fontSize={METRICS.fontSizeNormal}
                          style={styles.button}
                          status={1}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ))}
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
    minHeight: '100%',
  },
  searchWrapper: {
    flexDirection: 'row',
    paddingHorizontal: METRICS.marginNormal,
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
  button: {
    width: 0.8 * METRICS.followbuttonwidth,
    height: METRICS.sendbuttonheight,
  },
  buttonrow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: METRICS.followspacing,
  },
  buttonText: {
    fontFamily: 'lato-bold',
    fontSize: METRICS.fontSizeNormal,
    color: COLORS.whiteColor,
  },
  searchResultWrapper: {
    paddingHorizontal: METRICS.spacingNormal,
  },
  iconRight: {
    fontSize: METRICS.fontSizeHuge,
    color: COLORS.primaryColor,
    marginHorizontal: METRICS.spacingBig,
  },
  iconStyle: {
    color: COLORS.primaryColor,
    paddingHorizontal: METRICS.marginTiny,
  },
  column: {
    flexDirection: 'column',
    flex: 1,
  },
});

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

export default connect(mapStateToProps, mapDispatchToProps)(withNavigation(BanScreen));
