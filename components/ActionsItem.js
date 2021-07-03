import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { connect } from 'react-redux';
import CustomIcon from './CustomIcon';
import { COLORS, METRICS, STYLES } from '../global';
import ProfileService from '../services/ProfileService';
import { craft, craftlistBg, user } from '../global/Images';
import store from '../store/configureStore';
import {
  updateCraftPlaying,
  setPlayingCrafts,
  updateProfileUserId,
  updateTitle,
  updateCurCraftId,
  updatePrevState,
  updateBackScreen,
} from '../store/actions';

const ActionContainer = ({ children, touchable, onPress }) => {
  return touchable ? (
    <TouchableHighlight onPress={onPress}>{children}</TouchableHighlight>
  ) : (
    <View>{children}</View>
  );
};

class ActionsItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      followingStatus: this.props.followingStatus || false,
    };
  }

  static getDerivedStateFromProps(next, prev) {
    if (next.followingStatus != prev.followingStatus) {
      return { followingStatus: next.followingStatus };
    }
    return null;
  }

  follow = (id) => {
    let { followingStatus } = this.state;
    if (followingStatus) {
      ProfileService.unFollow(id)
        .then((res) => {})
        .catch((err) => console.log(err.response.data.error));
    } else {
      ProfileService.follow(id)
        .then((res) => {})
        .catch((err) => console.log(err.response.data.error));
    }
    followingStatus = !followingStatus;
    this.setState({ followingStatus });
  };

  confirm = () => {
    const { callback } = this.props;
    callback('confirm');
  };

  cancel = () => {
    const { callback } = this.props;
    callback('cancel');
  };

  renderRight = (type, image, userid) => {
    const { confirm, cancel } = this;
    switch (type) {
      case 'button':
        return (
          <View style={styles.rightWrapper}>
            {this.state.followingStatus ? (
              <TouchableHighlight
                style={{
                  ...styles.followingButton,
                  ...STYLES.centerAlign,
                }}
                onPress={() => this.follow(userid)}
              >
                <Text style={styles.buttonText}>Following</Text>
              </TouchableHighlight>
            ) : (
              <TouchableHighlight
                style={{
                  ...styles.followButton,
                  ...STYLES.centerAlign,
                }}
                onPress={() => this.follow(userid)}
              >
                <Text style={styles.buttonText}>Follow</Text>
              </TouchableHighlight>
            )}
          </View>
        );
      case 'cancel':
      case 'confirmation':
        return (
          <View style={styles.rightWrapper}>
            {type === 'confirmation' && (
              <TouchableHighlight onPress={confirm}>
                <CustomIcon name="check-sign" style={styles.correct} />
              </TouchableHighlight>
            )}
            <TouchableHighlight onPress={cancel}>
              <CustomIcon name="error" style={styles.wrong} />
            </TouchableHighlight>
          </View>
        );
      case 'navigation':
        return (
          <View style={styles.rightWrapper}>
            <CustomIcon
              name="next"
              style={{
                color: COLORS.whiteColor,
                marginHorizontal: METRICS.spacingTiny,
              }}
              size={METRICS.fontSizelarge}
            />
          </View>
        );
      case 'craft':
      case 'comment':
        return image ? (
          <View style={styles.rightWrapper}>
            <FastImage source={{ uri: image }} style={styles.rightImage} />
          </View>
        ) : (
          <View style={styles.rightWrapper}>
            <FastImage source={craft} style={styles.rightImage} />
          </View>
        );
      case 'craftList':
        return image ? (
          <View style={styles.rightWrapper}>
            <FastImage source={{ uri: image }} style={styles.rightImage} />
          </View>
        ) : (
          <View style={styles.rightWrapper}>
            <FastImage source={craftlistBg} style={styles.rightImage} />
          </View>
        );
      default:
        return image ? (
          <View style={styles.rightWrapper}>
            <FastImage source={{ uri: image }} style={styles.rightImage} />
          </View>
        ) : null;
    }
  };

  goToProfile = (id) => {
    this.props.updatePrevState(store.getState());
    this.props.updateProfileUserId(id);
    this.props.updateTitle('Profile');
    this.props.updateBackScreen('Notifications');
    this.props.navigation.navigate('Profile', { refresh: true });
  };

  render() {
    const {
      recipientAvatar,
      senderAvatar,
      type,
      senderName,
      senderId,
      receiverName,
      receiverId,
      description,
      onPress,
      time,
      image,
    } = this.props;
    const SenderExist = description.includes(senderName);
    const ReceiverExist = description.includes(receiverName);
    let username;
    let userid;
    let avatar;
    if (SenderExist) {
      username = senderName;
      userid = senderId;
      avatar = senderAvatar;
    } else if (ReceiverExist) {
      username = receiverName;
      userid = receiverId;
      avatar = recipientAvatar;
    }
    const arr = description.split(username);
    let avatarNull = false;
    let avatarImage;
    if (avatar) {
      avatarNull = avatar.includes('null');
    }
    if (avatarNull === true) {
      avatarImage = null;
    } else {
      avatarImage = avatar;
    }
    const isTouchable = type === 'navigation' || 'comment' || 'craft';
    const renderRight = this.renderRight(type, image, userid);
    return (
      <ActionContainer touchable={isTouchable} onPress={onPress}>
        <View style={[STYLES.horizontalAlign, styles.userItem]}>
          <View style={styles.avatarWrap}>
            <TouchableHighlight onPress={() => this.goToProfile(userid)}>
              {avatarImage != null ? (
                <FastImage source={{ uri: avatarImage }} style={styles.avatar} />
              ) : (
                <FastImage source={user} style={styles.avatar} />
              )}
            </TouchableHighlight>
          </View>
          <View style={styles.content}>
            <View style={styles.maincontent}>
              <Text style={styles.text}>
                {arr[0]}
                <Text style={styles.name}>{username}</Text>
                <Text style={styles.text}>{arr[1]}</Text>
              </Text>
            </View>
            <Text style={styles.time}>{time}</Text>
          </View>
          {renderRight && <View style={styles.rightWrapper}>{renderRight}</View>}
        </View>
      </ActionContainer>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    setPlayingCrafts: (crafts) => dispatch(setPlayingCrafts(crafts)),
    updateCraftPlaying: (playing) => dispatch(updateCraftPlaying(playing)),
    updatePrevState: (playing) => dispatch(updatePrevState(playing)),
    updateCurCraftId: (playing) => dispatch(updateCurCraftId(playing)),
    updateTitle: (playing) => dispatch(updateTitle(playing)),
    updateProfileUserId: (playing) => dispatch(updateProfileUserId(playing)),
    updateBackScreen: (playing) => dispatch(updateBackScreen(playing)),
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

const styles = StyleSheet.create({
  userItem: {
    paddingVertical: METRICS.followspacing,
  },
  content: {
    flex: 6,
  },
  maincontent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '95%',
  },
  text: {
    color: COLORS.whiteColor,
    fontSize: METRICS.fontSizeNormal,
    fontFamily: 'lato',
    textAlign: 'left',
  },
  name: {
    fontFamily: 'lato-bold',
    fontSize: METRICS.fontSizeMedium,
    color: COLORS.primaryColor,
  },
  time: {
    color: COLORS.inActive,
    fontSize: METRICS.fontSizeLight,
    marginTop: METRICS.spacingSmall,
  },
  correct: {
    fontSize: METRICS.fontSizeHuge,
    color: COLORS.primaryColor,
    marginRight: 25 * METRICS.ratioX,
  },
  wrong: {
    fontSize: METRICS.fontSizeHuge,
    color: COLORS.whiteColor,
    marginLeft: 25 * METRICS.ratioX,
  },
  rightWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    position: 'relative',
  },
  rightImage: {
    width: 50 * METRICS.ratioX,
    height: 50 * METRICS.ratioX,
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
  buttonText: {
    fontFamily: 'lato-bold',
    fontSize: METRICS.fontSizeNormal,
    color: COLORS.whiteColor,
  },
  avatarWrap: {
    marginRight: METRICS.spacingSmall,
  },
  avatar: {
    height: METRICS.avatarsmall,
    width: METRICS.avatarsmall,
    borderRadius: METRICS.avatarsmall / 2,
  },
  thumbnail: {
    height: METRICS.avatarsmall,
    width: METRICS.avatarsmall,
  },
});

ActionsItem.propTypes = {
  name: PropTypes.string,
  description: PropTypes.string,
  time: PropTypes.string,
  callback: PropTypes.func,
  status: PropTypes.bool,
};

ActionsItem.defaultProps = {
  name: 'Screen',
  description: 'Screen',
  time: 'Just now',
  type: 'button',
  status: false,
  callback: () => {},
  onPress: () => {},
};

export default connect(mapStateToProps, mapDispatchToProps)(ActionsItem);
