import React from 'react';
import { ScrollView, View, StyleSheet, SafeAreaView } from 'react-native';
import { withNavigation } from 'react-navigation';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { connect } from 'react-redux';
import { BaseScreen, ScreenHeader, StoreItem } from '../components';
import { COLORS, METRICS } from '../global';
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

class SpotlightCraft extends BaseScreen {
  navbarHidden = true;

  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      title: '',
      type: 1,
      user: [],
      contest: [],
      craft: [],
      shop: [],
    };
  }

  componentDidMount() {
    const title = this.props.navigation.getParam('title');
    const type = this.props.navigation.getParam('type');
    this.setState(
      {
        title,
        type,
      },
      () => {
        this.getData();
      }
    );
  }

  getData = () => {
    PlayingCraftService.getSpotlightData()
      .then((res) => {
        this.setState({
          user: res.data.user,
          contest: res.data.contests,
          craft: res.data.crafts,
          shop: res.data.shop,
        });
      })
      .catch((err) => {
        // console.log(err.response.data.error);
      });
  };

  actionNavigation = (screen = 'Profile', id = 0) => {
    this.props.navigation.push(screen, { id });
  };

  onCraft = (id) => {
    PlayingCraftService.getCraft(id)
      .then((res) => {
        this.props.setPlayingCrafts([res.data]);
        this.props.updateCurCraftId(0);
        this.props.updatePrevState(store.getState());
        // this.props.updateTitle('PlayingCraft');
        this.props.updateIsPlaying(true);
        this.props.updateCraftPlaying(true);
      })
      .catch((err) => {
        // console.log(err.response.data.error);
      });
  };

  renderItem = (data) => {
    return data.map((item) => (
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
    const { user, contest, craft, shop, title, type } = this.state;
    let data = [];
    if (type === 1) data = user;
    if (type === 2) data = contest;
    if (type === 3) data = craft;
    if (type === 4) data = shop;
    return (
      <SafeAreaView style={styles.wrapper}>
        <ScreenHeader navigation={navigation} pageTitle={title} style={styles.headerstyle} />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            {data.length > 0 && <View style={styles.list}>{this.renderItem(data)}</View>}
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

export default connect(mapStateToProps, mapDispatchToProps)(withNavigation(SpotlightCraft));
