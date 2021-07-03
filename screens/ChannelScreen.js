import React from 'react';
import {
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  Clipboard,
  Modal,
  Linking,
} from 'react-native';
import { connect } from 'react-redux';
import {
  GiftedChat,
  Bubble,
  Send,
  Avatar,
  Actions,
  InputToolbar,
  utils,
  Day,
} from 'react-native-gifted-chat';
import moment from 'moment';
import Video from 'react-native-video';
import DocumentPicker from 'react-native-document-picker';
import firebase from 'react-native-firebase';
import _, { isArray } from 'lodash';
import ImagePicker from 'react-native-image-crop-picker';
import uuid from 'react-native-uuid-generator';
import * as Progress from 'react-native-progress';
import ImageView from 'react-native-image-view';
import Orientation from 'react-native-orientation-locker';
import RNFetchBlob from 'rn-fetch-blob';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import ActionSheet from 'react-native-action-sheet';
import RBSheet from 'react-native-raw-bottom-sheet';
import Upload from 'react-native-background-upload';
import Animated from 'react-native-reanimated';
import Share from 'react-native-share';
import { zip, unzip } from 'react-native-zip-archive';

import ProfileService from '../services/ProfileService';
import { CustomIcon, DMPopup, DMHeader, Giphy } from '../components';
import { COLORS, METRICS, STYLES } from '../global';
import {
  ProgressImage,
  MessageType,
  UpdatingMsgType,
  PATTERNS,
  getFlashMessage,
  getFileExtension,
  GIF_TYPES,
} from '../utils/chat';
import {
  getAllChatGroups,
  updateLastMsg,
  deleteChatGroup,
  updateDMCounter,
  updateTitle,
  updatePrevState,
} from '../store/actions';
import store from '../store/configureStore';
import Player from '../components/ChatComponents/AudioPlayer';

const { isSameDay, isSameUser } = utils;

const defaultAvatar = 'https://craftmusic.nyc3.digitaloceanspaces.com/user.png';

class ChannelScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isImageViewVisible: false,
      isFullScreen: false,
      images: [],
      channelPopup: false,
      isBuffering: false,
      chatId: this.props.navigation.state.params.chatId,
      channel: this.props.navigation.state.params.channel,
      typedMessage: '',
      isTyping: false,
      user: this.props.navigation.state.params.user,
      modalStatus: false,
      editChannel: null,
      image: null,
      file: null,
      video: null,
      messages: [],
      cureentMessage: {},
      paused: true,
      progress: 0,
      duration: 0,
      counter: 0,
      onlineUsers: [],
      typingUsers: [],
      groupMembers: [],
      messagesSeed: [],
      currentImage: null,
      uploading: false,
      transferred: 0,
      totalBytes: 0,
      messagePathRef: null,
      blockingList: [],
      blocksList: [],
      showTyping: true,
      filename: '',
      orientation: '',
      currentTask: null,
    };
  }

  static defaultProps = {
    updatePrevState: (data, dispatch) => dispatch(updatePrevState(data)),
    updateTitle: (title, dispatch) => dispatch(updateTitle(title)),
  };

  static navigationOptions = ({ navigation }) => {
    const channel = navigation.state.params.channel.data;
    const { chatUser, user, prevScreen } = navigation.state.params;
    const editChannel = navigation.getParam('editChannel');
    const isIndividual = channel.group_details.is_personal;
    const parsedUsers = JSON.parse(channel.group_details.users);
    const { key } = parsedUsers.filter((parsedUser) => parsedUser.key !== user.id)[0];
    let userData = {};
    async () => {
      const result = await ProfileService.getUserInfo(key).then((res) => {
        return res.data;
      });
      userData = { ...result };
    };
    const groupIcon = channel.group_details.image
      ? channel.group_details.image
      : isIndividual
      ? parsedUsers.filter((parsedUser) => parsedUser.key !== user.id)[0].avatar
        ? parsedUsers.filter((parsedUser) => parsedUser.key !== user.id)[0].avatar
        : defaultAvatar
      : undefined;
    return {
      headerStyle: {
        backgroundColor: COLORS.blackColor,
        paddingVertical: METRICS.spacingNormal,
        marginTop: METRICS.spacingSmall,
        borderBottomWidth: 0,
      },
      headerTitle: (
        <DMHeader
          title={
            channel.group_details.name
              ? channel.group_details.name
              : isIndividual
              ? parsedUsers.filter((parsedUser) => parsedUser.key !== user.id)[0].username
              : ''
          }
          groupIcon={groupIcon}
        />
      ),
      headerLeft: (
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            this.defaultProps.updatePrevState(store.getState(), store.dispatch);
            this.defaultProps.updatePrevState('DM', store.dispatch);
            if (prevScreen) {
              navigation.navigate(prevScreen);
            } else {
              navigation.navigate('DM');
            }
          }}
        >
          <CustomIcon name="back" style={styles.backIcon} />
        </TouchableOpacity>
      ),
      headerRight: !isIndividual && (
        <TouchableOpacity style={styles.dotsButton} onPress={editChannel}>
          <CustomIcon
            name="three-dots-more-indicator"
            size={18 * METRICS.ratioX}
            style={styles.backIcon}
          />
        </TouchableOpacity>
      ),
    };
  };

  onTaskCancel = async () => {
    const { task } = this.state;
    if (task) {
      console.log('trying cancel');
      try {
        console.log('trying  cancel()');
        await task.cancel();
      } catch (error) {
        console.log(error, 'err');
      }
    }
  };

  // for custom video player
  handleMainButtonTouch = () => {
    if (this.state.progress >= 1) {
      this.player1.seek(0);
    }
    this.setState((state) => {
      return {
        paused: !state.paused,
      };
    });
  };

  handleProgressPress = (e) => {
    const position = e.nativeEvent.locationX;
    const progress = (position / 250) * this.state.duration;
    this.player1.seek(progress);
  };

  handleProgress = (progress) => {
    this.setState((prevState) => ({
      ...prevState,
      progress: progress.currentTime / prevState.duration,
    }));
  };

  handleEnd = () => {
    this.setState({ paused: true }, () => {
      this.player1.seek(10, 10);
      this.handleLoad();
    });
  };

  handleLoad = (meta) => {
    this.setState({
      duration: meta.duration,
    });
  };

  // End Custom video style */}

  detectTyping = (text) => {
    if (text !== '') this.init = true;
    this.startTyping();
    this.stopTyping();
  };

  _docPicker = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });

      const { uri, type, name } = res;
      this.setState({ currentFile: { url: uri, type, name } });

      return res;
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        return err;
        // User cancelled the picker, exit any dialogs or menus and move on
      }
      throw err;
    }
  };

  addPhoto = async () => {
    this.setState({ visible: false });

    const res = await ImagePicker.openPicker({
      mediaType: 'any',
    }).then((file) => {
      const { filename, path } = file;
      const source = { uri: path };
      this.setState({ currentImage: source, filename });
      return file;
    });
    return res;
  };

  async componentDidMount() {
    this.props.navigation.setParams({
      editChannel: this._editChannel,
    });
    this.props.navigation.setParams({
      togglePopup: this.onToggleModal,
    });
    setTimeout(() => {
      this.setState((prevState) => ({
        ...prevState,
        counter: prevState.counter + 1,
      }));
    }, 1000);

    await this.getOnlineUser();
    await this.getTypingUser();
    this.getMembers();
    this.readMessages();
    this.checkBlocklist();
    // this.markAsRead();
    this.on((message) => {
      this.setState((previousState) => ({
        messages: GiftedChat.append(previousState.messages, message),
      }));
    });

    Orientation.getDeviceOrientation((deviceOrientation) => {
      this.setState({ orientation: deviceOrientation });
    });

    Orientation.addDeviceOrientationListener(this._onOrientationDidChange);
  }

  _onOrientationDidChange = (orientation) => {
    const { isFullScreen } = this.state;
    if (isFullScreen) {
      if (orientation === 'LANDSCAPE-LEFT' || orientation === 'LANDSCAPE-RIGHT') {
        Orientation.lockToLandscape();
      } else Orientation.lockToPortrait();
    }
    this.setState({ orientation });
  };

  checkBlocklist = async () => {
    // for individual
    const channel = this.props.navigation.state.params.channel.data;
    const { group_details = {} } = channel;

    const isPersonal = group_details.is_personal;
    if (isPersonal) {
      const parsedUsers = JSON.parse(channel.group_details.users);
      const chatUser = parsedUsers.filter((parsedUser) => parsedUser.key !== this.user._id)[0];

      ProfileService.getBlock().then((res) => {
        const {
          data: { blockings = [], blocks = [] },
        } = res;
        this.setState((state) => ({
          ...state,
          blockingList: blockings.filter((user) => user.id === chatUser.key).map((user) => user.id),
          blocksList: blocks.filter((user) => user.id === chatUser.key).map((user) => user.id),
        }));
      });
    }

    // if Its  a group
    ProfileService.getBlock().then((res) => {
      const {
        data: { blockings = [], blocks = [] },
      } = res;
      const { groupMembers } = this.state;
      this.setState({
        blockingList: blockings
          .filter((user) => groupMembers.includes(user.id))
          .map((user) => user.id),
        blocksList: blocks.filter((user) => groupMembers.includes(user.id)).map((user) => user.id),
      });
    });
  };

  getOnlineUser = async () => {
    const userRef = firebase.database().ref('online');
    await userRef.on('value', (snapshot) => {
      if (snapshot.val() === false) {
        return;
      }
      if (Array.isArray(snapshot.val())) {
        this.setState({ onlineUsers: snapshot.val() });
      } else {
        this.setState({ onlineUsers: [snapshot.val()] });
      }
    });
  };

  getTypingUser = async () => {
    const typingRef = firebase.database().ref(`typing/${this.state.chatId}`);
    await typingRef.on('value', (snapshot) => {
      if (snapshot.val()) {
        if (Array.isArray(snapshot.val())) {
          snapshot.forEach((s) => {
            if (s.val().typing === false) {
              s.ref.remove();
            }
          });
          this.setState({ typingUsers: snapshot.val() });
        } else if (typeof snapshot.val() === 'object') {
          snapshot.forEach((s) => {
            if (s.val().typing === false) {
              s.ref.remove();
            }
          });
          this.setState({
            typingUsers: [Object.values(snapshot.val())[0]],
          });
        }
      }
    });
  };

  _editChannel = () => {
    this.setState((state) => {
      return { channelPopup: !state.channelPopup };
    });
  };

  get ref() {
    return firebase.database().ref(`groups/${this.state.chatId}/messages/`);
  }

  getMembers = async () => {
    this.membersRef.on('value', (snapshot) => {
      this.setState({ groupMembers: snapshot.val() });
    });
  };

  readMessages = async () => {
    this.props.getAllChatGroups().then((res) => console.log('updated'));
    this.ref.once('value', (snapshot) => {
      if (snapshot) {
        snapshot.forEach((snap) => {
          const readRef = snap.child('readBy').ref;
          const prev = snap.child('readBy').val();
          if (!prev.includes(this.user._id)) {
            const updated = [...prev, this.user._id];
            readRef.set(updated);
            this.props.updateDMCounter(0);
          }
        });
      }
    });
  };

  get membersRef() {
    return firebase.database().ref(`groups/${this.state.chatId}/meta/members/`);
  }

  get user() {
    return {
      _id: this.props.navigation.state.params.user.id,
      name: this.props.navigation.state.params.user.username,
      email: this.props.navigation.state.params.user.email,
      avatar: this.props.navigation.state.params.user.avatar,
    };
  }

  get storageRef() {
    return firebase.storage().ref(`files/${this.state.chatId}`);
  }

  parse = (snapshot) => {
    const {
      timestamp: numberStamp,
      text,
      user,
      createdAt,
      received,
      sent,
      image,
      video,
      messageType,
      attachment,
      status,
      readBy,
      messageFor,
      dimensions,
    } = snapshot.val();
    const { key: _id } = snapshot;
    const timestamp = new Date(numberStamp);

    const message = {
      _id,
      timestamp,
      text,
      image,
      video,
      createdAt: new Date(createdAt),
      user,
      sent,
      received,
      messageType,
      attachment,
      status,
      readBy,
      messageFor,
      dimensions,
    };
    return message;
  };

  on = async (callback) => {
    this.ref.limitToLast(20).on('child_added', (snapshot) => {
      callback(this.parse(snapshot));
    });
  };

  timestamp() {
    return firebase.database.ServerValue.TIMESTAMP;
  }

  newMessage = async () => {
    const blocked = await this.checkblockStatus();
    if (blocked) {
      const message = getFlashMessage(blocked);
      return showMessage(message);
    }
    const messages = [
      {
        createdAt: new Date(),
        text: this.state.message,
        user: this.user,
      },
    ];
    for (let i = 0; i < messages.length; i++) {
      const { text, user, image, video, messageType, attachment } = messages[i];
      const message = {
        text,
        user,
        createdAt: new Date(),
        timestamp: this.timestamp(),
        sent: false,
        received: false,
        image: image || null,
        video: video || null,
        messageType: messageType || 'Text',
        attachment: attachment || null,
      };
      this.append(message);
      const group_id = this.props.navigation.state.params.channel.data.group_details.id;

      this.updateLastMessage(group_id, message.text ? message.text : '🏙  Image');
    }
  };

  onToggleModal = () => {
    this.setState((prevState) => {
      const stateUpdate = {
        channelPopup: !prevState.channelPopup,
      };
      if (prevState.channelPopup && prevState.editChannel) {
        stateUpdate.editChannel = null;
      }
      return stateUpdate;
    });
  };

  checkblockStatus = async () => {
    const channel = this.props.navigation.state.params.channel.data;
    const { group_details = {} } = channel;
    const isPersonal = group_details.is_personal;
    if (isPersonal) {
      const parsedUsers = JSON.parse(channel.group_details.users);
      const chatUser = parsedUsers.filter((parsedUser) => parsedUser.key !== this.user._id)[0];
      await ProfileService.getBlock().then((res) => {
        const {
          data: { blockings = [], blocks = [] },
        } = res;
        this.setState((state) => ({
          ...state,
          blockingList: blockings.filter((user) => user.id === chatUser.key).map((user) => user.id),
          blocksList: blocks.filter((user) => user.id === chatUser.key).map((user) => user.id),
        }));
      });

      if (
        this.state.blockingList.includes(chatUser.key) &&
        this.state.blocksList.includes(chatUser.key)
      ) {
        return 'Both';
      }
      if (this.state.blockingList.includes(chatUser.key)) {
        return 'Blocking';
      }
      if (this.state.blocksList.includes(chatUser.key)) {
        this.setState({ showTyping: false });
        return 'Blocked';
      }
    }
    this.setState({ showTyping: true });
    return false;
  };

  send = async (messages) => {
    const blocked = await this.checkblockStatus();
    if (blocked) {
      const message = getFlashMessage(blocked);

      return showMessage(message);
    }
    for (let i = 0; i < messages.length; i++) {
      const { text, user, image, video, attachment } = messages[i];
      const id = await uuid.getRandomUUID();
      const message = {
        _id: id,
        text,
        user,
        image,
        video,
        createdAt: new Date(),
        timestamp: this.timestamp(),
        sent: false,
        received: false,
        messageType: MessageType.TEXT,
        attachment,
        status: 'unread',
        readBy: [user._id],
        senderId: this.user._id,
        messageFor: [...this.state.groupMembers],
      };

      this.append(message);
      const group_id = this.props.navigation.state.params.channel.data.group_details.id;

      this.updateLastMessage(group_id, message.text ? message.text : '🏙  Image');
    }
  };

  updateLastMessage(group_id, last_message) {
    const LastMessage =
      last_message.length > 10
        ? `${last_message.split('').splice(0, 20).join('')} ...`
        : last_message;
    this.props
      .updateLastMsg({ group_id, last_message: LastMessage })
      .then((res) => {
        this.props.getAllChatGroups();
      })
      .catch((error) => {
        // console.log(error);
      });
  }

  append = (message) => {
    const b = {};
    Object.assign(b, message);
    b.sent = true;
    const visibleRef = firebase.database().ref(`groups/${this.state.chatId}/meta/visibleTo`);
    visibleRef.set(this.state.groupMembers);
    this.ref.push(message).then((response, error) => {
      if (error) {
        // The write failed...
        // console.log('error', error);
      } else {
        const messagePathRef = firebase.database().ref(response.path);
        this.setState({ messagePathRef });
        messagePathRef.update({ sent: true });
        this.setState((previousState) => ({
          messages: previousState.messages.filter((msg) => msg.sent !== false),
          typedMessage: '',
        }));

        this.setState((previousState) => ({
          messages: GiftedChat.append(previousState.messages, b),
        }));
        this.on(this.parse(response));
      }
    });
  };

  // close the connection to the Backend
  off() {
    this.ref.off();
  }

  onSend(messages = []) {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
  }

  onDeleteForMe(messageIdToDelete, userId) {
    const delRef = this.ref.child(`${messageIdToDelete}`).child('messageFor');
    delRef.on('value', (snapshot) => {
      if (snapshot.exists()) {
        snapshot.forEach((snap) => {
          if (snap.val() === userId) {
            snap.ref.remove();
          }
        });
      }
    });
    this.setState((previousState) => ({
      messages: previousState.messages.filter((message) => message._id !== messageIdToDelete),
    }));
  }

  async onDelete(messageIdToDelete) {
    await this.ref.child(`${messageIdToDelete}`).remove();
    this.setState((previousState) => ({
      messages: previousState.messages.filter((message) => message._id !== messageIdToDelete),
    }));
    const group_id = this.props.navigation.state.params.channel.data.group_details.id;
    this.updateLastMessage(group_id, UpdatingMsgType.DELETED);
  }

  // onClearChat(userId) {
  //   this.ref.once('value', (snapshot) => {
  //     snapshot.forEach((snap) => {
  //       snap.ref.on('value', (s) => {
  //         console.log('s.val()', s.val().messageFor);
  //       });
  //     });
  //   });
  // }

  deleteChannel = async (channel) => {
    const groupId = channel.data.group_id;
    await this.props.deleteChatGroup(groupId);
    await this.props.getAllChatGroups();
    this.props.navigation.navigate('DM');
  };

  UNSAFE_componentWillMount() {
    this.off();
    const self = this;
    const { user } = self;
    // this.init is fix as the indicator would run when the app mounts
    this.init = false;
    const typingRef = firebase.database().ref(`typing/${this.state.chatId}/${user._id}`);

    this.startTyping = _.debounce(
      () => {
        if (!this.init) return;
        self.setState({ isTyping: true });
        typingRef.set({ typing: true, username: user.name, key: user._id });
      },
      500,
      { leading: true, trailing: false }
    );

    this.stopTyping = _.debounce(() => {
      if (!this.init) return;
      self.setState({ isTyping: false });
      typingRef.set({
        typing: false,
        username: user.name,
        key: user._id,
      });
    }, 500);
  }

  uploadImage = async () => {
    const { currentImage } = this.state;
    const { uri } = currentImage;
    const filename = uri.substring(uri.lastIndexOf('/') + 1);
    const uploadUri = uri.replace('file://', '');
    this.setState({ uploading: true, transferred: 0 });

    const task = this.storageRef.child(`image/${filename}`).putFile(uploadUri);

    this.setState({ currentTask: task });
    // set progress state
    task.on(
      'state_changed',
      (snapshot) => {
        this.setState({
          transferred: Math.round(snapshot.bytesTransferred),
          totalBytes: Math.round(snapshot.totalBytes),
        });
      },
      (err) => {
        // console.log('err', err);
      },
      (complete) => {
        const { downloadURL = 'string' } = complete;
        console.log('complete', complete);
        this.setState({ uploading: false, currentImage: null });
        // const { messagePathRef } = this.state;
        // messagePathRef.update({ image: downloadURL, messageFor: [...this.state.groupMembers] });
      }
    );

    try {
      await task;
      return task.then((file) => file.downloadURL);
    } catch (e) {
      // console.error(e);
    }
    return this.setState({ uploading: false, currentImage: null });
  };

  uploadVideo = async () => {
    const { currentImage } = this.state;
    const { uri } = currentImage;
    const filename = uri.substring(uri.lastIndexOf('/') + 1);
    const uploadUri = uri.replace('file://', '');
    const task = this.storageRef.child(`video/${filename}`).putFile(uploadUri);
    // set progress state
    this.setState({ uploading: true, transferred: 0 });
    task.on(
      'state_changed',
      (snapshot) => {
        this.setState({
          transferred: Math.round(snapshot.bytesTransferred),
          totalBytes: Math.round(snapshot.totalBytes),
        });
      },
      (err) => {
        // console.log('err', err);
      },
      (complete) => {
        const { downloadURL = 'string' } = complete;
        this.setState({ uploading: false, currentImage: null });
      }
    );

    try {
      await task;
      return task.then((file) => file.downloadURL);
    } catch (e) {
      console.error(e);
    }
    return this.setState({ uploading: false, currentImage: null });
  };

  uploadAudio = async () => {
    const { currentFile } = this.state;
    const { url } = currentFile;
    const filename = url.substring(url.lastIndexOf('/') + 1);
    const uploadurl = url.replace('file://', '');
    this.setState({ uploading: true, transferred: 0 });
    const task = this.storageRef.child(`audio/${filename}`).putFile(uploadurl);
    // set progress state
    task.on(
      'state_changed',
      (snapshot) => {
        this.setState({
          transferred: Math.round(snapshot.bytesTransferred),
          totalBytes: Math.round(snapshot.totalBytes),
        });
      },
      (err) => {
        // console.log('err', err);
      },
      (complete) => {
        const { downloadURL = 'string' } = complete;
        this.setState({ uploading: false, currentFile: null });
      }
    );

    try {
      await task;
      return task.then((file) => file.downloadURL);
    } catch (e) {
      // console.error(e);
    }
    return this.setState({ uploading: false, currentFile: null });
  };

  uploadAttachment = async () => {
    const { currentFile } = this.state;
    const { url } = currentFile;
    const filename = url.substring(url.lastIndexOf('/') + 1);
    const uploadurl = url.replace('file://', '');
    this.setState({ uploading: true, transferred: 0 });
    const task = this.storageRef.child(`docs/${filename}`).putFile(uploadurl);
    // set progress state
    task.on(
      'state_changed',
      (snapshot) => {
        this.setState({
          transferred: Math.round(snapshot.bytesTransferred),
          totalBytes: Math.round(snapshot.totalBytes),
        });
      },
      (err) => {
        // console.log('err', err);
      },
      (complete) => {
        const { downloadURL = 'string' } = complete;
        this.setState({ uploading: false, currentFile: null });
      }
    );

    try {
      await task;
      return task.then((file) => file.downloadURL);
    } catch (e) {
      // console.error(e);
    }
    return this.setState({ uploading: false, currentFile: null });
  };

  uploadGif = async (gif) => {
    this.setState({ uploading: true, transferred: 0 });
    this.setState({ currentFile: gif });
    const { id, is_sticker, originalUrl, dimensions } = gif;
    const filename = id;
    const type = is_sticker === 0 ? GIF_TYPES.GIFS : GIF_TYPES.STICKERS;
    const OriginalUrl = await RNFetchBlob.config({ fileCache: true, appendExt: 'gif' })
      .fetch('GET', `${originalUrl}`)
      .then((resp) => resp.data)
      .catch((err) => console.log('err', err));
    const task = this.storageRef.child(`${type}/${filename}`).putFile(OriginalUrl);
    // set progress state
    task.on(
      'state_changed',
      (snapshot) => {
        this.setState({
          transferred: Math.round(snapshot.bytesTransferred),
          totalBytes: Math.round(snapshot.totalBytes),
        });
      },
      (err) => {
        // console.log('err', err);
      },
      (complete) => {
        const { downloadURL = 'string' } = complete;
        this.setState({ uploading: false, currentFile: null });
      }
    );

    try {
      await task;
      return task.then((file) => ({ fileUrl: file.downloadURL, type, dimensions }));
    } catch (e) {
      // console.error(e);
    }
    return this.setState({ uploading: false, currentFile: null });
  };

  _uploadToServer = async (file, { pickerType }) => {
    if (pickerType === 'GifPicker') {
      const { fileUrl, type, dimensions } = file;
      const blocked = await this.checkblockStatus();
      if (blocked) {
        const message = getFlashMessage(blocked);
        return showMessage(message);
      }
      const id = await uuid.getRandomUUID();
      const messages = [
        {
          createdAt: new Date(),
          text: this.state.message,
          user: this.user,
        },
      ];
      for (let i = 0; i < messages.length; i++) {
        const { text, user, video, attachment } = messages[i];

        const message = {
          _id: id,
          text,
          user,
          image: fileUrl,
          video,
          createdAt: new Date(),
          timestamp: this.timestamp(),
          sent: false,
          received: false,
          messageType:
            type === GIF_TYPES.GIFS
              ? MessageType.GIF
              : type === GIF_TYPES.STICKERS
              ? MessageType.STICKER
              : MessageType.IMAGE,
          attachment,
          dimensions,
          status: 'unread',
          readBy: [user._id],
          senderId: this.user._id,
          messageFor: [...this.state.groupMembers],
        };

        this.append(message);
        const group_id = this.props.navigation.state.params.channel.data.group_details.id;

        return this.updateLastMessage(
          group_id,
          message.text
            ? message.text
            : type === GIF_TYPES.GIFS
            ? UpdatingMsgType.GIF
            : type === GIF_TYPES.STICKERS
            ? UpdatingMsgType.STICKER
            : UpdatingMsgType.IMAGE
        );
      }
    }

    const fileType =
      pickerType === 'ImagePicker' ? file.mime.split('/')[0] : file.type.split('/')[0];
    if (fileType === 'image') {
      const blocked = await this.checkblockStatus();
      if (blocked) {
        const message = getFlashMessage(blocked);
        return showMessage(message);
      }

      const fileUrl = await this.uploadImage();
      const id = await uuid.getRandomUUID();
      const messages = [
        {
          createdAt: new Date(),
          text: this.state.message,
          user: this.user,
        },
      ];
      for (let i = 0; i < messages.length; i++) {
        const { text, user, video, attachment } = messages[i];

        const message = {
          _id: id,
          text,
          user,
          image: fileUrl,
          video,
          createdAt: new Date(),
          timestamp: this.timestamp(),
          sent: false,
          received: false,
          messageType: MessageType.IMAGE,
          attachment,
          status: 'unread',
          readBy: [user._id],
          senderId: this.user._id,
          messageFor: [...this.state.groupMembers],
        };

        this.append(message);
        const group_id = this.props.navigation.state.params.channel.data.group_details.id;

        return this.updateLastMessage(
          group_id,
          message.text ? message.text : UpdatingMsgType.IMAGE
        );
      }
    }
    if (fileType === 'video') {
      const blocked = await this.checkblockStatus();
      if (blocked) {
        const message = getFlashMessage(blocked);
        return showMessage(message);
      }
      const fileUrl = await this.uploadVideo();
      const id = await uuid.getRandomUUID();
      const messages = [
        {
          createdAt: new Date(),
          text: this.state.typedMessage,
          user: this.user,
          messageType: MessageType.VIDEO,
          senderId: this.user._id,
        },
      ];
      for (let i = 0; i < messages.length; i++) {
        const { text, user, image, messageType } = messages[i];

        const message = {
          _id: id,
          text,
          user,
          createdAt: new Date(),
          timestamp: this.timestamp(),
          sent: false,
          received: false,
          image: image || null,
          video: fileUrl,
          messageType: messageType || MessageType.TEXT,
          status: 'unread',
          readBy: [user._id],
          messageFor: [...this.state.groupMembers],
        };
        this.append(message);
        const group_id = this.props.navigation.state.params.channel.data.group_details.id;

        return this.updateLastMessage(
          group_id,
          message.text ? message.text : UpdatingMsgType.VIDEO
        );
      }
    } else if (fileType === 'audio') {
      const blocked = await this.checkblockStatus();
      if (blocked) {
        const message = getFlashMessage(blocked);
        return showMessage(message);
      }

      const fileUrl = await this.uploadAudio();

      const id = await uuid.getRandomUUID();

      const messages = [
        {
          createdAt: new Date(),
          text: this.state.message,
          user: this.user,
        },
      ];
      for (let i = 0; i < messages.length; i++) {
        const { text, user, image, attachment } = messages[i];
        const message = {
          _id: id,
          text,
          user,
          image,
          video: fileUrl,
          createdAt: new Date(),
          timestamp: this.timestamp(),
          sent: false,
          received: false,
          messageType: MessageType.AUDIO,
          attachment,
          status: 'unread',
          readBy: [user._id],
          senderId: this.user._id,
          messageFor: [...this.state.groupMembers],
        };

        this.append(message);
        const group_id = this.props.navigation.state.params.channel.data.group_details.id;

        return this.updateLastMessage(
          group_id,
          message.text ? message.text : UpdatingMsgType.AUDIO
        );
      }
    } else {
      const blocked = await this.checkblockStatus();
      if (blocked) {
        const message = getFlashMessage(blocked);
        return showMessage(message);
      }
      const { name, type } = file;

      const fileUrl = await this.uploadAttachment();

      const id = await uuid.getRandomUUID();

      const messages = [
        {
          createdAt: new Date(),
          text: this.state.typedMessage,
          user: this.user,
          attachment: { url: fileUrl, name, type },
          messageType: MessageType.ATTACHMENT,
          senderId: this.user._id,
        },
      ];
      for (let i = 0; i < messages.length; i++) {
        const { text, user, image, video, messageType, attachment } = messages[i];
        const message = {
          _id: id,
          text,
          user,
          createdAt: new Date(),
          timestamp: this.timestamp(),
          sent: false,
          received: false,
          image: image || null,
          video: video || null,
          attachment: attachment || null,
          messageType: messageType || MessageType.TEXT,
          status: 'unread',
          readBy: [user._id],
          messageFor: [...this.state.groupMembers],
        };
        this.append(message);
        const group_id = this.props.navigation.state.params.channel.data.group_details.id;

        return this.updateLastMessage(
          group_id,
          message.text ? message.text : UpdatingMsgType.ATTACHMENT
        );
      }
    }
  };

  onLongPress = (context, message) => {
    const options = ['Copy Text', 'Delete For Me', 'Delete For All', 'Cancel'];
    const cancelButtonIndex = options.length - 1;
    message.user._id === this.user._id &&
      context.actionSheet().showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex,
        },
        (buttonIndex) => {
          switch (buttonIndex) {
            case 0:
              Clipboard.setString(message.text);
              break;
            case 1:
              this.onDeleteForMe(message._id, this.user._id);
              break;
            case 2:
              this.onDelete(message._id, this.user._id);
              break;
          }
        }
      );
  };

  showCustomActionSheet = (message) => {
    const options = ['Delete For Me', 'Delete For All', 'Cancel'];
    const cancelButtonIndex = options.length - 1;
    ActionSheet.showActionSheetWithOptions({ options, cancelButtonIndex }, (buttonIndex) => {
      switch (buttonIndex) {
        case 0:
          this.onDeleteForMe(message._id, this.user._id);
          break;
        case 1:
          this.onDelete(message._id, this.user._id);
          break;
      }
    });
  };

  render() {
    const { navigation } = this.props;
    const channel = navigation.state.params.channel.data;
    const isAdmin = channel && channel.group_details.admin === this.user._id;
    const usersOnline =
      this.state.onlineUsers.length && this.state.onlineUsers.length === 1
        ? this.state.onlineUsers
        : this.state.onlineUsers.length > 1 &&
          this.state.onlineUsers.map((t, i) => ({
            key: i,
            value: t,
          }));

    const checkOnline =
      usersOnline && usersOnline.length === 1
        ? Object.keys(usersOnline[0])
            .map((k) => Number(k))
            .filter((k) => {
              return (
                this.state.blockingList.indexOf(k) === -1 && this.state.blocksList.indexOf(k) === -1
              );
            })
        : usersOnline &&
          usersOnline.length > 1 &&
          usersOnline
            .filter((obj) => obj.value === true)
            .map((obj) => obj.key)
            .filter((k) => {
              return (
                this.state.blockingList.indexOf(k) === -1 && this.state.blocksList.indexOf(k) === -1
              );
            });

    const typingOnline =
      this.state.typingUsers && this.state.typingUsers.length && this.state.typingUsers.length === 1
        ? this.state.typingUsers
        : this.state.typingUsers.length > 1 &&
          this.state.typingUsers
            .filter((t) => t != null)
            .map((t) => {
              const { key, typing, username } = t;
              return { key, typing, username };
            });

    const checkTypingUsers =
      typingOnline &&
      typingOnline.length &&
      typingOnline.filter((obj) => obj && obj.typing === true && obj.key !== this.user._id);

    const filterMessages = this.state.messages.filter((message) => {
      if (message.messageFor) {
        if (Object.keys(message.messageFor).length) {
          return Object.values(message.messageFor).indexOf(this.user._id) > -1;
        }
        if (isArray(message.messageFor)) {
          return message.messageFor.includes(this.user._id);
        }
      }
    });

    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: COLORS.editingGrey,
        }}
      >
        <View
          style={{
            backgroundColor: COLORS.blackColor,
            flex: 1,
          }}
        >
          <Modal
            animationType="slide"
            transparent
            visible={
              (this.state.uploading &&
                (this.state.transferred / this.state.totalBytes) * 100 > 0 &&
                (this.state.transferred / this.state.totalBytes) * 100 < 6) ||
              (this.state.uploading &&
                (this.state.transferred / this.state.totalBytes) * 100 > 95 &&
                (this.state.transferred / this.state.totalBytes) * 100 <= 100)
            }
            onRequestClose={() => {}}
          >
            <View style={Modalstyles.centeredView}>
              <View style={Modalstyles.modalView}>
                <Progress.Circle
                  progress={this.state.transferred / this.state.totalBytes}
                  size={50 * METRICS.ratioX}
                  color="white"
                  showsText
                  textStyle={{ fontSize: METRICS.fontSizeNormal }}
                  borderWidth={0}
                  thickness={5 * METRICS.ratioX}
                  unfilledColor="rgba(255, 255, 255, 0.2)"
                />
                <Text style={Modalstyles.modalText} ellipsizeMode="middle" numberOfLines={1}>
                  {this.state.currentImage
                    ? `Uploading.. ${this.state.filename}`
                    : this.state.currentFile
                    ? this.state.currentFile.name
                      ? `Uploading.. ${this.state.currentFile.name}`
                      : this.state.currentFile.title
                      ? `Uploading.. ${this.state.currentFile.title}`
                      : 'Uploading ...'
                    : 'Uploading ...'}
                </Text>
              </View>
            </View>
          </Modal>
          <GiftedChat
            minInputToolbarHeight={55 * METRICS.ratioX}
            keyboardAvoidingViewEnabled
            style={{ flex: 0 }}
            messages={filterMessages || []}
            onSend={(messages) => this.send(messages)}
            user={this.user}
            listViewProps={{
              showsVerticalScrollIndicator: false,
            }}
            shouldUpdateMessage={(props, nextProps) => props !== nextProps}
            onLongPress={(context, message) => this.onLongPress(context, message)}
            showUserAvatar
            showAvatarForEveryMessage
            bottomOffset={this.props.offsetFix ? 50 : 0}
            placeholder="Write your message"
            placeholderTextColor={COLORS.whiteColor}
            textInputStyle={{
              color: COLORS.whiteColor,
              fontSize: METRICS.fontSizeNormal,
              fontFamily: 'lato',
            }}
            extraData={this.state}
            renderDay={(props) => {
              return (
                <Day
                  {...props}
                  wrapperStyle={{
                    marginVertical: METRICS.marginNormalY,
                  }}
                  textStyle={{
                    fontFamily: 'lato',
                    fontSize: METRICS.fontSizeLight,
                    color: COLORS.whiteColor,
                  }}
                />
              );
            }}
            renderAvatar={(props) => {
              const currentUserId = props.currentMessage.user._id;
              const { position } = props;

              return (
                <>
                  {position === 'left' &&
                  checkOnline.length &&
                  checkOnline.includes(currentUserId) ? (
                    <CustomIcon
                      name="circle"
                      size={METRICS.fontSizeNormal}
                      color={COLORS.primaryColor}
                      style={styles.onlinecircle}
                    />
                  ) : null}
                  {position === 'left' && (
                    <Avatar
                      size={METRICS.avatarsmall}
                      {...props}
                      containerStyle={{
                        left: {
                          backgroundColor: COLORS.editingGrey,
                          borderRadius: 50 * METRICS.ratioX,
                        },
                        right: {
                          backgroundColor: COLORS.editingGrey,
                          borderRadius: 50 * METRICS.ratioX,
                        },
                      }}
                      imageStyle={{
                        left: {
                          backgroundColor: COLORS.editingGrey,
                        },
                        right: {
                          backgroundColor: COLORS.editingGrey,
                        },
                      }}
                    >
                      {props.currentMessage.user.avatar ? (
                        <Image
                          source={{
                            uri: props.currentMessage.user.avatar,
                          }}
                          style={styles.avatar}
                        />
                      ) : (
                        <Text style={{ color: '#fff' }}>{props.currentMessage.user.name}</Text>
                      )}
                    </Avatar>
                  )}
                </>
              );
            }}
            renderMessageImage={(props) => {
              const {
                dimensions = {
                  height: 400 * METRICS.ratioY,
                  width: 400 * METRICS.ratioX,
                },
              } = props.currentMessage;
              const { messageType } = props.currentMessage;

              if (messageType === 'Gif') {
                // const { dimensions } = props.currentMessage;
                return this.state.isFullScreen ? (
                  <ImageView
                    isPinchZoomEnabled
                    isTapZoomEnabled
                    images={this.state.images}
                    onPress={() => {
                      this.setState({
                        isImageViewVisible: false,
                        isFullScreen: false,
                      });
                    }}
                    imageIndex={0}
                    isVisible={this.state.isImageViewVisible}
                    onClose={() => {
                      Orientation.lockToPortrait();
                      this.setState({ isFullScreen: false, images: [] });
                    }}
                  />
                ) : (
                  <>
                    <TouchableWithoutFeedback
                      onLongPress={() => {}}
                      onPress={() => {
                        const images = [
                          {
                            source: {
                              uri: props.currentMessage.image,
                            },
                            height: (dimensions.height / dimensions.width) * METRICS.screenWidth,
                            width: METRICS.screenWidth,
                          },
                        ];
                        this.setState({
                          isImageViewVisible: true,
                          isFullScreen: true,
                          images,
                        });
                      }}
                    >
                      <ProgressImage
                        indicator={Progress.Circle}
                        progress={this.state.uploading ? this.state.transferred : null}
                        showsText
                        indicatorProps={{
                          size: 80 * METRICS.ratioX,
                          borderWidth: 0,
                          color: COLORS.primaryColorRgb(0.6),
                          unfilledColor: 'rgba(200, 200, 200, 0.2)',
                        }}
                        style={{
                          height:
                            ((dimensions.height / dimensions.width) * METRICS.screenWidth) / 1.5,
                          minWidth: METRICS.screenWidth / 1.5,

                          borderBottomLeftRadius: props.position === 'left' ? 0 : 10,
                          borderBottomRightRadius: props.position === 'right' ? 0 : 10,
                          borderBottomWidth: 1,
                          backgroundColor: 'transparent',
                        }}
                        source={{
                          uri: props.currentMessage.image,
                        }}
                        imageStyle={{
                          height:
                            ((dimensions.height / dimensions.width) * METRICS.screenWidth) / 1.5,
                          borderRadius: METRICS.craftborder,
                        }}
                        resizeMode="cover"
                      />
                    </TouchableWithoutFeedback>
                    {props.position === 'right' ? (
                      <View
                        style={[
                          styles.times,
                          {
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                          },
                        ]}
                      >
                        <Text
                          style={{
                            fontSize: METRICS.fontSizeSmall,
                            color: '#fff',
                            fontFamily: 'lato',
                            textAlignVertical: 'center',
                          }}
                        >
                          {moment(props.currentMessage.createdAt).format('LT')}
                        </Text>
                        <CustomIcon
                          onPress={() => {
                            this.showCustomActionSheet(props.currentMessage);
                          }}
                          name="more-button-of-three-dots"
                          color="#fff"
                          size={16 * METRICS.ratioX}
                          style={{ marginHorizontal: 10 * METRICS.ratioX }}
                        />
                      </View>
                    ) : (
                      <View
                        style={[
                          styles.times,
                          {
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            left: 0,
                          },
                        ]}
                      >
                        <Text
                          style={{
                            fontSize: METRICS.fontSizeSmall,
                            left: 0,
                            color: '#fff',
                            fontFamily: 'lato',
                          }}
                        >
                          {moment(props.currentMessage.createdAt).format('LT')}
                        </Text>
                      </View>
                    )}
                  </>
                );
              }

              return this.state.isFullScreen ? (
                <ImageView
                  isPinchZoomEnabled
                  isTapZoomEnabled
                  images={this.state.images}
                  onPress={() => {
                    this.setState({
                      isImageViewVisible: false,
                      isFullScreen: false,
                    });
                  }}
                  imageIndex={0}
                  isVisible={this.state.isImageViewVisible}
                  onClose={() => {
                    Orientation.lockToPortrait();
                    this.setState({ isFullScreen: false, images: [] });
                  }}
                />
              ) : (
                <>
                  <TouchableWithoutFeedback
                    onLongPress={() => {}}
                    onPress={() => {
                      const images = [
                        {
                          source: {
                            uri: props.currentMessage.image,
                          },
                          height: (dimensions.height / dimensions.width) * METRICS.screenWidth,
                          width: METRICS.screenWidth,
                        },
                      ];
                      this.setState({
                        isImageViewVisible: true,
                        isFullScreen: true,
                        images,
                      });
                    }}
                  >
                    <ProgressImage
                      indicator={Progress.Circle}
                      progress={this.state.uploading ? this.state.transferred : null}
                      showsText
                      indicatorProps={{
                        size: 80 * METRICS.ratioX,
                        borderWidth: 0,
                        color: COLORS.primaryColorRgb(0.6),
                        unfilledColor: 'rgba(200, 200, 200, 0.2)',
                      }}
                      style={{
                        height: METRICS.screenWidth / 1.5,
                        minWidth: METRICS.screenWidth / 1.5,

                        borderBottomLeftRadius: props.position === 'left' ? 0 : 10,
                        borderBottomRightRadius: props.position === 'right' ? 0 : 10,
                        borderBottomWidth: 1,
                        backgroundColor: 'transparent',
                      }}
                      source={{
                        uri: props.currentMessage.image,
                      }}
                      resizeMode="cover"
                      imageStyle={{ borderRadius: METRICS.craftborder }}
                    />
                  </TouchableWithoutFeedback>
                  {props.position === 'right' ? (
                    <View
                      style={[
                        styles.times,
                        {
                          flexDirection: 'row',
                          justifyContent: 'flex-end',
                        },
                      ]}
                    >
                      <Text
                        style={{
                          fontSize: METRICS.fontSizeSmall,
                          color: '#fff',
                          fontFamily: 'lato',
                          textAlignVertical: 'center',
                        }}
                      >
                        {moment(props.currentMessage.createdAt).format('LT')}
                      </Text>
                      <CustomIcon
                        onPress={() => {
                          this.showCustomActionSheet(props.currentMessage);
                        }}
                        name="more-button-of-three-dots"
                        color="#fff"
                        size={16 * METRICS.ratioX}
                        style={{ marginHorizontal: 10 * METRICS.ratioX }}
                      />
                    </View>
                  ) : (
                    <View
                      style={[
                        styles.times,
                        {
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          left: 0,
                        },
                      ]}
                    >
                      <Text
                        style={{
                          fontSize: METRICS.fontSizeSmall,
                          left: 0,
                          color: '#fff',
                          fontFamily: 'lato',
                        }}
                      >
                        {moment(props.currentMessage.createdAt).format('LT')}
                      </Text>
                    </View>
                  )}
                </>
              );
            }}
            renderMessageVideo={(props) => {
              const MediaType = props.currentMessage.messageType;
              if (MediaType === 'Audio') {
                return (
                  <>
                    {/* <View
                      style={{
                        padding: 0,
                        backgroundColor: '#000',
                        borderColor: COLORS.editingGrey,
                        borderWidth: 1,
                        borderRadius: 5,
                        // width: METRICS.screenWidth / 1.5,
                      }}
                    >
                      <Video
                        resizeMode="cover"
                        controls={false}
                        paused={this.state.paused}
                        audioOnly
                        onPlaybackResume={() => {
                          this.setState({
                            isBuffering: false,
                          });
                        }}
                        onBuffer={(data) => {
                          const { isBuffering } = data;
                          this.setState({ isBuffering });
                        }}
                        onLoad={(data) => {
                          this.handleLoad(data);
                          this.setState({
                            isBuffering: false,
                          });
                        }}
                        onProgress={(data) => this.handleProgress(data)}
                        onEnd={() => this.handleEnd}
                        // fullscreen
                        source={{
                          uri: props.currentMessage.video,
                        }} // Can be a URL or a local file.
                        ref={(ref) => {
                          this.player1 = ref;
                        }} // Store reference
                        //  onBuffer={this.onBuffer}   // Callback when remote video is buffering
                        //  onError={this.videoError}  // Callback when video cannot be loaded
                        style={{
                          height: 45,
                          flex: 1,
                          width: METRICS.screenWidth / 1.5,
                          backgroundColor: 'transparent',
                        }}
                      />

                      <View style={styles.controls}>
                        <TouchableWithoutFeedback
                          onPress={this.handleMainButtonTouch}
                          style={{ flex: 1 }}
                        >
                          <CustomIcon
                            name={this.state.paused ? 'play' : 'pausethin'}
                            size={25 * METRICS.ratioX}
                            color={COLORS.whiteColor}
                          />
                        </TouchableWithoutFeedback>
                        <View style={{ flex: 0.5 }}>
                          {this.state.isBuffering && (
                            <ActivityIndicator color={COLORS.primaryColor} />
                          )}
                        </View>
                        <TouchableWithoutFeedback
                          style={{ flex: 1 }}
                          onPress={this.handleProgressPress}
                        >
                          <View>
                            <Progress.Bar
                              progress={this.state.progress}
                              color={COLORS.primaryColor}
                              unfilledColor="rgba(255,255,255,.5)"
                              borderColor={COLORS.primaryColor}
                              width={METRICS.screenWidth / 2.5}
                              height={8}
                            />
                          </View>
                        </TouchableWithoutFeedback>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.duration}>
                            {secondsToTime(Math.floor(this.state.progress * this.state.duration))}
                          </Text>
                        </View>
                      </View>
                    </View>
                     */}

                    <Player
                      track={{
                        id: props.currentMessage._id,
                        title: props.currentMessage.timestamp,
                        artist: props.currentMessage.user.name,
                        url: props.currentMessage.video,
                      }}
                    />

                    {props.position === 'left' ? (
                      <Text
                        style={{
                          color: '#fff',
                          backgroundColor: '#000',
                          position: 'absolute',
                          bottom: -20,
                          left: 0,
                          fontSize: METRICS.fontSizeSmall,
                        }}
                      >
                        {moment(moment.utc(props.currentMessage.createdAt).local()).format('LT')}
                      </Text>
                    ) : (
                      <View
                        style={[
                          styles.times,
                          {
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                          },
                        ]}
                      >
                        <Text
                          style={{
                            fontSize: METRICS.fontSizeSmall,
                            color: '#fff',
                            fontFamily: 'lato',
                            textAlignVertical: 'center',
                          }}
                        >
                          {moment(props.currentMessage.createdAt).format('LT')}
                        </Text>
                        <CustomIcon
                          onPress={() => {
                            this.showCustomActionSheet(props.currentMessage);
                          }}
                          name="more-button-of-three-dots"
                          color="#fff"
                          size={16 * METRICS.ratioX}
                          style={{ marginHorizontal: 10 * METRICS.ratioX }}
                        />
                      </View>
                    )}
                  </>
                );
              }
              return (
                <View>
                  <Video
                    resizeMode="cover"
                    controls
                    paused
                    onBuffer={() => <Text> Loading Video ...</Text>}
                    // fullscreen
                    source={{
                      uri: props.currentMessage.video,
                    }} // Can be a URL or a local file.
                    ref={(ref) => {
                      this.player = ref;
                    }} // Store reference
                    //  onBuffer={this.onBuffer}   // Callback when remote video is buffering
                    //  onError={this.videoError}  // Callback when video cannot be loaded
                    style={{
                      height: METRICS.screenWidth / 1.5,
                      width: METRICS.screenWidth / 1.5,
                      padding: 0,
                      borderRadius: METRICS.craftborder,
                    }}
                  />
                  {props.position === 'left' ? (
                    <Text
                      style={[
                        styles.times,
                        {
                          fontSize: METRICS.fontSizeSmall,
                          left: 0,
                        },
                      ]}
                    >
                      {moment(moment.utc(props.currentMessage.createdAt).local()).format('LT')}
                    </Text>
                  ) : (
                    <View
                      style={[
                        styles.times,
                        {
                          flexDirection: 'row',
                          justifyContent: 'flex-end',
                        },
                      ]}
                    >
                      <Text
                        style={{
                          fontSize: METRICS.fontSizeSmall,
                          color: '#fff',
                          fontFamily: 'lato',
                          textAlignVertical: 'center',
                        }}
                      >
                        {moment(props.currentMessage.createdAt).format('LT')}
                      </Text>
                      <CustomIcon
                        onPress={() => {
                          this.showCustomActionSheet(props.currentMessage);
                        }}
                        name="more-button-of-three-dots"
                        color="#fff"
                        size={16 * METRICS.ratioX}
                        style={{ marginHorizontal: 10 }}
                      />
                    </View>
                  )}
                </View>
              );
            }}
            renderActions={(props) => {
              const options = {
                'Upload a photo / video': () => {
                  this.addPhoto().then((file) => {
                    this._uploadToServer(file, {
                      pickerType: 'ImagePicker',
                    });
                  });
                },
                'Upload a file': () => {
                  this._docPicker()
                    .then((file) => {
                      // Upload file to server
                      this._uploadToServer(file, {
                        pickerType: 'docPicker',
                      });
                    })
                    .catch((err) => console.log('err docpicker', err));
                },
                Cancel: () => {
                  // console.log('cancel');
                },
              };
              return (
                <SafeAreaView
                  style={[
                    STYLES.horizontalAlign,
                    {
                      // backgroundColor: COLORS.editingGrey,
                      // justifyContent: 'flex-end',
                      // alignItems: 'center',
                      backgroundColor: COLORS.editingGrey,
                      justifyContent: 'center',
                      alignItems: 'center',
                      alignSelf: 'flex-end',
                    },
                  ]}
                >
                  <Actions
                    onPressActionButton={() => this.ActionSheet.show()}
                    {...props}
                    options={options}
                    icon={() => (
                      <CustomIcon
                        name="plus1"
                        size={METRICS.attachmentIconSize}
                        style={{
                          paddingVertical: 5 * METRICS.ratioX,
                          paddingHorizontal: METRICS.spacingTiny,
                          color: COLORS.whiteColor,
                        }}
                      />
                    )}
                    wrapperStyle={{
                      backgroundColor: COLORS.editingGrey,
                      padding: METRICS.spacingSmall,
                    }}
                    containerStyle={{
                      backgroundColor: COLORS.editingGrey,
                      height: 44 * METRICS.ratioX,
                      width: 40 * METRICS.ratioX,
                      margin: 0,
                    }}
                    // optionTintColor={COLORS.primaryColor} // TODO: add condition of blackColor for iOS<13 and primaryColor otherwise
                  />
                  <CustomIcon
                    name="smile-1"
                    size={METRICS.attachmentIconSize}
                    style={{
                      paddingVertical: 5 * METRICS.ratioX,
                      paddingHorizontal: METRICS.spacingTiny,
                      color: COLORS.whiteColor,
                      paddingBottom: 18 * METRICS.ratioX,
                    }}
                    onPress={() => this.RBSheet.open()}
                  />
                </SafeAreaView>
              );
            }}
            renderSend={(props) => {
              return (
                <SafeAreaView
                  style={{
                    backgroundColor: COLORS.editingGrey,
                    justifyContent: 'center',
                    alignItems: 'center',
                    flex: 0,
                  }}
                >
                  <Send {...props} alwaysShowSend>
                    <CustomIcon
                      name="right-arrow"
                      size={23 * METRICS.ratioX}
                      style={{
                        paddingBottom: 18 * METRICS.ratioX,
                        paddingHorizontal: METRICS.spacingNormal,
                        color: COLORS.whiteColor,
                      }}
                    />
                  </Send>
                </SafeAreaView>
              );
            }}
            multiline
            isAnimated
            renderFooter={() => {
              if (this.state.showTyping) {
                if (checkTypingUsers && checkTypingUsers.length === 1) {
                  return (
                    <View style={styles.footerContainer}>
                      {checkTypingUsers.map((u) => {
                        return <Text style={styles.footerText}>{u.username} is typing ...</Text>;
                      })}
                    </View>
                  );
                }
                if (checkTypingUsers && checkTypingUsers.length > 1) {
                  return (
                    <View style={[styles.footerContainer, { flexDirection: 'row' }]}>
                      {checkTypingUsers.map((u, index) => (
                        <Text style={styles.footerText}>
                          {index === checkTypingUsers.length - 1 ? ' and ' : ''}
                          {u.username}
                          {index === checkTypingUsers.length - 2 ||
                          index === checkTypingUsers.length - 1
                            ? ''
                            : ' , '}
                        </Text>
                      ))}
                      <Text style={styles.footerText}> are typing ...</Text>
                    </View>
                  );
                }
              }
              return <View style={styles.footerContainer} />;
            }}
            // renderQuickReplySend
            renderAvatarOnTop
            onInputTextChanged={(text) => this.detectTyping(text)}
            renderInputToolbar={(props) => (
              <InputToolbar
                {...props}
                containerStyle={{
                  backgroundColor: COLORS.editingGrey,
                  flex: 1,
                }}
                primaryStyle={{
                  alignItems: 'center',
                  backgroundColor: COLORS.editingGrey,
                  paddingBottom: 100 / METRICS.screenHeight,
                  paddingTop: METRICS.spacingTiny,
                }}
              />
            )}
            showsVerticalScrollIndicator={false}
            renderBubble={(props) => {
              const SameUser = isSameUser(props.currentMessage, props.previousMessage);
              const SameDay = isSameDay(props.currentMessage, props.previousMessage);
              const { uploading, transferred } = this.state;
              if (props.currentMessage.messageType === 'Upload') {
                return (
                  uploading && (
                    <View style={{ flexDirection: 'column' }}>
                      <>
                        <View style={{ marginVertical: 20 }}>
                          {/* bubble start */}
                          <View
                            style={{
                              backgroundColor: COLORS.blackColor,
                              borderColor: COLORS.whiteColor,
                              borderWidth: 1,
                              borderRadius: 8,
                              flexDirection: 'row',
                              justifyContent: 'space-evenly',
                              alignItems: 'center',
                              width: 250,
                              marginVertical: 5,
                              paddingHorizontal: 20,
                              paddingVertical: 10,
                            }}
                          >
                            <Progress.Bar progress={transferred} size={50} />
                          </View>
                        </View>
                      </>
                    </View>
                  )
                );
              }
              if (props.currentMessage.messageType === 'Attachment') {
                return (
                  <View style={{ flexDirection: 'column', paddingVertical: METRICS.marginTinyY }}>
                    {SameUser && SameDay ? (
                      <>
                        <View
                          style={{
                            backgroundColor: COLORS.blackColor,
                            borderColor:
                              props.position === 'left' ? COLORS.whiteColor : COLORS.primaryColor,

                            borderWidth: 0.5,
                            borderRadius: 4,
                            flexDirection: 'row',
                            justifyContent: 'space-evenly',
                            alignItems: 'center',
                            width: METRICS.screenWidth / 1.5,
                            marginVertical: 10,
                            marginBottom: 5,
                            paddingHorizontal: 20,
                            paddingVertical: 10,
                          }}
                        >
                          <CustomIcon
                            name="attachment"
                            color="#fff"
                            size={METRICS.attachmentIconSize}
                          />
                          <Text
                            numberOfLines={1}
                            ellipsizeMode="middle"
                            style={{
                              color: '#fff',
                              fontWeight: 'bold',
                              fontSize: METRICS.fontSizeNormal,
                              lineHeight: 24 * METRICS.ratioX,
                              paddingHorizontal: 40 * METRICS.ratioX,
                            }}
                          >
                            {props.currentMessage.attachment.name}
                          </Text>
                          <TouchableWithoutFeedback
                            // eslint-disable-next-line no-unused-vars
                            onPress={(e) => {
                              const date = new Date();
                              const { name, url } = props.currentMessage.attachment;

                              const { dirs } = RNFetchBlob.fs;
                              const { DocumentDir } = dirs;
                              const ApplicationPath = `CraftMusic`;
                              const path = `${DocumentDir}/${ApplicationPath}/${name}`;
                              RNFetchBlob.config({
                                // add this option that makes response data to be stored as a file,
                                // this is much more performant.
                                fileCache: true,
                                path,
                                appendExt: getFileExtension(url),
                              })
                                .fetch('GET', `${url}`)
                                .then(async (res) => {
                                  const { status } = res.info();
                                  console.log('res', res);
                                  console.log('status', status);
                                  // the temp file path
                                  // eslint-disable-next-line no-console
                                  // const data = res.path();
                                  // const docIndex = data.indexOf('Documents');
                                  // const dataLen = data.length;
                                  // const location = data.slice(docIndex, dataLen);
                                  // console.log('file Saved To Location :', location);

                                  if (status === 200) {
                                    // on success

                                    // Go for zip
                                    const targetPath = `${DocumentDir}/${Math.floor(
                                      date.getTime() + date.getSeconds() / 2
                                    )}.zip`;
                                    const sourcePath = res.path();
                                    const lastIndex = String(sourcePath).lastIndexOf('/');
                                    console.log('lastIndex', lastIndex);
                                    const originPath = String(sourcePath).substring(0, lastIndex);

                                    zip(originPath, targetPath)
                                      .then(async (originalPath) => {
                                        console.log('zip completed at--', originalPath);
                                        this.setState({ temp_path: String(originalPath) });
                                        const shareOptions = {
                                          title: 'Download file',
                                          failOnCancel: false,
                                          saveToFiles: true,
                                          url: originalPath, // base64 with mimeType or path to local file
                                        };
                                        const sh = await Share.open(shareOptions);

                                        console.log(
                                          'this.state.temp_path',
                                          this.state.temp_path,
                                          sh
                                        );

                                        RNFetchBlob.fs
                                          .exists(String(this.state.temp_path))
                                          .then((result) => {
                                            console.log('result', result);
                                            if (result) {
                                              RNFetchBlob.fs
                                                .unlink(String(this.state.temp_path))
                                                .then(() => {
                                                  console.log('unlink t--');
                                                })
                                                .catch((err) => {
                                                  console.log('unlink err at--', err);
                                                });
                                            }
                                          });
                                      })
                                      .catch((error) => {
                                        console.log(error);
                                      });
                                    // }
                                  }
                                });
                            }}
                          >
                            <CustomIcon
                              name="download"
                              color="#fff"
                              size={METRICS.attachmentIconSize}
                            />
                          </TouchableWithoutFeedback>
                        </View>
                        {props.position === 'left' ? (
                          <Text
                            style={{
                              color: '#fff',
                              backgroundColor: '#000',
                              position: 'absolute',
                              bottom: -20,
                              left: 0,
                              marginBottom: 10 * METRICS.ratioY,
                              fontSize: METRICS.fontSizeSmall,
                            }}
                          >
                            {moment(moment.utc(props.currentMessage.createdAt).local()).format(
                              'LT'
                            )}
                          </Text>
                        ) : (
                          <View
                            style={[
                              styles.times,
                              {
                                flexDirection: 'row',
                              },
                            ]}
                          >
                            <Text
                              style={{
                                fontSize: METRICS.fontSizeSmall,
                                color: '#fff',
                                fontFamily: 'lato',
                                textAlignVertical: 'center',
                              }}
                            >
                              {moment(props.currentMessage.createdAt).format('LT')}
                            </Text>
                            <CustomIcon
                              onPress={() => {
                                this.showCustomActionSheet(props.currentMessage);
                              }}
                              name="more-button-of-three-dots"
                              color="#fff"
                              size={16 * METRICS.ratioX}
                              style={{ marginHorizontal: 10 * METRICS.ratioX }}
                            />
                          </View>
                        )}
                      </>
                    ) : (
                      <>
                        <View style={{ marginVertical: 20 * METRICS.ratioY }}>
                          <Text
                            style={[
                              styles.bubbleUserName,
                              {
                                alignSelf: props.position === 'left' ? 'flex-start' : 'flex-end',
                              },
                            ]}
                          >
                            {props.currentMessage.user.name}
                          </Text>
                          {/* bubble start */}
                          <View
                            style={{
                              backgroundColor: COLORS.blackColor,
                              borderColor:
                                props.position === 'left' ? COLORS.whiteColor : COLORS.primaryColor,
                              borderWidth: 0.5 * METRICS.ratioX,
                              borderRadius: METRICS.craftborder,
                              flexDirection: 'row',
                              justifyContent: 'space-evenly',
                              alignItems: 'center',
                              width: METRICS.screenWidth / 1.5,
                              marginVertical: 10 * METRICS.ratioY,
                              marginBottom: 5 * METRICS.ratioY,
                              paddingHorizontal: 10 * METRICS.ratioX,
                              paddingVertical: 10 * METRICS.ratioY,
                            }}
                          >
                            <CustomIcon
                              name="attachment"
                              color="#fff"
                              size={METRICS.attachmentIconSize}
                            />
                            <Text
                              numberOfLines={1}
                              ellipsizeMode="middle"
                              style={{
                                color: '#fff',
                                fontWeight: 'bold',
                                fontSize: METRICS.fontSizeNormal,
                                lineHeight: 24 * METRICS.ratioX,
                                paddingHorizontal: 40 * METRICS.ratioX,
                              }}
                            >
                              {props.currentMessage.attachment.name}
                            </Text>
                            <TouchableWithoutFeedback
                              onPress={async () => {
                                const downloadRef = this.storageRef.child(
                                  `docs/${props.currentMessage.attachment.name}`
                                );
                                const downloadUrl = await downloadRef.getDownloadURL();
                                const url = downloadUrl.split('?')[0];
                                const { config } = RNFetchBlob;
                                const options = {
                                  fileCache: true,
                                };
                                config(options)
                                  .fetch(`${encodeURI(url)}`)
                                  .then((res) => {
                                    // console.log('res', res.path());
                                  })
                                  .catch((err) => console.log('err', err));
                              }}
                            >
                              <CustomIcon
                                name="download"
                                color="#fff"
                                size={METRICS.attachmentIconSize}
                              />
                            </TouchableWithoutFeedback>
                          </View>
                        </View>
                        {props.position === 'left' ? (
                          <Text
                            style={{
                              color: '#fff',
                              backgroundColor: '#000',
                              position: 'absolute',
                              bottom: -20 * METRICS.ratioY,
                              left: 0,
                              marginBottom: 10 * METRICS.ratioY,
                            }}
                          >
                            {moment(moment.utc(props.currentMessage.createdAt).local()).format(
                              'LT'
                            )}
                          </Text>
                        ) : (
                          <Text
                            style={{
                              color: '#fff',
                              backgroundColor: '#000',
                              position: 'absolute',
                              bottom: -20 * METRICS.ratioY,
                              right: 0,
                              marginBottom: 10 * METRICS.ratioY,
                            }}
                          >
                            {moment(moment.utc(props.currentMessage.createdAt).local()).format(
                              'LT'
                            )}
                          </Text>
                        )}
                      </>
                    )}
                  </View>
                );
              }

              if (props.currentMessage.messageType === 'Sticker') {
                return (
                  <View style={{ flexDirection: 'column' }}>
                    {SameUser && SameDay ? (
                      <>
                        <View
                          style={{
                            backgroundColor: COLORS.blackColor,
                            borderColor:
                              props.position === 'left' ? COLORS.whiteColor : COLORS.primaryColor,
                            flexDirection: 'row',
                            justifyContent: 'space-evenly',
                            alignItems: 'center',
                            width: 120 * METRICS.ratioX,
                            marginVertical: 10 * METRICS.ratioY,
                            marginBottom: 5 * METRICS.ratioY,
                            paddingHorizontal: 0,
                            paddingVertical: 10 * METRICS.ratioY,
                          }}
                        >
                          <ProgressImage
                            indicator={Progress.Circle}
                            progress={this.state.uploading ? this.state.transferred : null}
                            showsText
                            indicatorProps={{
                              size: 40 * METRICS.ratioX,
                              borderWidth: 0,
                              color: COLORS.primaryColorRgb(0.6),
                              unfilledColor: 'rgba(200, 200, 200, 0.2)',
                            }}
                            style={{
                              height: 120 * METRICS.ratioX,
                              minWidth: 120 * METRICS.ratioX,
                              borderBottomLeftRadius: props.position === 'left' ? 0 : 10,
                              borderBottomRightRadius: props.position === 'right' ? 0 : 10,
                              borderBottomWidth: 1,
                              backgroundColor: 'transparent',
                            }}
                            source={{
                              uri: props.currentMessage.image,
                            }}
                            resizeMode="contain"
                          />
                        </View>

                        {props.position === 'left' ? (
                          <Text
                            style={{
                              color: '#fff',
                              backgroundColor: '#000',
                              position: 'absolute',
                              bottom: -20 * METRICS.ratioY,
                              left: 0,
                              marginBottom: 10 * METRICS.ratioY,
                              fontSize: METRICS.fontSizeSmall,
                            }}
                          >
                            {moment(moment.utc(props.currentMessage.createdAt).local()).format(
                              'LT'
                            )}
                          </Text>
                        ) : (
                          <View
                            style={[
                              styles.times,
                              {
                                flexDirection: 'row',
                              },
                            ]}
                          >
                            <Text
                              style={{
                                fontSize: METRICS.fontSizeSmall,
                                color: '#fff',
                                fontFamily: 'lato',
                                textAlignVertical: 'center',
                              }}
                            >
                              {moment(props.currentMessage.createdAt).format('LT')}
                            </Text>
                            <CustomIcon
                              onPress={() => {
                                this.showCustomActionSheet(props.currentMessage);
                              }}
                              name="more-button-of-three-dots"
                              color="#fff"
                              size={16 * METRICS.ratioX}
                              style={{ marginHorizontal: 10 * METRICS.ratioX }}
                            />
                          </View>
                        )}
                      </>
                    ) : (
                      <>
                        <View style={{ marginVertical: 5 * METRICS.ratioY }}>
                          <Text
                            style={[
                              styles.bubbleUserName,
                              {
                                alignSelf: props.position === 'left' ? 'flex-start' : 'flex-end',
                              },
                            ]}
                          >
                            {props.currentMessage.user.name}
                          </Text>
                          {/* bubble start */}
                          <View
                            style={{
                              backgroundColor: COLORS.blackColor,
                              borderColor:
                                props.position === 'left' ? COLORS.whiteColor : COLORS.primaryColor,

                              flexDirection: 'row',
                              justifyContent: 'space-evenly',
                              alignItems: 'center',
                              width: 120 * METRICS.ratioX,
                              paddingHorizontal: 10 * METRICS.ratioX,
                              paddingVertical: 10 * METRICS.ratioY,
                            }}
                          >
                            <ProgressImage
                              indicator={Progress.Circle}
                              progress={this.state.uploading ? this.state.transferred : null}
                              showsText
                              indicatorProps={{
                                size: 40 * METRICS.ratioX,
                                borderWidth: 0,
                                color: COLORS.primaryColorRgb(0.6),
                                unfilledColor: 'rgba(200, 200, 200, 0.2)',
                              }}
                              style={{
                                height: 120 * METRICS.ratioX,
                                minWidth: 120 * METRICS.ratioX,
                                borderBottomLeftRadius: props.position === 'left' ? 0 : 10,
                                borderBottomRightRadius: props.position === 'right' ? 0 : 10,
                                borderBottomWidth: 1,
                                backgroundColor: 'transparent',
                              }}
                              source={{
                                uri: props.currentMessage.image,
                              }}
                              resizeMode="contain"
                            />
                          </View>
                        </View>
                        {props.position === 'left' ? (
                          <Text
                            style={{
                              color: '#fff',
                              backgroundColor: '#000',
                              position: 'absolute',
                              bottom: -20 * METRICS.ratioY,
                              left: 0,
                              marginBottom: 10 * METRICS.ratioY,
                            }}
                          >
                            {moment(moment.utc(props.currentMessage.createdAt).local()).format(
                              'LT'
                            )}
                          </Text>
                        ) : (
                          <View
                            style={[
                              styles.times,
                              {
                                flexDirection: 'row',
                              },
                            ]}
                          >
                            <Text
                              style={{
                                fontSize: METRICS.fontSizeSmall,
                                color: '#fff',
                                fontFamily: 'lato',
                                textAlignVertical: 'center',
                              }}
                            >
                              {moment(props.currentMessage.createdAt).format('LT')}
                            </Text>
                            <CustomIcon
                              onPress={() => {
                                this.showCustomActionSheet(props.currentMessage);
                              }}
                              name="more-button-of-three-dots"
                              color="#fff"
                              size={16 * METRICS.ratioX}
                              style={{ marginHorizontal: 10 * METRICS.ratioX }}
                            />
                          </View>
                        )}
                      </>
                    )}
                  </View>
                );
              }
              return (
                <View style={{ flexDirection: 'column' }}>
                  {SameUser && SameDay ? (
                    <Bubble
                      {...props}
                      textStyle={{
                        right: {
                          color: '#fff',
                          textAlign: 'left',
                          fontFamily: 'lato',
                        },
                        left: {
                          color: '#fff',
                          fontFamily: 'lato',
                        },
                      }}
                      wrapperStyle={{
                        left: {
                          backgroundColor: 'black',
                          borderColor: '#fff',
                          borderWidth: props.currentMessage.messageType === 'Text' ? 0.5 : 0,
                          marginVertical: METRICS.marginBigY,
                          paddingHorizontal: props.currentMessage.messageType === 'Text' ? 10 : 0,
                        },
                        right: {
                          backgroundColor: COLORS.editingGrey,
                          marginVertical: METRICS.marginBigY,
                          paddingHorizontal: props.currentMessage.messageType === 'Text' ? 10 : 0,
                        },
                      }}
                      tickStyle={{
                        height: 0,
                        width: 0,
                      }}
                      bottomContainerStyle={{
                        left: {
                          height: props.currentMessage.messageType === 'Text' ? 20 : 0,
                        },
                        right: {
                          height: props.currentMessage.messageType === 'Text' ? 20 : 0,
                        },
                      }}
                    />
                  ) : (
                    <>
                      <Text
                        style={[
                          styles.bubbleUserName,
                          {
                            alignSelf: props.position === 'left' ? 'flex-start' : 'flex-end',
                          },
                        ]}
                      >
                        {props.currentMessage.user.name}
                      </Text>

                      <Bubble
                        {...props}
                        textStyle={{
                          right: {
                            color: '#fff',
                            textAlign: 'left',
                            fontFamily: 'lato',
                          },
                          left: {
                            color: '#fff',
                            fontFamily: 'lato',
                          },
                        }}
                        wrapperStyle={{
                          left: {
                            backgroundColor: 'black',
                            borderColor: '#fff',
                            borderWidth: props.currentMessage.messageType === 'Text' ? 0.5 : 0,

                            marginVertical: METRICS.marginBigY,
                            paddingHorizontal: props.currentMessage.messageType === 'Text' ? 10 : 0,
                          },
                          right: {
                            backgroundColor: COLORS.editingGrey,
                            marginVertical: METRICS.marginBigY,
                            paddingHorizontal: props.currentMessage.messageType === 'Text' ? 10 : 0,
                          },
                        }}
                        tickStyle={{
                          height: 0,
                          width: 0,
                        }}
                        bottomContainerStyle={{
                          left: {
                            height: props.currentMessage.messageType === 'Text' ? 20 : 0,
                          },
                          right: {
                            height: props.currentMessage.messageType === 'Text' ? 20 : 0,
                          },
                        }}
                      />
                    </>
                  )}
                </View>
              );
            }}
            parsePatterns={(linkStyle) => [
              {
                type: 'url',
                onPress: (link) => {
                  Linking.openURL(link);
                },
                pattern: PATTERNS.url, // Pattern of url can be changed ! go to definitions 'PATTERNS' and changed there
                style: {
                  color: COLORS.primaryColor,
                  textDecorationLine: 'none',
                },
              },
              {
                type: 'phone',
                onPress: (number) => {
                  const dialNumber = `tel:${number}`;
                  Linking.openURL(dialNumber);
                },
                pattern: PATTERNS.phone,
                style: {
                  color: COLORS.primaryColor,
                  textDecorationLine: 'none',
                },
              },
              {
                type: 'email',
                onPress: (email) => {
                  Linking.openURL(`mailto:${email}`);
                },
                pattern: PATTERNS.email,
                style: {
                  color: COLORS.primaryColor,
                  textDecorationLine: 'none',
                },
              },
            ]}
          />

          <RBSheet
            ref={(ref) => {
              this.RBSheet = ref;
            }}
            animationType="slide"
            openDuration={900}
            height={300}
            keyboardAvoidingViewEnabled
            closeOnDragDown
            customStyles={{
              container: {
                height: METRICS.screenHeight / 1.85,
                backgroundColor: COLORS.editingGrey,
              },
            }}
          >
            <Giphy
              attachGif={(item) =>
                this.uploadGif(item).then((file) => {
                  return this._uploadToServer(file, { pickerType: 'GifPicker' });
                })
              }
              close={() => this.RBSheet.close()}
            />
          </RBSheet>
          <DMPopup
            title="Edit Group Info"
            status={this.state.channelPopup}
            onClose={this.onToggleModal}
            channel={{ data: { ...channel } }}
            edit
            isAdmin={isAdmin}
            deleteChannel={() => this.deleteChannel({ data: { ...channel } })}
            navigation={this.props.navigation}
          />
        </View>
        <FlashMessage titleStyle={styles.flashStyle} />
      </SafeAreaView>
    );
  }
}

