import React from 'react';
import { ScrollView, View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { withNavigation } from 'react-navigation';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { connect } from 'react-redux';
import { BaseScreen, ScreenHeader, StoreItem } from '../components';
import { COLORS, METRICS } from '../global';
import ProfileService from '../services/ProfileService';
import PlayingCraftService from '../services/PlayingCraftService';
import { craft } from '../global/Images';
import Environment from '../helpers/environment';
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

class StoreCategoryScreen extends BaseScreen {
  navbarHidden = true;

  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      userId: '1',
      type: 1,
      title: '',
      crafts: [],
      userProfile: Object,
    };
  }

  componentDidMount() {
    const userId = this.props.navigation.getParam('userId');
    const type = this.props.navigation.getParam('type');
    let title;
    if (type === 1) title = 'ART';
    if (type === 2) title = 'MUSIC';
    if (type === 3) title = 'BRAND';

    this.setState(
      {
        userId,
        type,
        title,
      },
      () => {
        this.getData();
      }
    );
  }

  getData = () => {
    PlayingCraftService.getUserStore(this.state.userId)
      .then((res) => {
        let crafts = [];
        if (this.state.type === 1) crafts = res.data.art;
        if (this.state.type === 2) crafts = res.data.music;
        if (this.state.type === 3) crafts = res.data.brand;
        this.setState({
          crafts,
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

  actionNavigation = (screen = 'StoreCategory', id = 0) => {
    this.props.updatePrevState(store.getState());
    this.props.updateTitle(screen);
    this.props.navigation.navigate(screen, { id });
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
        // console.log(err.response.data.error);
      });
  };

  renderItem = () => {
    return this.state.crafts.map((item) => (
      <TouchableOpacity onPress={() => this.onCraft(item.id)}>
        <StoreItem
          image={
            item.thumbnail_url
              ? {
                  uri:
                    item.thumbnail_url.search('http') >= 0
                      ? item.thumbnail_url
                      : Environment.S3URL + item.thumbnail_url,
                }
              : craft
          }
          key={item.title}
          title={item.title}
        />
      </TouchableOpacity>
    ));
  };

  renderScreen() {
    const { navigation } = this.props;
    const { userProfile, crafts } = this.state;

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
            <Text style={styles.store}>{this.state.title}</Text>
            {crafts.length > 0 && <View style={styles.list}>{this.renderItem()}</View>}
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
  store: {
    fontSize: METRICS.fontSizeBig,
    color: COLORS.primaryColor,
    marginBottom: METRICS.spacingNormal,
    textAlign: 'center',
    fontFamily: 'Lato-Bold',
  },
  list: {
    paddingVertical: METRICS.spacingSmall,
    paddingHorizontal: METRICS.spacingTiny,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
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

export default connect(mapStateToProps, mapDispatchToProps)(withNavigation(StoreCategoryScreen));
