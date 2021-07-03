import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { ScreenHeader, HashedCraftList, BaseScreen } from '../components';
import { COLORS, METRICS } from '../global';
import SearchService from '../services/SearchService';
import PlayingCraftService from '../services/PlayingCraftService';
import {
  updateBackScreen,
  updateCraftPlaying,
  setPlayingCrafts,
  updateTitle,
  updateCurCraftId,
  updatePrevState,
  updateIsPlaying,
} from '../store/actions';

class HashedCraftsScreen extends BaseScreen {
  navbarHidden = false;

  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      hashtag: [],
      craftsCount: 0,
      crafts: [],
    };
  }

  componentDidMount() {
    const hashtag = this.props.navigation.getParam('hashtag');
    const craftsCount = this.props.navigation.getParam('crafts_count');
    this.setState({
      hashtag,
      craftsCount,
    });
    this.getCraftsRelatedHash(hashtag);
  }

  getCraftsRelatedHash = (hashtag) => {
    SearchService.search(hashtag, {}, {}, false, true)
      .then((res) => {
        this.setState({
          crafts: res.data.craft,
          craftsCount: res.data.craft.length,
        });
      })
      .catch((err) => {
        // console.log(err.response.data.error);
      });
  };

  onCraft = (id) => {
    PlayingCraftService.getCraft(id)
      .then((res) => {
        this.props.setPlayingCrafts([res.data]);
        this.props.updateCurCraftId(0);
        this.props.updateIsPlaying(true);
        this.props.updateCraftPlaying(true);
      })
      .catch((err) => {
        // console.log(err.response.data.error);
      });
  };

  render() {
    const { hashtag, craftsCount, crafts } = this.state;
    const { navigation } = this.props;
    const backScreen = navigation.getParam('back_screen');
    const backAction = backScreen
      ? () => {
          navigation.navigate(backScreen);
        }
      : null;
    return (
      <SafeAreaView style={styles.container}>
        <ScreenHeader
          navigation={navigation}
          only_show_list={1}
          pageTitle={`${hashtag} (${craftsCount})`}
          backAction={backAction}
          style={{ marginHorizontal: METRICS.spacingNormal }}
        />
        <HashedCraftList items={crafts} onCraft={this.onCraft} numColumns={3} />
      </SafeAreaView>
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
    updateIsPlaying: (playing) => dispatch(updateIsPlaying(playing)),
    updateBackScreen: (data) => dispatch(updateBackScreen(data)),
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

export default connect(mapStateToProps, mapDispatchToProps)(HashedCraftsScreen);

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.blackColor,
    minHeight: '100%',
  },
});
