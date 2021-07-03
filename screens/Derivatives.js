import React from 'react';
import { ScrollView, View, StyleSheet, SafeAreaView } from 'react-native';
import { withNavigation } from 'react-navigation';
import { connect } from 'react-redux';
import { ScreenHeader, StoreItem } from '../components';
import { COLORS, METRICS } from '../global';
import Environment from '../helpers/environment';
import {
  updateCraftPlaying,
  setPlayingCrafts,
  updateTitle,
  updateCurCraftId,
  updatePrevState,
} from '../store/actions';
import store from '../store/configureStore';

class Derivatives extends React.Component {
  navbarHidden = true;

  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      curCraftId: this.props.curCraftId,
    };
  }

  componentWillReceiveProps() {
    this.setState({
      curCraftId: this.props.curCraftId,
    });
  }

  actionNavigation = (screen = 'StoreCategory', id = 0) => {
    this.props.updatePrevState(store.getState());
    this.props.updateTitle(screen);
    this.props.navigation.navigate(screen, { id });
  };

  renderItem = () => {
    const craft = this.props.playingCrafts ? this.props.playingCrafts[this.state.curCraftId] : null;
    return craft.derivatives.map((item) => (
      <StoreItem
        image={
          item.photo_url
            ? item.photo_url.search('http') >= 0
              ? item.photo_url
              : Environment.S3URL + item.photo_url
            : null
        }
        key={item.title}
        title={item.title}
      />
    ));
  };

  render() {
    const { navigation, onGoBack } = this.props;

    return (
      <SafeAreaView style={styles.wrapper}>
        <ScreenHeader
          navigation={navigation}
          onGoBack={onGoBack}
          pageTitle="Derivatives"
          style={styles.headerstyle}
        />
        <ScrollView>
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
    width: METRICS.screenWidth,
    height: METRICS.screenHeight,
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

export default connect(mapStateToProps, mapDispatchToProps)(withNavigation(Derivatives));
