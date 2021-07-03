import React from 'react';
import 'react-native-gesture-handler';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { swipeDirections } from 'react-native-swipe-gestures';
import { connect } from 'react-redux';
import { CustomIcon } from '..';
import RangeSlider from '../RangeSlider';
import { COLORS, METRICS } from '../../global';
import { craft } from '../../global/Images';
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
  updateDeeplinkAlert,
  updateCraftListId,
  updateBackupCraft,
  updateSeekOnBack,
  updateCurrentTime,
  updateFollowId,
  updateStoreState,
  updateIsPlaying
} from '../../store/actions';

class MiniCraftPlayer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isPlaying: false,
      stream_data: Object,
      progress: 0,
      isChangeStatus: false,
      repeat: false,
      isShuffle: false,
    };
  }

  componentDidMount() {
    const stream_data = this.props.playingCrafts[this.props.curCraftId];
    this.setState({ isPlaying: this.props.isPlaying });
    if (!this.props.playingCrafts) {
      return;
    }

    this.setState({
      stream_data,
      curCraftId: this.props.curCraftId,
      repeat: this.props.repeat,
      isShuffle: this.props.isShuffle,
    });
  }

  componentDidUpdate() {
    if (this.props.curCraftId !== this.state.curCraftId) {
      const stream_data = this.props.playingCrafts[this.props.curCraftId];
      this.setState({ isPlaying: this.props.isPlaying });
      if (this.props.playingCrafts === undefined) {
        return;
      }

      this.setState({
        stream_data,
        curCraftId: this.props.curCraftId,
        repeat: this.props.repeat,
        isShuffle: this.props.isShuffle,
      });
    }
    if (this.state.repeat !== this.props.repeat) this.setState({ repeat: this.props.repeat });
    if (this.state.isShuffle !== this.props.isShuffle)
      this.setState({ isShuffle: this.props.isShuffle });
  }

  onPressPlayPause = () => {
    this.setState(
      {
        isPlaying: !this.state.isPlaying,
      },
      () => {
        // console.log('playing = ' , this.state.isPlaying)
        //updateIsPlaying(!this.state.isPlaying)
      }
    );
    this.props.onPlayPause();
    this.props.togglePlay();
  };

  onRepeat = () => {
    this.setState({
      repeat: !this.state.repeat,
    });
    this.props.onRepeat();
  };

  onShuffle = (id) => {
    this.setState({
      isShuffle: !this.state.isShuffle,
    });
    this.props.onShuffle(id);
  };

  onChangeSliderStatus = (value) => {
    this.setState({ isChangeStatus: true, progress: value });
    this.props.onChangeSliderStatus(value);
  };

  onFinsihSliderStatus = (value) => {
    this.props.onFinsihSliderStatus(value);
    setTimeout(() => this.setState({ isChangeStatus: false, progress: value }), 1100);
  };

  onSwipe(gestureName) {
    const { SWIPE_UP } = swipeDirections;
    switch (gestureName) {
      case SWIPE_UP:
        break;
    }
  }

  render() {
    const { stream_data } = this.state;

    return (
      <View style={styles.minimizeWrapper}>
        {stream_data?.craft_type_id != 1 && (
          <View style={styles.slider_body}>
            <RangeSlider
              style={styles.slider}
              labelStyle="none"
              rangeEnabled={false}
              syntax=""
              bottom={false}
              thumbBorderWidth={this.state.isEnd}
              wrapperStyle={styles.wrapperStyle}
              blankColor={COLORS.whiteColor}
              thumbColor="transparent"
              thumbRadius={0}
              totalDuration=""
              currentDuration=""
              progress={this.state.isChangeStatus ? this.state.progress : this.props.progress}
              min={0}
              max={100}
              onChangeSliderStatus={this.onChangeSliderStatus}
              onFinsihSliderStatus={this.onFinsihSliderStatus}
            />
          </View>
        )}

        <TouchableWithoutFeedback onPress={() => this.props.goUp()}>
          <View style={styles.minimizebottom}>
            <Image
              source={stream_data.thumbnail_url ? { uri: stream_data.thumbnail_url } : craft}
              style={{
                width: 30,
                height: 30,
                marginRight: METRICS.spacingTiny,
                marginLeft: METRICS.spacingNormal,
              }}
            />

            {stream_data?.craft_type_id !== 1 && (
              <TouchableOpacity onPress={() => this.onShuffle(stream_data.id)}>
                <CustomIcon
                  name="ionicons_svg_ios-shuffle"
                  style={this.state.isShuffle ? styles.shuffleIcon : styles.smallIcon}
                />
              </TouchableOpacity>
            )}

            <TouchableOpacity onPress={() => this.props.goUp()}>
              <Text style={styles.text}>{stream_data?.title}</Text>
            </TouchableOpacity>

            {stream_data?.craft_type_id !== 1 && (
              <TouchableOpacity onPress={this.onRepeat}>
                <CustomIcon
                  name="ionicons_svg_ios-repeat"
                  style={this.state.repeat ? styles.selectedSmallIcon : styles.smallIcon}
                />
              </TouchableOpacity>
            )}

            {stream_data?.craft_type_id === 1 ? (
              <TouchableOpacity onPress={() => this.props.onClosePlayer()}>
                <CustomIcon name="cancel-button" style={styles.icon2} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => this.onPressPlayPause()}>
                <CustomIcon
                  name={!this.state.isPlaying ? 'play-button' : 'pausethin'}
                  style={styles.icon2}
                />
              </TouchableOpacity>
            )}
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.blackColor,
    flex: 1,
  },
  wrapper: {
    paddingTop: METRICS.spacingNormal,
    backgroundColor: 'blue',
  },
  wrapperStyle: {
    flex: 1,
    marginBottom: METRICS.spacingSmall,
    paddingBottom: 0,
  },
  slider_body: {
    width: '100%',
    backgroundColor: 'transparent',
    position: 'absolute',
    top: -20 * METRICS.ratioX,
  },
  slider: {
    height: METRICS.spacingNormal,
    backgroundColor: 'red',
  },
  minimizeWrapper: {
    height: 50,
    width: '100%',
    backgroundColor: 'black',
  },
  minimizebottom: {
    paddingBottom: 0,
    paddingTop: METRICS.spacingSmall,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  icon: {
    color: COLORS.whiteColor,
    fontSize: METRICS.fontSizeBiggest,
    justifyContent: 'center',
    alignSelf: 'center',
    paddingRight: METRICS.spacingTiny,
    paddingLeft: METRICS.spacingTiny,
  },
  icon2: {
    color: COLORS.whiteColor,
    fontSize: METRICS.fontSizeHuge,
    justifyContent: 'center',
    alignSelf: 'center',
    paddingRight: METRICS.spacingNormal,
    paddingLeft: METRICS.spacingNormal,
  },
  text: {
    color: COLORS.whiteColor,
    fontSize: METRICS.fontSizeBig,
    fontFamily: 'lato',
  },
  none: {
    width: 0,
    height: 0,
  },
  selectedSmallIcon: {
    color: COLORS.pinkColor,
    fontSize: 26 * METRICS.ratioY,
  },
  smallIcon: {
    color: COLORS.primaryColor,
    fontSize: 26 * METRICS.ratioY,
  },
  shuffleIcon: {
    color: COLORS.pinkColor,
    fontSize: 26 * METRICS.ratioY,
  },
});

function mapDispatchToProps(dispatch) {
  return {
    updateCraftPlaying: (data) => dispatch(updateCraftPlaying(data)),
    setPlayingCrafts: (data) => dispatch(setPlayingCrafts(data)),
    updateProfileUserId: (data) => dispatch(updateProfileUserId(data)),
    updateBackScreen: (data) => dispatch(updateBackScreen(data)),
    updateEditingCraftId: (data) => dispatch(updateEditingCraftId(data)),
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
    updateCurrentTime: (data) => dispatch(updateCurrentTime(data)),
    updateFollowId: (data) => dispatch(updateFollowId(data)),
    updateStoreState: (data) => dispatch(updateStoreState(data)),
    updateAddMusicMethod: (data) => dispatch(updateAddMusicMethod(data)),
    updateIsPlaying: (data) => dispatch(updateIsPlaying(data)),

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
    repeat: state.repeat,
    isShuffle: state.isShuffle,
    isPlaying: state.isPlaying,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MiniCraftPlayer);
