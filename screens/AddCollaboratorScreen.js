import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';
import SearchList2 from '../components/SearchList2';
import { COLORS, METRICS } from '../global';
import { ScreenHeader, BaseScreen, CustomIcon, ConfirmModal } from '../components';
import {
  searchUser,
  receiveSearchUser,
  getCollaborationRequests,
  sendCollaborationRequest,
  cancelCollaborationRequest,
  removeCollaborator,
  updateOwnerId,
  updateNewStudioId,
  updateProfileUserId,
  updateEditingCraftId,
  updateTitle,
  updatePrevState,
} from '../store/actions';
import DisplayUserRow2 from '../components/DisplayUserRow2';
import RowAction from '../components/RowAction';
import PlayingCraftService from '../services/PlayingCraftService';
import store from '../store/configureStore';

let ownerId = '';
class AddCollaboratorScreen extends BaseScreen {
  navbarHidden = true;

  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      search: null,
      modalVisible: false,
      modalWorking: false,
      selectedItem: null,
      deleteModalVisible: false,
      userToRemove: null,
      ownerId: null,
      collabId: null,
    };
  }

  componentDidMount = () => {
    this.getCollaborationRequests();
  };

  actionNavigation = (screen = 'AddCollaboratorScreen', id = 0) => {
    this.props.dispatch(updatePrevState(store.getState()));
    this.props.dispatch(updateTitle(screen));
    this.props.navigation.navigate(screen, { id });
  };

  updateSearch = _.debounce((search) => {
    this.setState({ search });
    this.props.dispatch(searchUser(search));
  }, 500);

  renderSelected = (status) => {
    if (status === 1) {
      return (
        <View style={styles.plusWrapper}>
          <CustomIcon name="plus1" style={styles.plusIcon} />
        </View>
      );
    }
    return <></>;
  };

  onClear = () => {
    this.setState({ search: null });
    this.props.dispatch(receiveSearchUser([]));
  };

  rowActionHandler = (item) => {
    // if action
    if (item.type === 'invite') {
      this.setState({ selectedItem: item }, this.send);
    } else if (item.type === 'pending') {
      // cancel request
      this.cancelCollaborationRequest(item.collabId, item.user.id);
    } else if (item.type === 'accepted') {
      if (item.owner_id === this.props.user.id || item.user.id === this.props.user.id) {
        this.onDelete(item.user.id, item.collabId);
      }
    }
  };

  cancelCollaborationRequest = (collabId, userId) => {
    this.setState({ modalWorking: true });
    this.props.dispatch(cancelCollaborationRequest(collabId, userId)).then(() => {
      this.setState({ modalWorking: false });
    });
  };

  modalOpen = (item) => {
    this.setState({ modalVisible: true, selectedItem: item });
  };

  modalClose = () => {
    this.setState({ modalVisible: false, modalWorking: false, selectedItem: null });
  };

  send = () => {
    if (!this.state.modalWorking) {
      this.setState({ modalWorking: true });

      this.createNewStudio();
    }
  };

  createNewStudio = () => {
    this.props.dispatch(updateNewStudioId(this.props.navigation.getParam('studioId')));

    if (!this.props.newStudioId) {
      this.props.dispatch(updateNewStudioId(null));
      PlayingCraftService.joinStudioCraft(this.props.newStudioId, this.props.editingCraftId).then(
        (res) => {
          this.props.dispatch(updateNewStudioId(res.data.id));
          this.sendRequest(res.data.id);
        }
      );
    } else {
      this.sendRequest(this.props.newStudioId);
    }
  };

  sendRequest = (studioId) => {
    this.props
      .dispatch(
        sendCollaborationRequest(
          this.state.selectedItem.user.id,
          studioId,
          0,
          this.props.editingCraftId
        )
      )
      .then((val) => {
        this.props.dispatch(updateEditingCraftId(val.craft_id));
        this.modalClose();
      });
  };

  formatResults = () => {
    const { collaborationKeys, collaborationScreenResults, searchUserResult } = this.props;
    const { search } = this.state;
    const collabReqResults = [];
    const usersResult = [];
    collaborationScreenResults.map((collaboration) => {
      if (search) {
        const searchMatch =
          collaboration.recipient &&
          collaboration.recipient.username &&
          collaboration.recipient.username.includes(search);
        if (!searchMatch) {
          return;
        }
      }
      const payload = {
        type: null,
        user: collaboration.recipient,
        key: collaboration.recipient.id,
        collabId: collaboration.id,
        owner_id: collaboration.owner_id,
      };
      ownerId = collaboration.owner_id;

      if (collaboration.status === 'accepted') {
        payload.type = 'accepted';
      } else if (collaboration.status === 'requested') {
        payload.type = 'pending';
      } else {
        return;
      }
      collabReqResults.push(payload);
    });

    if (search) {
      searchUserResult.map((user) => {
        if (collaborationKeys[user.id]) {
          return;
        }
        const payload = {
          type: 'invite',
          user,
          key: user.id,
        };
        usersResult.push(payload);
      });
    }

    return usersResult.concat(collabReqResults);
  };

  getCollaborationRequests = () => {
    this.props.dispatch(
      updateOwnerId(
        this.props.navigation.getParam('ownerId')
          ? this.props.navigation.getParam('ownerId')
          : this.props.ownerId
      )
    );
    return this.props.dispatch(
      getCollaborationRequests('studio', this.props.navigation.getParam('studioId'))
    );
  };

  // Delete Modal
  setDeleteModalVisible = (visible) => {
    this.setState({ deleteModalVisible: visible });
  };

  onDelete = (userId, collabId) => {
    this.setState({
      deleteModalVisible: true,
      userToRemove: userId,
      collabId,
    });
  };

  closeDeleteModal = () => {
    this.setState({
      deleteModalVisible: false,
    });
  };

  onDeleteUser = () => {
    const id = this.state.userToRemove;
    // call remove user api
    this.props
      .dispatch(
        removeCollaborator(
          this.state.userToRemove,
          this.props.navigation.getParam('studioId'),
          this.state.collabId
        )
      )
      .then((val) => {
        this.closeDeleteModal();
        if (item.owner_id == this.props.user.id) {
        } else {
          this.props.navigation.navigate('Home');
        }
      });
  };

  onUser = (id) => {
    this.props.dispatch(updateProfileUserId(id));
    this.props.navigation.navigate('Profile', { refresh: true });
  };

  render() {
    const { search } = this.state;
    const { navigation } = this.props;
    const { updateSearch, onClear } = this;
    const { isFetching } = this.props;
    return (
      <SafeAreaView style={{ backgroundColor: COLORS.blackColor }}>
        <ScreenHeader
          pageTitle="Collaborators"
          navigation={navigation}
          style={styles.headerstyle}
        />
        <SearchList2
          onChangeText={updateSearch}
          value={search}
          onClear={onClear}
          placeholder="Search users"
          showLoading={isFetching}
          data={this.formatResults()}
          listProps={{
            renderItem: ({ item }) => {
              let message;

              let iconName = 'three-dots-more-indicator';
              let iconColor = '#fff';
              if (item.type === 'accepted') {
                iconName =
                  item.owner_id === this.props.user.id || item.user.id === this.props.user.id
                    ? 'three-dots-more-indicator'
                    : '';
                // TODO: user role
                // message = 'Admin'; //set to Collaborator
                message = item.owner_id === item.user.id ? 'Admin' : 'Collaborator';
              } else if (item.type === 'pending') {
                message = 'Invite pending';
                iconName = item.owner_id === this.props.user.id ? 'cancel-button' : '';
              } else if (item.type === 'invite') {
                iconName = this.props.ownerId === item.user.id ? '' : 'plus1';
                message = null;
                iconColor = COLORS.primaryColor;
              }
              return (
                <RowAction
                  item={item}
                  display={
                    <DisplayUserRow2
                      user={item.user}
                      message={message}
                      onPressUser={() => this.onUser(item.user.id)}
                    />
                  }
                  callback={this.rowActionHandler}
                  action={
                    iconName ? (
                      <CustomIcon name={iconName} size={METRICS.fontSizeHuge} color={iconColor} />
                    ) : null
                  }
                />
              );
            },
          }}
        />
        <ConfirmModal
          visible={this.state.deleteModalVisible}
          onCloseRequest={this.setDeleteModalVisible}
          onCancel={this.closeDeleteModal}
          onConfirm={this.onDeleteUser}
          title={ownerId === this.props.user.id ? 'Remove' : 'Leave'}
          message={
            ownerId === this.props.user.id
              ? 'Do you want to remove this collaborator?'
              : 'Do you want to leave this collaboration?'
          }
        />
      </SafeAreaView>
    );
  }
}

