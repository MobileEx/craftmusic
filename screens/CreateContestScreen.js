import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { withNavigation } from 'react-navigation';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DocumentPicker from 'react-native-document-picker';
import ImagePicker from 'react-native-image-crop-picker';
import _ from 'lodash';
import { connect, useStore } from 'react-redux';
import cropper from '../helpers/cropper';
import PlayingCraftService from '../services/PlayingCraftService';
import { COLORS, METRICS, STYLES } from '../global';
import { CustomIcon, BaseScreen, ScreenHeader, Button2, FileUpload } from '../components';
import {
  updateCraftPlaying,
  setPlayingCrafts,
  updateTitle,
  updatePrevState,
} from '../store/actions';
import store from '../store/configureStore';

const avatarImage = require('../assets/images/craft.png');

class CreateContestScreen extends BaseScreen {
  navbarHidden = true;

  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      title: '',
      descriptionText: '',
      fileModalVisible: false,
      orientation: 0,
      craftId: '',
      art_url: '',
      music_url: '',
      thumb_url: '',
      contest_url: '',
    };
  }

  componentDidMount() {
    // Create fresh craft
    PlayingCraftService.addNewCraft('5')
      .then((res) => {
        this.setState({
          toggle: true,
          craftId: res.data.craft_id,
        });
      })
      .catch((err) => {
        // console.log(err.response.data.error);
      });
  }

  handleUpdateDescription = (text) => {
    this.setState({ descriptionText: text });
  };

  showFileModal = (value) => {
    this.setState({
      fileModalVisible: value,
    });
  };

  setOrientation = (value) => {
    this.setState({ orientation: value });
  };

  setCraftMediaUrl = (type, url, name, orientation) => {
    PlayingCraftService.setCraftMedia(this.state.craftId, type, url, name, orientation).catch(
      (err) => {
        // console.log(err.response.data.error);
      }
    );
  };

  uploadFromLocal = (value) => {
    let type = 'square';
    this.setState({ fileType: value });
    const { orientation } = this.state;

    if (value) {
      ImagePicker.openPicker({
        mediaType: 'video',
      }).then(async (video) => {
        PlayingCraftService.uploadFile(video.path, video.mime, video.filename)
          .then((res) => {
            const file = res.data;
            this.setState({
              art_url: file.url,
            });
            this.setCraftMediaUrl('video', file.url, file.filename, orientation);
            this.showFileModal(false);
          })
          .catch((err) => {
            // console.log(err.response.data.error);
          });
      });
    } else {
      if (orientation === 1) type = 'portrait';
      if (orientation === 2) type = 'landscape';

      cropper(type).then((image) => {
        PlayingCraftService.uploadFile(image.path, image.mime, image.filename)
          .then((res) => {
            const file = res.data;
            this.setState({
              art_url: file.url,
              thumb_url: file.url,
            });
            this.setCraftMediaUrl('photo', file.url, file.filename, orientation);
            this.showFileModal(false);
          })
          .catch((err) => {
            // console.log(err.response.data.error);
          });
      });
    }
  };

  uploadFromCloud = (fileType = 'photo') => {
    // store DocumentPicker class type for file type
    let docType;
    const { orientation } = this.state;

    if (fileType === 'video') {
      docType = [DocumentPicker.types.video];
      this.setState({ fileType: 1 });
    } else if (fileType === 'audio') {
      docType = [DocumentPicker.types.audio];
    } else if (fileType === 'photo') {
      docType = [DocumentPicker.types.images];
      this.setState({ fileType: 0 });
    } else if (fileType === 'contest') {
      docType = [DocumentPicker.types.allFiles];
    }
    (async () => {
      // Pick a single file
      try {
        const res = await DocumentPicker.pick({
          type: docType,
        });
        PlayingCraftService.uploadFile(res.uri, res.type, res.name)
          .then((res) => {
            const file = res.data;
            if (fileType === 'photo') {
              this.setState({
                thumb_url: file.url,
              });
            }
            if (fileType === 'audio') {
              this.setState({
                music_url: file.url,
              });
            }
            if (fileType === 'video' || fileType === 'photo') {
              this.setState({
                art_url: file.url,
              });
            }
            if (fileType === 'contest') {
              this.setState({
                contest_url: file.url,
              });
            }
            this.setCraftMediaUrl(fileType, file.url, file.filename, orientation);
            this.showFileModal(false);
          })
          .catch((err) => {
            // console.log(err.response.data.error);
          });
      } catch (err) {
        if (DocumentPicker.isCancel(err)) {
          // User cancelled the picker, exit any dialogs or menus and move on
        } else {
          throw err;
        }
      }
    })();
  };

  onEditThumb = () => {
    cropper('square').then((image) => {
      this.setState({
        thumb_url: image.path,
      });
      PlayingCraftService.uploadFile(image.path, image.mime, image.filename)
        .then((res) => {
          const file = res.data;
          PlayingCraftService.setCraftThumbnail(this.state.craftId, file.url, file.filename);
          this.showFileModal(false);
        })
        .catch((err) => {
          // console.log(err.response.data.error);
        });
    });
  };

  onCreateContest = () => {
    PlayingCraftService.createContestCraft(
      this.state.craftId,
      this.state.title,
      this.state.descriptionText
    )
      .then((res) => {
        PlayingCraftService.getUserCraft(this.props.user.id)
          .then((res) => {
            this.props.setPlayingCrafts(res.data.all);
            this.props.updatePrevState(store.getState());
            this.props.updateTitle('Home');
            this.props.navigation.navigate('Home');
          })
          .catch((err) => {
            console.log(err.response.data.error);
          });
      })
      .catch((err) => {
        console.log(err.response.data.error);
      });
  };

  renderScreen() {
    const { navigation } = this.props;
    const {
      descriptionText,
      fileModalVisible,
      title,
      thumb_url,
      art_url,
      music_url,
      contest_url,
    } = this.state;

    return (
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        style={STYLES.contentWrapper}
      >
        <ScreenHeader
          navigation={navigation}
          pageTitle="Create Contest"
          saveChanges={this.saveChanges}
        />
        <View style={styles.row}>
          <Button2
            title={art_url ? 'File uploaded' : 'Add Art/Video'}
            style={styles.button}
            callback={() => this.showFileModal(true)}
          />
        </View>
        <View style={styles.row}>
          <Button2
            title={music_url ? 'File uploaded' : 'Add Music'}
            style={styles.button}
            callback={() => this.uploadFromCloud('audio')}
          />
        </View>
        <View style={styles.row}>
          <Button2
            title={contest_url ? 'File uploaded' : 'Contest File'}
            style={styles.button}
            callback={() => this.uploadFromCloud('contest')}
          />
        </View>
        <View style={styles.row}>
          <View style={styles.labelWrapper}>
            <Text style={styles.label}>Edit Thumbnail</Text>
          </View>
          <TouchableOpacity style={styles.avatarWrapper} onPress={this.onEditThumb}>
            <FastImage
              source={thumb_url ? { uri: thumb_url } : avatarImage}
              style={styles.avatar}
            />
            <View style={styles.editButton}>
              <CustomIcon
                name="plus-1"
                size={METRICS.fontSizeBiggest}
                style={styles.addImageIcon}
              />
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <View style={styles.labelWrapper}>
            <Text style={styles.label}>Title</Text>
          </View>
          <TextInput
            selectionColor={COLORS.primaryColor}
            keyboardAppearance="dark"
            style={styles.textInput}
            value={title}
            onChangeText={(text) => this.setState({ title: text })}
          />
        </View>
        <View style={styles.row}>
          <View style={styles.labelWrapper}>
            <Text style={styles.label}>Description</Text>
          </View>
          <TextInput
            selectionColor={COLORS.primaryColor}
            keyboardAppearance="dark"
            multiline
            style={styles.descriptionInput}
            value={descriptionText}
            onChangeText={this.handleUpdateDescription}
            maxLength={1000}
          />
        </View>
        <View style={styles.row}>
          <Button2
            title="Create Contest"
            style={styles.button}
            callback={() => this.onCreateContest()}
          />
        </View>
        <View style={{ paddingBottom: 60 * METRICS.ratioY }} />
        <FileUpload
          onClose={() => this.showFileModal(false)}
          status={fileModalVisible}
          onCloseRequest={() => this.showFileModal(false)}
          setOrientation={this.setOrientation}
          uploadFromLocal={this.uploadFromLocal}
          uploadFromCloud={this.uploadFromCloud}
        />
      </KeyboardAwareScrollView>
    );
  }
}

