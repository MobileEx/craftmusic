import React from 'react';
import { ScrollView, View, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { withNavigation } from 'react-navigation';
import { connect } from 'react-redux';
import { BaseScreen, ScreenHeader, StoreItem } from '../components';
import { COLORS, METRICS } from '../global';
import ProfileService from '../services/ProfileService';
import { craftlistBg } from '../global/Images';
import {
  updateCraftPlaying,
  setPlayingCrafts,
  updateProfileUserId,
  updateTitle,
  updateCurCraftId,
  updatePrevState,
  updateCraftListId,
} from '../store/actions';
import store from '../store/configureStore';

class SeeAllCraftlists extends BaseScreen {
  navbarHidden = true;

  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      userId: '1',
      craftlists: [],
      userProfile: Object,
    };
  }

  componentDidMount() {
    const userId = this.props.navigation.getParam('userId');
    this.setState(
      {
        userId: userId || this.props.profileUserId,
      },
      () => {
        this.getData();
      }
    );
  }

  getData = () => {
    ProfileService.getContributedCraftlist(this.state.userId)
      .then((res) => {
        this.setState({
          craftlists: res.data,
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

  actionNavigation = (screen = 'Profile', id = 0) => {
    this.props.navigation.push(screen, { id });
  };

  onCraftlist = (id) => {
    this.props.updateCraftListId(id);
    this.props.updatePrevState(store.getState());
    this.props.updateTitle('Craftlist');
    this.props.navigation.navigate('Craftlist');
  };

  renderItem = () => {
    return this.state.craftlists.map((item) => (
      <TouchableOpacity onPress={() => this.onCraftlist(item.id)}>
        <StoreItem
          image={item.image ? { uri: item.image } : craftlistBg}
          key={item.title}
          title={item.title}
        />
      </TouchableOpacity>
    ));
  };

  renderScreen() {
    const { navigation } = this.props;
    const { userProfile } = this.state;

    return (
      <SafeAreaView style={styles.wrapper}>
        <ScreenHeader
          navigation={navigation}
          pageTitle={`${userProfile.username} Craftlists`}
          style={styles.headerstyle}
          only_show_list={1} //made by dongdong
        />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            <View style={styles.list}>{this.renderItem()}</View>
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

export default connect(mapStateToProps, mapDispatchToProps)(withNavigation(SeeAllCraftlists));
