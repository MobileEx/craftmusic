import React from 'react';
import { View, Text, TextInput, StyleSheet, FlatList } from 'react-native';
import FastImage from 'react-native-fast-image';
import Switch from 'react-native-switch-pro';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { connect } from 'react-redux';
import { CustomButton, CustomIcon, BaseScreen, ScreenHeader, ConfirmModal } from '../components';
import { COLORS, METRICS, STYLES } from '../global';
import { craftlistBg, user } from '../global/Images';
import ProfileService from '../services/ProfileService';
import CraftlistService from '../services/CraftlistService';
import cropper from '../helpers/cropper';
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
} from '../store/actions';
import store from '../store/configureStore';
import Env from '../helpers/environment';

class CraftInsideScreen extends BaseScreen {
  navbarHidden = true;

  constructor(props) {
    super(props);
    this.state = {
      image: '',
      craftlistId: 1,
      title: '',
      description: '',
      isPrivacy: true,
      contributors: [],
    };
  }

  static navigationOptions = {
    header: null,
  };

  componentDidMount() {
    this.setState(
      {
        craftlistId: this.props.craftlistId,
      },
      () => {
        this.getData();
      }
    );

    this.timer = setInterval(() => {
      if (this.state.craftlistId !== this.props.craftlistId) {
        this.setState(
          {
            craftlistId: this.props.craftlistId,
          },
          () => {
            this.getData();
          }
        );
      }
    }, 500);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.craftlistId != nextProps.craftlistId) {
      return {
        userId: nextProps.craftlistId,
      };
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.craftlistId !== this.props.craftlistId) {
      this.setState(
        {
          craftlistId: this.props.craftlistId,
        },
        () => {
          this.getData();
        }
      );
    }
    if (prevState.craftlistId !== this.state.craftlistId) {
      this.getData();
    }
  }

  getData = () => {
    CraftlistService.getCraftlist(this.props.craftlistId)
      .then((res) => {
        // console.log('craftlist inside screen--', res.data);
        this.setState({
          image: res.data.image,
          title: res.data.title,
          description: res.data.description,
          isPrivacy: res.data.isPrivacy,
          contributors: res.data.contributors,
        });
      })
      .catch((err) => {
        // console.log('error', this.props.craftlistId);
        // console.log(err.response);
        // console.log(err.response.data);
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

  onDeleteCraftlist = () => {
    CraftlistService.deleteCraftlist(this.state.craftlistId)
      .then((res) => {
        this.props.updateProfileUserId(store.getState());
        this.props.updateTitle(this.props.backScreen);
        this.props.navigation.navigate(this.props.backScreen);
        this.closeDeleteModal();
      })
      .catch((err) => {
        // console.log(err.response.data.error);
      });
  };

  onPrivacySwitch = () => {
    this.setState({
      isPrivacy: !this.state.isPrivacy,
    });
  };

  addContributor = () => {
    this.props.updateProfileUserId(store.getState());
    this.props.updateTitle('ContributorStack');
    this.props.navigation.navigate('ContributorStack', { craftlistId: this.state.craftlistId });
  };

  handleChoosePhoto = () => {
    const options = {
      noData: true,
    };
    cropper('square').then((image) => {
      ProfileService.uploadImage(image.path, image.filename, image.mime)
        .then((res) => {
          this.setState({ image: Env.S3URL + res.url });
          CraftlistService.saveImage(this.state.craftlistId, res.url, res.filename, res.filetype)
            .then((res) => {
              // console.log(res.data);
            })
            .catch((err) => {
              // console.log(err.response.data.error);
            });
        })
        .catch((err) => {
          // console.log(err.response.data.error);
        });
    });
  };

  blurTitle = () => {
    const { craftlistId, title } = this.state;
    CraftlistService.saveTitle(craftlistId, title)
      .then((res) => {
        // console.log(res.data);
      })
      .catch((err) => {
        // console.log(err.response.data.error);
      });
  };

  blurDescription = () => {
    const { craftlistId, description } = this.state;
    CraftlistService.saveDescription(craftlistId, description)
      .then((res) => {
        // console.log(res.data);
      })
      .catch((err) => {
        // console.log(err.response.data.error);
      });
  };

  gotoCraftlist = () => {
    this.props.updateCraftListId(this.state.craftlistId);
    this.props.updateProfileUserId(store.getState());
    this.props.updateTitle('Craftlist');
    this.props.navigation.navigate('Craftlist');
  };

  renderScreen() {
    const { navigation } = this.props;
    const { isPrivacy, image, contributors } = this.state;

    return (
      <KeyboardAwareScrollView style={STYLES.contentWrapper} keyboardShouldPersistTaps="handled">
        <ScreenHeader
          navigation={navigation}
          pageTitle="Edit Craftlist"
          saveChanges={this.saveChanges}
        />
        <View style={styles.row}>
          <View style={styles.labelWrapper}>
            <Text style={styles.label}>Image</Text>
          </View>
          <View style={styles.editWrapper}>
            <FastImage source={image ? { uri: image } : craftlistBg} style={styles.editImage} />
            <CustomButton
              title="Edit"
              style={styles.editButtom}
              clickHandler={() => this.handleChoosePhoto()}
            />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.labelWrapper}>
            <Text style={styles.label}>Title</Text>
          </View>
          <View>
            <TextInput
              selectionColor={COLORS.primaryColor}
              maxLength={60}
              keyboardAppearance="dark"
              style={styles.input}
              value={this.state.title}
              onChangeText={(text) => this.setState({ title: text })}
              onBlur={this.blurTitle}
            />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.labelWrapper}>
            <Text style={styles.label}>Description</Text>
          </View>
          <View>
            <TextInput
              selectionColor={COLORS.primaryColor}
              keyboardAppearance="dark"
              style={styles.input}
              value={this.state.description}
              onChangeText={(text) => this.setState({ description: text })}
              onBlur={this.blurDescription}
            />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.labelWrapper}>
            <Text style={styles.label}>Craftlist Privacy</Text>
          </View>
          <View>
            <Switch
              backgroundActive={COLORS.primaryColor}
              value={isPrivacy}
              onSyncPress={(res) => this.onPrivacySwitch()}
            />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.labelWrapper}>
            <Text style={styles.label}>Delete Craftlist</Text>
          </View>
          <View>
            <CustomButton
              title="Delete"
              style={styles.delete}
              clickHandler={() => this.onDelete()}
            />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.labelWrapper}>
            <Text style={styles.label}>Invite Contributors</Text>
          </View>
          <Text style={styles.invitedescribe}>
            Inviting contributors allows them to add and remove crafts in your Craftlist.
          </Text>
          <TouchableOpacity style={styles.addWrapper} onPress={this.addContributor}>
            <CustomIcon name="plus1" style={styles.addIcon} />
            <Text style={styles.textIcon}>Add Contributors</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.countWrapper}>
          <Text style={styles.label}>Contributors </Text>
          <Text style={styles.subLabel}>{contributors.length}</Text>
        </View>
        <FlatList
          style={styles.list}
          data={contributors}
          keyExtractor={(item) => item.index}
          renderItem={({ item, index }) => (
            // <TouchableOpacity>
            //   <FollowsItem item={item}>
            //     <CustomIcon name="cancel-button" style={styles.removeIcon} />
            //   </FollowsItem>
            // </TouchableOpacity>
            <View style={styles.item} key={index}>
              <FastImage source={item.avatar ? { uri: item.avatar } : user} style={styles.img} />
              <Text style={styles.nameLabel}>{item.username}</Text>
              <TouchableOpacity>
                <CustomIcon name="error" style={styles.iconRight} />
              </TouchableOpacity>
            </View>
          )}
        />
        <ConfirmModal
          visible={this.state.deleteModalVisible}
          onCloseRequest={this.setDeleteModalVisible}
          onCancel={this.closeDeleteModal}
          onConfirm={this.onDeleteCraftlist}
          message="Are you sure you want to delete this craftlist?"
        />
      </KeyboardAwareScrollView>
    );
  }
}