const styles = StyleSheet.create({
  contentWrapper: {
    paddingHorizontal: METRICS.spacingNormal,
    paddingVertical: METRICS.spacingSmall,
  },
  row: {
    padding: METRICS.spacingNormal,
  },
  labelWrapper: {
    marginBottom: METRICS.spacingBig,
  },
  label: {
    color: COLORS.primaryColor,
    fontSize: METRICS.fontSizeMedium,
    fontFamily: 'lato-bold',
    textAlign: 'center',
  },
  avatarWrapper: {
    position: 'relative',
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
  },
  avatar: {
    borderColor: COLORS.btnGrey,
    borderWidth: 1,
    width: 100 * METRICS.ratioX,
    height: 100 * METRICS.ratioX,
    resizeMode: 'cover',
    opacity: 0.5,
  },
  editButton: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15 * METRICS.ratioX,
    height: 30 * METRICS.ratioX,
    top: 35 * METRICS.ratioX,
  },
  addImageIcon: {
    color: COLORS.whiteColor,
  },
  textInput: {
    borderWidth: 1 * METRICS.ratioX,
    borderColor: COLORS.primaryColor,
    padding: METRICS.spacingTiny,
    minHeight: METRICS.rowHeightSmall,
    color: COLORS.whiteColor,
  },
  descriptionInput: {
    borderColor: COLORS.primaryColor,
    minHeight: 3 * METRICS.rowHeightBig,
    borderWidth: 1 * METRICS.ratioX,
    color: COLORS.whiteColor,
    padding: METRICS.spacingTiny,
    paddingBottom: METRICS.spacingBig,
  },
  button: {
    width: 140 * METRICS.ratioX,
    height: 40 * METRICS.ratioX,
    justifyContent: 'center',
    flexDirection: 'row',
  },
});

function mapDispatchToProps(dispatch) {
  return {
    setPlayingCrafts: (crafts) => dispatch(setPlayingCrafts(crafts)),
    updateCraftPlaying: (playing) => dispatch(updateCraftPlaying(playing)),
    updatePrevState: (playing) => dispatch(updatePrevState(playing)),
    updateTitle: (playing) => dispatch(updateTitle(playing)),
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

export default connect(mapStateToProps, mapDispatchToProps)(withNavigation(CreateContestScreen));
