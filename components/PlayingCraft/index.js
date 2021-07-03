import React from 'react';
import 'react-native-gesture-handler';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Animated, Image } from 'react-native';
import FastImage from 'react-native-fast-image';
import PropTypes from 'prop-types';
import Video from 'react-native-video';
import LinearGradient from 'react-native-linear-gradient';
import ImageView from 'react-native-image-view';
import Orientation from 'react-native-orientation-locker';
import { connect } from 'react-redux';
import CustomIcon from '../CustomIcon';
import RangeSlider from '../RangeSlider';
import { COLORS, METRICS, STYLES } from '../../global';
import PlayingCraftService from '../../services/PlayingCraftService';
import { AudioPlayer } from '../../libs/rnsuperpowered';
import { CraftBg } from '../../global/Images';
import Environment from '../../helpers/environment';
import {
  updateBackScreen,
  updateCraftPlaying,
  setPlayingCrafts,
  updateProfileUserId,
  updateEditingCraftId,
  updateTitle,
  updateCurCraftId,
  updatePrevState,
  updateOpenComments,
  updateMiniPlay,
  updateSeekOnBack,
  updateCurrentTime,
  updateMinTime,
  updateRepeat,
} from '../../store/actions';
import { PinchGestureHandler, State } from 'react-native-gesture-handler';

class Playing extends React.Component {
  constructor(props) {
    super(props);

    this.onLoad = this.onLoad.bind(this);
    this.onEnd = this.onEnd.bind(this);
    this.onProgress = this.onProgress.bind(this);
    this.onBuffer = this.onBuffer.bind(this);
    this.timeInterval = null;
    this.state = {
      likeStatus: this.props.likeStatus,
      // about video
      rate: 1,
      volume: 1,
      resizeMode: 'cover',
      duration: 0.0,
      progress: 0,
      ignoreSilentSwitch: null,
      repeat: false,
      isChangeStatus: false,
      craft_idx: 0,
      likes: 0,
      views: 0,
      currentTime: 0.0,
      realtimeData: Object,
      isFullScreen: false,
      orientation: '',
    };
    this.onScreenTouch = this.onScreenTouch.bind(this);
    this.onLike = this.onLike.bind(this);
    this.onRepeat = this.onRepeat.bind(this);
    this.togglePlay = this.togglePlay.bind(this);
    this.onFinsihSliderStatus = this.onFinsihSliderStatus.bind(this);
    this.onChangeSliderStatus = this.onChangeSliderStatus.bind(this);
  }

  // new add
  getCraftData(index) {
    let obj = null;
    for (let i = 0; i < this.props.playingCrafts.length; i++) {
      if (this.props.playingCrafts[i].id === index) {
        obj = this.props.playingCrafts[i];
        break;
      }
    }
    return obj;
  }

  loopInterval = null;
  timer = null;
  scale = new Animated.Value(1);

  onZoomEvent = Animated.event(
    [
      {
        nativeEvent: { scale: this.scale }
      }
    ],
    {
      useNativeDriver: true
    }
  )

  componentDidMount() {
    if (this.props.curCraftId === this.props.craft_idx) {
      this.props.setFinsihSliderStatus(this.onFinsihSliderStatus);
      this.props.setChangeSliderStatus(this.onChangeSliderStatus);
      this.props.onLike(this.onLike);
      this.props.onRepeat(this.onRepeat);
      this.props.togglePlay(this.togglePlay);

      const { craft } = this.props;
      if (craft?.craft_type_id === 2 || craft?.craft_type_id === 3) {
        AudioPlayer.loadFile(craft.audio_url);
        this.audioEventsLoop();
      } else AudioPlayer.pause();

      if (this.timer === null)
        this.timer = setInterval(() => {
          this.props.onProgress(this.state.progress);
        }, 1000);
    } else {
      clearInterval(this.timer);
      this.timer = null;
      this.loopInterval = null;
    }

    this.setState({
      craft_idx: this.props.craft_idx,
      likes: this.props.craft.likes.length,
      likeStatus: this.props.craft.isliking,
      views: this.props.craft.views,
    });

    Orientation.getDeviceOrientation((deviceOrientation) => {
      this.setState({ orientation: deviceOrientation });
    });

    Orientation.addDeviceOrientationListener(this._onOrientationDidChange);
  }

  _onOrientationDidChange = (orientation) => {
    // this.setOrientation();
    const { craft_idx, isFullScreen } = this.state;
    const craft = this.props.playingCrafts ? this.props.playingCrafts[craft_idx] : null;
    if (isFullScreen) {
      if (
        craft.orientation.type === 'Landscape' &&
        (orientation === 'LANDSCAPE-LEFT' || orientation === 'LANDSCAPE-RIGHT')
      ) {
        Orientation.lockToLandscape();
      } else Orientation.lockToPortrait();
    }
    this.setState({ orientation });
  };

  componentWillUnmount() {
    clearInterval(this.timer);
    clearInterval(this.loopInterval);
    this.timer = null;
    this.loopInterval = null;
  }

