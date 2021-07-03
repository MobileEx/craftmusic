import React from 'react';
import {
  Dimensions,
  StyleSheet,
  ScrollView,
  View,
  Animated,
  Easing,
  Text,
  TouchableOpacity,
  PanResponder,
  ActivityIndicator,
  FlatList,
  TouchableWithoutFeedback,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { SafeAreaView } from 'react-navigation';
import DocumentPicker from 'react-native-document-picker';
import RNFetchBlob from 'rn-fetch-blob';
import Video from 'react-native-video';
import { connect } from 'react-redux';
import { RNFFmpeg } from 'react-native-ffmpeg';
import RNFS from 'react-native-fs';
import UUIDGenerator from 'react-native-uuid-generator';
import ImagePicker from 'react-native-image-picker';
import { Badge } from 'react-native-elements';
import firebase from 'react-native-firebase';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import _ from 'lodash';
import Environment from '../helpers/environment';
import ProfileService from '../services/ProfileService';
import {
  removeOnlineStudioUser,
  toggleRecording,
  togglePlaying,
  // updateTrackPosition,
  setStudioControlsCallback,
  ADD_VIDEO,
  ADD_AUDIO_TRACK,
  updateAudioTrack,
  UPDATE_AUDIO_TRACK,
  SPLIT_AUDIO_TRACK,
  DELETE_AUDIO_TRACK,
  UPDATE_VIDEO,
  // COPY_VIDEO_TRACK,
  // PASTE_VIDEO_TRACK,
  DELETE_VIDEO,
  SPLIT_VIDEO,
  updateIsAudioCopy,
  updateEditingCraftId,
  updateTitle,
  updatePrevState,
  updateStoreState,
  updateIsCopy,
  getAllChatGroups,
  updateDMCounter,
} from '../store/actions';
import { Audio } from '../libs/rnsuperpowered';
import { CustomIcon, ModalWrapper, PublishModal, ConfirmModal } from '../components';
import { FileModal, Timeline, Track, VideoTrack } from '../components/studio';
import { CONSTANTS, COLORS, METRICS, STYLES } from '../global';
import { user as userImage } from '../global/Images';
import {
  StudioContext,
  setPlayerPitchShift,
  setPlayerEcho,
  setPlayerReverb,
  setPlayerPlaybackRate,
  setPlayerFlanger,
  toggleRecorder,
  setupStudio,
  exportStudio,
  leaveOnlineStudio,
  update as updateStudio,
} from '../services/StudioService';
import { Studio as StudioEvents } from '../events';
import PlayingCraftService from '../services/PlayingCraftService';
import store from '../store/configureStore';

class StudioScreen extends React.Component {
  constructor(props) {
    super(props);

    this.timelineRef = React.createRef();

    this.state = {
      activeTrack: {
        id: null,
        type: null,
        startDuration: 0,
        endDuration: 0,
      },
      activeView: 'default',
      // cameraPreviewActiveStyle: {},
      currentlyPlayingVideoId: null,
      currentPlayTime: 0,
      playbackStartTime: 0,
      playbackOffset: 0,
      // xOffset: 0,
      // waveform: null,
      // isRecording: false,
      // recordedVideo: '',
      // positions: [],
      videos: [],
      videoKeysOrder: [],
      videoSrc: null,
      // videoThumb: null,
      futureVideoTimeoutId: null,
      videoPaused: true,
      fileModalVisible: false,
      trackEffects: {},
      aspectRatio: 'square',
      toggle: false,
      studioContainerPan: new Animated.ValueXY(),
      playbackAnimation: null,
      videoVolume: 1,
      selectedVideoTrack: null,
      newVideoId: '',
      newPath: '',
      avatarUrl: '',
      selectedAudioTrack: null,
      newAudioId: '',
      newAudioPath: '',
      isFromAddCover: this.props.navigation.state.params
        ? this.props.navigation.state.params.isFromAddCover
        : 0,
      isVidLoaded: false,
      isAudLoaded: false,
      isVisibleSaveModal: false,
      dmCount: 0,
    };

    this.hasVideoTracks = false;
    this.videoTrackId = '';
    this.isNewStudio = false;

    this._translateX = new Animated.Value(0);
  }

  static contextType = StudioContext;

  static navigationOptions = {
    header: null,
    tabBarVisible: false,
  };

  videoPlayerPaused = true;

  scrollX = new Animated.Value(0);

  audio = new Audio('', 44100);

  tracks = [];

  adding = false;

  currentPan = 0;

  panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (rawEvent, gestureState) => {
      if (this.props.playing) {
        return;
      }

      let newVal = this.currentPan + gestureState.dx;
      if (newVal >= 0) {
        newVal = 0;
      }
      this.state.studioContainerPan.x.setValue(newVal);
    },
    onPanResponderRelease: (e, gestureState) => {
      if (this.props.playing) {
        return;
      }
      let newVal = this.currentPan + gestureState.dx;
      if (newVal >= 0) {
        newVal = 0;
      }

      this.currentPan = newVal;
      this.state.studioContainerPan.x.setValue(newVal);
      this.setState({ currentPlayTime: this.scrollXToMs(newVal * -1) });
      this.handleScrollEnd(newVal * -1);
    },
  });

  onGestureChange = (event) => {
    if (this.props.playing) {
      return;
    }
    if (event.nativeEvent.oldState === State.ACTIVE) {
      let newVal = this.currentPan + event.nativeEvent.translationX;
      if (newVal > 0) {
        newVal = 0;
      }

      this.currentPan = newVal;
      this.state.studioContainerPan.x.setValue(newVal);
      this.setState({ currentPlayTime: this.scrollXToMs(newVal * -1) });
      this.handleScrollEnd(newVal * -1);
    }
  };

  onGestureEvent = (event) => {
    let newVal = this.currentPan + event.nativeEvent.translationX;
    if (newVal > 0) {
      newVal = 0;
    }
    this.state.studioContainerPan.x.setValue(newVal);
  };

  componentDidMount() {
    const { navigation } = this.props;
    this.getUserProfileDetails();
    this.props.navigation.addListener('didFocus', this.onFocusHeader);

    this.state.studioContainerPan.setValue({ x: 0, y: 0 });
    // set default null
    const studioId = navigation.getParam('id', null);
    const craftId = navigation.getParam('craftId', null);

    if (!studioId && !craftId) {
      this.isNewStudio = true;
      this.addNewCraft();
    } else {
      setupStudio(studioId, craftId, this.props.user);
    }

    this.props.dispatch(setStudioControlsCallback(this.studioControlsCallback));
    this.setupPlaybackAnimation();

    // // studio checkin
    // this.props.dispatch(studioCheckIn()).then(studio => {
    //   this.registerStudioEvents(studio.id);
    // });
  }

  componentDidUpdate(prevProps) {
    if (this.props.studio && this.props.studio.studio_tracks) {
      this.props.studio.studio_tracks.map((item) => {
        if (item.type === 2) {
          this.hasVideoTracks = true;
          this.videoTrackId = item.id;
        }
      });
    }
  }

  onFocusHeader = () => {
    this.getDMCount();
  };

  get ref() {
    return firebase.database().ref('groups');
  }

  getDMCount() {
    let dmCount = 0;
    this.props.dispatch(getAllChatGroups()).then((res) => {
      this.props.groups.forEach((group) => {
        const groupId = group.group_details.id;
        const messagesRef = this.ref.child(`${groupId}/messages`);
        messagesRef.once('value', (snapshot) => {
          snapshot.forEach((message) => {
            (async () => {
              const readByRef = message.child('readBy').ref;
              const messageForRef = message.child('messageFor').ref;
              let readByVal = [];
              let messageForVal = [];

              await readByRef.once('value', (rSnapShot) => {
                readByVal = rSnapShot.val();
              });
              await messageForRef.once('value', (mfSnapShot) => {
                messageForVal = mfSnapShot.val();
              });
              if (messageForVal) {
                if (Array.isArray(messageForVal) && messageForVal.includes(this.props.user.id)) {
                  if (readByVal && !readByVal.includes(this.props.user.id)) {
                    dmCount += 1;
                    this.props.dispatch(updateDMCounter(dmCount));
                  }
                } else if (!Array.isArray(messageForVal)) {
                  if (Object.values(messageForVal).indexOf(this.props.user.id) > -1) {
                    dmCount += 1;
                    this.props.dispatch(updateDMCounter(dmCount));
                  }
                }
              }
            })();
          });
        });
      });
    });
  }

  onGoBack = () => {
    const studioId = this.props.navigation.getParam('id', null);
    leaveOnlineStudio(studioId, this.props.user.id);
    for (const [userId] of Object.entries(this.props.onlineStudioUsers)) {
      this.props.dispatch(removeOnlineStudioUser(userId));
    }

    if (this.state.isFromAddCover === 1) {
      this.props.navigation.goBack();
    } else {
      this.props.dispatch(updatePrevState(store.getState()));
      this.props.dispatch(updateTitle('StudioSplash'));
      this.props.navigation.navigate('StudioSplash');
    }
    PlayingCraftService.clearCrafts()
      .then((/* res */) => {
        // console.log('clearCrafts response', res)
      })
      .catch((/* err */) => {
        // console.log(err.response.data.error);
      });

    this.props.dispatch(updateEditingCraftId(null));
  };

  onCheckSave = () => {
    if (this.isNewStudio) {
      this.setState({ isVisibleSaveModal: true });
      return;
    }
    this.onGoBack();
  };

  onCancelSave = () => {
    this.setState({ isVisibleSaveModal: false });
    if (this.props.editingCraftId) {
      PlayingCraftService.deleteCraft(this.props.editingCraftId)
        .then((/* res */) => {
          // console.log('deleteCraft response', res);
          this.onGoBack();
        })
        .catch((/* err */) => {
          // console.log(err.response.data.error);
        });
    }
  };

  onSaveDraft = () => {
    this.setState({ isVisibleSaveModal: false });
    this.onGoBack();
  };

  addNewCraft = () => {
    if (!this.props.editingCraftId) {
      PlayingCraftService.addNewCraft()
        .then((res) => {
          this.props.dispatch(updateEditingCraftId(res.data.craft_id));
          if (this.state.isFromAddCover === 1) {
            this.createNewStudio();
          }
          // console.log("this.props.editingCraftId-", this.props.editingCraftId)
        })
        .catch((/* err */) => {
          // console.log(err.response.data.error);
        });
    }
  };

  resetStudioData = () => {
    // delete audioTracks

    for (const [, track] of Object.entries(this.props.audioTracks)) {
      const StudioService = this.context;
      this.removeStudioFiles('audio', track.track);
      StudioService.update(DELETE_AUDIO_TRACK, { id: track.id });
    }
    this.setState({ isAudLoaded: true });

    // delete videos
    Object.values(this.props.videos).forEach((video) => {
      const StudioService = this.context;
      this.removeStudioFiles('video', video);
      StudioService.update(DELETE_VIDEO, { videoId: video.id });
    });
    this.setState({ isVidLoaded: true });
  };

  removeStudioFiles = (trackType, object) => {
    RNFS.unlink(trackType === 'audio' ? object : object.filepath)
      .then(() => {
        if (trackType === 'video') {
          RNFS.unlink(object.thumbs[0])
            .then(() => {
              // console.log('video thumb delete')
            })
            .catch((/* err */) => {
              // console.log('video thumb delete error', err)
            });
        }
      })
      .catch((/* err */) => {
        // console.log('error unlink file', err);
      });
  };

  getUserProfileDetails = () => {
    ProfileService.getUserProfile(this.props.user.id)
      .then((res) => {
        const userProfile = res.data;
        this.setState({
          avatarUrl: userProfile.avatar,
        });
        if (this.state.isFromAddCover === 0) {
          // delete already added data in studio
          this.resetStudioData();
        } else {
          this.setState({ isAudLoaded: true, isVidLoaded: true });
        }
      })
      .catch((err) => {
        // console.log(err.response.data.error);
        if (this.state.isFromAddCover === 0) {
          // delete already added data in studio
          this.resetStudioData();
        } else {
          this.setState({ isAudLoaded: true, isVidLoaded: true });
        }
      });
  };

  setupPlaybackAnimation = () => {
    const { studioDuration } = this.props;
    const { currentPlayTime } = this.state;
    // calculate width of track view
    const trackParts = this.props.studioDuration / this.props.timeScale;
    const finishPosition = trackParts * this.props.rulerUnitWidth * -1;
    const delay = 350;
    const easing = Easing.linear;
    // time left until end of studio canvas
    const duration = studioDuration - currentPlayTime;
    const playbackAnimation = Animated.timing(this.state.studioContainerPan.x, {
      toValue: finishPosition,
      delay,
      easing,
      duration,
    });
    this.setState({ playbackAnimation });
    return playbackAnimation;
  };

  getEventsWithHandlers() {
    const events = [];
    for (const [eventName] of Object.entries(StudioEvents)) {
      const eventHandler = this[eventName];
      // $event name, $event handler
      if (eventHandler) {
        events.push([eventName, eventHandler]);
      }
    }
    return events;
  }

  scrollXToMs = (x) => {
    if (x) return (x / this.props.rulerUnitWidth) * this.props.timeScale;
    return 0;
  };

  videoTrackDragFinishHandler = (videoId, xPosition) => {
    // let previousVideoPosition;
    // xPosition starts from 0 wherever video clips original position was
    // add offset xPosition of previous video
    // const currentVideoIndex = this.props.videoKeysOrder.indexOf(videoId);
    // if (currentVideoIndex > 0) {
    //   const previousVideoId = this.props.videoKeysOrder[currentVideoIndex - 1];
    //   previousVideoPosition = this.props.videoTrackPositions[previousVideoId];
    // }

    const startPositionMs = this.scrollXToMs(xPosition);

    // if (previousVideoPosition) {
    //   startPositionMs += previousVideoPosition.endPositionMs;
    // }

    const video = this.props.videos[videoId];
    const endPositionMs = startPositionMs + video.durationMs;
    const difference = this.state.currentPlayTime - startPositionMs;
    updateStudio(UPDATE_VIDEO, {
      videoTrack: { id: videoId, startPositionMs, endPositionMs },
    });

    this.seekVideoPlayerToCurrentVideo(difference);
  };

  openModal = () => {
    this.setState({ toggle: true });
  };

  closeModal = () => {
    this.setState({ toggle: false });
    PlayingCraftService.clearCrafts()
      .then((/* res */) => {
        // console.log('clearCrafts response', res)
      })
      .catch((/* err */) => {
        // console.log(err.response.data.error);
      });
  };

  navigationHandler = (routeName) => {
    this.setState({ toggle: false });
    this.props.navigation.navigate(routeName, {
      openModal: this.openModal,
      studioId: this.props.studio.id,
    });
  };

  // broadcast Events
  StudioFileUpload = (data) => {
    const { id, filetype, url, filename } = data;

    this.handleFile(id, filetype, `${Environment.S3URL}/${url}`, filename, true);
  };

  videoAtCurrentTime = (currentTimeMs, videoPositionObjects) => {
    for (const [id, positionObj] of Object.entries(videoPositionObjects)) {
      if (currentTimeMs >= positionObj.startPositionMs) {
        return id;
      }
    }
    return null;
  };

  findNextVideo = (currentTimeMs, videoPositionObjects) => {
    // schedule: 'now'
    // schedule: 'next'
    // null if no playable video
    const closest = { id: null, schedule: null, difference: null };

    for (const [id, positionObj] of Object.entries(videoPositionObjects)) {
      if (
        currentTimeMs >= positionObj.startPositionMs &&
        currentTimeMs < positionObj.endPositionMs
      ) {
        closest.id = id;
        closest.schedule = 'now';
        return closest;
      }
      const difference = positionObj.startPositionMs - currentTimeMs;
      // replace if closer
      if (difference === null || difference < closest.difference) {
        closest.id = id;
        closest.schedule = 'next';
        closest.difference = difference;
      }
    }
    if (closest.id) {
      return closest;
    }
    return null;
  };

  toggleAnimatePlayback = (playing) => {
    if (!playing) {
      this.state.playbackAnimation.stop();
      return;
    }
    const animationRef = this.setupPlaybackAnimation();
    animationRef.start(() => {
      // completion callback
      const stopTimeMs = this.scrollXToMs(this.state.studioContainerPan.x._value * -1);
      this.setState({ currentPlayTime: stopTimeMs });
      this.currentPan = this.state.studioContainerPan.x._value;
    });
  };

  toggleProjectPlayback = () => {
    let newState = {};
    let playbackOffset;
    const newPlaying = !this.props.playing;
    this.toggleAnimatePlayback(newPlaying);

    this.props.dispatch(togglePlaying());

    if (this.props.videoKeysOrder.length > 0) {
      if (!this.props.playing) {
        playbackOffset = this.state.currentPlayTime;
        newState.playbackOffset = playbackOffset;
        // toggle video playback
        // determine correct video to play at current time
        const nextVideoResult = this.findNextVideo(
          this.state.currentPlayTime,
          this.props.videoTrackPositions
        );

        if (nextVideoResult && nextVideoResult.schedule && nextVideoResult.id) {
          const vidId = nextVideoResult.id;
          if (nextVideoResult.schedule === 'now') {
            // set up video info for video player
            const videoState = this.makeVideoPlaybackStateData(
              vidId,
              this.props.videos[nextVideoResult.id].filepath,
              false
            );
            newState = { ...newState, ...videoState };
          } else if (nextVideoResult.schedule === 'next') {
            // clear current video state
            const videoState = this.makeVideoPlaybackStateData(null);

            newState = {
              ...newState,
              ...videoState,
              videoPaused: true,
              videoSrc: null,
            };

            const startTime = this.props.videoTrackPositions[vidId].startPositionMs;

            this.queueFutureVideoPlayback(vidId, startTime, newState.playbackStartTime);
          }
        }
      } else {
        newState.videoPaused = true;
        newState.currentPlayTime =
          Date.now() - this.state.playbackStartTime + this.state.playbackOffset;
        // clear any pending future video queues
        clearTimeout(this.state.futureVideoTimeoutId);
      }
    }
    if (Object.keys(this.props.audioTracks).length > 0) {
      // toggle audio
      this.toggleAudioPlayback();
    }

    if (this.props.playing) {
      newState.playbackStartTime = null;
    } else {
      newState.playbackStartTime = Date.now();
    }

    // update any state
    this.setState(newState);
  };

  triggerVideoPlaybackState = (id, paused = false) => {
    this.setState(() => {
      const videoStateData = this.makeVideoPlaybackStateData(id, this.props.videos[id].filepath);
      return {
        ...videoStateData,
        videoPaused: paused,
      };
    });
  };

  queueFutureVideoPlayback = (id, startPositionMs, playbackStartTime) => {
    const elapsedTimeMs = Date.now() - playbackStartTime;
    const difference = startPositionMs - elapsedTimeMs;
    if (difference === 0 || difference > 0) {
      const timeoutId = setTimeout(() => {
        this.triggerVideoPlaybackState(id, false);
      }, difference);

      this.setState({ futureVideoTimeoutId: timeoutId });
    }
  };

  updateActiveView = (activeView) => {
    // toggle logic
    // toggle off
    if (this.state.activeView === activeView) {
      activeView = 'default';
    }
    // let cameraPreviewActiveStyle = {
    //   height: 0,
    // };
    // switch (activeView) {
    //   case 'splitscreen':
    //     cameraPreviewActiveStyle = {
    //       height: '80%',
    //       display: 'flex',
    //     };
    //     break;
    //   case 'fullscreen':
    //     cameraPreviewActiveStyle = {
    //       height: '100%',
    //       display: 'flex',
    //     };
    //     break;
    //   default:
    //     break;
    // }
    this.setState({
      activeView,
      // cameraPreviewActiveStyle,
    });
  };

  generateUUID = async () => {
    // Callback interface
    return UUIDGenerator.getRandomUUID();
  };

  openImagePicker = async () => {
    const options = {
      mediaType: 'video',
      videoQuality: 'high',
      storageOptions: {
        skipBackup: true,
      },
    };
    ImagePicker.launchImageLibrary(options, async (response) => {
      const filePathParts = response.uri.split('/');
      const filename = filePathParts[filePathParts.length - 1];
      const transformedPath = `~/Documents/${filename}`;
      // Same code as in above section!

      this.handleFile('', 'video', response.uri, response.fileName);
    });
  };

  setupNewTrack = (trackType = 'audio') => {
    const StudioService = this.context;
    if (this.props.playing) {
      this.toggleProjectPlayback(this.props.playing);
    }
    const record = trackType.includes('record_');
    if (!record) {
      if (trackType === 'video_roll') {
        this.openImagePicker('video');
        return;
      }
      this.openDocumentPicker(trackType);
      return;
    }
    if (trackType === 'record_video') {
      // record_video
    } else if (trackType === 'record_audio') {
      StudioService.update(ADD_AUDIO_TRACK);
    }
    this.setState({ fileModalVisible: false });
  };

  addVideo = (id, title, filepath, duration) => {
    this.setState((state) => {
      const videos = {
        ...state.videos,
        [id]: {
          id,
          title,
          filepath,
          selected: false,
          // render loading indicator section
          loading: true,
          thumbs: [],
          durationMs: duration,
        },
      };

      let { videoSrc } = state;
      // if no video in player set this one up
      if (!videoSrc) {
        videoSrc = { uri: filepath };
      }

      const videoKeysOrder = state.videoKeysOrder.concat(id);
      return {
        videos,
        videoKeysOrder,
        videoSrc,
      };
    });
  };

  updateVideo = (id, payload = null) => {
    this.setState((state) => {
      const videos = { ...state.videos, [id]: payload };
      return {
        videos,
      };
    });
  };

  makeVideoPlaybackStateData = (id, filepath, paused) => {
    let currentlyPlayingVideoId = id;
    let videoSrc = { uri: filepath };
    let videoPaused = paused;
    if (id === null) {
      currentlyPlayingVideoId = null;
      videoSrc = null;
      videoPaused = null;
    }
    return {
      videoPaused,
      currentlyPlayingVideoId,
      videoSrc,
    };
  };

  updateVideoPlaybackStateData = (id, filepath) => {
    this.setState(this.makeVideoPlaybackStateData(id, filepath));
  };

  videoFinished = () => {
    const elapsedTimeMs = Date.now() - this.state.playbackStartTime + this.state.playbackOffset;

    // grab the next video info
    const currentVideo = this.props.videos[this.state.currentlyPlayingVideoId];
    const { endPositionMs } = currentVideo;
    this.setState({
      currentPlayTime: endPositionMs,
      currentlyPlayingVideoId: null,
    });
    let nextVideoIndex = this.props.videoKeysOrder.indexOf(this.state.currentlyPlayingVideoId);
    nextVideoIndex += 1;
    const nextVideoId = this.props.videoKeysOrder[nextVideoIndex];
    if (!nextVideoId) {
      return;
    }
    const nextVideoPosition = this.props.videoTrackPositions[nextVideoId];
    const timeUntilNextVideo = nextVideoPosition.startPositionMs - elapsedTimeMs;

    // setup timeout to start playing next video at the appropriate time:
    setTimeout(() => {
      this.setState({
        currentlyPlayingVideoId: nextVideoId,
        currentPlayTime: nextVideoPosition.startPositionMs,
      });
    }, timeUntilNextVideo);
  };

  handleFile = (id, fileType, filepath, filename, remoteFile = false) => {
    const StudioService = this.context;
    (async () => {
      const { navigation, user } = this.props;
      const studioId = navigation.getParam('id', null);
      const craftId = navigation.getParam('craftId', null);
      if (fileType === 'audio') {
        // set up initial effects (pitch,echo,reverb etc values)
        StudioService.update(
          ADD_AUDIO_TRACK,
          {
            id,
            fileType,
            filepath,
            filename,
            volume: this.props.initialVolume,
            studioId,
            craftId,
            user,
          },
          remoteFile
        );
      } else if (fileType === 'video') {
        StudioService.update(
          ADD_VIDEO,
          { id, fileType, filepath, filename, studioId, craftId, user },
          remoteFile,
          this.hasVideoTracks,
          this.videoTrackId
        );
        this.setState({ fileModalVisible: false });
        // this.toggleFileImportModal()
      }

      // let uploadPath = filepath;
      // let audiofilepath = filepath;
      // const cachePath = `${RNFS.CachesDirectoryPath}/craftmusic_workspace/${id}`;
      // const newFilepath = `${cachePath}/${filename}`;
      // // TODO: handle cache file cleanup
      // RNFS.mkdir(cachePath, { NSURLIsExcludedFromBackupKey: true });
      // if (remoteFile) {
      //   // download file
      //   const download = RNFS.downloadFile({ fromUrl: filepath, toFile: newFilepath });
      //   audiofilepath = newFilepath;

      //   const downloadResult = await download.promise;
      // }
      // if (fileType === 'video') {
      //   if (!remoteFile) {
      //     // move file from document picker tmp directory to cache
      //     await RNFS.moveFile(filepath, newFilepath);
      //   }
      //   // add additional video clips to video track
      //   this.addVideo(id, filename, newFilepath, duration);
      //   uploadPath = newFilepath;

      //   // get video file information: duration, fps, codec, resolution etc
      //   const info = await RNFFmpeg.getMediaInformation(newFilepath);

      //   let latest = 0;
      //   // get last position
      //   for (const [videoId, videoPosition] of Object.entries(this.props.videoTrackPositions)) {
      //     if (videoPosition.endPositionMs >= latest) {
      //       latest = videoPosition.endPositionMs;
      //     }
      //   }

      //   this.props.dispatch(updateTrackPosition(id, 'video', latest, latest + info.duration));
      //   this.updateVideo(id, {
      //     ...this.state.videos[id],
      //     durationMs: info.duration,
      //   });
      //   // to get multiple thumbnails calculate desired fps so we get 4 screenshots every 25% apart:
      //   // duration in ms converted to s
      //   // let fps = (info.duration / 1000) / 4
      //   // using single thumbnail for now

      //   // get thumbnail
      //   RNFFmpeg.execute(
      //     `-i '${newFilepath}' -ss 00:00:00 -vframes 1 '${cachePath}/thumb%d.png'`
      //   ).then((result) => {
      //     // update the video entry in state with new thumb paths
      //     // turn off loading indicator
      //     // set up new video object payload: copy existing into new object, replace  with new data
      //     const newVideo = {
      //       ...this.state.videos[id],
      //       loading: false,
      //       durationMs: info.duration,
      //       thumbs: [`${cachePath}/thumb1.png`],
      //     };
      //     this.updateVideo(id, newVideo);
      //   });
      //   if (!remoteFile) {
      //     this.context.update({
      //       type: 'add_file',
      //       path: uploadPath,
      //       studio_id: this.props.studio.id,
      //       filetype: fileType,
      //     });
      //   }
      // } else if (fileType === 'audio') {
      //   this.addAudioTrack(id, filename, audiofilepath);
      //   // add initial track position
      //   this.props.dispatch(updateTrackPosition(id, 'audio', 0, 0));
      //   // setup superpowered audio player
      //   const audio = new Audio(audiofilepath, 44100);
      //   audio.addAudioPlayer(id, audiofilepath, (error, results) => {
      //     // update audio track
      //     this.updateAudioTrack(id, {
      //       durationSeconds: results.durationSeconds,
      //       waveform: results.waveform.slice(700, 1400),
      //     });
      //     // update track position with endPositionMs
      //     this.props.dispatch(updateTrackPosition(id, 'audio', 0, results.durationSeconds * 1000));
      //   });
      //   if (!remoteFile) {
      //     this.context.update({
      //       type: 'add_file',
      //       path: uploadPath,
      //       studio_id: this.props.studio.id,
      //       filetype: fileType,
      //     });
      //   }
      // }
    })();
  };

  toggleFileImportModal = () => {
    this.setState((state) => {
      return {
        fileModalVisible: !state.fileModalVisible,
      };
    });
  };

  toggleActiveTrack = (type, id) => {
    this.setState(() => {
      return { activeTrack: { type, id, start: 0, end: 0 } };
    });
  };

  onScrollEndSnapToEdge = (event) => {
    const { x } = event.nativeEvent.contentOffset;
    this.scrollX = x;
  };

  selectedTrack = (track) => {
    this.setState({
      selectedTrack: track,
    });
  };

  openDocumentPicker = (fileType = 'audio') => {
    // store DocumentPicker class type for file type
    let docType;
    this.fileType = fileType;
    if (fileType === 'video') {
      docType = [DocumentPicker.types.video];
    } else if (fileType === 'audio') {
      docType = [DocumentPicker.types.audio];
    } else if (fileType === 'image') {
      docType = [DocumentPicker.types.video];
    } else {
      return;
    }
    (async () => {
      // Pick a single file
      try {
        const res = await DocumentPicker.pick({
          type: docType,
          copyTo: 'documentDirectory',
        });
        this.toggleFileImportModal();
        RNFetchBlob.fs
          .stat(decodeURI(res.uri.split('://')[1]))
          .then(async (stats) => {
            if (this.fileType === 'audio') {
              const splitedFile = stats.filename.split('.');
              const fileExtension = splitedFile[splitedFile.length - 1];
              const path = `${RNFS.DocumentDirectoryPath}/test.${fileExtension}`;
              RNFS.exists(path)
                .then((isExist) => {
                  if (isExist) {
                    RNFS.unlink(path)
                      .then(() => {
                        RNFS.copyFile(stats.path, path)
                          .then((success) => {
                            this.handleFile('', this.fileType, path, stats.filename);
                          })
                          .catch((err) => {
                            // console.log(err.message);
                          });
                      })
                      .catch((err) => {
                        // console.log(err.message);
                      });
                  } else {
                    RNFS.copyFile(stats.path, path)
                      .then((success) => {
                        this.handleFile('', this.fileType, path, stats.filename);
                      })
                      .catch((err) => {
                        // console.log(err.message);
                      });
                  }
                  // `unlink` will throw an error, if the item to unlink does not exist
                  // console.log('Document Picker Res Decode====', stats)
                  // this.handleFile('', fileType, stats.path, stats.filename);
                })
                .catch((err) => {
                  // console.log(err.message);
                });
            } else {
              // Other then audio
              this.handleFile('', this.fileType, stats.path, stats.filename);
            }
          })
          .catch((err) => {
            // console.log(err.message);
          });
      } catch (err) {
        if (DocumentPicker.isCancel(err)) {
          // User cancelled the picker, exit any dialogs or menus and move on
        } else {
          throw err;
        }
      }
    })();
  };

  toggleRecord = (recording) => {
    if (!recording) {
      if (this.camera) {
        (async () => {
          try {
            const promise = this.camera.recordAsync(this.state.recordOptions);

            if (promise) {
              if (!this.state.playing) {
                this.togglePlayback(this.props.playing);
              }
              this.props.dispatch(toggleRecording());
              // this.setState({ isRecording: true });
              // const data = await promise;

              // this.setState({ isRecording: false });
              // this.setState({
              //   recordedVideo: data.uri,
              // });
            }
          } catch (e) {
            // console.error(e);
          }
        })();
      }
    } else {
      this.camera.stopRecording();
      this.props.dispatch(toggleRecording());
      // stop playback
      this.togglePlayback(this.props.playing);
    }
  };

  getAudioTrackPosition = (id) => {
    return this.props.audioTrackPositions[id];
  };

  getVideoPosition = (id) => {
    const { videoTrackPositions } = this.props;
    return videoTrackPositions[id];
  };

  // return how many ms the playhead position relevant to a track start
  getTrackPlayHeadPositionMs = (trackType, id) => {
    // const StudioService = this.context;
    if (trackType === 'audio') {
      const trackPosition = this.getAudioTrackPosition(id);
      return this.state.currentPlayTime - trackPosition.startPositionMs;
    }
    if (trackType === 'video') {
      const trackPosition = this.getVideoPosition(id);
      return this.state.currentPlayTime - trackPosition.startPositionMs;
    }
    return null;
  };

  splitTrack = (id, trackType) => {
    // get current position
    const { splitAudio, splitVideo } = this;
    if (trackType === 'audio') {
      // send to superpowered to process/save a trimmed audio file
      // how many MS into the track should it cut at
      const splitPosition = this.getTrackPlayHeadPositionMs(trackType, id);

      splitAudio(id, splitPosition);
    } else if (trackType === 'video') {
      const splitPosition = this.getTrackPlayHeadPositionMs(trackType, id);
      splitVideo(id, splitPosition);
    }
  };

  splitVideo = (id, positionMs) => {
    const StudioService = this.context;
    StudioService.update(SPLIT_VIDEO, { id, positionMs }, false);
  };

  splitAudio = (id, positionMs) => {
    const StudioService = this.context;
    StudioService.update(SPLIT_AUDIO_TRACK, { id, positionMs }, false);
  };

  deleteTrack = (id, trackType) => {
    const StudioService = this.context;
    if (trackType === 'audio') {
      StudioService.update(DELETE_AUDIO_TRACK, { id });
    } else if (trackType === 'video') {
      StudioService.update(DELETE_VIDEO, {
        videoId: this.state.activeTrack.id,
      });
    }
  };

  copyTrack = (id, trackType) => {
    // const StudioService = this.context;
    if (trackType === 'video') {
      (async () => {
        const newId = await this.generateUUID();
        const destPath = `${RNFS.DocumentDirectoryPath}/${newId}.mov`;

        this.props.dispatch(updateIsCopy(true));
        this.setState({ newVideoId: newId, newPath: destPath });
        this.copyFileToDest(this.state.selectedVideoTrack.filepath, destPath);
      })();
    } else {
      (async () => {
        const newId = await this.generateUUID();
        const destPath = `${RNFS.DocumentDirectoryPath}/${newId}.wav`;
        this.props.dispatch(updateIsAudioCopy(true));
        this.setState({ newAudioId: newId, newAudioPath: destPath });
        let sourcePath = this.state.selectedAudioTrack.track;

        if (!sourcePath) {
          sourcePath = `${RNFS.DocumentDirectoryPath}/SuperpoweredRecordingTest.wav`;
        }
        this.copyFileToDest(sourcePath, destPath);
      })();
    }
  };

  async copyFileToDest(source, dest) {
    try {
      await RNFS.copyFile(source, dest);
    } catch (error) {
      // console.log('error in copy', error)
    }
  }

  pasteTrack = (id, trackType) => {
    if (trackType === 'video') {
      this.props.dispatch(updateIsCopy(false));
      this.handleFile(
        this.state.newVideoId,
        'video',
        this.state.newPath,
        `${this.state.newVideoId}.mov`
      );
    } else {
      this.props.dispatch(updateIsAudioCopy(false));
      this.handleFile(
        this.state.newAudioId,
        'audio',
        this.state.newAudioPath,
        `${this.state.newAudioId}.wav`
      );
    }
  };

  exportVideo = () => {
    let cmd = '';
    let avStreams = '';
    const vidSymbols = [];
    // build ffmpeg command segments for each video
    this.state.videoKeysOrder.forEach((key, index) => {
      const video = this.state.videos[key];
      let startPosition = this.props.videoTrackPositions[key].startPositionMs / 1000;
      if (index === 0) {
        startPosition = 0;
      } else {
        startPosition = 3;
      }
      const cmdSegment = `-itsoffset ${startPosition} -i ${video.filepath} `;
      const vidSymbol = `[v${index}]`;
      vidSymbols.push(vidSymbol);
      avStreams += `[${index}:v:0]setsar=1${vidSymbol};`;
      cmd += cmdSegment;
    });
    const cachePath = `${RNFS.CachesDirectoryPath}/craftmusic_workspace`;
    cmd += `-filter_complex "${avStreams}${vidSymbols.join('')}concat=n=${
      this.state.videoKeysOrder.length
    }:v=1:a=0[outv]" `;
    cmd += `-map "[outv]" -c:v mpeg4 ${cachePath}/apexsurfnew.mp4`;
    RNFFmpeg.execute(cmd).then(() => {});
  };

  updateAspectRatio = (ratio) => {
    this.setState({ aspectRatio: ratio });
  };

  removeFileFromDevice = (file, trackType) => {
    if (file == null) {
      return;
    }
    let object = null;
    if (trackType === 'video') {
      object = this.state.selectedVideoTrack.filepath;
    } else {
      object = this.state.selectedAudioTrack.track;
    }
    RNFS.unlink(file == null ? object : file)
      .then(() => {
        if (trackType === 'video') {
          RNFS.unlink(this.state.selectedVideoTrack.thumbs[0])
            .then(() => {
              // console.log('video thumb delete')
            })
            .catch((/* err */) => {
              // console.log('video thumb delete error', err)
            });
        }
      })
      .catch((/* err */) => {
        // console.log('delete error', err)
      });
  };

  studioControlsCallback = ({ trackType, id, action, data, complete }) => {
    const { splitTrack, deleteTrack, copyTrack, pasteTrack, updateAspectRatio } = this;

    if (action === 'export') {
      exportStudio();
      return;
    }

    if (action === 'paste') {
      pasteTrack(id, trackType);
      return;
    }

    if (action === 'copy') {
      copyTrack(id, trackType);
      return;
    }

    if (action === 'split') {
      splitTrack(id, trackType);
      return;
    }
    if (action === 'delete') {
      this.removeFileFromDevice(null, trackType);
      deleteTrack(id, trackType);
      return;
    }

    if (action === 'aspectRatio') {
      updateAspectRatio(data);
      return;
    }

    if (action === CONSTANTS.studioTrackFadeOut) {
      return;
    }

    if (trackType === 'video') {
      if (action === 'volume') {
        if (complete) {
          // update video player volume
          this.setState({ videoVolume: data });
        }
      }
      //
    } else if (trackType === 'audio') {
      // effects data needs to be stored with the track
      if (action === 'volume') {
        // update volume
        if (!complete) {
          complete = false;
        }
        updateStudio(UPDATE_AUDIO_TRACK, {
          audioTrack: { id, volume: data },
          finalEvent: complete,
        });
      } else if (action === 'pitch') {
        setPlayerPitchShift(id, data);
        if (complete) {
          updateStudio(UPDATE_AUDIO_TRACK, {
            audioTrack: { id, pitch: data },
            finalEvent: complete,
          });
        }
      } else if (action === 'echo') {
        setPlayerEcho(id, data);
        if (complete) {
          updateStudio(UPDATE_AUDIO_TRACK, {
            audioTrack: { id, echo: data },
            finalEvent: complete,
          });
        }
      } else if (action === 'reverb') {
        setPlayerReverb(id, data);
        if (complete) {
          updateStudio(UPDATE_AUDIO_TRACK, {
            audioTrack: { id, reverb: data },
            finalEvent: complete,
          });
        }
      } else if (action === 'tempo') {
        setPlayerPlaybackRate(id, data);
      }

      if (action === 'flanger') {
        let enabled = false;
        if (data) enabled = true;
        setPlayerFlanger(id, enabled);
        if (complete) {
          updateStudio(UPDATE_AUDIO_TRACK, {
            audioTrack: { id, flanger: data },
            finalEvent: complete,
          });
        }
      }
    }
    if (action === 'record') {
      this.props.dispatch(toggleRecording());
      toggleRecorder(id, this.props.audioTrackPositions, (error, result) => {
        this.props.dispatch(
          updateAudioTrack(
            {
              id,
              durationSeconds: result.durationSeconds,
              waveform: result.waveform.slice(0, 1400),
            },
            0,
            result.durationSeconds * 1000
          )
        );
      });
      return;
    }
    if (action === 'play' || action === 'pause') {
      this.toggleProjectPlayback();
      return;
    }

    if (action === 'rewind') {
      if (this.props.playing) {
        this.currentPan = 0;
        this.state.studioContainerPan.x.setValue(0);
        this.setState({ currentPlayTime: 0 });
        this.handleScrollEnd(0);
        this.audio.playProject();
        this.toggleAnimatePlayback(true);
      } else {
        this.currentPan = 0;
        this.state.studioContainerPan.x.setValue(0);
        this.setState({ currentPlayTime: 0 });
        this.handleScrollEnd(0);
      }
    }
  };

  setAspectRatio = (type = 'square') => {
    let ratio;
    if (type === 'square') {
      ratio = [1, 1];
    } else if (type === 'landscape') {
      ratio = [16, 9];
    } else if (type === 'portrait') {
      ratio = [9, 16];
    }
    this.setState({ aspectRatio: ratio });
  };

  fileModalCallback = (action) => {
    this.setupNewTrack(action);
  };

  trackCallback = (action, payload = {}) => {
    if (action === 'select' && payload.type && payload.id) {
      let track;

      const start = 0;
      const end = 0;

      if (payload.type === 'video') {
        track = this.props.videos[payload.id];
        this.setState({ selectedVideoTrack: track });
      }
      if (payload.type === 'audio') {
        track = this.props.audioTracks[payload.id];
        this.setState({ selectedAudioTrack: track });
        // if (!this.props.duration) {
        //   this.props.dispatch(updateDuration(track.durationSeconds));
        // }

        // if (!track.parentId) {
        //   start = 0
        //   end = track.durationSeconds
        // } else {
        //   start = this.props.duration - track.durationSeconds
        //   end = this.props.duration
        // }
      }
      // does the user have lock on this track or is track available to obtain lock?
      // if (track.locked_by) {
      //   if (track.locked_by != this.props.user.id) {
      //   }
      //   // release track lock
      // } else {
      //   // obtain track lock
      //   // this.props.dispatch(lockTrack(payload.id)).then(() => {
      //   //   this.toggleActiveTrack(payload.type, payload.id);
      //   // });
      // }

      this.toggleActiveTrack(payload.type, payload.id, start, end);
    }
  };

  audioTrackDragFinishCallback = (trackId, xPosition) => {
    const track = this.props.audioTracks[trackId];
    let startPositionMs = null;
    if (!trackId && !track) {
      throw new Error('Track id not found');
    }
    if (xPosition) {
      startPositionMs = this.scrollXToMs(xPosition);
    } else {
      staPrtositionMs = this.scrollXToMs(0);
    }
    // throw new Error('Track position not provided in audio drag finish callback.');
    const endPositionMs = startPositionMs + track.durationSeconds * 1000;
    updateStudio(UPDATE_AUDIO_TRACK, {
      audioTrack: { id: trackId, startPositionMs, endPositionMs },
    });
  };

  toggleAudioPlayback = () => {
    this.audio.toggleProject(this.state.currentPlayTime, this.props.audioTrackPositions);
  };

  pressRecord = () => {
    this.toggleRecord(this.props.recording);
  };

  pressPlay = () => {
    this.toggleProjectPlayback();
  };

  isActiveTrack = (type, id) => {
    return this.state.activeTrack.id === id && this.state.activeTrack.type === type;
  };

  getCurrentVideoProps() {
    const currentTime = this.state.currentPlayTime;
    // project is currently playing determine next video according to right now
    const nextVideoResult = this.findNextVideo(currentTime, this.props.videoTrackPositions);

    if (nextVideoResult) {
      const nextVideo = this.props.videos[nextVideoResult.id];

      // this video should not currently be shown
      if (nextVideoResult.schedule !== 'now') {
        return null;
      }
      const nextVideoProps = {
        source: { uri: encodeURI(nextVideo.filepath) },
        volume: this.state.videoVolume,
      };
      return nextVideoProps;
    }
    return null;
  }

  handleScrollEnd = (x) => {
    const newPlayTime = this.scrollXToMs(x);

    const findCurrentVideo = this.findNextVideo(newPlayTime, this.props.videoTrackPositions);
    if (findCurrentVideo && findCurrentVideo.schedule === 'now') {
      const videoStartPosition = this.props.videoTrackPositions[findCurrentVideo.id]
        .startPositionMs;
      const difference = newPlayTime - videoStartPosition;
      if (this.videoplayer) this.videoplayer.seek(difference / 1000);
    }
    // get current video
  };

  onVideoPlayerLoadCallback = () => {
    // videoplayer loaded
    this.seekVideoPlayerToCurrentVideo();
  };

  seekVideoPlayerToCurrentVideo(differenceMs) {
    if (differenceMs) {
      if (this.videoplayer) this.videoplayer.seek(differenceMs / 1000);
      return;
    }
    const findCurrentVideo = this.findNextVideo(
      this.state.currentPlayTime,
      this.props.videoTrackPositions
    );
    if (findCurrentVideo && findCurrentVideo.schedule === 'now') {
      const videoStartPosition = this.props.videoTrackPositions[findCurrentVideo.id]
        .startPositionMs;
      const difference = this.state.currentPlayTime - videoStartPosition;
      if (this.videoplayer) this.videoplayer.seek(difference / 1000);
    }
  }

  onPublishYes = (isPublic) => {
    this.setState({
      publishModalVisible: false,
    });
    // Save new craft.
    PlayingCraftService.publishCraft(this.props.editingCraftId, isPublic)
      .then((/* res */) => {
        // console.log(res.data);
      })
      .catch((/* err */) => {
        // console.log(err.response.data.error);
      });
    this.props.dispatch(updateStoreState(null));
    this.props.dispatch(updateEditingCraftId(null));
  };

  onPublishNo = () => {
    this.setState({
      toggle: true,
      publishModalVisible: false,
    });
  };

  showPublishModal = (value) => {
    this.setState(
      {
        publishModalVisible: value,
        toggle: false,
      },
      () => {}
    );
  };

  showProgress() {
    const { uploadStatus } = this.props;
    const { status, progress } = uploadStatus;
    if (!status) {
      return null;
    }
    const percent = progress;
    return (
      <>
        <View style={styles.progressContainer}>
          <ActivityIndicator size="large" color={COLORS.primaryColor} />
          <Text style={styles.progressText}>{percent}%</Text>
        </View>
        <View style={styles.overlayContainer} />
      </>
    );
  }

  render() {
    const { navigation, onlineStudioUsers } = this.props;
    const { props } = this;
    const { dmCount } = props;
    let { height, width } = Dimensions.get('window');
    const studioContainerActiveStyle = {};
    const avatars = [];
    const currentVideoProps = this.getCurrentVideoProps();
    const tracksScrollX = Animated.multiply(
      this.state.studioContainerPan.x,
      new Animated.Value(-1)
    );
    const studioId = navigation.getParam('id', null);

    // fed to audio and video tracks player controls
    const playerControlsData = {
      playing: this.props.playing,
      recording: this.props.recording,
      volume: this.props.initialVolume,
    };

    for (const [userId, oSU] of Object.entries(onlineStudioUsers)) {
      avatars.push(
        <View key={userId} style={styles.avatars}>
          <FastImage
            style={{ width: '100%', height: '100%' }}
            source={oSU.avatar ? { uri: oSU.avatar } : userImage}
          />
        </View>
      );
    }

    let studioHeader = (
      <View style={styles.studioHeader}>
        {navigation ? (
          <View style={{ height: 60 * METRICS.ratioY, width: METRICS.screenWidth }}>
            <TouchableOpacity style={styles.backButton} onPress={this.onCheckSave}>
              <CustomIcon
                name="back"
                size={METRICS.fontSizeBigger}
                style={{ color: COLORS.whiteColor }}
              />
            </TouchableOpacity>
            {avatars.length !== 0 ? (
              <View style={styles.scrollContainer}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{
                    justifyContent: 'center',
                    flexGrow: 1,
                  }}
                >
                  {avatars}
                </ScrollView>
              </View>
            ) : (
              <FastImage
                resizeMode="cover"
                source={this.state.avatarUrl ? { uri: this.state.avatarUrl } : userImage}
                style={styles.avatar}
              />
            )}
          </View>
        ) : null}
      </View>
    );

    const tracks = [];
    // key nested tracks under parentId
    const nestedTracks = {};
    if (this.state.isAudLoaded) {
      Object.entries(this.props.audioTracks).forEach(([, track]) => {
        if (track.parentId) {
          if (!nestedTracks[track.parentId]) {
            nestedTracks[track.parentId] = [];
          }
          nestedTracks[track.parentId].push(track);
        }
      });

      for (const [, track] of Object.entries(this.props.audioTracks)) {
        if (!track.parentId) {
          const trackPlayerControlsData = {
            ...playerControlsData,
            volume: track.volume,
          };
          let childTracks;
          if (nestedTracks[track.id]) {
            childTracks = nestedTracks[track.id];
          }

          tracks.push(
            <Track
              track={track}
              key={track.id}
              id={track.id}
              active={this.isActiveTrack('audio', track.id)}
              activeTrack={this.state.activeTrack}
              title={track.title}
              scrollx={tracksScrollX}
              waveform={track.waveform}
              durationSeconds={track.durationSeconds === 0 ? 50 : track.durationSeconds}
              activeEffects={this.state.trackEffects[track.id]}
              callback={this.trackCallback}
              studioControlsCallback={this.studioControlsCallback}
              playerControlsData={trackPlayerControlsData}
              dragFinishCallback={this.audioTrackDragFinishCallback}
              childTracks={childTracks}
            />
          );
        }
      }
    }

    let widthRatio;
    let heightRatio;

    if (this.state.aspectRatio === 'square') {
      widthRatio = 1;
      heightRatio = 1;
      height = width;
    } else if (this.state.aspectRatio === 'landscape') {
      widthRatio = 16;
      heightRatio = 9;
      height = width * (heightRatio / widthRatio);
    } else if (this.state.aspectRatio === 'portrait') {
      widthRatio = 9;
      heightRatio = 16;
      height = width;
      width = height * (widthRatio / heightRatio);
    }
    const playerContainerStyle = {
      width,
      height,
    };
    if (this.state.activeView !== 'splitscreen' && this.state.activeView !== 'fullscreen') {
      playerContainerStyle.height = 0;
    }
    let videotrack;
    let videoplayer;
    if (this.state.isVidLoaded) {
      const videoKeys = Object.keys(this.props.videos);
      if (videoKeys.length > 0) {
        // set up the video track
        videotrack = (
          <VideoTrack
            videos={this.props.videos}
            active={this.state.activeTrack}
            scrollx={tracksScrollX}
            callback={this.trackCallback}
            playerControlsCallback={this.playerControlsCallback}
            videoKeysOrder={this.state.videoKeysOrder}
            playerControlsData={playerControlsData}
            videoTrackDragFinishCallback={this.videoTrackDragFinishHandler}
            id={this.state.activeTrack.id}
          />
        );

        const playerStyle = {
          width: '100%',
          backgroundColor: COLORS.blackColor,
          height: '100%',
        };
        if (currentVideoProps) {
          // set up video player
          videoplayer = (
            <Video
              // source={this.state.videoSrc} // Can be a URL or a local file.
              ref={(ref) => {
                this.videoplayer = ref;
              }}
              repeat={false}
              paused={this.state.videoPaused}
              resizeMode="cover"
              playInBackground
              playWhenInactive
              // Callback when remote video is buffering
              // onBuffer={this.onBuffer}
              // Callback when video cannot be loaded
              onLoad={this.onVideoPlayerLoadCallback}
              onError={(/* error */) => {}}
              onEnd={this.videoFinished}
              // based on 16x9 aspect ratio
              style={[playerStyle]}
              {...currentVideoProps}
            />
          );
        }
      }
    }

    // let fullscreenBtn = (
    //   <TouchableOpacity
    //     style={styles.cameraFullscreenBtn}
    //     onPress={() => this.updateActiveView('fullscreen')}
    //   >
    //     <CustomIcon name="ionicons_svg_md-expand" size={METRICS.fontSizeHuge} color="#fff" />
    //   </TouchableOpacity>
    // );
    // if (this.state.activeView == 'fullscreen') {
    //   studioContainerActiveStyle = {
    //     height: 0,
    //   };
    //   fullscreenBtn = (
    //     <TouchableOpacity
    //       style={styles.cameraFullscreenBtn}
    //       onPress={() => this.updateActiveView('splitscreen')}
    //     >
    //       <CustomIcon name="shrink" size={METRICS.fontSizeHuge} color="#fff" />
    //     </TouchableOpacity>
    //   );
    // }
    // const video = null;
    // if (this.state.recordedVideo != '') {
    //   video = (
    //     <Video
    //       source={{ uri: this.state.recordedVideo }} // Can be a URL or a local file.
    //       ref={ref => {
    //         this.player = ref;
    //       }}
    //       repeat // Store reference
    //       // onBuffer={this.onBuffer}                // Callback when remote video is buffering
    //       onError={error => {
    //
    //       }} // Callback when video cannot be loaded
    //       style={{ height: 400 * METRICS.ratioY, width: 400 * METRICS.ratioX }}
    //     />
    //   );
    // }
    // if (this.state.activeView == 'splitscreen') {
    //   const controls = (
    //     <View style={{ width: '100%', position: 'absolute', bottom: 0 }}>
    //       <PlayerControls pressRecord={this.pressRecord} pressPlay={this.pressPlay} />
    //     </View>
    //     // fullscreenBtn
    //   );
    //   // render camera preview or video preview
    //   // video player must load encoded URI to handle any spaces/special chars
    //   if (this.props.videos.length > 0) {
    //     vidSection = (
    //       <View style={{ height: '50%', width: '100%', backgroundColor: 'pink' }}>
    //         <Video
    //           // source={{ uri: encodeURI(this.props.videos[0].filepath) }} // Can be a URL or a local file.
    //           ref={ref => {
    //             this.previewplayer = ref;
    //           }}
    //           repeat // Store reference
    //           onError={error => {
    //
    //           }}
    //           // Callback when remote video is buffering
    //           // onError={this.videoError}               // Callback when video cannot be loaded
    //           style={{ height: '100%', width: '100%' }}
    //           resizeMode="cover"
    //           {...currentVideoProps}
    //         />
    //         {controls}
    //       </View>
    //     );
    //   } else {
    //     vidSection = (
    //       <View style={[styles.cameraPreviewContainer, this.state.cameraPreviewActiveStyle]}>
    //         <RNCamera
    //           style={[styles.cameraPreview]}
    //           ref={ref => {
    //             this.camera = ref;
    //           }}
    //           type={RNCamera.Constants.Type.back}
    //           flashMode={RNCamera.Constants.FlashMode.on}
    //         />
    //         {controls}
    //       </View>
    //     );
    //   }
    // }

    if (this.state.activeView !== 'default') {
      studioHeader = null;
    }

    return (
      <SafeAreaView style={{ backgroundColor: COLORS.blackColor, height: '100%' }}>
        <FileModal
          visible={this.state.fileModalVisible}
          callback={this.fileModalCallback}
          onCloseRequest={this.toggleFileImportModal}
        />
        {this.showProgress()}
        {studioHeader}
        <View style={styles.playerWrapper}>
          <View style={playerContainerStyle}>{videoplayer}</View>
        </View>
        <View style={[{ flex: -1, minHeight: 0 }, studioContainerActiveStyle]}>
          <View style={[STYLES.topAlign, styles.studioToolbarWrap]}>
            {/* <TouchableOpacity onPress={() => this.setState({ toggle: true })}> */}
            <TouchableOpacity onPress={() => this.openModal()}>
              <CustomIcon
                name="edition-box"
                size={METRICS.fontSizeBiggest}
                style={styles.tooltopicons}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.props.dispatch(updatePrevState(store.getState()));
                this.props.dispatch(updateTitle('AddCollaborator'));
                this.props.navigation.navigate('AddCollaborator', {
                  studioId: this.props.studio.id,
                  ownerId: this.props.studio.owner_id,
                });
              }}
            >
              <CustomIcon name="add1" size={METRICS.fontSizeHuge} style={styles.tooltopicons} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.props.dispatch(updatePrevState(store.getState()));
                this.props.dispatch(updateTitle('DM'));
                props.navigation.navigate('DM');
              }}
            >
              <CustomIcon name="sms" size={24 * METRICS.ratioX} style={styles.tooltopicons} />
              {dmCount >= 1 ? (
                <Badge
                  value={<Text style={styles.badgetext}>{dmCount}</Text>}
                  containerStyle={{
                    position: 'absolute',
                    top: 28 * METRICS.ratioX,
                    left: 32 * METRICS.ratioX,
                  }}
                  badgeStyle={{
                    backgroundColor: COLORS.primaryColor,
                  }}
                />
              ) : null}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.updateActiveView('splitscreen')}>
              <CustomIcon name="camera-1" size={27 * METRICS.ratioX} style={styles.tooltopicons} />
            </TouchableOpacity>
            <TouchableOpacity onPress={this.exportVideo}>
              <CustomIcon
                name="audio-1"
                size={METRICS.fontSizeBiggest}
                style={styles.tooltopicons}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.toggleFileImportModal()}>
              <CustomIcon
                name="add-plus-button"
                size={METRICS.fontSizeBigger}
                style={styles.tooltopicons}
              />
            </TouchableOpacity>
          </View>
          <Animated.View
            style={[
              {
                width: 18720,
                transform: this.state.studioContainerPan.getTranslateTransform(),
              },
            ]}
          >
            <Timeline />
          </Animated.View>

          <PanGestureHandler
            onHandlerStateChange={this.onGestureChange}
            onGestureEvent={this.onGestureEvent}
          >
            <Animated.ScrollView
              style={[
                {
                  width: 18720,
                  transform: this.state.studioContainerPan.getTranslateTransform(),
                },
              ]}
            >
              {videotrack}
              {tracks}
            </Animated.ScrollView>
          </PanGestureHandler>
          {/* Edit Details Modal */}
          <ModalWrapper title="Edit Details" status={this.state.toggle} onClose={this.closeModal}>
            <View style={styles.contentWrapper}>
              <View style={styles.itemWrapper}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => this.navigationHandler('Info')}
                >
                  <CustomIcon
                    name="info-1"
                    color={COLORS.primaryColor}
                    size={35 * METRICS.ratioX}
                  />
                  <Text style={styles.buttonText}>Info</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.itemWrapper}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => this.navigationHandler('Store')}
                >
                  <CustomIcon
                    name="gift-bag"
                    color={COLORS.primaryColor}
                    size={35 * METRICS.ratioX}
                  />
                  <Text style={styles.buttonText}>Store</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ ...styles.button, ...styles.publishButton }}
                  onPress={() => this.showPublishModal(true)}
                >
                  <Text style={styles.publishButtonText}>Publish</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => this.navigationHandler('Music')}
                >
                  <CustomIcon name="music" color={COLORS.primaryColor} size={35 * METRICS.ratioX} />
                  <Text style={styles.buttonText}>Music</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.itemWrapper}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => this.navigationHandler('CoverArtVideo')}
                >
                  <CustomIcon name="brush" color={COLORS.primaryColor} size={35 * METRICS.ratioX} />
                  <Text style={styles.buttonText}>Cover Art/Video</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ModalWrapper>
          <PublishModal
            onClose={() => this.showPublishModal(false)}
            status={this.state.publishModalVisible}
            onCloseRequest={() => this.showPublishModal(false)}
            onPublishYes={this.onPublishYes}
            onPublishNo={this.onPublishNo}
          />
          <ConfirmModal
            visible={this.state.isVisibleSaveModal}
            onCloseRequest={() => this.setState({ isVisibleSaveModal: false })}
            onCancel={this.onCancelSave}
            onConfirm={this.onSaveDraft}
            title="Save"
            message="Do you want to save this draft?"
          />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    left: 12 * METRICS.ratioX,
    top: 4 * METRICS.ratioX,
    padding: 10 * METRICS.ratioX,
    paddingRight: METRICS.spacingBig,
    zIndex: 101,
    flexDirection: 'row',
  },
  scrollContainer: {
    marginHorizontal: METRICS.spacingGiant,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  avatars: {
    height: METRICS.avatar,
    width: METRICS.avatar,
    borderRadius: METRICS.avatar,
    overflow: 'hidden',
    marginHorizontal: METRICS.spacingSmall,
  },
  cameraPreviewContainer: {
    height: 0,
    width: '100%',
    position: 'relative',
    display: 'none',
    flex: 0,
  },
  cameraPreview: {
    width: '100%',
    height: '100%',
  },
  cameraFullscreenBtn: {
    position: 'absolute',
    bottom: 0,
    right: 20 * METRICS.ratioX,
  },
  playerWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerButtonWrap: {
    height: 36 * METRICS.ratioY,
    width: 36 * METRICS.ratioX,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18 * METRICS.ratioX,
  },
  container: {
    backgroundColor: '#000',
    justifyContent: 'flex-start',
    textAlign: 'left',
  },
  studioToolbarWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: METRICS.spacingSmall,
    marginBottom: METRICS.spacingNormal,
  },
  tooltopicons: {
    color: '#fff',
    justifyContent: 'center',
    alignSelf: 'center',
    padding: METRICS.spacingNormal,
  },
  studioHeader: {
    flex: 0,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    marginTop: METRICS.spacingTiny,
  },
  itemWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: METRICS.spacingHuge,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    height: METRICS.rowHeight,
    paddingHorizontal: METRICS.spacingHuge,
  },
  buttonText: {
    fontFamily: 'Lato-Semibold',
    fontSize: METRICS.fontSizeNormal,
    color: 'white',
    paddingTop: METRICS.spacingTiny,
  },
  publishButtonText: {
    fontFamily: 'Lato-Semibold',
    fontSize: METRICS.fontSizeNormal,
    color: 'white',
    textAlign: 'center',
  },
  publishButton: {
    borderRadius: METRICS.rowHeight / 2,
    borderWidth: 1,
    borderColor: COLORS.primaryColor,
  },
  avatar: {
    width: METRICS.avatarsmall,
    height: METRICS.avatarsmall,
    borderRadius: METRICS.avatarsmall / 2,
    resizeMode: 'cover',
    alignSelf: 'center',
  },
  overlayContainer: {
    position: 'absolute',
    zIndex: 1,
    height: METRICS.screenHeight,
    width: METRICS.screenWidth,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.blackColor,
    opacity: 0.65,
  },
  progressContainer: {
    height: METRICS.screenHeight,
    width: METRICS.screenWidth,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    zIndex: 200,
  },
  progressText: {
    fontSize: METRICS.fontSizeBig,
    marginTop: METRICS.spacingNormal,
    alignItems: 'center',
    justifyContent: 'center',
    color: COLORS.whiteColor,
    fontFamily: 'lato-semibold',
    position: 'relative',
    zIndex: 201,
  },
  badgetext: {
    color: COLORS.blackColor,
    fontFamily: 'lato',
  },
});

function mapStateToProps(state) {
  const {
    recording,
    playing,
    audioTracks,
    audioTrackPositions,
    videoTrackPositions,
    videoKeysOrder,
    dimensions,
    videos,
    onlineStudioUsers,
    studio,
    timeScale,
    rulerUnitWidth,
    studioDuration,
    user,
    clipboard,
    initialVolume,
    craftPlaying,
    duration,
    editingCraftId,
    uploadStatus,
    dmCount,
  } = state;
  return {
    audioTracks,
    recording,
    playing,
    audioTrackPositions,
    videoTrackPositions,
    videoKeysOrder,
    videos,
    dimensions,
    onlineStudioUsers,
    studio,
    timeScale,
    rulerUnitWidth,
    studioDuration,
    user,
    clipboard,
    initialVolume,
    craftPlaying,
    duration,
    editingCraftId,
    uploadStatus,
    dmCount,
  };
}

export default connect(mapStateToProps)(StudioScreen);
