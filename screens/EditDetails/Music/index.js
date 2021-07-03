import React from 'react';
import {View, Text, TouchableOpacity, TextInput, StyleSheet, Alert, ActivityIndicator} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { withNavigation } from 'react-navigation';
import DocumentPicker from 'react-native-document-picker';
import _ from 'lodash';
import { useDispatch, connect } from 'react-redux';
import {
  BaseScreen,
  ScreenHeader,
  CircleCheck,
  Button2,
  SectionHeader,
  CustomCheck,
  CustomAccordion,
  CustomSwitch,
  CustomIcon,
  AudioUpload,
  GenreModal, Uploader,
} from '../../../components';
import { METRICS, COLORS, STYLES } from '../../../global';
import PlayingCraftService from '../../../services/PlayingCraftService';
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
  updateAddMusicMethod,
  updateUploadingProgress, uploadedItems,
} from '../../../store/actions';
import store from '../../../store/configureStore';
import Upload from "react-native-background-upload";

class MusicScreen extends BaseScreen {
  navbarHidden = true;

  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      addMusicMethod: '',
      lyricsText: '',
      musicTypes: [''],
      moods: [''],
      genre: [],
      explicitContent: true,
      craftId: 2,
      fileModalVisible: false,
      attach_url: '',
      genreModalVisible: false,
      genres_list: [],
      isFromAddCraft: this.props.navigation.state.params
        ? this.props.navigation.state.params.isFromAddCraft
        : 0,
      uploaderVisible: false,
      uploadedMusic: []
    };
  }
  componentWillUnmount() {
    // Remove the event listener
    this.focusListener.remove();
  }

  componentDidMount() {
    this.focusListener = this.props.navigation.addListener("didFocus", () => {
      const curid = this.props.editingCraftId;
      this.setState({ craftId: curid });
      this.props.updateAddMusicMethod('');
      PlayingCraftService.getCraft(curid)
        .then((res) => {
          const categories = res.data.music_categories;
          const musicTypes = [];
          const moods = [];
          const genre = [];
          let explicitContent;
          if (res.data.audio_url != null) {
            this.props.updateAddMusicMethod(res.data.music_data.type==='purchase' ? 'Purchased' : res.data.music_data.type==='uploaded' ? 'Upload' : 'Studio');
          }
          for (let i = 0; i < categories.length; i++) {
            if (categories[i].category === 'Music Type') {
              musicTypes.push(categories[i].type);
            }
            if (categories[i].category === 'Music Mood') {
              moods.push(categories[i].type);
            }
            if (categories[i].category === 'Genre') {
              genre.push(categories[i].type);
            }
            if (categories[i].category === 'Explicit') {
              explicitContent = false;
              if (categories[i].type === 'Yes') explicitContent = true;
            }
          }
          this.setState({
            musicTypes,
            moods,
            genre,
            explicitContent,
            lyricsText: res.data.lyrics ? res.data.lyrics : '',
          });
        })
        .catch((err) => {});
      PlayingCraftService.getGenre()
        .then((res) => {
          this.setState({
            genres_list: res.data,
          });
        })
        .catch((err) => {
          // console.log(err.response.data.error);
        });
    })
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.state.craftId !== this.props.editingCraftId) {
      const curid = this.props.editingCraftId;
      this.setState({ craftId: curid });
      this.props.updateAddMusicMethod('');
      PlayingCraftService.getCraft(curid)
        .then((res) => {
          const categories = res.data.music_categories;
          const musicTypes = [];
          const moods = [];
          const genre = [];
          let explicitContent;
          if (res.data.audio_url != null) {
            this.props.updateAddMusicMethod(res.data.music_data.type==='purchase' ? 'Purchased' : res.data.music_data.type==='uploaded' ? 'Upload' : 'Studio');
          }
          for (let i = 0; i < categories.length; i++) {
            if (categories[i].category === 'Music Type') {
              musicTypes.push(categories[i].type);
            }
            if (categories[i].category === 'Music Mood') {
              moods.push(categories[i].type);
            }
            if (categories[i].category === 'Genre') {
              genre.push(categories[i].type);
            }
            if (categories[i].category === 'Explicit') {
              explicitContent = false;
              if (categories[i].type === 'Yes') explicitContent = true;
            }
          }
          this.setState({
            musicTypes,
            moods,
            genre,
            explicitContent,
            lyricsText: res.data.lyrics ? res.data.lyrics : '',
          });
        })
        .catch((err) => {});
      PlayingCraftService.getGenre()
        .then((res) => {
          this.setState({
            genres_list: res.data,
          });
        })
        .catch((err) => {
          // console.log(err.response.data.error);
        });
    }
  }

  uploadingProgress = (data) => {
    data.craftId = this.state.craftId;
    data.uploadingArt = false;

    this.dispatchProgress(data);
  };

  dispatchProgress = (data) => {
    this.props.uploadingProgressSetter(data);
  };

  uploadFromCloud = () => {
    // store DocumentPicker class type for file type
    let docType;
    docType = [DocumentPicker.types.audio];
    (async () => {
      // Pick a single file
      try {
        const res = await DocumentPicker.pick({
          type: docType,
        });
        PlayingCraftService.uploadFile(
          res.uri,
          res.type,
          res.name,
          this.state.craftId,
          this.uploadingProgress,
        )
          .then((res) => {
            console.log('res', res)
            const file = res.data[0];

            console.log('file', file)

            this.props.uploadedItemsSetter({...file, craftId: this.state.craftId, uploadingArt: false });
            //this.setState({uploadedMusic: [...this.state.uploadedMusic, file]})
          })
          .catch((err) => {
            console.log(err);
          })

      } catch (err) {
        if (DocumentPicker.isCancel(err)) {
          // User cancelled the picker, exit any dialogs or menus and move on
        } else {
          throw err;
        }
      }
    })();
  };

  updateCraftData = () => {
    const { musicTypes, moods, genre, explicitContent, craftId } = this.state;
    const categories = [...musicTypes, ...moods, ...genre];
    categories.push(explicitContent ? 'Yes' : 'No');
    PlayingCraftService.setMusicCategories(craftId, categories).then((res) => {});
  };

  handleUpdateLyrics = (text) => {
    this.setState({ lyricsText: text });
  };

  showUploader = (value) => {
    this.setState({
      uploaderVisible: value,
    });
  };

  setUploadMusicMethod = (addMusicMethod) => {
    if (addMusicMethod === 'Upload') {
      this.showUploader(true);
    } else if (addMusicMethod === 'Studio') {
      this.openStudio();
    } else if (addMusicMethod === 'Purchased') {
      this.openPurchased();
    }
    this.setState({ addMusicMethod });
  };

  openPurchased = () => {
    this.props.navigation.navigate('AddPurchases', { isFromMusic: true, craftId: this.state.craftId });
  };

  openStudio = () => {
    if (this.state.isFromAddCraft === 1) {
      this.props.updatePrevState(store.getState());
      this.props.navigation.navigate('Studio', { isFromAddCover: 1 });
      this.props.updateAddMusicMethod('Studio');
    } else {
      console.log('Upload already added data in studio');
    }
  };

  createNewStudio = () => {
    let studioId = this.props.navigation.getParam('studioId');
    if (!studioId) {
      studioId = null;
    }
    PlayingCraftService.joinStudioCraft(studioId, this.state.craftId).then((res) => {});
  };

  uploadStudioContent = (addMusicMethod) => {
    this.props.updateAddMusicMethod(addMusicMethod);
    this.setState({ addMusicMethod });
    this.createNewStudio();
  };

  showFileModal = (value) => {
    this.uploadFromCloud();
  };

  setMusicType = (musicType) => {
    const { musicTypes } = this.state;

    if (musicTypes.includes(musicType)) {
      musicTypes.splice(musicTypes.indexOf(musicType), 1);
    } else {
      musicTypes.push(musicType);
    }
    this.setState({ musicTypes }, () => {
      this.updateCraftData();
    });
  };

  onSubmitLyrics = () => {
    PlayingCraftService.setLyrics(this.state.craftId, this.state.lyricsText).then((res) => {});
  };

  setMood = (mood) => {
    const { moods } = this.state;

    if (moods.includes(mood)) {
      moods.splice(moods.indexOf(mood), 1);
    } else {
      moods.push(mood);
    }
    this.setState({ moods }, () => {
      this.updateCraftData();
    });
  };

  setGenre = (val) => {
    const { genre } = this.state;

    if (genre.includes(val)) {
      genre.splice(genre.indexOf(val), 1);
    } else {
      genre.push(val);
    }
    this.setState({ genre }, () => {
      this.updateCraftData();
    });
  };

  updateExplicitSwitch = (fieldName, value) => {
    this.setState((preState) => {
      const newState = preState;
      newState[fieldName] = value;
      this.setState({ explicitContent: value }, () => {
        this.updateCraftData();
      });
      return newState;
    });
  };

  setCraftMediaUrl = (type, url, name) => {
    PlayingCraftService.setCraftMedia(this.state.craftId, type, url, name)
      .then((res) => { console.log(res)})
      .catch((err) => {
        console.log(err)
        // console.log(err.response.data.error);
      });
  };

  setGenreModalVisible = (value) => {
    this.setState({
      genreModalVisible: value,
    });
  };

  onPressBack = (navigation) => {
    navigation.state.params.openModal();
    this.onSubmitLyrics();
  };

  renderUploadingItem = (item, index) => (
    <View style={{ flexDirection: 'row', alignItems: 'center' }} key={index}>
      <ActivityIndicator size="small" color={COLORS.purpleColor} />
      <Text
        style={[
          STYLES.mediumText,
          {
            paddingVertical: METRICS.spacingSmall,
            marginLeft: METRICS.spacingNormal,
          },
          {
            color: COLORS.primaryColor,
          },
        ]}
      >
        {`Uploading ${item.progress.toFixed(2)}%`}
      </Text>

      <TouchableOpacity
        onPress={() => {
          Upload.cancelUpload(item.id);
          this.dispatchProgress({
            ...item,
            progress: 100,
          });
        }}
      >
        <CustomIcon name="cancel-button" style={styles.icon2} />
      </TouchableOpacity>
    </View>
  );

  renderScreen() {
    const { navigation } = this.props;
    const { musicTypes, lyricsText, moods, fileModalVisible, uploaderVisible } = this.state;

    return (
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.container}
      >
        <ScreenHeader
          pageTitle="Music"
          navigation={navigation}
          backAction={() => this.onPressBack(navigation)}
        />
        <View style={styles.titleWrapper}>
          <Text
            style={[
              STYLES.mediumText,
              { marginTop: METRICS.spacingNormal, marginBottom: METRICS.spacingTiny },
            ]}
          >
            Choose Music
          </Text>
          <Text style={[STYLES.normalText, { color: COLORS.lightGrey }]}>
            Note: Upload a tagged file for display if you are selling your music.
          </Text>
        </View>
        <View style={styles.contentWrapper}>
          <TouchableOpacity style={styles.checkItemWrapper}>
            <CircleCheck
              value={this.props.addMusicMethod === 'Upload'}
              clickHandler={() => this.setUploadMusicMethod('Upload')}
            />
            <Button2
              title={this.props.addMusicMethod === 'Upload' ? 'File uploaded' : 'Upload'}
              style={styles.button}
              callback={() => this.setUploadMusicMethod('Upload')}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.checkItemWrapper}
            onPress={() => this.setUploadMusicMethod('Studio')}
          >
            <CircleCheck
              value={this.props.addMusicMethod === 'Studio'}
              clickHandler={() => this.uploadStudioContent('Studio')}
            />
            <Button2
              title="Studio"
              style={styles.button}
              callback={() => this.setUploadMusicMethod('Studio')}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.checkItemWrapper}
            onPress={() => this.setUploadMusicMethod('Purchased')}
          >
            <CircleCheck
              value={this.props.addMusicMethod === 'Purchased'}
              clickHandler={() => this.setUploadMusicMethod('Purchased')}
            />
            <Button2
              title="Purchased"
              style={styles.button}
              callback={() => this.setUploadMusicMethod('Purchased')}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.checkItemWrapper}>
            <CustomIcon name="search" style={styles.searchIcon} />
            <Text
              style={[
                STYLES.normalText,
                { color: COLORS.lightGrey, fontFamily: 'lato', fontSize: METRICS.fontSizeOK },
              ]}
            >
              Browse Store
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.contentWrapper}>
          <View style={styles.section}>
            <SectionHeader title="Music Categories" primary={false} />
            <CustomAccordion primary isOpen title="Music Type">
              <View style={styles.collapseBody}>
                <View style={styles.checkItem}>
                  <CustomCheck
                    value={musicTypes.includes('Instrumental')}
                    clickHandler={() => this.setMusicType('Instrumental')}
                  />
                  <TouchableOpacity onPress={() => this.setMusicType('Instrumental')}>
                    <Text style={{ ...STYLES.normalText, ...styles.checkTitle }}>Instrumental</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.checkItem}>
                  <CustomCheck
                    value={musicTypes.includes('Instrumental + vocal')}
                    clickHandler={() => this.setMusicType('Instrumental + vocal')}
                  />
                  <TouchableOpacity onPress={() => this.setMusicType('Instrumental + vocal')}>
                    <Text style={{ ...STYLES.normalText, ...styles.checkTitle }}>
                      Instrumental + Vocal
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.checkItem}>
                  <CustomCheck
                    value={musicTypes.includes('Acapella')}
                    clickHandler={() => this.setMusicType('Acapella')}
                  />
                  <TouchableOpacity onPress={() => this.setMusicType('Acapella')}>
                    <Text style={{ ...STYLES.normalText, ...styles.checkTitle }}>Acapella</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.checkItem}>
                  <CustomCheck
                    value={musicTypes.includes('Sample')}
                    clickHandler={() => this.setMusicType('Sample')}
                  />
                  <TouchableOpacity onPress={() => this.setMusicType('Sample')}>
                    <Text style={{ ...STYLES.normalText, ...styles.checkTitle }}>Sample Pack</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.checkItem}>
                  <CustomCheck
                    value={musicTypes.includes('Podcast')}
                    clickHandler={() => this.setMusicType('Podcast')}
                  />
                  <TouchableOpacity onPress={() => this.setMusicType('Podcast')}>
                    <Text style={{ ...STYLES.normalText, ...styles.checkTitle }}>Podcast</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </CustomAccordion>
            <CustomAccordion primary isOpen title="Genre">
              <View style={styles.collapseBody}>
                <View style={styles.checkItem}>
                  <Button2
                    title="Choose Genre"
                    style={styles.button}
                    callback={() => this.setGenreModalVisible(true)}
                  />
                </View>
              </View>
            </CustomAccordion>
            <CustomAccordion primary isOpen title="BPM">
              <View style={[styles.collapseBody, STYLES.horizontalAlign]}>
                <Button2 title="Detect BPM" style={styles.button} />
                <Button2 status={3} title="110 BPM" style={styles.button} />
              </View>
            </CustomAccordion>
            <CustomAccordion primary isOpen title="Mood">
              <View style={styles.collapseBody}>
                <View style={styles.checkItem}>
                  <CustomCheck
                    value={moods.includes('Happy')}
                    clickHandler={() => this.setMood('Happy')}
                  />
                  <TouchableOpacity onPress={() => this.setMood('Happy')}>
                    <Text style={{ ...STYLES.normalText, ...styles.checkTitle }}>Happy</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.checkItem}>
                  <CustomCheck
                    value={moods.includes('Sad')}
                    clickHandler={() => this.setMood('Sad')}
                  />
                  <TouchableOpacity onPress={() => this.setMood('Sad')}>
                    <Text style={{ ...STYLES.normalText, ...styles.checkTitle }}>Sad</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.checkItem}>
                  <CustomCheck
                    value={moods.includes('Angry')}
                    clickHandler={() => this.setMood('Angry')}
                  />
                  <TouchableOpacity onPress={() => this.setMood('Angry')}>
                    <Text style={{ ...STYLES.normalText, ...styles.checkTitle }}>Angry</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.checkItem}>
                  <CustomCheck
                    value={moods.includes('Upbeat')}
                    clickHandler={() => this.setMood('Upbeat')}
                  />
                  <TouchableOpacity onPress={() => this.setMood('Upbeat')}>
                    <Text style={{ ...STYLES.normalText, ...styles.checkTitle }}>Upbeat</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.checkItem}>
                  <CustomCheck
                    value={moods.includes('Calm')}
                    clickHandler={() => this.setMood('Calm')}
                  />
                  <TouchableOpacity onPress={() => this.setMood('Calm')}>
                    <Text style={{ ...STYLES.normalText, ...styles.checkTitle }}>Calm</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </CustomAccordion>
            <View style={STYLES.horizontalAlign}>
              <CustomSwitch
                primary
                value={this.state.explicitContent}
                title="Explicit"
                fieldName="explicit"
                swipeHandler={this.updateExplicitSwitch}
              />
            </View>
            <CustomAccordion primary isOpen title="Lyrics">
              <View style={styles.collapseBody}>
                <TextInput
                  selectionColor={COLORS.primaryColor}
                  keyboardAppearance="dark"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoCompleteType="off"
                  multiline
                  style={styles.lyricsInput}
                  value={lyricsText}
                  onChangeText={this.handleUpdateLyrics}
                  maxLength={500}
                  onBlur={this.onSubmitLyrics}
                />
                <Text
                  style={[STYLES.smallText, styles.lyricsLengthCounter]}
                >{`${lyricsText.length}/500`}</Text>
              </View>
            </CustomAccordion>
          </View>
        </View>
        <AudioUpload
          onClose={() => this.showFileModal(false)}
          status={fileModalVisible}
          onCloseRequest={() => this.showFileModal(false)}
          uploadFromLocal={this.uploadFromLocal}
          uploadFromCloud={this.uploadFromCloud}
        />
        <GenreModal
          onClose={() => this.setGenreModalVisible(false)}
          onCloseRequest={() => this.setGenreModalVisible(false)}
          genrelist={this.state.genres_list}
          data={this.state.genre}
          setGenre={this.setGenre}
          status={this.state.genreModalVisible}
        />

        <Uploader
          onClose={() => this.showUploader(false)}
          status={uploaderVisible}
          onCloseRequest={() => this.showUploader(false)}
          onShowFileModal={this.onShowFileModal}
          storeType={'Music'}
          mainFile={true}
          onFilePress={(files)=>{
            this.showUploader(false)
            let file = files[0];
            this.props.updateAddMusicMethod('Upload');
            this.setState({
              attach_url: file.url,
            });
            this.setCraftMediaUrl('audio', file.url, file.filename);
          }}
          onUploadMusic={() => {
            this.showFileModal(true);
          }}
          uploadedMusic={this.state.uploadedMusic}
          deleteMusic={(index)=>{
            const {uploadedMusic} = this.state;

            uploadedMusic.splice(index, 1);
            this.setState({uploadedMusic})
          }}
          uploadingProgress={this.props.uploadingProgress.filter(item => item.craftId===this.state.craftId)}
          renderUploadingItem={this.renderUploadingItem}
          uploadedGlobal={this.props.uploadedItems.filter(item => item.craftId===this.state.craftId)}
        />
      </KeyboardAwareScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: METRICS.spaceNormal,
    paddingRight: METRICS.spaceNormal,
  },
  titleWrapper: {
    alignItems: 'center',
    paddingHorizontal: METRICS.spacingSmall,
  },
  contentWrapper: {
    paddingHorizontal: METRICS.spacingBig,
    paddingVertical: METRICS.spacingSmall,
  },
  checkItemWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: METRICS.spacingSmall,
  },
  button: {
    width: 140 * METRICS.ratioX,
    marginLeft: 20 * METRICS.ratioX,
  },
  section: {
    marginBottom: 30 * METRICS.ratioY,
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
  collapseBody: {
    position: 'relative',
    paddingVertical: METRICS.marginSmallY,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    height: METRICS.rowHeight,
  },
  checkBox: {},
  checkTitle: {
    marginLeft: METRICS.spacingTiny,
  },
  swatchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: METRICS.spacingSmall,
  },
  removableItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    height: METRICS.rowHeight,
  },
  removableItemText: {
    marginLeft: METRICS.marginNormal,
  },
  swatchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 70,
  },
  swatchCircle: {
    width: 40 * METRICS.ratioX,
    height: 40 * METRICS.ratioX,
    borderRadius: 20 * METRICS.ratioX,
    overflow: 'hidden',
  },
  lyricsInput: {
    borderColor: COLORS.primaryColor,
    minHeight: 3 * METRICS.rowHeightBig,
    borderWidth: 1,
    color: COLORS.whiteColor,
    padding: METRICS.spacingTiny,
    paddingBottom: METRICS.spacingBig,
  },
  lyricsLengthCounter: {
    position: 'absolute',
    left: METRICS.marginSmall,
    bottom: 2 * METRICS.marginSmall,
  },
  searchIcon: {
    fontSize: METRICS.fontSizeBig,
    color: COLORS.lightGrey,
    marginLeft: 1.25 * METRICS.spacingGiant,
    marginRight: METRICS.spacingSmall,
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
    updateAddMusicMethod: (data) => dispatch(updateAddMusicMethod(data)),
    uploadingProgressSetter: (data) => dispatch(updateUploadingProgress(data)),
    uploadedItemsSetter: (data) => dispatch(uploadedItems(data)),
  };
}

function mapStateToProps(state) {
  return {
    uploadingProgress: state.uploadingProgress,
    user: state.user,
    craftPlaying: state.craftPlaying,
    prevState: state.prevState,
    playingCrafts: state.playingCrafts,
    profileUserId: state.profileUserId,
    backScreen: state.backScreen,
    editingCraftId: state.editingCraftId,
    title: state.title,
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
    uploadedItems: state.uploadedItems,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withNavigation(MusicScreen));