  componentDidUpdate() {
    const { craft } = this.props;
    if (this.props.curCraftId === this.props.craft_idx) {
      this.props.setFinsihSliderStatus(this.onFinsihSliderStatus);
      this.props.setChangeSliderStatus(this.onChangeSliderStatus);
      this.props.onLike(this.onLike);
      this.props.onRepeat(this.onRepeat);
      this.props.togglePlay(this.togglePlay);

      if (craft?.craft_type_id === 2 || craft?.craft_type_id === 3) {
        if (this.loopInterval === null) {
          AudioPlayer.loadFile(craft.audio_url);
          this.audioEventsLoop();
        }
      } else {
        clearInterval(this.loopInterval);
        this.loopInterval = null;
      }

      if (this.timer === null)
        this.timer = setInterval(() => {
          this.props.onProgress(this.state.progress);
        }, 1000);
    } else {
      if (this.state.progress !== 0) this.setState({ progress: 0 });
      clearInterval(this.timer);
      clearInterval(this.loopInterval);
      this.timer = null;
      this.loopInterval = null;
    }

    if (craft.id !== this.props.craft.id) {
      if (this.state.progress !== 0) this.setState({ progress: 0 });
      clearInterval(this.timer);
      clearInterval(this.loopInterval);
      this.timer = null;
      this.loopInterval = null;
    }
  }

  receiveDuration = (error, { durationMs }) => {
    this.setState({ duration: durationMs / 1000 }, () => {
      if (this.props.seekOnBack) {
        this.onFinsihSliderStatus(this.props.seekOnBack);
        this.props.updateSeekOnBack(false);
      }
    });
  };

  receiveProgress = (error, { progress }) => {
    const currentTime = progress * this.state.duration;

    const { craft } = this.props;
    if (craft?.craft_type_id === 2 || craft?.craft_type_id === 3) {
      if (!this.state.isChangeStatus && this.state.craft_idx === this.props.curCraftId) {
        this.setState({
          currentTime,
          progress,
        });
        this.props.updateCurrentTime(currentTime);
      }
      if (progress > 0.999) this.onEnd();
    }
  };

  togglePlay = () => {
    const { craft } = this.props;
    if (craft?.craft_type_id === 2 || craft?.craft_type_id === 3) {
      AudioPlayer.togglePlayback();
    }
  };

  receiveLatestEvent = (error, event) => {
    if (event === 'Opened') {
      // file was opened get duration now
      this.togglePlay();
      AudioPlayer.getDuration(this.receiveDuration);
    }
  };

  setPositionMs = (ms) => {
    AudioPlayer.setPositionMs(ms);
  };

  audioEventsLoop = () => {
    this.loopInterval = setInterval(() => {
      AudioPlayer.getLatestEvent(this.receiveLatestEvent);
      AudioPlayer.getProgress(this.receiveProgress);
    }, 500);
  };

  onTouchEvent(name, ev) {}

  onEnd() {
    // when video is end
    this.setState({
      progress: 0,
      currentTime: 0,
    });
    const { craft } = this.props;
    if (craft?.craft_type_id === 2 || craft?.craft_type_id === 3) {
      this.setPositionMs(0);
      AudioPlayer.loadFile(craft.audio_url);
    } else this.player.seek(0);

    PlayingCraftService.addCraftPlay(this.props.playingCrafts[this.state.craft_idx].id)
      .then((res) => {
        this.setState({
          views: res.data,
        });
      })
      .catch((err) => {
        // console.log(err.response.data.error);
      });
    if (this.state.repeat) {
      if (craft?.craft_type_id === 2 || craft?.craft_type_id === 3) {
        this.setPositionMs(0);
        AudioPlayer.loadFile(craft.audio_url);
      } else this.player.seek(0);
    } else {
      this.props.onNext();
    }
  }

  // about video
  onLoad(data) {
    // start video
    this.setState(
      {
        duration: data.duration,
        progress: this.getSeekTimePercentage(0, data.duration),
      },
      () => {
        if (this.props.seekOnBack) {
          this.onFinsihSliderStatus(this.props.seekOnBack);
          this.props.updateSeekOnBack(false);
        }
      }
    );
  }

  onProgress(data) {
    // running video
    if (!this.state.isChangeStatus && this.state.craft_idx === this.props.curCraftId) {
      this.setState({
        currentTime: data.currentTime,
        progress: this.getCurrentTimePercentage(data.currentTime),
      });
      this.props.updateCurrentTime(data.currentTime);
    }
  }

  onBuffer(buffering) {
    this.setState({ isBuffering: buffering });
  }

  getSeekTimePercentage(time, duration) {
    if (time > 0) {
      return parseFloat(time) / parseFloat(duration);
    }
    return 0;
  }

  getCurrentTimePercentage(currentTime) {
    if (currentTime > 0) {
      return parseFloat(currentTime) / parseFloat(this.state.duration);
    }
    return 0;
  }

  onChangeSliderStatus = (value) => {
    // goto selection timeline
    this.setState({ isChangeStatus: true });
    const selSeek = this.state.duration * value;

    const { craft } = this.props;
    if (craft?.craft_type_id === 2 || craft?.craft_type_id === 3)
      this.setPositionMs(selSeek * 1000);
    else this.player.seek(selSeek);
  };

  onFinsihSliderStatus = (value) => {
    const selSeek = this.state.duration * value;
    this.setState({ currentTime: selSeek });
    this.setState({ isChangeStatus: false });
    this.setState({ progress: this.getSeekTimePercentage(selSeek, this.state.duration) });

    const { craft } = this.props;
    if (craft?.craft_type_id === 2 || craft?.craft_type_id === 3)
      this.setPositionMs(selSeek * 1000);
    else this.player.seek(selSeek);
  };

  showControl = () => {
    this.props.onShowControl();
  };

  onPlay = () => {
    this.props.onPlay();

    const { craft } = this.props;
    if (craft?.craft_type_id === 2 || craft?.craft_type_id === 3) this.togglePlay();
  };

  onPrev = () => {
    if (this.props.isPlaying) {
      this.onPlay();
    }
    this.props.onPrev();
  };