function mapStateToProps(state) {
  const { chatClient, user, craftState } = state;
  return { chatClient, user, craftState };
}

export default connect(mapStateToProps, {
  updateLastMsg,
  getAllChatGroups,
  deleteChatGroup,
  updateDMCounter,
  updatePrevState,
  updateTitle,
})(ChannelScreen);

const styles = StyleSheet.create({
  flashStyle: {
    fontFamily: 'lato',
    fontSize: METRICS.fontSizeNormal,
  },
  backIcon: {
    color: COLORS.whiteColor,
    fontSize: METRICS.fontSizeBigger,
  },
  dotsButton: {
    position: 'absolute',
    right: METRICS.spacingSmall,
    padding: 12 * METRICS.ratioX,
    paddingLeft: METRICS.spacingHuge,
    zIndex: 101,
  },
  backButton: {
    position: 'absolute',
    left: METRICS.spacingSmall,
    padding: 12 * METRICS.ratioX,
    paddingRight: METRICS.spacingHuge,
    zIndex: 101,
  },
  bubbleUserName: {
    color: COLORS.whiteColor,
    fontFamily: 'lato',
    textAlign: 'center',
  },
  footerContainer: {
    paddingBottom: METRICS.spacingBig,
  },
  footerText: {
    fontSize: METRICS.fontSizeOK,
    fontFamily: 'lato',
    color: COLORS.greygreyColor,
    paddingHorizontal: METRICS.spacingNormal,
    alignSelf: 'center',
    textAlign: 'center',
  },
  videocontainer: {
    flex: 1,
    paddingTop: 250 * METRICS.ratioX,
  },
  controls: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    height: 25,
    left: 0,
    bottom: 10,
    right: 0,
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingHorizontal: 10,
    paddingVertical: 0,
  },
  mainButton: {
    marginRight: 15 * METRICS.ratioX,
  },
  duration: {
    color: COLORS.whiteColor,
    marginLeft: 10 * METRICS.ratioX,
  },
  avatar: {
    width: METRICS.avatarsmall,
    height: METRICS.avatarsmall,
    borderRadius: METRICS.avatarsmall,
  },
  times: {
    color: COLORS.whiteColor,
    fontFamily: 'lato',
    position: 'absolute',
    bottom: -20,
    right: 0,
  },
  onlinecircle: {
    position: 'absolute',
    right: 5 * METRICS.ratioX,
    bottom: 0,
    zIndex: 1,
    padding: 1 * METRICS.ratioX,
  },
});

const Modalstyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginTop: 80,
  },
  modalView: {
    flexDirection: 'row',
    marginTop: 20,
    backgroundColor: COLORS.greygreyColor,
    borderRadius: 10,
    width: METRICS.screenWidth,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    backgroundColor: '#F194FF',
    borderRadius: 20,
    padding: 10,
    top: -25,
    left: -25,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 14,
  },
  modalText: {
    marginHorizontal: 20,
    paddingRight: 30,
    textAlign: 'center',
    justifyContent: 'center',
    color: '#fff',
  },
});
