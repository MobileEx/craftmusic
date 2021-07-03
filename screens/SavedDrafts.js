import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Moment from 'moment';
import { connect } from 'react-redux';
import {
  BaseScreen,
  ScreenHeader,
  DraftItem,
  ModalWrapper,
  PublishModal,
  CustomIcon,
  ConfirmModal,
} from '../components';
import PlayingCraftService from '../services/PlayingCraftService';
import { METRICS, COLORS } from '../global';
import {
  getStudios,
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
} from '../store/actions';

import store from '../store/configureStore';

class SavedDrafts extends BaseScreen {
  navbarHidden = true;

  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      toggle: false,
      selectedDraft: null,
      deleteModalVisible: false,
      editingStudioOwnerId: null,
    };
  }

  componentDidMount = () => {
    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      this.props.getStudios();
    });
  };

  componentWillUnmount() {
    // Remove the event listener before removing the screen from the stack
    this.focusListener.remove();
  }

  selectDraft = (item) => {
    this.props.updateEditingCraftId(item.id);
    this.setState({ editingStudioOwnerId: item.owner_id });
    this.setState({ selectDraft: item, toggle: true });
  };

  openModal = () => {
    this.setState({ toggle: true });
  };

  closeModal = () => {
    this.props.updateEditingCraftId(null);
    this.setState({ selectDraft: null, toggle: false });
  };

  callBack = (id) => {
    this.props.updateEditingCraftId(id);
    this.setDeleteModalVisible(true);
  };

  onDeleteCraft = () => {
    PlayingCraftService.deleteCraft(this.props.editingCraftId)
      .then((res) => {
        this.props.getStudios();
        this.closeDeleteModal();
      })
      .catch((err) => {
        // console.log('deelte craft error', err);
        // console.log(err.response.data.error);
      });
  };

  // Delete Modal
  setDeleteModalVisible = (visible) => {
    this.setState({ deleteModalVisible: visible });
  };

  onDelete = () => {
    this.setState({
      deleteModalVisible: true,
    });
  };

  closeDeleteModal = () => {
    this.setState({
      deleteModalVisible: false,
    });
  };

  navigationHandler = (routeName) => {
    this.setState({ selectDraft: null, toggle: false });
    this.props.updatePrevState(store.getState());
    this.props.updateTitle(routeName);
    this.props.navigation.navigate(routeName, { openModal: this.openModal });
  };

  showPublishModal = (value) => {
    // console.log('Studio splash: screen publish button pressed');

    this.setState(
      {
        publishModalVisible: value,
        toggle: false,
      },
      () => {
        // console.log('Studio splash: publishModalVisible set');
      }
    );
  };

  onPublishYes = (isPublic) => {
    this.setState({
      publishModalVisible: false,
    });
    // Save new craft.
    PlayingCraftService.publishCraft(this.props.editingCraftId, isPublic)
      .then((res) => {
        this.props.getStudios();
      })
      .catch((err) => {
        // console.log(err.response.data.error);
      });
    this.props.updateStoreState(null);
    this.props.updateEditingCraftId(null);
  };

  onPublishNo = () => {
    this.setState({
      toggle: true,
      publishModalVisible: false,
    });
  };

  renderScreen() {
    const { navigation, studios } = this.props;
    const drafts = [];
    for (const [id, studio] of Object.entries(studios)) {
      drafts.push(
        <DraftItem
          key={id}
          title={studio.title}
          username={studio.updated_by}
          lastEditedDate={Moment(Moment.utc(studio.updated_at).local()).fromNow()}
          handleEdit={(studio) => this.selectDraft(studio)}
          studio={studio}
          callBack={this.callBack}
        />
      );
    }

    return (
      <ScrollView contentContainerStyle={styles.container}>
        <ScreenHeader pageTitle="Saved Drafts" navigation={navigation} />
        {drafts}
        <ModalWrapper title="Edit Details" status={this.state.toggle} onClose={this.closeModal}>
          <View style={styles.contentWrapper}>
            <View style={styles.itemWrapper}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => this.navigationHandler('Info')}
              >
                <CustomIcon name="info-1" color={COLORS.primaryColor} size={35 * METRICS.ratioX} />
                <Text style={styles.buttonText}>Info</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.itemWrapper}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => this.navigationHandler('Store')}
              >
                <CustomIcon
                  name="gift-bag"
                  color={COLORS.primaryColor}
                  size={35 * METRICS.ratioX}
                />
                <Text style={styles.buttonText}>Store</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ ...styles.button, ...styles.publishButton }}
                onPress={() =>
                  this.state.editingStudioOwnerId === this.props.user.id
                    ? this.showPublishModal(true)
                    : alert("You're not the owner of this craft so you can't publish it.")
                }
              >
                <Text style={styles.publishButtonText}>Publish</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => this.navigationHandler('Music')}
              >
                <CustomIcon name="music" color={COLORS.primaryColor} size={35 * METRICS.ratioX} />
                <Text style={styles.buttonText}>Music</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.itemWrapper}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => this.navigationHandler('CoverArtVideo')}
              >
                <CustomIcon name="brush" color={COLORS.primaryColor} size={35 * METRICS.ratioX} />
                <Text style={styles.buttonText}>Cover Art/Video</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ModalWrapper>
        <PublishModal
          onClose={() => this.showPublishModal(false)}
          status={this.state.publishModalVisible}
          onCloseRequest={() => this.showPublishModal(false)}
          onPublishYes={this.onPublishYes}
          onPublishNo={this.onPublishNo}
        />
        <ConfirmModal
          visible={this.state.deleteModalVisible}
          onCloseRequest={this.setDeleteModalVisible}
          onCancel={this.closeDeleteModal}
          onConfirm={this.onDeleteCraft}
        />
      </ScrollView>
    );
  }
}

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
    updateFollowId: (data) => dispatch(updateFollowId(data)),
    updateStoreState: (data) => dispatch(updateStoreState(data)),
    updateAddMusicMethod: (data) => dispatch(updateAddMusicMethod(data)),
    createChatGroup: (data) => dispatch(createChatGroup(data)),
    getAllChatGroups: (data) => dispatch(getAllChatGroups(data)),
    getStudios: (data) => dispatch(getStudios(data)),
  };
}

function mapStateToProps(state) {
  return {
    studios: state.studios,
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

export default connect(mapStateToProps, mapDispatchToProps)(SavedDrafts);

const styles = StyleSheet.create({
  container: {
    paddingLeft: METRICS.spaceNormal,
    paddingRight: METRICS.spaceNormal,
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
    color: 'white',
    textAlign: 'center',
  },
  publishButton: {
    borderRadius: METRICS.rowHeight / 2,
    borderWidth: 1 * METRICS.ratioX,
    borderColor: COLORS.primaryColor,
  },
});