  onNext = () => {
    if (this.props.isPlaying) {
      this.onPlay();
    }
    this.props.onNext();
  };

  isPortrait = () => {
    const dim = Dimensions.get('screen');
    return dim.height >= dim.width;
  };

  isMinimize = () => {
    this.props.updateMinTime(this.state.currentTime);
    this.props.minimize();
  };

  onLike = () => {
    this.props.onShowControl(true);
    if (this.state.likeStatus) {
      PlayingCraftService.unlikeCraft(this.props.playingCrafts[this.props.curCraftId].id)
        .then((res) => {
          const tmpCrafts = this.props.playingCrafts;
          tmpCrafts[this.props.curCraftId].isliking = false;
          tmpCrafts[this.props.curCraftId].likes = res.data;
          this.props.setPlayingCrafts(tmpCrafts);
          this.setState({
            likes: res.data.length,
          });
        })
        .catch((err) => {
          // console.log(err.response.data.error)
        });
    } else {
      PlayingCraftService.likeCraft(this.props.playingCrafts[this.props.curCraftId].id)
        .then((res) => {
          const tmpCrafts = this.props.playingCrafts;
          tmpCrafts[this.props.curCraftId].isliking = true;
          tmpCrafts[this.props.curCraftId].likes = res.data;
          this.props.setPlayingCrafts(tmpCrafts);
          this.setState({
            likes: res.data.length,
          });
        })
        .catch((err) => {
          // console.log(err.response.data.error)
        });
    }
    this.setState({
      likeStatus: !this.state.likeStatus,
    });
  };

  onScreenTouch = () => {
    this.props.onShowControl();
  };

  onRepeat = () => {
    this.setState(
      {
        repeat: !this.state.repeat,
      },
      () => {
        this.props.updateRepeat(this.state.repeat);
      }
    );
  };

  onPressMore = () => {
    const craft = this.props.playingCrafts ? this.props.playingCrafts[this.state.craft_idx] : null;
    this.props.onToggle(craft.craft_owner.id === this.props.user.id ? 'option' : 'report', true);
  };

  onZoomStateChange = event => {
    console.log("state = ", this.scale);
    if (event.nativeEvent.oldState === State.ACTIVE) {
      Animated.spring(this.scale, {
        toValue: 1,
        useNativeDriver: true
      }).start();
    }
  }

