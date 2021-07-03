import React from 'react';
import { TouchableOpacity, StyleSheet, View, Text, Linking } from 'react-native';
import FastImage from 'react-native-fast-image';
import moment from 'moment';
import { SwipeRow } from 'react-native-swipe-list-view';
import { connect } from 'react-redux';
import { COLORS, METRICS, STYLES } from '../../../global';
import CustomIcon from '../../CustomIcon';
import TextComponent from './Text';
import ImageComponent from './Image';
import PlayingCraftService from '../../../services/PlayingCraftService';
import { user } from '../../../global/Images';
import SearchService from '../../../services/SearchService';
import { setPlayingCrafts, updateProfileUserId, updateOnBackProfile } from '../../../store/actions';

class CommentReply extends React.Component {
  constructor(props) {
    super(props);
    // commentMode = true  : Add a comment
    // commentMode = false : Reply comment
    this.state = {
      likeFlags: [],
      parentId: 0,
      comments: [],
      craftData: '',
      currentOpen: -1,
      currentMainOpen: this.props.currentOpen,
      myCraftComment: '',
    };
    this.references = this.props.references;
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.state.currentMainOpen != nextProps.currentOpen) {
      this.closeAllOpenRows();
    }
  }

  closeAllOpenRows = () => {
    if (this.state.currentOpen != -1) {
      this.references[this.state.currentOpen].closeRow();
    }
  };

  componentDidMount() {
    this.setState(
      {
        parentId: this.props.parentId,
      },
      () => {
        this.updateCommentsData();
      }
    );
    this.setState({ craftData: this.props.craftData });
  }

  updateCommentsData = () => {
    const { parentId, comments } = this.state;
    PlayingCraftService.getCommentsReply(parentId)
      .then((res) => {
        this.setState({
          comments: res.data,
        });
      })
      .catch((err) => {
        // console.log(err.response.data.error);
      });
    const likeFlags = [];
    for (let i = 0; i < comments.length; i++) {
      likeFlags.push(comments[i].islike);
    }
    this.setState({ likeFlags });
  };

  onLike = (index) => {
    const tmp = this.state.likeFlags;
    tmp[index] = !tmp[index];
    this.setState({
      likeFlags: tmp,
    });
    if (this.state.comments[index].islike) {
      PlayingCraftService.unlikeComment(this.state.comments[index].id)
        .then(() => {
          // console.log(res.data);
          this.updateCommentsData();
        })
        .catch((err) => {
          // console.log(err.response.data.error);
        });
    } else {
      PlayingCraftService.likeComment(this.state.comments[index].id)
        .then(() => {
          // console.log(res.data);
          this.updateCommentsData();
        })
        .catch((err) => {
          // console.log(err.response.data.error);
        });
    }
  };

  onUser = (id) => {
    this.props.updateProfileUserId(id);
    this.props.updateOnBackProfile(this.props.onBackProfile);
    this.props.navigation.navigate('Profile', { refresh: true });
    this.props.onGoProfile();
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
                <CustomIcon
                  name="briefcase"
                  size={METRICS.fontSizeSmall}
                  style={styles.iconStyle}
                />
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

  onPressMention = (e, mention) => {
    const { navigation } = this.props;
    SearchService.getUserByUsername(mention)
      .then((res) => {
        this.props.updateProfileUserId(res.data.id);
        this.props.updateOnBackProfile(this.props.onBackProfile);
        navigation.navigate('Profile', {
          refresh: false,
          // back_screen: 'PlayingCraft',
        });
        this.props.onGoProfile();
      })
      .catch((err) => {
        // console.log(err.response.data.error);
      });
  };

  onPressHashtag = (e, hashtag) => {
    const { navigation } = this.props;
    navigation.navigate('HashedCrafts', {
      refresh: false,
      hashtag: `#${hashtag}`,
      crafts_count: 0,
      // back_screen: 'PlayingCraft',
    });
    this.props.onGoProfile();
  };

  deleteComment = (id) => {
    PlayingCraftService.deleteComment(id)
      .then((res) => {
        // console.log('delete reply--',res)
        this.props.updateCommentsData();
      })
      .catch((err) => {
        // alert(err.response.data.error);
      });
  };

  reportComment = (id, rowMap, index) => {
    this.onSubmitReport(id, rowMap, index);
  };

  onSubmitReport = (id, rowMap) => {
    PlayingCraftService.reportComment(id)
      .then((res) => {
        this.closeAllOpenRows();
      })
      .catch((err) => {
        console.log(err.response.data.error, id);
      });
  };

  renderSwipeElement(item, index, craftData, rowMap) {
    if (this.props.user.id === item.user.id) {
      // My Comment
      return (
        <TouchableOpacity
          style={[styles.button, styles.activeButton, styles.deleteButton]}
          onPress={() => this.deleteComment(item.id)}
        >
          <Text style={styles.textButton}>Delete</Text>
        </TouchableOpacity>
      );
    }
    if (this.props.user.id === craftData.owner_id) {
      // My Craft + Other comment
      return (
        <View style={{ flexDirection: 'row', height: '100%' }}>
          <TouchableOpacity
            style={[styles.button, styles.activeButton, styles.deleteButton]}
            onPress={() => this.deleteComment(item.id)}
          >
            <Text style={styles.textButton}>Delete</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.activeButton]}
            onPress={() => this.reportComment(item.id, rowMap, index)}
          >
            <Text style={styles.textButton}>Report</Text>
          </TouchableOpacity>
        </View>
      );
    } // Other Craft + Other comment
    return (
      <TouchableOpacity
        style={[styles.button, styles.activeButton, { height: '100%' }]}
        onPress={() => this.reportComment(item.id, rowMap, index)}
      >
        <Text style={styles.textButton}>Report</Text>
      </TouchableOpacity>
    );
  }

  onPressLink = (e, link) => {
    Linking.openURL(`http://${link}`).catch((err) => console.error('An error occurred', err));
  };

  render() {
    const { comments } = this.state;
    const { craftData } = this.state;
    let swipeValue = -112 * METRICS.ratioX;
    return (
      <View>
        <View style={styles.wrapper}>
          {comments.map((message, index) => {
            if (this.props.user.id === message.user.id) {
              swipeValue = -112 * METRICS.ratioX;
            } else if (this.props.user.id != craftData.owner_id) {
              swipeValue = -112 * METRICS.ratioX;
            } else {
              swipeValue = -222 * METRICS.ratioX;
            }
            return (
              <View key={String(message.id)} style={{ flex: 1 }}>
                <SwipeRow
                  key={String(message.id)}
                  rightOpenValue={swipeValue}
                  disableRightSwipe
                  closeOnRowPress
                  recalculateHiddenLayout={false}
                  ref={(row) => (this.references[message.id] = row)}
                  swipeGestureBegan={() => {
                    if (this.state.currentOpen != -1 && this.references[this.state.currentOpen]) {
                      this.closeAllOpenRows();
                    }
                    this.props.closeAllOpenRows();
                    this.setState({ currentOpen: message.id });
                  }}
                  recalculateHiddenLayout={false}
                >
                  <View style={styles.buttonWrapper}>
                    {this.renderSwipeElement(message, index, craftData)}
                  </View>

                  <View style={styles.leftPerson} key={index}>
                    <View style={styles.parentWrapper}>
                      <View style={styles.imageWrapper}>
                        <TouchableOpacity onPress={() => this.onUser(message.user.id)}>
                          <FastImage
                            source={message.user.avatar ? { uri: message.user.avatar } : user}
                            style={styles.image}
                          />
                        </TouchableOpacity>
                      </View>
                      <View style={styles.contentWrapper}>
                        <View style={[STYLES.horizontalAlign, { flexDirection: 'row' }]}>
                          <Text style={styles.name}>{message.user.username} </Text>
                          {message.user.types &&
                            this.showUsertypeIcon(message.user.types, message.user.verified_at)}
                        </View>
                        <View style={styles.content}>
                          {message.type === 'photo' && (
                            <ImageComponent
                              content={message.attach_url ? { uri: message.attach_url } : null}
                            />
                          )}
                          {
                            <TextComponent
                              content={`@${message.parent_name} ${message.content}`}
                              onPressHashtag={this.onPressHashtag}
                              onPressMention={this.onPressMention}
                              onPressLink={this.onPressLink}
                            />
                          }
                        </View>
                        <View style={styles.contentBottom}>
                          <Text style={styles.textBottom}>
                            {moment(moment.utc(message.created_at).local()).fromNow()}
                          </Text>
                          <TouchableOpacity onPress={() => this.props.onReply(message.id)}>
                            <Text style={styles.textBottom}>Reply</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                      <View
                        style={{
                          flexDirection: 'column',
                          justifyContent: 'center',
                          paddingRight: METRICS.spacingNormal,
                        }}
                      >
                        <TouchableOpacity onPress={() => this.onLike(index)}>
                          <CustomIcon
                            name={message.islike ? 'heart' : 'passion-heart'}
                            style={styles.like}
                          />
                        </TouchableOpacity>
                        <Text style={styles.tinyIcon}>{message.likes}</Text>
                      </View>
                    </View>
                  </View>
                </SwipeRow>
                <View style={styles.replyWrapper}>
                  <CommentReply
                    closeAllOpenRows={() => this.closeAllOpenRows()}
                    currentOpen={this.state.currentOpen}
                    references={this.references}
                    parentId={message.id}
                    onReply={this.props.onReply}
                    craftData={craftData}
                    navigation={this.props.navigation}
                    updateCommentsData={this.updateCommentsData}
                  />
                </View>
              </View>
            );
          })}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {},
  wrapper: {
    paddingRight: METRICS.spacingBig,
  },
  leftPerson: {
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'black',
    justifyContent: 'center',
    alignSelf: 'center',
    width: '100%',
    flex: 1,
    paddingLeft: METRICS.spacingBig,
    paddingTop: METRICS.spacingSmall,
  },
  image: {
    width: 0.8 * METRICS.avatarsmall,
    height: 0.8 * METRICS.avatarsmall,
    borderRadius: 0.8 * METRICS.avatarsmall,
  },
  contentWrapper: {
    marginLeft: METRICS.spacingNormal,
    marginRight: METRICS.spacingNormal,
    flex: 1,
  },
  name: {
    color: COLORS.whiteColor,
    fontSize: METRICS.fontSizeNormal,
    fontFamily: 'lato-bold',
  },
  commentInput: {
    flex: 1,
    flexDirection: 'column',
    flexGrow: 1,
  },
  content: {
    paddingTop: METRICS.spacingTiny,
    paddingBottom: METRICS.spacingTiny,
  },
  like: {
    color: COLORS.whiteColor,
    fontSize: METRICS.fontSizeBiggest,
    flexDirection: 'column',
    justifyContent: 'center',
    textAlign: 'center',
  },
  contentBottom: {
    flexDirection: 'row',
  },
  textBottom: {
    color: COLORS.nameDM,
    marginRight: METRICS.spacingHuge,
    fontSize: METRICS.fontSizeLight,
    paddingBottom: METRICS.spacingSmall,
  },
  parentWrapper: {
    marginLeft: METRICS.marginBig,
    marginRight: METRICS.marginBig,
    flex: 1,
    width: '100%',
    flexDirection: 'row',
  },
  replyWrapper: {
    flex: 1,
    width: METRICS.screenWidth * 0.94,
  },
  iconStyle: {
    color: COLORS.primaryColor,
    paddingRight: METRICS.marginTiny,
  },
  buttonWrapper: {
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  button: {
    borderColor: COLORS.whiteColor,
    borderWidth: 1,
    width: 110 * METRICS.ratioX,
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  activeButton: {
    backgroundColor: COLORS.blackColor,
    borderColor: COLORS.whiteColor,
  },
  textButton: {
    color: COLORS.whiteColor,
    fontSize: METRICS.fontSizeBig,
    fontFamily: 'lato',
  },
  deleteButton: {
    backgroundColor: COLORS.primaryColor,
    borderColor: COLORS.primaryColor,
  },
  tinyIcon: {
    color: COLORS.primaryColor,
    fontSize: 12 * METRICS.ratioX,
    paddingVertical: METRICS.spacingTiny,
    flexDirection: 'column',
    justifyContent: 'center',
    textAlign: 'center',
  },
});

function mapDispatchToProps(dispatch) {
  return {
    setPlayingCrafts: (data) => dispatch(setPlayingCrafts(data)),
    updateProfileUserId: (data) => dispatch(updateProfileUserId(data)),
    updateOnBackProfile: (data) => dispatch(updateOnBackProfile(data)),
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

export default connect(mapStateToProps, mapDispatchToProps)(CommentReply);
