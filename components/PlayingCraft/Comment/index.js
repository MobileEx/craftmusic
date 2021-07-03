import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  ScrollView,
  Linking,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import moment from 'moment';
import { SwipeRow } from 'react-native-swipe-list-view';
import { connect } from 'react-redux';
import { COLORS, METRICS, STYLES } from '../../../global';
import { comments } from '../../../global/Seeds';
import CustomIcon from '../../CustomIcon';
import TextComponent from './Text';
import ImageComponent from './Image';
import CommentInput from './CommentInput';
import PlayingCraftService from '../../../services/PlayingCraftService';
import CommentReply from './CommentReply';
import SearchService from '../../../services/SearchService';
import { user } from '../../../global/Images';
import { ReportModal } from '../..';
import { setPlayingCrafts, updateProfileUserId, updateOnBackProfile } from '../../../store/actions';

const radio_props = [
  { label: '  Miscategorized Content', value: 0 },
  { label: '  Inappropriate Content', value: 1 },
  { label: '  Abuse/Harassment', value: 2 },
  { label: '  Intellectual Property/Copyright Infringement', value: 3 },
];

class CommentTab extends React.Component {
  constructor(props) {
    super(props);
    // commentMode = true  : Add a comment
    // commentMode = false : Reply comment
    this.state = {
      likeFlags: [],
      replayFlags: [],
      commentMode: true,
      replyId: 0,
      curCraftId: 0,
      comments: [],
      reportModalVisible: false,
      reportOptionSelected: 0,
      reportCommentId: -1,
      currentOpen: -1,
    };
    this.commentRef = React.createRef();
    this.replayRef = React.createRef();
    this.references = {};
  }

  componentDidMount() {
    const { comments } = this.state;
    this.setState({
      curCraftId: this.props.curCraftId,
      keyboardHeight: 0,
    });
    _keyboardWillShowSubscription = Keyboard.addListener('keyboardDidShow', (e) =>
      this._keyboardWillShow(e)
    );
    this.updateCommentsData();
  }

  _keyboardWillShow(e) {
    this.setState({ height: e.endCoordinates.height });
  }

  componentWillUnmount() {
    _keyboardWillShowSubscription.remove();
  }

  updateCommentsData = () => {
    const craft = this.props.playingCrafts[this.props.curCraftId];
    PlayingCraftService.getCraft(craft.id)
      .then((res) => {
        const tmpCrafts = this.props.playingCrafts;
        tmpCrafts[this.props.curCraftId] = res.data;
        this.props.setPlayingCrafts(tmpCrafts);
      })
      .catch((err) => {
        // console.log(err.response.error.data);
      });
    PlayingCraftService.getComments(this.props.playingCrafts[this.props.curCraftId].id)
      .then((res) => {
        this.closeAllOpenRows();
        this.setState({
          comments: res.data,
        });

        const replayFlags = [];
        for (let i = 0; i < res.data.length; i++) {
          replayFlags.push(false);
        }
        this.setState({ replayFlags });
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
        .then((res) => {
          this.updateCommentsData();
        })
        .catch((err) => {
          // console.log(err.response.data.error);
        });
    } else {
      PlayingCraftService.likeComment(this.state.comments[index].id)
        .then((res) => {
          // console.log('likeComment res',res.data);
          this.updateCommentsData();
        })
        .catch((err) => {
          // console.log('likeComment error', err.response.data.error);
        });
    }
  };

  onShowReply = (index) => {
    const tmp = this.state.replayFlags;
    tmp[index] = !tmp[index];
    this.setState({
      replayFlags: tmp,
    });
  };

  onReply = (id) => {
    this.setState(
      {
        commentMode: false,
        replyId: id,
      },
      () => {
        this.commentRef.current.setCommentMode(false);
      }
    );
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
          isFromComments: true,
        });

