import React from 'react';
import { ScrollView, StyleSheet, SafeAreaView, View } from 'react-native';
import { withNavigation } from 'react-navigation';
import { connect } from 'react-redux';
import { BaseScreen, ScreenHeader, StoreList } from '../components';
import { COLORS, METRICS } from '../global';
import ProfileService from '../services/ProfileService';
import PlayingCraftService from '../services/PlayingCraftService';
import {
  updateBackScreen,
  updateCraftPlaying,
  setPlayingCrafts,
  updateProfileUserId,
  updateTitle,
  updateCurCraftId,
  updatePrevState,
  updateCraftListId,
  updateIsPlaying,
} from '../store/actions';
import store from '../store/configureStore';

class StoreMainScreen extends BaseScreen {
  navbarHidden = true;

  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      userId: '1',
      music: [],
      brand: [],
      art: [],
      userProfile: Object,
    };
  }

  componentDidMount() {
    const userId = this.props.navigation.getParam('userId');
    this.setState(
      {
        userId,
      },
      () => {
        this.getData();
      }
    );
  }

  getData = () => {
    PlayingCraftService.getUserStore(this.state.userId)
      .then((res) => {
        this.setState({
          art: res.data.art,
          music: res.data.music,
          brand: res.data.brand,
        });
      })
      .catch((err) => {
        // console.log(err.response.data.error);
      });
    ProfileService.getUserProfile(this.state.userId)
      .then((res) => {
        this.setState({
          userProfile: res.data,
        });
      })
      .catch((err) => {
        // console.log(err.response.data.error);
      });
  };

  actionNavigation = (type) => {
    this.props.updatePrevState(store.getState());
    this.props.updateTitle('StoreCategory');
    this.props.navigation.navigate('StoreCategory', { userId: this.state.userId, type });
  };

  onCraft = (id) => {
    PlayingCraftService.getCraft(id)
      .then((res) => {
        this.props.setPlayingCrafts([res.data]);
        this.props.updateCurCraftId(0);
        this.props.updatePrevState(store.getState());
        this.props.updateIsPlaying(true);
        // this.props.updateTitle('PlayingCraft');
        this.props.updateCraftPlaying(true);
      })
      .catch((err) => {
        console.log(err.response.data.error);
      });
  };

  renderScreen() {
    const { navigation } = this.props;
    const { userProfile, art, music, brand } = this.state;

    return (
      <SafeAreaView style={styles.wrapper}>
        <ScreenHeader
          navigation={navigation}
          pageTitle={`${userProfile.username} Store`}
          style={styles.headerstyle}
          only_show_list={1} //made by dongdong
        />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            {music.length > 0 && (
              <StoreList
                title="MUSIC"
                items={music}
                onPress={() => this.actionNavigation(2)}
                onCraft={this.onCraft}
              />
            )}
            {art.length > 0 && (
              <StoreList
                title="ART"
                items={art}
                onPress={() => this.actionNavigation(1)}
                onCraft={this.onCraft}
              />
            )}
            {brand.length > 0 && (
              <StoreList
                title="BRAND ITEMS"
                items={brand}
                onPress={() => this.actionNavigation(3)}
                onCraft={this.onCraft}
              />
            )}
          </View>
          <View style={{ height: 90 * METRICS.ratioY }} />
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  headerstyle: {
    paddingLeft: METRICS.spaceNormal,
    paddingRight: METRICS.spaceNormal,
    marginHorizontal: METRICS.spaceNormal,
  },
  wrapper: {
    backgroundColor: COLORS.blackColor,
  },
  container: {
    backgroundColor: COLORS.blackColor,
    paddingTop: METRICS.spacingNormal,
  },
});

function mapDispatchToProps(dispatch) {
  return {
    setPlayingCrafts: (data) => dispatch(setPlayingCrafts(data)),
    updateCraftPlaying: (data) => dispatch(updateCraftPlaying(data)),
    updatePrevState: (data) => dispatch(updatePrevState(data)),
    updateCurCraftId: (data) => dispatch(updateCurCraftId(data)),
    updateTitle: (data) => dispatch(updateTitle(data)),
    updateCraftListId: (data) => dispatch(updateCraftListId(data)),
    updateProfileUserId: (data) => dispatch(updateProfileUserId(data)),
    updateBackScreen: (data) => dispatch(updateBackScreen(data)),
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
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withNavigation(StoreMainScreen));