const styles = StyleSheet.create({
  labelWrapper: {
    marginBottom: METRICS.spacingBig,
  },
  countWrapper: {
    marginBottom: METRICS.spacingBig,
    marginTop: -METRICS.spacingBig,
    flexDirection: 'row',
  },
  label: {
    color: COLORS.primaryColor,
    fontSize: METRICS.fontSizeMedium,
    fontFamily: 'lato-bold',
  },
  invitedescribe: {
    color: COLORS.whiteColor,
    fontSize: METRICS.fontSizeNormal,
    fontFamily: 'lato',
  },
  subLabel: {
    color: COLORS.whiteColor,
    fontSize: METRICS.fontSizeNormal,
    fontFamily: 'lato',
  },
  editWrapper: {
    width: 114 * METRICS.ratioX,
    height: 114 * METRICS.ratioX,
    borderColor: COLORS.borderColor,
    borderWidth: 1 * METRICS.ratioX,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButtom: {
    fontSize: METRICS.fontSizeMedium,
    fontFamily: 'lato',
    backgroundColor: COLORS.blackColor,
    width: 70 * METRICS.ratioX,
  },
  editImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  input: {
    paddingBottom: METRICS.spacingTiny,
    borderBottomColor: COLORS.primaryColor,
    borderBottomWidth: 1 * METRICS.ratioX,
    color: COLORS.whiteColor,
    fontFamily: 'lato',
    fontSize: METRICS.fontSizeNormal,
  },
  row: {
    marginBottom: METRICS.spacingGiant,
  },
  addWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addIcon: {
    color: COLORS.primaryColor,
    fontSize: 30 * METRICS.ratioX,
    marginRight: METRICS.spacingNormal,
    paddingVertical: METRICS.spacingBig,
  },
  textIcon: {
    color: COLORS.whiteColor,
    fontSize: METRICS.fontSizeNormal,
    fontFamily: 'lato',
    paddingVertical: METRICS.spacingBig,
  },
  list: {
    marginLeft: -METRICS.spacingNormal,
    marginRight: -METRICS.spacingNormal,
  },
  removeIcon: {
    color: COLORS.whiteColor,
    fontSize: METRICS.fontSizeHuge,
  },
  delete: {
    fontSize: METRICS.fontSizeMedium,
    color: COLORS.primaryColor,
  },
  img: {
    height: METRICS.avatarsmall,
    width: METRICS.avatarsmall,
    borderRadius: 20 * METRICS.ratioX,
  },
  nameLabel: {
    fontFamily: 'Lato-Semibold',
    fontSize: METRICS.fontSizeNormal,
    color: COLORS.whiteColor,
  },
  item: {
    flexDirection: 'row',
    height: 55 * METRICS.ratioX,
    marginLeft: METRICS.marginNormal,
    marginRight: METRICS.marginNormal,
    alignItems: 'center',
    paddingVertical: METRICS.followspacing,
    justifyContent: 'space-between',
  },
  iconRight: {
    fontSize: METRICS.fontSizeHuge,
    color: COLORS.primaryColor,
  },
});

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

export default connect(mapStateToProps, mapDispatchToProps)(CraftInsideScreen);