function mapStateToProps(state) {
  const {
    searchUserResult,
    isFetching,
    collaborationScreenResults,
    collaborationKeys,
    user,
    newStudioId,
    ownerId,
    prevState,
    playingCraft,
    profileUserId,
    backScreen,
    editingCraftId,
    title,
    curCraftId,
    openComments,
    miniPlay,
    deepAlert,
    craftlistId,
    backupCraft,
    seekOnBack,
    currentTime,
    followId,
    storeState,
    addMusicMethod,
  } = state;
  return {
    searchUserResult,
    isFetching,
    collaborationScreenResults,
    collaborationKeys,
    user,
    newStudioId,
    ownerId,
    prevState,
    playingCraft,
    profileUserId,
    backScreen,
    editingCraftId,
    title,
    curCraftId,
    openComments,
    miniPlay,
    deepAlert,
    craftlistId,
    backupCraft,
    seekOnBack,
    currentTime,
    followId,
    storeState,
    addMusicMethod,
  };
}

export default connect(mapStateToProps)(AddCollaboratorScreen);

const styles = StyleSheet.create({
  headerstyle: {
    marginHorizontal: METRICS.spacingBig,
    marginBottom: METRICS.spacingSmall,
  },
  wrapper: {
    backgroundColor: COLORS.blackColor,
    minHeight: '100%',
    paddingTop: METRICS.marginBig,
  },
  container: {
    backgroundColor: COLORS.blackColor,
    height: '100%',
    width: '100%',
  },
  plusIcon: {
    color: COLORS.primaryColor,
    fontSize: METRICS.fontSizeHuge,
  },
});
