import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { withNavigation } from 'react-navigation';
import _ from 'lodash';
import { connect, useStore } from 'react-redux';
import {
  BaseScreen,
  ScreenHeader,
  CircleClose,
  Thumbnail,
  CustomButton,
} from '../../../components';
import { METRICS, COLORS, STYLES } from '../../../global';
import { craft } from '../../../global/Images';
import ProfileService from '../../../services/ProfileService';
import PlayingCraftService from '../../../services/PlayingCraftService';
import Environment from '../../../helpers/environment';
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
  updateIsPlaying,
} from '../../../store/actions';
import store from '../../../store/configureStore';

class MyWishList extends BaseScreen {
  navbarHidden = true;

  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      salesItems: [],
      removeOption: false,
    };
  }

  handleBuy = () => {
    //
  };

  componentDidMount() {
    ProfileService.getMyWishlist()
      .then((res) => {
        this.setState({
          salesItems: res.data,
        });
      })
      .catch((err) => {
        console.log(err.response.data.error);
      });
  }

  onCraft = (id) => {
    if (this.state.removeOption === true) {
      this.removeItem(id);
    } else {
      PlayingCraftService.getCraft(id)
        .then((res) => {
          this.props.setPlayingCrafts([res.data]);
          this.props.updateCurCraftId(0);
          this.props.updatePrevState(store.getState());
          this.props.updateIsPlaying(true);
          // this.props.updateTitle('PlayingCraft');
          this.props.updateCraftPlaying(true);

          this.props.navigation.navigate('Home');
        })
        .catch((err) => {
          // console.log(err.response.data.error);
        });
    }
  };

  removeItem = (id) => {
    //
    PlayingCraftService.removeCraftFromWishlist(id)
      .then((res) => {
        this.setState({
          salesItems: res.data,
        });
      })
      .catch((err) => {
        // console.log(err.response.data.error);
      });
  };

  onLongPress = () => {
    this.setState({ removeOption: true });
  };

  removeDone = () => {
    this.setState({ removeOption: false });
  };

  renderScreen() {
    const { navigation } = this.props;
    const { salesItems } = this.state;
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <ScreenHeader navigation={navigation} pageTitle="My Wishlist" />
        {this.state.removeOption && (
          <CustomButton
            title="Done"
            style={styles.doneButton}
            clickHandler={() => this.removeDone()}
          />
        )}
        <View style={styles.contentContainer}>
          {salesItems.map((item, index) => (
            <View
              key={index}
              style={{ ...styles.wishItem, marginHorizontal: index % 3 === 1 ? '5%' : 0 }}
            >
              <View>
                {this.state.removeOption && (
                  <CircleClose
                    clickHandler={() => this.removeItem(item.id)}
                    style={styles.circleClose}
                  />
                )}
                <Thumbnail
                  imageSource={item.thumbnail_url ? { uri: item.thumbnail_url } : craft}
                  onCraft={() => this.onCraft(item.id)}
                  onLongPress={() => this.onLongPress()}
                />
              </View>
              <Text style={[STYLES.normalText, styles.mediaText]}>{item.title}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: METRICS.spaceNormal,
    paddingRight: METRICS.spaceNormal,
  },
  contentContainer: {
    paddingVertical: METRICS.spacingTiny,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  wishItem: {
    width: '30%',
    marginBottom: METRICS.spacingBig,
  },
  mediaText: {
    textAlign: 'center',
    marginVertical: METRICS.spacingTiny,
  },
  buyButton: {
    borderColor: COLORS.primaryColor,
    borderWidth: 1,
    borderRadius: 10 * METRICS.ratioX,
    height: 30 * METRICS.ratioX,
    paddingHorizontal: METRICS.spacingSmall,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleClose: {
    position: 'absolute',
    top: -10 * METRICS.ratioY,
    right: -8 * METRICS.ratioX,
    zIndex: 101,
  },
  doneButton: {
    position: 'absolute',
    width: '20%',
    top: 10 * METRICS.ratioX,
    right: 15 * METRICS.ratioY,
    zIndex: 101,
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

export default connect(mapStateToProps, mapDispatchToProps)(withNavigation(MyWishList));
