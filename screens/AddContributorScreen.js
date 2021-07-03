import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import SearchList2 from '../components/SearchList2';
import { COLORS, METRICS } from '../global';
import { ScreenHeader, BaseScreen, CustomIcon, ConfirmModal } from '../components';
import {
  searchUser,
  receiveSearchUser,
  getContributionRequests,
  sendCollaborationRequest,
  cancelCollaborationRequest,
  updateOwnerId,
  updateProfileUserId,
  updateEditingCraftId,
  updateTitle,
  updatePrevState,
  getCollaborationRequests,
} from '../store/actions';
import DisplayUserRow2 from '../components/DisplayUserRow2';
import RowAction from '../components/RowAction';

let ownerId = '';
class AddContributorScreen extends BaseScreen {
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
    };
  }

  componentDidMount = () => {
    this.getContributionRequests();
  };

  getContributionRequests = () => {
    return this.props.dispatch(
      getContributionRequests('craftlist', this.props.navigation.getParam('craftlistId'))
    );
  };

  actionNavigation = (screen = 'AddContributorScreen', id = 0) => {
    this.props.dispatch(updatePrevState(store.getState()));
    this.props.dispatch(updateTitle(screen));
    this.props.navigation.navigate(screen, { id });
  };

  updateSearch = (search) => {
    this.setState({ search });
    this.props.dispatch(searchUser(search));
  };

  onEndSearchInput = () => {
    this.props.dispatch(searchUser(this.state.search));
  };

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
      if (item.owner_id == this.props.user.id || item.user.id == this.props.user.id) {
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

      this.props
        .dispatch(
          sendCollaborationRequest(
            this.state.selectedItem.user.id,
            this.props.navigation.getParam('studioId'),
            0,
            this.props.editingCraftId
          )
        )
        .then((val) => {
          this.modalClose();
        });
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
    const { contributionKeys, contributionScreenResults, searchUserResult } = this.props;
    const contriReqResults = [];
    for (const contributionRequest of contributionScreenResults) {
      if (this.state.search) {
        const searchMatch = contributionRequest.recipient.username.includes(this.state.search);
        if (!searchMatch) {
          continue;
        }
      }
      const payload = {
        type: null,
        user: contributionRequest.recipient,
        key: contributionRequest.recipient.id,
        collabId: contributionRequest.id,
        owner_id: contributionRequest.owner_id,
      };
      ownerId = contributionRequest.owner_id;

      if (contributionRequest.status === 'accepted') {
        payload.type = 'accepted';
      } else if (contributionRequest.status === 'requested') {
        payload.type = 'pending';
      } else {
        continue;
      }

      contriReqResults.push(payload);
    }

    const mappedUserResults = [];
    if (this.state.search != null) {
      for (const userResult of searchUserResult) {
        if (contributionKeys[userResult.id]) {
          continue;
        }
        const payload = {
          type: 'invite',
          user: userResult,
          key: userResult.id,
        };
        mappedUserResults.push(payload);
      }
    }

    return mappedUserResults.concat(contriReqResults);
  };

  getCollaborationRequests = () => {
    this.props.updateOwnerId(
      this.props.navigation.getParam('ownerId')
        ? this.props.navigation.getParam('ownerId')
        : this.props.ownerId
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
    const { updateSearch, onEndSearchInput, onClear } = this;
    const { isFetching } = this.props;
    return (
      <SafeAreaView style={{ backgroundColor: COLORS.blackColor }}>
        <ScreenHeader pageTitle="Contributors" navigation={navigation} style={styles.headerstyle} />
        <SearchList2
          onChangeText={updateSearch}
          onEndEditing={onEndSearchInput}
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
                iconName = 'three-dots-more-indicator';
                message = 'Admin';
              } else if (item.type === 'pending') {
                message = 'Invite pending';
                iconName = 'cancel-button';
              } else if (item.type === 'invite') {
                iconName = 'plus1';
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
                    <CustomIcon name={iconName} size={METRICS.fontSizeHuge} color={iconColor} />
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
              ? 'Do you want to remove this contributor?'
              : 'Do you want to leave this craftlist?'
          }
        />
      </SafeAreaView>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    updateOwnerId: (data) => dispatch(updateOwnerId(data)),
  };
}

function mapStateToProps(state) {
  const {
    searchUserResult,
    isFetching,
    contributionScreenResults,
    contributionKeys,
    user,
    craftPlaying,
    craftState,
    ownerId,
    editingCraftId,
  } = state;
  return {
    searchUserResult,
    isFetching,
    contributionScreenResults,
    contributionKeys,
    user,
    craftPlaying,
    craftState,
    ownerId,
    editingCraftId,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AddContributorScreen);

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