        this.props.onGoProfile();
      })
      .catch((err) => {
        // console.log(err.response.data.error);
      });
  };

  onPressHashtag = (e, hashtag) => {
    const { navigation } = this.props;
    this.props.updateOnBackProfile(this.props.onBackProfile);
    navigation.navigate('HashedCrafts', {
      refresh: false,
      hashtag: `#${hashtag}`,
      crafts_count: 0,
    });

    this.props.onGoProfile();
  };

  onPressLink = (e, link) => {
    Linking.openURL(`http://${link}`).catch((err) => console.error('An error occurred', err));
  };

  deleteComment = (id) => {
    PlayingCraftService.deleteComment(id)
      .then((res) => {
        // console.log('delete--',res)
        setTimeout(() => {
          this.updateCommentsData();
        }, 500);
      })
      .catch((err) => {
        // alert(err.response.data.error);
      });
  };

  setReportModalVisible = (visible) => {
    this.setState({ reportModalVisible: visible });
  };

  closeReportModal = () => {
    this.setState({ reportModalVisible: false });
  };

  onSubmitReport = (id, rowMap, index) => {
    PlayingCraftService.reportComment(id)
      .then((res) => {
        this.closeAllOpenRows();
      })
      .catch((err) => {
        // console.log(err.response.data.error, id);
      });
    this.closeReportModal();
  };

  onCLoseRow(rowMap, index) {
    rowMap[index].closeRow();
  }

  reportActionSelected = (index) => {
    this.setState({
      reportOptionSelected: index,
    });
  };

  reportComment = (id, rowMap, index) => {
    this.onSubmitReport(id, rowMap, index);
  };

  renderSwipeElement(item, index, craftData, rowMap) {
    if (this.props.user.id === item.user.id) {
      // My Comment
      return (
        <TouchableOpacity
          style={[styles.button, styles.activeButton, styles.deleteButton, { height: '100%' }]}
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

  closeRow = () => {
    this.rowRef.closeRow();
  };

  closeAllOpenRows = () => {
    if (this.state.currentOpen != -1 && this.references[this.state.currentOpen]) {
      this.references[this.state.currentOpen].closeRow();
    }
  };

  render() {
    const craftData = this.props.playingCrafts
      ? this.props.playingCrafts[this.state.curCraftId]
      : null;
    const { comments, replayFlags } = this.state;
    const keyboardHeight = 0.2 * METRICS.screenHeight;
    let swipeValue = -112 * METRICS.ratioX;
    return (
      <View>
        <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
          <ScrollView
            style={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* <Text style={styles.title}>Comments</Text> */}

            <View style={styles.wrapper}>
              {comments.map((item, index) => {
                if (this.props.user.id === item.user.id) {
                  swipeValue = -112 * METRICS.ratioX;
                } else if (this.props.user.id != craftData.owner_id) {
                  swipeValue = -112 * METRICS.ratioX;
                } else {
                  swipeValue = -222 * METRICS.ratioX;
                }
                return (
                  <View key={String(item.id)} style={{ flex: 1 }}>
                    <SwipeRow
                      disableRightSwipe
                      key={String(item.id)}
                      rightOpenValue={swipeValue}
                      recalculateHiddenLayout={false}
                      ref={(row) => (this.references[item.id] = row)}
                      swipeGestureBegan={() => {
                        if (
                          this.state.currentOpen != -1 &&
                          this.references[this.state.currentOpen] != undefined
                        ) {
                          this.references[this.state.currentOpen].closeRow();
                        }
                        this.setState({ currentOpen: item.id });
                      }}
                    >
                      <View style={styles.buttonWrapper}>
                        {this.renderSwipeElement(item, index, craftData)}
                      </View>

                      <View key={index} style={styles.leftPerson}>
                        <View style={styles.parentWrapper}>
                          <View style={styles.imageWrapper}>
                            <TouchableOpacity onPress={() => this.onUser(item.user.id)}>
                              <FastImage
                                source={item.user.avatar ? { uri: item.user.avatar } : user}
                                style={styles.image}
                              />
                            </TouchableOpacity>
                          </View>
                          <View style={styles.contentWrapper}>
                            <View style={[STYLES.horizontalAlign, { flexDirection: 'row' }]}>
                              <Text style={styles.name}>{item.user.username} </Text>
                              {item.user.types &&
                                this.showUsertypeIcon(item.user.types, item.user.verified_at)}
                            </View>

                            <View style={styles.content}>
                              {item.attach_url !== null && (
                                <ImageComponent content={{ uri: item.attach_url }} />
                              )}
                              {item.comment_body !== '' && (
                                <TextComponent
                                  content={item.content}
                                  onPressHashtag={this.onPressHashtag}
                                  onPressMention={this.onPressMention}
                                  onPressLink={this.onPressLink}
                                />
                              )}
                            </View>
                            <View style={styles.contentBottom}>
                              <Text style={styles.textBottom}>
                                {moment(moment.utc(item.created_at).local()).fromNow()}
                              </Text>
                              <TouchableOpacity onPress={() => this.onReply(item.id)}>
                                <Text style={styles.textBottom}>Reply</Text>
                              </TouchableOpacity>
                            </View>
                            <TouchableOpacity
                              onPress={() => {
                                this.closeAllOpenRows();
                                this.onShowReply(index);
                              }}
                            >
                              <Text style={item.replies > 0 ? styles.textReply : styles.noreply}>
                                {item.replies} replies..
                              </Text>
                            </TouchableOpacity>
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
                                name={item.islike ? 'heart' : 'passion-heart'}
                                style={styles.like}
                              />
                            </TouchableOpacity>
                            <Text style={styles.tinyIcon}>{item.likes}</Text>
                          </View>
                        </View>
                      </View>
                    </SwipeRow>
                    {replayFlags[index] && (
                      <View style={styles.replyWrapper}>
                        <CommentReply
                          closeAllOpenRows={() => this.closeAllOpenRows()}
                          currentOpen={this.state.currentOpen}
                          references={this.references}
                          parentId={item.id}
                          onReply={this.onReply}
                          craftData={craftData}
                          navigation={this.props.navigation}
                          updateCommentsData={this.updateCommentsData}
                        />
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          </ScrollView>
          <ReportModal
            status={this.state.reportModalVisible}
            onClose={this.closeReportModal}
            onCloseRequest={this.setReportModalVisible}
            onPress={this.reportActionSelected}
            selectedOption={this.state.reportOptionSelected}
            radio_props={radio_props}
            onSubmitReport={this.onSubmitReport}
          />
        </KeyboardAwareScrollView>
        <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={keyboardHeight}>
          <CommentInput
            currentOpen={this.state.currentOpen}
            references={this.references}
            ref={this.commentRef}
            replyId={this.state.replyId}
            updateCommentsData={this.updateCommentsData}
          />
        </KeyboardAvoidingView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {},
  scrollContainer: {
    height: 700 * METRICS.ratioY,
    flex: 5,
  },
  commentInput: {
    flex: 1,
    flexDirection: 'column',
    flexGrow: 1,
  },
  title: {
    color: COLORS.primaryColor,
    fontFamily: 'lato-bold',
    fontSize: METRICS.fontSizeMedium,
    textAlign: 'center',
    marginBottom: METRICS.spacingHuge,
  },
  wrapper: {
    flex: 1,
    paddingLeft: METRICS.spacingBig,
  },
  leftPerson: {
    flexDirection: 'column',
    width: '100%',
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'black',
    justifyContent: 'center',
    paddingTop: METRICS.spacingSmall,
  },
  image: {
    width: METRICS.avatarsmall,
    height: METRICS.avatarsmall,
    borderRadius: METRICS.avatarsmall,
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
  content: {
    paddingTop: METRICS.spacingSmall,
    paddingBottom: METRICS.spacingSmall,
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
  parentWrapper: {
    flex: 1,
    flexDirection: 'row',
  },
  replyWrapper: {
    marginLeft: METRICS.marginBig,
    flex: 1,
    width: '100%',
  },
  textBottom: {
    color: COLORS.nameDM,
    marginRight: METRICS.spacingHuge,
    fontSize: METRICS.fontSizeLight,
    fontFamily: 'lato',
  },
  textReply: {
    color: COLORS.primaryColor,
    fontSize: METRICS.fontSizeOK,
    fontFamily: 'lato-semibold',
    marginTop: METRICS.marginTiny,
    marginBottom: METRICS.spacingSmall,
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
    savePrevState: state.savePrevState,
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

export default connect(mapStateToProps, mapDispatchToProps)(CommentTab);
