import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Keyboard, Dimensions } from 'react-native';
import FastImage from 'react-native-fast-image';
import ImagePicker from 'react-native-image-picker';
import { connect } from 'react-redux';
import { CustomIcon } from '../..';
import { COLORS, METRICS, STYLES } from '../../../global';
import PlayingCraftService from '../../../services/PlayingCraftService';
import ProfileService from '../../../services/ProfileService';
import SearchService from '../../../services/SearchService';
import MentionsTextInput from '../../../custom_modules/react-native-mentions';
import { user } from '../../../global/Images';
import { setPlayingCrafts } from '../../../store/actions';
import Env from '../../../helpers/environment';

const { height, width } = Dimensions.get('window');
class CommentInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      comment: '',
      mentioned_users: [],
      keyword: '',
      commentArray: [],
      commentMode: true,
      photo: '',
      photo_name: '',
      photo_type: '',
    };
  }

  renderSuggestionsRow({ item }, hidePanel) {
    return (
      <TouchableOpacity onPress={() => this.onSuggestionTap(item.username, item.id, hidePanel)}>
        <View style={styles.suggestionsRowContainer}>
          <View style={styles.userIconBox}>
            <FastImage source={item.avatar ? { uri: item.avatar } : user} style={styles.image} />
          </View>
          <View style={styles.userDetailsBox}>
            {/* <Text style={styles.displayNameText}>{item.name}</Text> */}
            <Text style={styles.usernameText}>@{item.username}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  onSuggestionTap(username, id, hidePanel) {
    hidePanel();
    const comment = this.state.comment.slice(0, -this.state.keyword.length);
    this.setState({
      commentArray: [],
      comment: `${comment}@${username} `,
      mentioned_users: [...this.state.mentioned_users, id],
    });
  }

  callback(keyword) {
    if (this.reqTimer) {
      clearTimeout(this.reqTimer);
    }
    this.reqTimer = setTimeout(() => {
      if (keyword.replace(/^@+/g, '') === '') {
        this.setState({ commentArray: [] });
      }
      SearchService.getUserSuggestions(keyword.replace(/^@+/g, ''))
        .then((res) => {
          if (keyword[keyword.length - 1] === ' ' && res.data.users.length === 1) {
            const comment = this.state.comment.slice(0, -this.state.keyword.length - 1);
            this.setState({
              commentArray: [],
              comment: `${comment}@${res.data.users[0].username}`,
            });
          }
          this.setState({
            keyword,
            commentArray: [...res.data.users],
          });
        })
        .catch((err) => {
          // console.log(err.response.data.error);
        });
    }, 200);
  }

  setCommentMode = (mode) => {
    this.setState({
      commentMode: mode,
    });
  };

  onAttach = () => {
    const options = {
      noData: true,
    };
    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.uri) {
        this.setState({
          photo: response.uri,
          photo_name: response.fileName,
          photo_type: response.type,
        });
      }
    });
  };

  onSend = () => {
    const { comment, commentMode, photo, mentioned_users, photo_name, photo_type } = this.state;
    Keyboard.dismiss();
    if (photo) {
      ProfileService.uploadImage(photo, photo_name, photo_type)
        .then((res) => {
          if (commentMode === true) {
            PlayingCraftService.addComment(
              this.props.playingCrafts[this.props.curCraftId].id,
              comment,
              Env.S3URL + res.url,
              mentioned_users
            )
              .then((result) => {
                this.setState({
                  comment: '',
                  mentioned_users: [],
                });
                this.props.updateCommentsData();
              })
              .catch((err) => {
                // console.log(err.response.data.error);
              });
          } else {
            // console.log('not = ', res)
            PlayingCraftService.replyComment(
              this.props.playingCrafts[this.props.curCraftId].id,
              comment,
              this.props.replyId,
              res.data,
              mentioned_users
            )
              .then((res) => {
                this.setState({
                  commentMode: true,
                  comment: '',
                  mentioned_users: [],
                });
                this.props.updateCommentsData();
              })
              .catch((err) => {
                // console.log(err.response.data.error);
              });
          }
        })
        .catch((err) => {
          // console.log(err.response.data.error);
        });
    } else if (commentMode === true) {
      PlayingCraftService.addComment(
        this.props.playingCrafts[this.props.curCraftId].id,
        comment,
        photo,
        mentioned_users
      )
        .then((res) => {
          // console.log(res);
          this.setState({
            comment: '',
            mentioned_users: [],
          });
          this.props.updateCommentsData();
        })
        .catch((err) => {
          // console.log(err.response.data.error);
        });
    } else {
      PlayingCraftService.replyComment(
        this.props.playingCrafts[this.props.curCraftId].id,
        comment,
        this.props.replyId,
        photo,
        mentioned_users
      )
        .then((res) => {
          this.setState({
            commentMode: true,
            comment: '',
            mentioned_users: [],
          });
          this.props.updateCommentsData();
        })
        .catch((err) => {
          // console.log(err.response.data.error);
        });
    }

    this.setState({
      photo: '',
    });
  };

  render() {
    const { photo } = this.state;
    return (
      <View keyboardShouldPersistTaps="handled" style={styles.minimizeWrapper}>
        {this.state.photo ? <FastImage source={{ uri: photo }} style={styles.avatar} /> : null}
        <View style={[STYLES.horizontalAlign, styles.minimizebottom]}>
          <TouchableOpacity onPress={this.onAttach}>
            <CustomIcon name="plus1" style={styles.icon} />
          </TouchableOpacity>
          <MentionsTextInput
            keyboardShouldPersistTaps="handled"
            multiline
            editable
            selectionColor={COLORS.primaryColor}
            keyboardAppearance="dark"
            autoCapitalize="none"
            textInputStyle={styles.singleTextInput}
            suggestionsPanelStyle={
              this.state.photo ? styles.suggestionsPanelStyle : styles.suggestionsPanelPicStyle
            }
            trigger="@"
            triggerLocation="new-word-only" // 'new-word-only', 'anywhere'
            value={this.state.comment}
            onChangeText={(val) => {
              this.setState({ comment: val });
            }}
            triggerCallback={this.callback.bind(this)}
            renderSuggestionsRow={this.renderSuggestionsRow.bind(this)}
            suggestionsData={this.state.commentArray} // array of objects
            keyExtractor={(item, index) => item.username}
            suggestionRowHeight={50}
            placeholder={this.state.commentMode ? 'Add a comment...' : 'Reply...'}
            placeholderTextColor={COLORS.greygreyColor}
            textInputMaxHeight={METRICS.screenHeight}
          />
          <TouchableOpacity onPress={this.onSend}>
            <CustomIcon name="right-arrow" style={styles.icon2} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  minimizeWrapper: {
    position: 'absolute',
    flex: 1,
    bottom: -80 * METRICS.ratioY,
    backgroundColor: 'black',
    borderWidth: 1 * METRICS.ratioX,
    borderTopColor: 'white',
    justifyContent: 'center',
    padding: 5 * METRICS.ratioY,
  },
  minimizebottom: {
    flex: 1,
    paddingRight: METRICS.spacingTiny,
    paddingLeft: METRICS.spacingTiny,
    paddingBottom: METRICS.spacingTiny,
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  avatar: {
    borderColor: COLORS.btnGrey,
    borderWidth: 1,
    width: 100 * METRICS.ratioX,
    height: 100 * METRICS.ratioX,
    resizeMode: 'cover',
    top: 10 * METRICS.ratioY,
    left: 30 * METRICS.ratioX,
    justifyContent: 'center',
    marginBottom: 20 * METRICS.ratioY,
  },
  icon: {
    color: COLORS.whiteColor,
    fontSize: METRICS.fontSizeHuge,
    marginHorizontal: METRICS.spacingNormal,
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
  icon2: {
    color: COLORS.whiteColor,
    fontSize: METRICS.fontSizeBigger,
    marginHorizontal: METRICS.spacingNormal,
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
  text: {
    color: COLORS.whiteColor,
    fontSize: METRICS.fontSizeBig,
    fontFamily: 'lato',
  },
  singleTextInput: {
    fontFamily: 'Lato',
    fontSize: METRICS.fontSizeMedium,
    color: 'white',
    width:
      width -
      METRICS.spacingNormal * 4 -
      METRICS.fontSizeHuge -
      METRICS.fontSizeBigger -
      METRICS.spacingTiny * 2 -
      METRICS.marginSmall * 2 -
      2,
    flex: 1,
    marginLeft: METRICS.marginSmall,
    marginRight: METRICS.marginSmall,
    marginTop: METRICS.marginTiny,
    backgroundColor: 'black',
  },
  suggestionsPanelStyle: {
    backgroundColor: COLORS.blackColor,
    borderWidth: 1 * METRICS.ratioX,
    borderColor: COLORS.whiteColor,
    position: 'absolute',
    width: METRICS.screenWidth,
    marginHorizontal: -0.168 * METRICS.screenWidth,
    paddingHorizontal: METRICS.spacingSmall,
    marginTop: -175 * METRICS.ratioX,
  },
  suggestionsPanelPicStyle: {
    backgroundColor: COLORS.blackColor,
    borderWidth: 1 * METRICS.ratioX,
    borderColor: COLORS.whiteColor,
    position: 'absolute',
    marginHorizontal: -0.168 * METRICS.screenWidth,
    width: METRICS.screenWidth,
    paddingHorizontal: METRICS.spacingSmall,
    marginTop: -53.5,
  },
  suggestionsRowContainer: {
    flexDirection: 'row',
  },
  userAvatarBox: {
    width: 35 * METRICS.ratioX,
    paddingTop: 2 * METRICS.ratioX,
  },
  userIconBox: {
    paddingVertical: METRICS.spacingTiny,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.blackColor,
  },
  usernameInitials: {
    color: COLORS.blackColor,
    fontWeight: '800',
    fontSize: METRICS.fontSizeNormal,
  },
  userDetailsBox: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: METRICS.spacingSmall,
    paddingRight: METRICS.spacingSmall,
  },
  displayNameText: {
    fontSize: METRICS.fontSizeNormal,
    fontFamily: 'lato',
    fontWeight: '500',
    color: COLORS.whiteColor,
  },
  image: {
    width: METRICS.avatarsmall,
    height: METRICS.avatarsmall,
    borderRadius: METRICS.avatarsmall,
  },
  usernameText: {
    fontSize: METRICS.fontSizeNormal,
    fontFamily: 'lato',
    color: COLORS.lightGrey,
    paddingVertical: METRICS.spacingTiny,
  },
});

function mapDispatchToProps(dispatch) {
  return {
    setPlayingCrafts: (crafts) => dispatch(setPlayingCrafts(crafts)),
  };
}

function mapStateToProps(state) {
  return {
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

export default connect(mapStateToProps, mapDispatchToProps)(CommentInput);
