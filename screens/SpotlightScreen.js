import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, ScrollView } from 'react-native';
import { withNavigation } from 'react-navigation';
import { connect } from 'react-redux';
import { ScreenHeader, StoreList, UserList } from '../components';
import { COLORS, METRICS } from '../global';
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

class SpotlightScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      user: [],
      contest: [],
      craft: [],
      shop: [],
    };
    this.props.navigation.addListener('didFocus', this.onScreenFocus);
  }

  componentDidMount() {
    this.getData();
    this.props.updateBackScreen('Spotlight')
  }

  getData = () => {
    PlayingCraftService.getSpotlightData(10)
      .then((res) => {
        this.setState({
          user: res.data.user,
          contest: res.data.contests,
          craft: res.data.crafts,
          shop: res.data.shop,
        });
      })
      .catch((err) => {
        console.log(err.response.data.error);
      });
  };

  onScreenFocus = () => {
    this.getData();
  };

  actionNavigation = (screen = 'Spotlight', id = 0) => {
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
        // this.props.updateTitle('PlayingCraft');
        this.props.updateIsPlaying(true);
        this.props.updateCraftPlaying(true);
      })
      .catch((err) => {
        // console.log(err.response.data.error);
      });
  };

  onUser = (id) => {
    this.props.updatePrevState(this.props);
    this.props.updateProfileUserId(id);
    this.props.updateTitle('Profile');
    this.props.updateBackScreen('Spotlight');
    this.props.navigation.navigate('Profile', { refresh: true });
  };

  onSeeAll = (title, type) => {
    this.props.updatePrevState(store.getState());
    this.props.updateTitle('SeeAllFeatured');
    this.props.navigation.navigate('SeeAllFeatured', { title, type });
  };

  render() {
    const { user, contest, craft, shop } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <ScreenHeader pageTitle="Spotlight" />
        <ScrollView
          contentContainerStyle={styles.wrapper}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          {user.length > 0 && (
            <View style={styles.topSection}>
              <Text style={styles.title}>Featured Users</Text>
              <UserList items={user} onUser={this.onUser} />
            </View>
          )}
          {contest.length > 0 && (
            <StoreList
              title="Contests"
              items={contest}
              onCraft={this.onCraft}
              onPress={() => this.onSeeAll('Contests', 2)}
            />
          )}
          {craft.length > 0 && (
            <StoreList
              title="Featured Crafts"
              items={craft}
              onCraft={this.onCraft}
              onPress={() => this.onSeeAll('Featured Crafts', 3)}
            />
          )}
          {shop.length > 0 && (
            <StoreList
              title="Featured Shop"
              items={shop}
              onCraft={this.onCraft}
              onPress={() => this.onSeeAll('Featured Shop', 4)}
            />
          )}

          <View style={{ height: 90 * METRICS.ratioY }} />
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.blackColor,
    minHeight: '100%',
  },
  title: {
    marginBottom: METRICS.fontSizeHuge,
    color: COLORS.primaryColor,
    fontSize: METRICS.fontSizeBig,
    marginTop: METRICS.spacingSmall,
    marginLeft: METRICS.spacingBig,
    fontFamily: 'lato-bold',
  },
  topSection: {
    marginBottom: METRICS.fontSizeHuge,
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

export default connect(mapStateToProps, mapDispatchToProps)(withNavigation(SpotlightScreen));
