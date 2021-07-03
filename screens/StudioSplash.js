import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import FastImage from 'react-native-fast-image';
import { connect } from 'react-redux';
import { CustomIcon, ModalWrapper, PublishModal, ConfirmModal } from '../components';
import { SplashBg } from '../global/Images';
import { COLORS, METRICS } from '../global';
import {
  updateStoreState,
  updateIsPlaying,
  updateBackScreen,
  updateCraftPlaying,
  setPlayingCrafts,
  updateProfileUserId,
  updateEditingCraftId,
  updateTitle,
  updateCurCraftId,
  updatePrevState,
  updateCraftListId,
  updateAddMusicMethod,
} from '../store/actions';
import PlayingCraftService from '../services/PlayingCraftService';
import store from '../store/configureStore';

class StudioSplashScreen extends React.Component {
  static navigationOptions = {
    header: null,
    footer: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      publishModalVisible: false,
      isVisibleSaveModal: false,
      toggle: false,
    };
  }

  componentDidMount() {}

  openModal = () => {
    this.setState({ toggle: true });
  };

  closeModal = () => {
    this.setState({ toggle: false });
    if (this.props.editingCraftId) {
      this.setState({ isVisibleSaveModal: true });
    }
  };

  onCloseRequest = () => {
    this.setState({ toggle: false });
    this.props.updateEditingCraftId(null);
    this.props.updateStoreState(null);
  };

  onCancelSave = () => {
    this.setState({ isVisibleSaveModal: false });
    if (this.props.editingCraftId) {
      PlayingCraftService.deleteCraft(this.props.editingCraftId)
        .then((/* res */) => {
          // console.log('deleteCraft response', res);
          // Delete Craft
          this.props.updateStoreState(null);
          PlayingCraftService.clearCrafts()
            .then((res) => {
              // console.log('clearCrafts response', res);
            })
            .catch((err) => {
              // console.log(err.response.data.error);
            });
          this.props.updateEditingCraftId(null);
        })
        .catch((/* err */) => {
          // console.log(err.response.data.error);
        });
    }
  };

  onSaveDraft = () => {
    this.setState({ isVisibleSaveModal: false });
    // Delete Craft
    this.props.updateStoreState(null);
    PlayingCraftService.clearCrafts()
      .then((res) => {
        // console.log('clearCrafts response', res);
      })
      .catch((err) => {
        // console.log(err.response.data.error);
      });
    this.props.updateEditingCraftId(null);
  };

  navigationHandler = (routeName) => {
    this.setState({ toggle: false });
    this.props.updateTitle('StudioSplash');
    this.props.navigation.navigate(routeName, { openModal: this.openModal, isFromAddCraft: 1 });
  };

  reset = () => {
    this.props.updateBackScreen('Home');
    if (!this.props.isPlaying) this.props.updateIsPlaying(-1);
    this.props.navigation.navigate({
      routeName: 'Home',
      key: 'Home',
    });
  };

  onAddCraft = () => {
    this.props.updateAddMusicMethod('');
    this.setState({ toggle: true });
    this.props.updateEditingCraftId(null);
  };

  onPublishYes = (isPublic) => {
    this.setState({
      publishModalVisible: false,
    });
    // Save new craft.
    PlayingCraftService.publishCraft(this.props.editingCraftId, isPublic)
      .then((res) => {
        this.props.updateStoreState(null);
        this.props.updateEditingCraftId(null);
      })
      .catch((err) => {
        Alert.alert(
          'CraftMusic',
          err.response.data.error,
          [
            {
              text: 'OK',
              onPress: () =>
                setTimeout(() => {
                  this.setState({ toggle: true });
                }, 500),
            },
          ],
          { cancelable: false }
        );
      });
  };

  onPublishNo = () => {
    this.setState({
      toggle: true,
      publishModalVisible: false,
    });
  };

  showPublishModal = (value) => {
    this.setState(
      {
        publishModalVisible: value,
        toggle: false,
      },
      () => {}
    );
  };

  openEditDetails = (type) => {
    if (!this.props.editingCraftId) {
      PlayingCraftService.addNewCraft()
        .then((res) => {
          this.props.updateEditingCraftId(res.data.craft_id);
          this.navigationHandler(type, { modalVisible: true });
        })
        .catch((err) => {
          // console.log(err);
        });
    } else {
      this.navigationHandler(type, { modalVisible: true });
    }
  };

  render() {
    return (
      <FastImage source={SplashBg} style={styles.wrapper} resizeMode="cover">
        <View style={styles.contentWrapper}>
          <View style={styles.navigationButtonsWrapper}>
            <TouchableOpacity
              style={styles.navigationOptionButton}
              onPress={() => {
                this.props.updatePrevState(store.getState());
                this.props.updateTitle('Studio');
                this.props.updateEditingCraftId(null);
                this.props.navigation.navigate('Studio');
              }}
            >
              <Text style={styles.navigationButtonText}>OPEN STUDIO</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navigationOptionButton} onPress={this.onAddCraft}>
              <Text style={styles.navigationButtonText}>ADD A CRAFT</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.navigationOptionButton}
              onPress={() => {
                this.props.updatePrevState(store.getState());
                this.props.updateTitle('SavedDrafts');
                this.props.navigation.navigate('SavedDrafts');
              }}
            >
              <Text style={styles.navigationButtonText}>SAVED DRAFTS</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.bottomButtonWrapper}>
            <TouchableOpacity>
              <Text style={styles.needHelpText}>Need Help?</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.closeButtonWrapper}>
            <TouchableOpacity onPress={() => this.reset()}>
              <CustomIcon
                name="stop-1"
                size={METRICS.fontSizeHuge}
                color={COLORS.purpleColor}
                style={{
                  paddingBottom: 33 * METRICS.ratioY,
                  paddingHorizontal: METRICS.spacingHuge,
                }}
              />
            </TouchableOpacity>
          </View>
          <ModalWrapper
            title="Edit Details"
            status={this.state.toggle}
            onClose={this.closeModal}
            onCloseRequest={this.onCloseRequest}
          >
            <View style={styles.contentWrapper}>
              <View style={styles.itemWrapper}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => this.openEditDetails('Info')}
                >
                  <CustomIcon
                    name="info-1"
                    color={COLORS.primaryColor}
                    size={35 * METRICS.ratioX}
                  />
                  <Text style={styles.buttonText}>Info</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.itemWrapper}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => this.openEditDetails('Store')}
                >
                  <CustomIcon
                    name="gift-bag"
                    color={COLORS.primaryColor}
                    size={35 * METRICS.ratioX}
                  />
                  <Text style={styles.buttonText}>Store</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={!this.props.editingCraftId ? 1 : 0}
                  style={{ ...styles.button, ...styles.publishButton }}
                  onPress={
                    !this.props.editingCraftId
                      ? console.log('no')
                      : () => this.showPublishModal(true)
                  }
                >
                  <Text
                    style={[
                      styles.publishButtonText,
                      {
                        color: !this.props.editingCraftId ? COLORS.greygreyColor : 'white',
                      },
                    ]}
                  >
                    Publish
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => this.openEditDetails('Music')}
                >
                  <CustomIcon name="music" color={COLORS.primaryColor} size={35 * METRICS.ratioX} />
                  <Text style={styles.buttonText}>Music</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.itemWrapper}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => this.openEditDetails('CoverArtVideo')}
                >
                  <CustomIcon name="brush" color={COLORS.primaryColor} size={35 * METRICS.ratioX} />
                  <Text style={styles.buttonText}>Cover Art/Video</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ModalWrapper>
        </View>
        <PublishModal
          onClose={() => this.showPublishModal(false)}
          status={this.state.publishModalVisible}
          onCloseRequest={() => this.showPublishModal(false)}
          onPublishYes={this.onPublishYes}
          onPublishNo={this.onPublishNo}
        />
        <ConfirmModal
          visible={this.state.isVisibleSaveModal}
          onCloseRequest={() => this.setState({ isVisibleSaveModal: false })}
          onCancel={this.onCancelSave}
          onConfirm={this.onSaveDraft}
          title="Save"
          message="Do you want to save this draft?"
        />
      </FastImage>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.blackColor,
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  navigationButtonsWrapper: {
    paddingHorizontal: METRICS.spacingHuge,
  },
  needHelpText: {
    fontFamily: 'Lato-Regular',
    fontSize: METRICS.fontSizeOK,
    color: COLORS.nameDM,
    textAlign: 'center',
    paddingHorizontal: METRICS.spacingHuge,
  },
  navigationOptionButton: {
    width: '100%',
    height: 60 * METRICS.ratioY,
    borderColor: COLORS.purpleColor,
    borderWidth: 1,
    borderRadius: 30 * METRICS.ratioY,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 25 * METRICS.ratioY,
  },
  navigationButtonText: {
    fontFamily: 'Lato-Light',
    fontSize: 22 * METRICS.ratioX,
    color: COLORS.whiteColor,
  },
  bottomButtonWrapper: {
    paddingVertical: 33 * METRICS.ratioY,
    alignItems: 'center',
  },
  closeButtonWrapper: {
    alignItems: 'center',
  },
  itemWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: METRICS.spacingHuge,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    height: METRICS.rowHeight,
    paddingHorizontal: METRICS.spacingHuge,
  },
  buttonText: {
    fontFamily: 'Lato-Semibold',
    fontSize: METRICS.fontSizeNormal,
    color: 'white',
    paddingTop: METRICS.spacingTiny,
  },
  publishButtonText: {
    fontFamily: 'Lato-Semibold',
    fontSize: METRICS.fontSizeNormal,
    textAlign: 'center',
  },
  publishButton: {
    borderRadius: METRICS.rowHeight / 2,
    borderWidth: 1 * METRICS.ratioX,
    borderColor: COLORS.primaryColor,
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
    updateStoreState: (data) => dispatch(updateStoreState(data)),
    updateAddMusicMethod: (data) => dispatch(updateAddMusicMethod(data)),
    updateEditingCraftId: (data) => dispatch(updateEditingCraftId(data)),
    updateIsPlaying: (data) => dispatch(updateIsPlaying(data)),
  };
}

function mapStateToProps(state) {
  return {
    isPlaying: state.isPlaying,
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

export default connect(mapStateToProps, mapDispatchToProps)(StudioSplashScreen);
