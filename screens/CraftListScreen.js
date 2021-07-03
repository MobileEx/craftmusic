import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import { SwipeListView } from 'react-native-swipe-list-view';
import { connect } from 'react-redux';
import { CustomButton, CraftItem, CustomIcon } from '../components';
import { craft, craftlistBg } from '../global/Images';
import { METRICS, COLORS, STYLES } from '../global';
import Button from '../components/Button';
import CraftlistService from '../services/CraftlistService';
import PlayingCraftService from '../services/PlayingCraftService';
import Environment from '../helpers/environment';
import {
  updateCraftPlaying,
  setPlayingCrafts,
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
  updateIsPlaying,
  updateBackScreen,
  updateOnBackCraftList,
} from '../store/actions';
import store from '../store/configureStore';

class CraftListScreen extends React.Component {
  static navigationOptions = {
    header: null,
    tabBarVisible: true,
  };

  constructor(props) {
    super(props);
    this.state = {
      image: '',
      craftlistId: 1,
      title: '',
      description: '',
      followers: [],
      crafts: [],
      contributors: [],
    };
  }

  componentDidMount() {
    this.initCrafts();
    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      this.initCrafts();
    });
    this.timer = setInterval(() => {
      if (this.state.craftlistId !== this.props.craftlistId) {
        this.initCrafts();
      }
    }, 500);
  }

  componentWillUnmount() {
    // Remove the event listener before removing the screen from the stack
    this.focusListener.remove();
    clearInterval(this.timer);
  }

  initCrafts = () => {
    this.setState(
      {
        craftlistId: this.props.craftlistId,
      },
      () => {
        this.getCraftlistInfo();
      }
    );
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.craftlistId != nextProps.craftlistId) {
      return {
        userId: nextProps.craftlistId,
      };
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState) {
    // if (prevState.craftlistId !== this.props.craftlistId) {
    //   this.initCrafts();
    // }
    // if (prevState.craftlistId !== this.state.craftlistId) {
    //   this.getCraftlistInfo();
    // }
  }

  getCraftlistInfo = () => {
    CraftlistService.getCraftlist(this.props.craftlistId)
      .then((res) => {
        if (res.data.title) {
          this.setState({
            image: res.data.image,
            title: res.data.title,
            description: res.data.description,
            followers: res.data.followers,
            crafts: res.data.crafts,
            contributors: res.data.contributors,
            followStatus: res.data.isfollowing,
          });
        } else {
          this.props.navigation.navigate('Craft', { reset: true });
        }
      })
      .catch((err) => {
        this.props.navigation.navigate('Craft', { reset: true });
        // console.log(err.response.data.error);
      });
  };

  onBack = () => {
    this.props.updatePrevState(store.getState());
    this.props.updateTitle('Home');
    this.props.navigation.navigate('Home', { craftlistId: this.state.craftlistId });
  };

  onShowmore = () => {
    // this.props.navigation.goBack();
    this.props.updatePrevState(store.getState());
    //this.props.updateBackScreen('Craftlist'); // made by dongdong
    this.props.updateTitle('Craft');
    this.props.navigation.navigate('Craft', { craftlistId: this.state.craftlistId });
  };

  onDelete = (index) => {
    const { crafts, craftlistId } = this.state;
    // console.log('swipe:', index);
    CraftlistService.deleteCraftFromList(craftlistId, index)
      .then((res) => {
        this.setState({
          crafts: res.data,
        });
      })
      .catch((err) => {
        // console.log(err.response.data.error);
      });
  };

  follow = () => {
    const { craftlistId } = this.state;
    if (this.state.followStatus) {
      CraftlistService.unfollowCraftlist(craftlistId)
        .then((res) => {
          this.getCraftlistInfo();
        })
        .catch((err) => {
          // console.log(err.response.data.error);
        });
    } else {
      CraftlistService.followCraftlist(craftlistId)
        .then((res) => {
          this.getCraftlistInfo();
        })
        .catch((err) => {
          // console.log(err.response.data.error);
        });
    }
  };

  resort = () => {
    this.props.updateCraftListId(this.state.craftlistId);
    this.props.navigation.navigate('CraftlistSort');
  };

  actionNavigation = (screens, index = 0) => {
    this.props.updatePrevState(store.getState());
    this.props.updateTitle(screens);
    this.props.navigation.navigate(screens, { page: index, craftlistId: this.state.craftlistId });
  };

  onCraft = (id) => {
    PlayingCraftService.getCraft(id)
      .then((res) => {
        this.props.setPlayingCrafts([res.data]);
        this.props.updateCurCraftId(0);
        this.props.updatePrevState(store.getState());
        this.props.updateTitle('PlayingCraft');
        this.props.updateIsPlaying(1);
        this.props.updateCraftPlaying(1);
      })
      .catch((err) => {
        // console.log(err.response.data.error);
      });
  };

  render() {
    const {
      followers,
      crafts,
      description,
      title,
      contributors,
      image,
      craftlistId,
      followStatus,
    } = this.state;
    return (
      <View style={styles.wrapper}>
        <FastImage source={image ? { uri: image } : craftlistBg} style={styles.profileImage}>
          <LinearGradient
            colors={['transparent', 'transparent', 'black']}
            style={styles.linearGradient}
          />
          <TouchableOpacity
            style={styles.backbutton}
            onPress={() => {
              if (typeof store.getState().onBackCraftList === 'function') {
                store.getState().onBackCraftList();
                this.props.updateOnBackCraftList(null);
              }
              this.props.navigation.navigate(this.props.backScreen);
            }}
          >
            <CustomIcon name="back" style={styles.showmoreIcon} size={METRICS.fontSizeBigger} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.showmore} onPress={() => this.onShowmore()}>
            <CustomIcon
              name="three-dots-more-indicator"
              size={METRICS.fontSizeBigger}
              style={styles.showmoreIcon}
            />
          </TouchableOpacity>
        </FastImage>
        <Text numberOfLines={2} adjustsFontSizeToFit style={styles.title}>
          {title}
        </Text>

        <ScrollView contentContainerStyle={styles.background} showsVerticalScrollIndicator={false}>
          <Text style={styles.subTitle}>{description}</Text>
          <View style={STYLES.horizontalAlign}>
            <TouchableOpacity style={styles.buttonwrapper} onPress={this.follow}>
              <Button
                style={styles.followButton}
                title={followStatus ? 'Following' : 'Follow'}
                fontSize={METRICS.fontSizeNormal}
                status={followStatus ? 3 : 1}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonwrapper} onPress={this.resort}>
              <Button style={styles.followButton} title="Sort" fontSize={METRICS.fontSizeNormal} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonwrapper}>
              <CustomButton title="Shuffle" style={styles.followButton} />
            </TouchableOpacity>
          </View>
          <View style={styles.countWrapper}>
            <TouchableOpacity
              style={{ marginHorizontal: METRICS.spacingBig }}
              onPress={() => this.actionNavigation('CraftlistFollows', 0)}
            >
              <View style={styles.conter}>
                <Text style={styles.counterTitle}>Followers</Text>
                <Text style={styles.countNumber}>{followers.length}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ marginHorizontal: METRICS.spacingBig }}
              onPress={() => this.actionNavigation('CraftlistFollows', 1)}
            >
              <View style={styles.conter}>
                <Text style={styles.counterTitle}>Contributors</Text>
                <Text style={styles.countNumber}>{contributors.length}</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.flatlist}>
            <SwipeListView
              useFlatList
              keyExtractor={(item) => `${item.id}`}
              data={crafts}
              renderItem={(data) => (
                <TouchableHighlight onPress={() => this.onCraft(data.item.id)}>
                  <CraftItem
                    image={
                      data.item.thumbnail_url
                        ? {
                            uri:
                              data.item.thumbnail_url.search('http') >= 0
                                ? data.item.thumbnail_url
                                : Environment.S3URL + data.item.thumbnail_url,
                          }
                        : craft
                    }
                    title={data.item.title}
                  />
                </TouchableHighlight>
              )}
              renderHiddenItem={(data) => (
                <View style={styles.rowBack}>
                  <TouchableOpacity
                    style={styles.rightButton}
                    onPress={() => this.onDelete(data.item.id)}
                  >
                    <Text style={{ justifyContent: 'center', textAlign: 'center', flex: 1 }}>
                      Delete
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
              rightOpenValue={-100 * METRICS.ratioX}
              disableRightSwipe
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    updateCraftPlaying: (data) => dispatch(updateCraftPlaying(data)),
    setPlayingCrafts: (data) => dispatch(setPlayingCrafts(data)),
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
    updateIsPlaying: (data) => dispatch(updateIsPlaying(data)),
    updateBackScreen: (data) => dispatch(updateBackScreen(data)),
    updateOnBackCraftList: (data) => dispatch(updateOnBackCraftList(data)),
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

export default connect(mapStateToProps, mapDispatchToProps)(CraftListScreen);

const styles = StyleSheet.create({
  linearGradient: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    height: 300 * METRICS.ratioX,
  },
  wrapper: {
    backgroundColor: COLORS.blackColor,
    flex: 1,
  },
  profileImage: {
    width: '100%',
    height: 300 * METRICS.ratioX,
  },
  background: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    paddingBottom: 100 * METRICS.ratioY,
  },
  title: {
    fontSize: 35 * METRICS.ratioX,
    color: COLORS.primaryColor,
    fontFamily: 'lato-bold',
    textAlign: 'center',
    marginBottom: METRICS.spacingNormal,
    marginHorizontal: METRICS.spacingNormal,
  },
  subTitle: {
    color: COLORS.whiteColor,
    fontSize: METRICS.fontSizelarge,
    fontFamily: 'lato',
    textAlign: 'center',
    marginBottom: METRICS.spacingBig,
    paddingLeft: METRICS.spacingBig,
    paddingRight: METRICS.spacingBig,
  },
  follow: {
    fontSize: METRICS.fontSizeNormal,
    color: COLORS.whiteColor,
    backgroundColor: COLORS.primaryColor,
    borderColor: COLORS.primaryColor,
    marginBottom: METRICS.spacingHuge,
    fontFamily: 'lato-bold',
  },
  countWrapper: {
    flexDirection: 'row',
    paddingTop: METRICS.spacingBig,
    paddingBottom: METRICS.spacingNormal,
    paddingHorizontal: METRICS.spacingBig,
    flex: 1,
  },
  counterTitle: {
    color: COLORS.nameDM,
    fontSize: METRICS.fontSizeNormal,
    fontFamily: 'lato',
  },
  countNumber: {
    color: COLORS.nameDM,
    fontSize: METRICS.fontSizeOK,
    fontFamily: 'lato',
  },
  conter: {
    flex: 1,
    alignItems: 'center',
  },
  flatlist: {
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  showmore: {
    position: 'absolute',
    top: 45 * METRICS.ratioX,
    right: 0,
    paddingHorizontal: METRICS.spacingHuge,
    paddingTop: METRICS.spacingNormal,
    paddingBottom: METRICS.spacingHuge,
  },
  backbutton: {
    position: 'absolute',
    top: 45 * METRICS.ratioX,
    left: 0,
    paddingHorizontal: METRICS.spacingBig,
    paddingTop: METRICS.spacingNormal,
    paddingBottom: METRICS.spacingHuge,
  },
  showmoreIcon: {
    color: COLORS.primaryColor,
  },
  followButton: {
    width: METRICS.followbuttonwidth,
    height: METRICS.sendbuttonheight,
    fontFamily: 'lato-bold',
  },
  buttonwrapper: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingHorizontal: METRICS.spacingSmall,
  },
  rowBack: {
    backgroundColor: COLORS.primaryColor,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  rightButton: {
    width: 100 * METRICS.ratioX,
    height: '100%',
    alignItems: 'center',
    flexDirection: 'row',
  },
});
