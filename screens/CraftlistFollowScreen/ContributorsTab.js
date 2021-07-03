import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useDispatch, connect } from 'react-redux';
import ProfileService from '../../services/ProfileService';
import { COLORS, METRICS, STYLES } from '../../global';
import { SearchInput, CustomIcon } from '../../components';
import CraftlistService from '../../services/CraftlistService';
import { user } from '../../global/Images';

class ContributorsTab extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      nameFilterText: '',
      craftlistId: 1,
      contributorlist: [],
      followStatus: [],
    };
  }

  componentWillReceiveProps(param) {
    this.setState(
      {
        craftlistId: param.craftlistId,
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
        craftlistId: this.props.craftlistId,
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
    CraftlistService.getContributors(this.state.craftlistId)
      .then((res) => {
        // console.log("get contributors", res.data);
        const followStatus = [];
        for (let i = 0; i < res.data.length; i++) {
          followStatus.push(false);
          for (let j = 0; j < this.myFollowingList.length; j++) {
            if (this.myFollowingList[j].id === res.data[i].id) {
              followStatus[i] = true;
              break;
            }
          }
        }

        this.setState({
          contributorlist: res.data,
          followStatus,
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
    // console.log("id:", id);
    const { followStatus, contributorlist } = this.state;
    const statusFlags = followStatus;
    if (statusFlags[id]) {
      ProfileService.unFollow(contributorlist[id].id)
        .then((res) => {
          // console.log(res.data);
        })
        .catch((err) => console.log(err.response.data.error));
    } else {
      ProfileService.follow(contributorlist[id].id)
        .then((res) => {
          console.log(res.data);
        })
        .catch((err) => console.log(err.response.data.error));
    }

    statusFlags[id] = !statusFlags[id];
    this.setState({ followStatus: statusFlags });
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
    const { nameFilterText, followStatus, contributorlist } = this.state;
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
            {contributorlist
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

                  {followStatus[index] ? (
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

export default connect(mapStateToProps)(ContributorsTab);

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