  render() {
    const { onPressTab, craft } = this.props;
    const { isFullScreen, orientation } = this.state;
    if (craft != null && craft.orientation.type === 'Square') {
      // square
      styles.square.height = METRICS.screenWidth * METRICS.ratioY;
    } else if (craft != null && craft.orientation.type === 'Full-screen Portrait') {
      // full portrait
      styles.square.height = METRICS.screenHeight;
    }
    return (
      <TouchableOpacity onPress={() => this.showControl()} activeOpacity={1}>
        <View style={styles.container}>
          {isFullScreen || this.props.isShowControl >= 0 ? (
            <View style={{ height: 0 * METRICS.ratioX }} />
          ) : (
            <View style={styles.topNavigation_body}>
              <TouchableOpacity style={styles.minimize} onPress={() => this.isMinimize()}>
                <CustomIcon name="down1" style={styles.minimizeIcon} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.showmore} onPress={() => this.onPressMore()}>
                <CustomIcon name="three-dots-more-indicator" style={styles.showmoreIcon} />
              </TouchableOpacity>
            </View>
          )}
          {/* Orientations */}
          {this.props.curCraftId === this.props.craft_idx ? (
            <View
              style={
                craft.orientation.type === 'Landscape' && isFullScreen
                  ? styles.land_videoContainer
                  : styles.videoContainer
              }
            >
              {craft.orientation.type === 'Square' ? this.renderSquare(craft) : null}

              {craft.orientation.type === 'Full-screen Portrait'
                ? this.renderFullPortrait(craft)
                : null}
              {craft.orientation.type === 'Landscape' ? this.renderLandscape(craft) : null}
            </View>
          ) : (
            <View
              style={
                craft.orientation.type === 'Landscape' && !this.isPortrait()
                  ? styles.land_videoContainer
                  : styles.videoContainer
              }
            >
              {craft.orientation.type === 'Square' ? <View style={styles.square} /> : null}

              {craft.orientation.type === 'Full-screen Portrait' ? (
                <View style={styles.portrait} />
              ) : null}

              {craft.orientation.type === 'Landscape' ? (
                <View
                  style={this.isPortrait() ? styles.landscape_portrait : styles.landscape_landscape}
                />
              ) : null}
            </View>
          )}

          {!isFullScreen && !(this.props.isShowControl >= 0) && (
            <View style={styles.showControlContainer} onResponderGrant={() => this.onScreenTouch()}>
              {craft.orientation.type === 'Landscape' && (
                <TouchableOpacity
                  style={{ zIndex: 1001 }}
                  onPress={() => {
                    // onSetFullScreen();

                    if (
                      craft.orientation.type === 'Landscape' &&
                      (orientation === 'LANDSCAPE-LEFT' || orientation === 'LANDSCAPE-RIGHT')
                    )
                      Orientation.lockToLandscape();
                    else Orientation.lockToPortrait();
                    if (craft?.craft_type_id === 1) {
                      this.setState({ isFullScreen: true });
                    } else {
                      this.player.presentFullscreenPlayer();
                    }
                  }}
                >
                  <CustomIcon name="ionicons_svg_md-expand" style={styles.landscapeIcon} />
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={() => this.onScreenTouch()} activeOpacity={1}>
                <View
                  style={craft?.craft_type_id === 1 ? styles.hideTitleWrapper : styles.titleWrapper}
                >
                  <Text adjustsFontSizeToFit style={styles.nameWrapper}>
                    {craft.title ? craft.title : '   '}
                  </Text>
                  {craft.explicit && <CustomIcon name="explicit" style={styles.explicitIcon} />}
                </View>

                <View style={styles.playNumberWrapper}>
                  {craft?.craft_type_id !== 1 && (
                    <CustomIcon name="audio-play" style={styles.tinyIcon} />
                  )}

                  <Text style={styles.tinyIcon}>
                    {craft?.craft_type_id === 1
                      ? ''
                      : this.state.views.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  </Text>
                </View>
                {/* Video & Audio Controls */}
                <View style={[STYLES.horizontalAlign, styles.controlWrapper]}>
                  {craft?.craft_type_id !== 1 && (
                    <TouchableOpacity onPress={() => this.props.onShuffle(craft.id)}>
                      <CustomIcon
                        name="ionicons_svg_ios-shuffle"
                        style={this.props.isShuffle ? styles.shuffleIcon : styles.smallIcon}
                      />
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity onPress={this.onPrev} disabled={this.props.isSingle}>
                    <CustomIcon name="previous-1" style={styles.normalIcon} />
                  </TouchableOpacity>
                  {craft?.craft_type_id === 1 ? (
                    <View style={{ flex: 0 }}>
                      <View style={STYLES.horizontalAlign}>
                        <Text
                          adjustsFontSizeToFit
                          numberOfLines={2}
                          ellipsizeMode="tail"
                          style={styles.onlyNameWrapper}
                        >
                          {craft.title ? craft.title : '  '}
                        </Text>
                        {craft.explicit && (
                          <CustomIcon
                            name="explicit"
                            style={[styles.explicitIcon, { marginTop: 0 }]}
                          />
                        )}
                      </View>
                    </View>
                  ) : (
                    <TouchableOpacity onPress={() => this.onPlay()}>
                      <CustomIcon
                        name={!this.props.isPlaying ? 'play-button' : 'pausethin'}
                        style={craft?.craft_type_id !== 1 ? styles.bigIcon : styles.trans_bigIcon}
                      />
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity onPress={this.onNext} disabled={this.props.isSingle}>
                    <CustomIcon name="next-2" style={styles.normalIcon} />
                  </TouchableOpacity>
                  {craft?.craft_type_id !== 1 && (
                    <TouchableOpacity onPress={this.onRepeat}>
                      <CustomIcon
                        name="ionicons_svg_ios-repeat"
                        style={this.state.repeat ? styles.selectedSmallIcon : styles.smallIcon}
                      />
                    </TouchableOpacity>
                  )}
                </View>
                {/* Slider Control */}
                <View
                  style={
                    craft?.craft_type_id !== 1 ? styles.sliderWrapper : styles.hide_sliderWrapper
                  }
                  pointerEvents={craft?.craft_type_id !== 1 ? 'auto' : 'none'}
                >
                  <RangeSlider
                    style={styles.slider}
                    labelStyle="none"
                    rangeEnabled={false}
                    syntax=""
                    totalDuration={this.state.duration}
                    currentDuration={this.state.currentTime}
                    thumbColor={COLORS.whiteColor}
                    progress={this.state.progress}
                    min={0}
                    max={100}
                    onChangeSliderStatus={this.onChangeSliderStatus}
                    onFinsihSliderStatus={this.onFinsihSliderStatus}
                    data={this.state.realtimeData}
                  />
                </View>
                {/* Tab section */}
                <View style={styles.toolWrapper}>
                  <View style={styles.toolIconWrapper}>
                    <TouchableOpacity onPress={() => this.onLike()}>
                      <CustomIcon
                        name={this.state.likeStatus ? 'heart' : 'passion-heart'}
                        style={styles.toolIcon}
                      />
                    </TouchableOpacity>
                    <Text style={styles.tinyIcon}>{this.state.likes}</Text>
                  </View>
                  <View style={styles.toolIconWrapper}>
                    <TouchableOpacity onPress={() => onPressTab(2)}>
                      <CustomIcon
                        name="comment-bubble"
                        style={
                          this.props.selectedTab === 2 ? styles.toolIconPrimary : styles.toolIcon
                        }
                      />
                    </TouchableOpacity>
                    <Text style={styles.tinyIcon}>{craft.comments.length}</Text>
                  </View>
                  <View style={styles.toolIconWrapper}>
                    <TouchableOpacity onPress={() => onPressTab(3)}>
                      <CustomIcon
                        name="share-2"
                        style={
                          this.props.selectedTab === 3 || this.props.selectedTab === 7
                            ? styles.toolIconPrimary
                            : styles.toolIcon
                        }
                      />
                    </TouchableOpacity>
                    <Text style={styles.tinyIcon} />
                  </View>
                  {!craft.contest && (
                    <View style={styles.toolIconWrapper}>
                      <TouchableOpacity onPress={() => onPressTab(4)}>
                        <CustomIcon
                          name="info1"
                          style={
                            this.props.selectedTab === 4 ? styles.toolIconPrimary : styles.toolIcon
                          }
                        />
                      </TouchableOpacity>
                      <Text style={styles.tinyIcon} />
                    </View>
                  )}

                  {craft.store && this.props.storeOption === 1 && (
                    <View style={styles.toolIconWrapper}>
                      <TouchableOpacity onPress={() => onPressTab(5)}>
                        <CustomIcon
                          name="gift-bag"
                          style={
                            this.props.selectedTab === 5 ? styles.toolIconPrimary : styles.toolIcon
                          }
                        />
                        <Text style={styles.tinyIcon} />
                      </TouchableOpacity>
                    </View>
                  )}
                  {craft.contest && (
                    <View style={styles.toolIconWrapper}>
                      <TouchableOpacity onPress={() => onPressTab(8)}>
                        <CustomIcon
                          name="crown"
                          style={
                            this.props.selectedTab === 8 ? styles.toolIconPrimary : styles.toolIcon
                          }
                        />
                      </TouchableOpacity>
                      <Text style={styles.tinyIcon} />
                    </View>
                  )}
                  {(craft.store || craft.contest) && (
                    <View style={styles.toolIconWrapper}>
                      <TouchableOpacity onPress={() => onPressTab(6)}>
                        <CustomIcon
                          name="network"
                          style={
                            this.props.selectedTab === 6 ? styles.toolIconPrimary : styles.toolIcon
                          }
                        />
                      </TouchableOpacity>
                      <Text style={styles.tinyIcon}>{craft.derivatives.length}</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  }

  // LANDSCAPE

  renderLandscape(craft) {
    craft = this.props.playingCrafts[this.props.curCraftId];
    const { isFullScreen } = this.state;
    const images = [
      {
        source: {
          uri: craft.photo_url,
        },
        width: METRICS.screenHeight,
        height: METRICS.screenWidth,
      },
    ];
    return (
      <View style={{ flex: 1 }}>
        {craft?.craft_type_id === 1 &&
        !isFullScreen && ( // only photo
          <PinchGestureHandler
            onGestureEvent={this.onZoomEvent}
            onHandlerStateChange = {this.onZoomStateChange}>
            <Animated.Image
              source={craft.photo_url ? { uri: craft.photo_url } : CraftBg}
              style={[styles.landscape_portrait, { transform: [{ scale: this.scale }] }]}
            />
          </PinchGestureHandler>
        )}
        {craft?.craft_type_id === 1 && isFullScreen && (
          <ImageView
            images={images}
            imageIndex={0}
            isVisible={this.state.isImageViewVisible}
            onClose={() => {
              Orientation.lockToPortrait();
              this.setState({ isFullScreen: false });
            }}
          />
        )} 

        {craft?.craft_type_id === 2 &&
        !isFullScreen && ( // only photo, audio
          <PinchGestureHandler
            onGestureEvent={this.onZoomEvent}
            onHandlerStateChange = {this.onZoomStateChange}>
            <Animated.Image
              source={craft.photo_url ? { uri: craft.photo_url } : CraftBg}
              style={this.isPortrait() ? [styles.landscape_portrait, { transform: [{ scale: this.scale }] }] : styles.landscape_landscape}
            />
          </PinchGestureHandler>
          )}

        {craft?.craft_type_id === 2 && isFullScreen && (
          <ImageView
            images={images}
            imageIndex={0}
            isVisible={this.state.isImageViewVisible}
            onClose={() => {
              Orientation.lockToPortrait();
              this.setState({ isFullScreen: false });
            }}
          />
        )}

        {craft?.craft_type_id === 3 && ( // only photo , audio , video - replay video
          <PinchGestureHandler
            onGestureEvent={this.onZoomEvent}
            onHandlerStateChange = {this.onZoomStateChange}>
            <Animated.View style = {this.isPortrait() ? [styles.landscape_portrait, {transform: [{scale: this.scale}]}] : [styles.landscape_landscape, {transform: [{scale: this.scale}]}]}>
              <Video
                source={{ uri: craft.video_url }} // Can be a URL or a local file.
                ref={(ref) => {
                  this.player = ref;
                }}
                playInBackground
                onBuffer={this.onBuffer}
                bufferConfig={{
                  minBufferMs: 1500, // number
                  maxBufferMs: 50000, // number
                  bufferForPlaybackMs: 2500, // number
                  bufferForPlaybackAfterRebufferMs: 5000, // number
                }}
                onError={this.videoError}
                style={this.isPortrait() ? styles.landscape_portrait : styles.landscape_landscape}
                rate={this.state.rate}
                paused={false} // repeat
                repeat
                muted
                /* selectedVideoTrack={{
                  type: 'resolution',
                  value: 1080,
                }} */
              />
            </Animated.View>
          </PinchGestureHandler>
        )}

        {craft?.craft_type_id === 4 && ( // photo and video
          <Video
            source={{ uri: craft.video_url }} // Can be a URL or a local file.
            ref={(ref) => {
              this.player = ref;
            }}
            playInBackground
            style={this.isPortrait() ? styles.landscape_portrait : styles.landscape_landscape}
            rate={this.state.rate}
            paused={!this.props.isPlaying}
            volume={this.state.volume}
            ignoreSilentSwitch
            resizeMode={this.state.resizeMode}
            onLoad={this.onLoad}
            onEnd={this.onEnd}
            onBuffer={this.onBuffer}
            bufferConfig={{
              minBufferMs: 1500, // number
              maxBufferMs: 50000, // number
              bufferForPlaybackMs: 2500, // number
              bufferForPlaybackAfterRebufferMs: 5000, // number
            }}
            onProgress={this.onProgress}
            repeat={this.state.repeat}
            /* selectedVideoTrack={{
              type: 'resolution',
              value: 1080,
            }} */
          />
        )}
      </View>
    );
  }

  // SQUARE

  renderSquare(craft) {
    craft = this.props.playingCrafts[this.props.curCraftId];
    const images = [
      {
        source: {
          uri: craft.photo_url,
        },
        height: METRICS.screenWidth * METRICS.ratioY,
        width: METRICS.screenWidth * METRICS.ratioY,
      },
    ];
    const { isFullScreen } = this.state;
    return (
      <View style={{ flex: 1 }}>
        {craft?.craft_type_id === 1 && ( // only photo
          <PinchGestureHandler
            onGestureEvent={this.onZoomEvent}
            onHandlerStateChange = {this.onZoomStateChange}>
            <Animated.Image 
              source={craft.photo_url ? { uri: craft.photo_url } : CraftBg}
              style={[styles.square, { transform: [{ scale: this.scale }] }]}
            />
          </PinchGestureHandler>
        )}

        {craft?.craft_type_id === 2 && ( // only photo, audio
          <PinchGestureHandler
            onGestureEvent={this.onZoomEvent}
            onHandlerStateChange = {this.onZoomStateChange}>
            <Animated.Image
              source={craft.photo_url ? { uri: craft.photo_url } : CraftBg}
              style={[styles.square, { transform: [{scale: this.scale}] }]}
            />
          </PinchGestureHandler>
        )}

        {
          craft?.craft_type_id === 2 && isFullScreen && (
            <ImageView
              images={images}
              imageIndex={0}
              isVisible={this.state.isImageViewVisible}
              onClose={() => {
                this.setState({ isFullScreen: false });
              }}
            />
          ) // only photo
        }

        {craft?.craft_type_id === 3 && ( // only photo , audio , video - replay video
          <PinchGestureHandler
            onGestureEvent={this.onZoomEvent}
            onHandlerStateChange = {this.onZoomStateChange}>
            <Animated.View style = {[styles.square, {transform: [{scale: this.scale}]}]}>
              <Video
                source={{ uri: craft.video_url }} // Can be a URL or a local file.
                ref={(ref) => {
                  this.player = ref;
                }}
                bufferConfig={{
                  minBufferMs: 1500, // number
                  maxBufferMs: 50000, // number
                  bufferForPlaybackMs: 2500, // number
                  bufferForPlaybackAfterRebufferMs: 5000, // number
                }}
                style={styles.square}
                rate={this.state.rate}
                audioOnly={false}
                paused={false} // repeat
                muted
                resizeMode={this.state.resizeMode}
                repeat
                /* selectedVideoTrack={{
                  type: 'resolution',
                  value: 1080,
                }} */
              />
            </Animated.View>
          </PinchGestureHandler>
        )}

        {craft?.craft_type_id === 4 && ( // photo , video
          <PinchGestureHandler
            onGestureEvent={this.onZoomEvent}
            onHandlerStateChange = {this.onZoomStateChange}>
            <Animated.View style = {[styles.square, {transform: [{scale: this.scale}]}]}>
              <Video
                source={{ uri: craft.video_url }} // Can be a URL or a local file.
                ref={(ref) => {
                  this.player = ref;
                }} // Store reference
                playInBackground
                style={styles.square}
                rate={this.state.rate}
                paused={!this.props.isPlaying}
                volume={this.state.volume}
                ignoreSilentSwitch
                resizeMode={this.state.resizeMode}
                onLoad={this.onLoad}
                onEnd={this.onEnd}
                onBuffer={this.onBuffer}
                bufferConfig={{
                  minBufferMs: 1500, // number
                  maxBufferMs: 50000, // number
                  bufferForPlaybackMs: 2500, // number
                  bufferForPlaybackAfterRebufferMs: 5000, // number
                }}
                onProgress={this.onProgress}
                repeat={this.state.repeat}
                /* selectedVideoTrack={{
                  type: 'resolution',
                  value: 1080,
                }} */
              />
            </Animated.View>
          </PinchGestureHandler>
        )}
      </View>
    );
  }

  // FULL SCREEN PORTRAIT

  renderFullPortrait(craft) {
    craft = this.props.playingCrafts[this.props.curCraftId];
    return (
      <View style={{ flex: 1 }}>
        {craft?.craft_type_id === 1 && ( // only photo
          <PinchGestureHandler
            onGestureEvent={this.onZoomEvent}
            onHandlerStateChange = {this.onZoomStateChange}>
            <Animated.View style={[styles.portrait, {transform: [{scale: this.scale}]}]}>
              <FastImage source={craft ? { uri: craft.photo_url } : CraftBg} style={styles.portrait}>
                <TouchableOpacity onPress={() => this.showControl()} activeOpacity={1}>
                  <LinearGradient
                    colors={['transparent', '#000000DD', 'black']}
                    style={
                      this.props.isShowControl < 0
                        ? [styles.linearGradient, { position: 'relative' }]
                        : [styles.disableGradient, { position: 'relative' }]
                    }
                  />
                </TouchableOpacity>
              </FastImage>
            </Animated.View>
          </PinchGestureHandler>
        )}

        {craft?.craft_type_id === 2 && ( // only photo, audio
          <PinchGestureHandler
            onGestureEvent={this.onZoomEvent}
            onHandlerStateChange = {this.onZoomStateChange}>
            <Animated.View style={[styles.portrait, {transform: [{scale: this.scale}]}]}>
              <FastImage source={craft ? { uri: craft.photo_url } : CraftBg} style={styles.portrait}>
                <TouchableOpacity onPress={() => this.showControl()} activeOpacity={1}>
                  <LinearGradient
                    colors={['transparent', '#000000DD', 'black']}
                    style={
                      this.props.isShowControl < 0
                        ? [styles.linearGradient, { position: 'relative' }]
                        : [styles.disableGradient, { position: 'relative' }]
                    }
                  />
                </TouchableOpacity>
              </FastImage>
            </Animated.View>
          </PinchGestureHandler>
        )}

        {craft?.craft_type_id === 3 && ( // only photo , audio , video - replay video
          <TouchableOpacity onPress={() => this.showControl()} activeOpacity={1}>
            <PinchGestureHandler
              onGestureEvent={this.onZoomEvent}
              onHandlerStateChange = {this.onZoomStateChange}>
              <Animated.View style = {[styles.backgroundVideo, {transform: [{scale: this.scale}]}]}>
                <Video
                  source={{ uri: craft.video_url }} // Can be a URL or a local file.
                  ref={(ref) => {
                    this.player = ref;
                  }} // Callback when remote video is buffering
                  onError={this.videoError} // Callback when video cannot be loaded
                  style={styles.backgroundVideo}
                  audioOnly={false}
                  paused={false} // repeat
                  muted
                  ignoreSilentSwitch={this.state.ignoreSilentSwitch}
                  resizeMode={this.state.resizeMode}
                  repeat
                  bufferConfig={{
                    minBufferMs: 1500, // number
                    maxBufferMs: 50000, // number
                    bufferForPlaybackMs: 2500, // number
                    bufferForPlaybackAfterRebufferMs: 5000, // number
                  }}
                  /* selectedVideoTrack={{
                    type: 'resolution',
                    value: 1080,
                  }} */
                />
              </Animated.View>
            </PinchGestureHandler>
            <LinearGradient
              colors={['transparent', '#000000DD', 'black']}
              style={this.props.isShowControl < 0 ? styles.linearGradient : styles.disableGradient}
            />
          </TouchableOpacity>
        )}

        {craft?.craft_type_id === 4 && ( // photo , video
          <TouchableOpacity onPress={() => this.showControl()} activeOpacity={1}>
            <PinchGestureHandler
              onGestureEvent={this.onZoomEvent}
              onHandlerStateChange = {this.onZoomStateChange}>
              <Animated.View style = {[styles.backgroundVideo, {transform: [{scale: this.scale}]}]}>
                <Video
                  source={{ uri: craft.video_url }} // Can be a URL or a local file.
                  ref={(ref) => {
                    this.player = ref;
                  }} // Store reference
                  playInBackground
                  style={styles.backgroundVideo}
                  rate={this.state.rate}
                  paused={!this.props.isPlaying}
                  volume={this.state.volume}
                  ignoreSilentSwitch
                  resizeMode={this.state.resizeMode}
                  onLoad={this.onLoad}
                  onEnd={this.onEnd}
                  onBuffer={this.onBuffer}
                  bufferConfig={{
                    minBufferMs: 1500, // number
                    maxBufferMs: 50000, // number
                    bufferForPlaybackMs: 2500, // number
                    bufferForPlaybackAfterRebufferMs: 5000, // number
                  }}
                  onProgress={this.onProgress}
                  repeat={this.state.repeat}
                  /* selectedVideoTrack={{
                    type: 'resolution',
                    value: 1080,
                  }} */
                />
              </Animated.View>
            </PinchGestureHandler>
            <LinearGradient
              colors={['transparent', '#000000DD', 'black']}
              style={this.props.isShowControl < 0 ? styles.linearGradient : styles.disableGradient}
            />
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    flex: 1,
  },
  background: {
    height: METRICS.screenHeight,
  },
  topNavigation_body: {
    width: '100%',
    height: 45 * METRICS.ratioY,
    flex: 100,
    position: 'absolute',
    flexDirection: 'row',
    marginTop: 0.04 * METRICS.screenHeight,
    backgroundColor: 'transparent',
    zIndex: 999,
    marginBottom: 0.04 * METRICS.screenHeight,
  },
  videoContainer: {
    height: METRICS.screenHeight * 0.55,
    width: METRICS.screenWidth,
  },
  land_videoContainer: {
    height: METRICS.screenWidth * 0.5,
    width: METRICS.screenHeight,
  },
  square: {
    marginTop: 0.12 * METRICS.screenHeight,
    height: METRICS.screenWidth * METRICS.ratioY,
    width: METRICS.screenWidth * METRICS.ratioY,
    position: 'absolute',
    justifyContent: 'center',
    alignSelf: 'center',
    flex: 1,
    flexDirection: 'column',
  },
  portrait: {
    height: METRICS.screenHeight,
    width: METRICS.screenWidth,
    zIndex: 999,
  },
  showmore: {
    flex: 30,
    alignItems: 'flex-end',
  },
  showmoreIcon: {
    color: COLORS.whiteColor,
    fontSize: METRICS.fontSizeBig,
    position: 'relative',
    top: METRICS.spacingBig,
    right: METRICS.spacingBig,
  },
  minimize: {
    flex: 30,
    alignItems: 'flex-start',
  },
  minimizeIcon: {
    color: COLORS.whiteColor,
    fontSize: METRICS.fontSizeBig,
    position: 'relative',
    top: METRICS.spacingBig,
    left: METRICS.spacingBig,
  },
  controlContainer: {
    flexDirection: 'column',
    opacity: 0,
    backgroundColor: 'transparent',
  },
  showControlContainer: {
    flexDirection: 'column',
    opacity: 1,
    backgroundColor: 'transparent',
  },
  controlContrainer_land: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
  },
  nameWrapper: {
    color: COLORS.whiteColor,
    fontSize: METRICS.fontSizeBiggest,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0.06 * METRICS.screenHeight * METRICS.ratioY * METRICS.ratioY,
    fontFamily: 'lato',
  },
  playNumberWrapper: {
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    fontFamily: 'lato',
  },
  hide_playNumberWrapper: {
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    fontFamily: 'lato',
    opacity: 0,
  },
  controlWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    height: 0.1 * METRICS.screenHeight,
    position: 'relative',
  },
  toolIconWrapper: {
    flexDirection: 'column',
    alignItems: 'center',
    fontFamily: 'lato',
    justifyContent: 'center',
  },
  tinyIcon: {
    color: COLORS.primaryColor,
    fontSize: 12 * METRICS.ratioX,
    padding: METRICS.spacingTiny,
  },
  smallIcon: {
    color: COLORS.primaryColor,
    fontSize: 26 * METRICS.ratioY,
    padding: METRICS.spacingNormal,
  },
  shuffleIcon: {
    color: COLORS.pinkColor,
    fontSize: 26 * METRICS.ratioY,
    padding: METRICS.spacingNormal,
  },
  explicitIcon: {
    color: COLORS.primaryColor,
    fontSize: 18 * METRICS.ratioX,
    marginTop: 0.06 * METRICS.screenHeight * METRICS.ratioY * METRICS.ratioY,
    marginLeft: 8 * METRICS.ratioX,
    alignSelf: 'center',
  },
  selectedSmallIcon: {
    color: COLORS.pinkColor,
    fontSize: 26 * METRICS.ratioY,
    padding: METRICS.spacingNormal,
  },
  normalIcon: {
    color: COLORS.whiteColor,
    fontSize: 25 * METRICS.ratioY,
    padding: METRICS.spacingNormal,
  },
  bigIcon: {
    color: COLORS.whiteColor,
    fontSize: 60 * METRICS.ratioY,
    padding: METRICS.spacingNormal,
  },
  trans_bigIcon: {
    color: 'transparent',
    fontSize: 60 * METRICS.ratioY,
    padding: METRICS.spacingNormal,
  },
  toolWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 0.06 * METRICS.screenHeight * METRICS.ratioY,
    paddingLeft: METRICS.spacingNormal,
    paddingRight: METRICS.spacingNormal,
    marginBottom: 0.05 * METRICS.screenHeight * METRICS.ratioY,
  },
  toolIcon: {
    color: COLORS.whiteColor,
    fontSize: METRICS.fontSizeBiggest,
    paddingLeft: METRICS.spacingNormal,
    paddingRight: METRICS.spacingNormal,
  },
  toolIconPrimary: {
    color: COLORS.primaryColor,
    fontSize: METRICS.fontSizeBiggest,
    paddingLeft: METRICS.spacingNormal,
    paddingRight: METRICS.spacingNormal,
  },
  onlyNameWrapper: {
    color: COLORS.whiteColor,
    fontSize: METRICS.fontSizeBiggest,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'lato',
    maxWidth: 0.7 * METRICS.screenWidth,
  },
  sliderWrapper: {
    paddingLeft: 1.3 * METRICS.spacingHuge,
    paddingRight: 1.3 * METRICS.spacingHuge,
    marginTop: 0 * METRICS.screenHeight,
    opacity: 0.7,
  },
  hide_sliderWrapper: {
    paddingLeft: METRICS.spacingHuge,
    paddingRight: METRICS.spacingHuge,
    marginTop: 0 * METRICS.screenHeight,
    opacity: 0,
  },
  slider: {
    height: 100 * METRICS.screenHeight,
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  // add

  linearGradient: {
    width: '100%',
    height: '100%',
    opacity: 0.95,
    position: 'absolute',
    bottom: 0,
  },
  disableGradient: {
    width: '100%',
    height: '100%',
    opacity: 0,
  },
  landscape_portrait: {
    marginTop: 0.2 * METRICS.screenHeight,
    height: (METRICS.screenWidth * 9) / 16,
  },
  landscape_landscape: {
    width: METRICS.screenHeight,
    height: METRICS.screenWidth,
  },
  backgroundVideo: {
    width: METRICS.screenWidth,
    height: METRICS.screenHeight,
  },
  titleWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hideTitleWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0,
  },
  landscapeIcon: {
    position: 'absolute',
    flex: 1,
    alignSelf: 'flex-end',
    marginTop: 10 * METRICS.ratioY,
    paddingRight: METRICS.spacingNormal,
    color: 'white',
    fontSize: 20 * METRICS.ratioX,
    zIndex: 1001,
  },
});

Playing.propTypes = {
  report: PropTypes.bool,
  option: PropTypes.bool,
};

Playing.defaultProps = {
  report: false,
  option: false,
};

function mapDispatchToProps(dispatch) {
  return {
    setPlayingCrafts: (data) => dispatch(setPlayingCrafts(data)),
    updateCurCraftId: (data) => dispatch(updateCurCraftId(data)),
    updatePrevState: (data) => dispatch(updatePrevState(data)),
    updateCraftPlaying: (data) => dispatch(updateCraftPlaying(data)),
    updateMiniPlay: (data) => dispatch(updateMiniPlay(data)),
    updateOpenComments: (data) => dispatch(updateOpenComments(data)),
    updateEditingCraftId: (data) => dispatch(updateEditingCraftId(data)),
    updateProfileUserId: (data) => dispatch(updateProfileUserId(data)),
    updateTitle: (data) => dispatch(updateTitle(data)),
    updateBackScreen: (data) => dispatch(updateBackScreen(data)),
    updateSeekOnBack: (data) => dispatch(updateSeekOnBack(data)),
    updateCurrentTime: (data) => dispatch(updateCurrentTime(data)),
    updateMinTime: (data) => dispatch(updateMinTime(data)),
    updateRepeat: (data) => dispatch(updateRepeat(data)),
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

export default connect(mapStateToProps, mapDispatchToProps)(Playing);
