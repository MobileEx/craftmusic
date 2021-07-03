import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useDispatch, connect } from 'react-redux';
import ProfileService from '../../services/ProfileService';
import { COLORS, METRICS, STYLES } from '../../global';
import { SearchInput, CustomIcon } from '../../components';
import { user } from '../../global/Images';

class FollowersTab extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      nameFilterText: '',
      userId: 1,
      followersList: [],
      followerStatus: [],
    };
  }

  componentWillReceiveProps(param) {
    this.setState(
      {
        userId: param.userId,
      },
      () => {
        ProfileService.getFollow(this.props.user.id)
          .then((res) => {
            this.myFollowerList = res.data.followers;
            this.myFollowingList = res.data.followings;
            this.getFollowData();
          })
          .catch((err) => console.log(err.response.data.error));
      }
    );
  }

  componentDidMount() {
    this.setState(
      {
        userId: this.props.userId,
      },
      () => {
        ProfileService.getFollow(this.props.user.id)
          .then((res) => {
            this.myFollowerList = res.data.followers;
            this.myFollowingList = res.data.followings;
            this.getFollowData();
          })
          .catch((err) => console.log(err.response.data.error));
      }
    );
  }

  getFollowData = () => {
    ProfileService.getFollow(this.state.userId)
      .then((res) => {
        const followerStatus = [];
        for (let i = 0; i < res.data.followers.length; i++) {
          followerStatus.push(false);
          for (let j = 0; j < this.myFollowingList.length; j++) {
            if (this.myFollowingList[j].id == res.data.followers[i].id) {
              followerStatus[i] = true;
              break;
            }
          }
        }
        this.setState({
          followersList: res.data.followers,
          followerStatus,
        });
      })
      .catch((err) => {
        console.log(err.response.data.error);
      });
  };

  updateFilterText = (text) => {
    this.setState({
      nameFilterText: text,
    });
  };

  onFollow = (id) => {
    const { followerStatus, followersList } = this.state;
    const statusFlags = followerStatus;
    const followUsers = followersList;
    if (statusFlags[id]) {
      ProfileService.unFollow(followUsers[id].id)
        .then((res) => {})
        .catch((err) => console.log(err.response.data.error));
    } else {
      ProfileService.follow(followUsers[id].id)
        .then((res) => {})
        .catch((err) => console.log(err.response.data.error));
    }

    statusFlags[id] = !statusFlags[id];
    this.setState({ followerStatus: statusFlags });
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

  render() {
    const { nameFilterText, followerStatus, followersList } = this.state;
    return (
      <SafeAreaView style={styles.authContainer}>
        <View style={styles.searchWrapper}>
          <View style={styles.searchItem}>
            <SearchInput
              placeholder="Search users"
              value={nameFilterText}
              changeHandler={this.updateFilterText}
            />
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.usersWrapper}>
            {followersList
              .filter((item) => item.username.toLowerCase().includes(nameFilterText.toLowerCase()))
              .map((userItem, index) => (
                <View style={styles.userItem} key={index}>
                  <TouchableOpacity onPress={() => this.props.onUser(userItem.id)}>
                    <View style={STYLES.horizontalAlign}>
                      <FastImage
                        source={userItem.avatar ? { uri: userItem.avatar } : user}
                        style={styles.avatar}
                      />
                      <Text numberOfLines={1} ellipsizeMode="tail" style={styles.usernameText}>
                        {userItem.username}
                      </Text>
                      {userItem.types &&
                        this.showUsertypeIcon(userItem.types, userItem.verified_at)}
                    </View>
                  </TouchableOpacity>
                  {followerStatus[index] ? (
                    <TouchableOpacity
                      style={{ ...styles.followingButton, ...STYLES.centerAlign }}
                      onPress={this.onFollow.bind(this, index)}
                    >
                      <Text style={styles.buttonText}>Following</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={{ ...styles.followButton, ...STYLES.centerAlign }}
                      onPress={this.onFollow.bind(this, index)}
                    >
                      <Text style={styles.buttonText}>Follow</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
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

export default connect(mapStateToProps)(FollowersTab);

const styles = StyleSheet.create({
  authContainer: {
    flex: 1,
    backgroundColor: COLORS.blackColor,
  },
  container: {
    paddingLeft: METRICS.spacingNormal,
    paddingRight: METRICS.spacingNormal,
  },
  searchItem: {
    flex: 10,
    height: 40 * METRICS.ratioX,
  },
  searchWrapper: {
    flexDirection: 'row',
    paddingHorizontal: METRICS.marginNormal,
    paddingBottom: METRICS.marginSmall,
    paddingTop: -METRICS.spacingHuge,
  },
  followingButton: {
    borderWidth: 1 * METRICS.ratioX,
    borderColor: COLORS.primaryColor,
    backgroundColor: COLORS.blackColor,
    height: METRICS.followbuttonheight,
    borderRadius: 20 * METRICS.ratioX,
    width: METRICS.followbuttonwidth,
  },
  followButton: {
    backgroundColor: COLORS.primaryColor,
    height: METRICS.followbuttonheight,
    borderRadius: 20 * METRICS.ratioX,
    width: METRICS.followbuttonwidth,
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
    fontSize: METRICS.fontSizeOK,
    color: COLORS.whiteColor,
    paddingRight: METRICS.marginTiny,
    overflow: 'hidden',
    maxWidth: 0.33 * METRICS.screenWidth,
  },
  buttonText: {
    fontFamily: 'lato-bold',
    fontSize: METRICS.fontSizeNormal,
    color: COLORS.whiteColor,
  },
  iconStyle: {
    color: COLORS.primaryColor,
    paddingRight: METRICS.marginTiny,
  },
});
