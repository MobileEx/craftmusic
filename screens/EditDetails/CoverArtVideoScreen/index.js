import React from 'react';
import {ScrollView, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator} from 'react-native';
import { withNavigation } from 'react-navigation';
import FastImage from 'react-native-fast-image';
import DocumentPicker from 'react-native-document-picker';
import ImagePicker from 'react-native-image-crop-picker';
import _ from 'lodash';
import { useDispatch, connect, useStore } from 'react-redux';
import {
  BaseScreen,
  ScreenHeader,
  CircleCheck,
  Button2,
  SectionHeader,
  CustomIcon,
  CustomCheck,
  CustomAccordion,
  CustomSwitch,
  FileUpload, Uploader,
} from '../../../components';
import { METRICS, COLORS, STYLES } from '../../../global';
import cropper from '../../../helpers/cropper';
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
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";

const avatarImage = require('../../../assets/images/craft.png');

class CoverArtVideo extends BaseScreen {
  navbarHidden = true;

  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      addMusicMethod: '',
      artTypes: [],
      subject: [],
      moods: [],
      colorOptions: [],
      attach_url: '',
      thumb_url: '',
      explicitContent: true,
      craftId: 2,
      fileModalVisible: false,
      orientation: 0,
      fileType: 0, // 0: image, 1: video
      isFromAddCraft: this.props.navigation.state.params
        ? this.props.navigation.state.params.isFromAddCraft
        : 0,
      uploaderVisible: false,
      uploadedItems: []
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
          const categories = res.data.art_categories;
          const artTypes = [];
          const subject = [];
          const moods = [];
          const colorOptions = [];
          let explicitContent;
          if (res.data.video_url != null || res.data.photo_url != null) {
            this.props.updateAddMusicMethod(res.data.cover_data.type==='purchase' ? 'Purchased' : res.data.cover_data.type==='uploaded' ? 'Upload' : 'Studio');
          }
          for (let i = 0; i < categories.length; i++) {
            if (categories[i].category === 'Art Type') {
              artTypes.push(categories[i].type);
            }
            if (categories[i].category === 'Art Subject') {
              subject.push(categories[i].type);
            }
            if (categories[i].category === 'Art Colors') {
              colorOptions.push(categories[i].type);
            }
            if (categories[i].category === 'Art Mood') {
              moods.push(categories[i].type);
            }
            if (categories[i].category === 'Explicit') {
              explicitContent = false;
              if (categories[i].type === 'Yes') explicitContent = true;
            }
          }
          // console.log("thumb: ",res.data.thumbnail_url);
          this.setState({
            artTypes,
            moods,
            colorOptions,
            subject,
            explicitContent,
            thumb_url: res.data.thumbnail_url,
          });
        })
        .catch((err) => {});
    })

  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.state.craftId !== this.props.editingCraftId) {
      const curid = this.props.editingCraftId;
      this.setState({ craftId: curid });
      this.props.updateAddMusicMethod('');
      PlayingCraftService.getCraft(curid)
        .then((res) => {
          console.log('ReceiveData: ', res.data);
          const categories = res.data.art_categories;
          const artTypes = [];
          const subject = [];
          const moods = [];
          const colorOptions = [];
          let explicitContent;
          if (res.data.video_url != null || res.data.photo_url != null) {
            this.props.updateAddMusicMethod(res.data.cover_data.type==='purchase' ? 'Purchased' : res.data.cover_data.type==='uploaded' ? 'Upload' : 'Studio');
          }
          for (let i = 0; i < categories.length; i++) {
            if (categories[i].category === 'Art Type') {
              artTypes.push(categories[i].type);
            }
            if (categories[i].category === 'Art Subject') {
              subject.push(categories[i].type);
            }
            if (categories[i].category === 'Art Colors') {
              colorOptions.push(categories[i].type);
            }
            if (categories[i].category === 'Art Mood') {
              moods.push(categories[i].type);
            }
            if (categories[i].category === 'Explicit') {
              explicitContent = false;
              if (categories[i].type === 'Yes') explicitContent = true;
            }
          }
          // console.log("thumb: ",res.data.thumbnail_url);
          this.setState({
            artTypes,
            moods,
            colorOptions,
            subject,
            explicitContent,
            thumb_url: res.data.thumbnail_url,
          });
        })
        .catch((err) => {});
    }
  }

  uploadingProgress = (data) => {
    data.craftId = this.state.craftId;
    data.uploadingArt = false;

    this.dispatchProgress(data);
    if(!this.state.uploaderVisible)
      setTimeout(()=>this.showUploader(true), 500)
  };

  dispatchProgress = (data) => {
    this.props.uploadingProgressSetter(data);
  };

  showUploader = (value) => {
    this.setState({
      uploaderVisible: value,
    });
  };

  setUploadMusicMethod = (addMusicMethod) => {
    if (addMusicMethod === 'Upload') {
      this.showUploader(true);
      //this.showFileModal(true);
    } else if (addMusicMethod === 'Studio') {
      this.openStudio();
    } else if (addMusicMethod === 'Purchased') {
      this.openPurchased();
    }
    this.setState({ addMusicMethod });
  };

  openPurchased = () => {
    this.props.navigation.navigate('AddPurchases', { isFromArt: true, craftId: this.state.craftId });
  };

  openStudio = () => {
    if (this.state.isFromAddCraft === 1) {
      this.props.updatePrevState(store.getState());
      this.props.updateTitle('Studip');
      this.props.navigation.navigate('Studio', { isFromAddCover: 1 });
      this.props.updateAddMusicMethod('Studio');
    } else {
      console.log('Upload already added data in studio');
    }
  };

  uploadStudioContent = (addMusicMethod) => {
    this.props.updateAddMusicMethod(addMusicMethod);
    this.setState({ addMusicMethod });
  };

  setArtTypes = (artType) => {
    const { artTypes } = this.state;

    if (artTypes.includes(artType)) {
      artTypes.splice(artTypes.indexOf(artType), 1);
    } else {
      artTypes.push(artType);
    }
    this.setState({ artTypes }, () => {
      this.updateCraftData();
    });
  };

  updateCraftData = () => {
    const { artTypes, subject, colorOptions, moods, explicitContent, craftId } = this.state;
    const categories = [...artTypes, ...subject, ...colorOptions, ...moods];
    categories.push(explicitContent ? 'Yes' : 'No');
    PlayingCraftService.setArtCategories(craftId, categories).then((res) => {
      // console.log(res);
    });
  };

  uploadFromLocal = (value) => {
    let type = 'square';
    this.setState({ fileType: value });
    const { orientation } = this.state;

    if (value) {
      ImagePicker.openPicker({
        mediaType: 'video',
      }).then(async (video) => {
        // console.log(video);
        const croppedRes = video.sourceURL;
        // console.log(croppedRes);
        PlayingCraftService.uploadFile(
          image.path,
          image.mime,
          image.filename,
          this.state.craftId,
          this.uploadingProgress,
        )
          .then((res) => {
            console.log('res', res)
            const file = res.data[0];

            console.log('file', file)
            this.props.uploadedItemsSetter({...file, craftId: this.state.craftId, uploadingArt: true });
            //this.setState({uploadedItems: [...this.state.uploadedItems, file]})
          })
          .catch((err) => {
            console.log(err);
          })
      });
    } else {
      if (orientation === 1) type = 'portrait';
      if (orientation === 2) type = 'landscape';
      cropper(type).then((image) => {
        this.showFileModal(false);
        // console.log(image);
        PlayingCraftService.uploadFile(
          image.path,
          image.mime,
          image.filename,
          this.state.craftId,
          this.uploadingProgress,
        )
          .then((res) => {
            console.log('res', res)
            const file = res.data[0];

            console.log('file', file)
            this.props.uploadedItemsSetter({...file, craftId: this.state.craftId, uploadingArt: true });
            //this.setState({uploadedItems: [...this.state.uploadedItems, file]})
          })
          .catch((err) => {
            console.log(err);
          })
      });
    }
  };

  uploadCraftUrl = () => {};

  setCraftMediaUrl = (type, url, name, orientation) => {
    // console.log("Function: setCraftMediaUrl");
    // console.log(url);
    if(type==='image'){
      this.setState({
        thumb_url: url,
      });
      this.setCraftMediaUrl('thumb', url, name, orientation);
    }
    PlayingCraftService.setCraftMedia(this.state.craftId, type, url, name, orientation)
      .then((res) => {
        // console.log(res.data);
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  uploadFromCloud = (fileType = 'photo') => {
    // store DocumentPicker class type for file type
    let docType;
    const { orientation } = this.state;

    this.showFileModal(false)

    if (fileType === 'video') {
      docType = [DocumentPicker.types.video];
      this.setState({ fileType: 1 });
    } else if (fileType === 'audio') {
      docType = [DocumentPicker.types.audio];
    } else if (fileType === 'photo') {
      docType = [DocumentPicker.types.images];
      this.setState({ fileType: 0 });
    } else {
      return;
    }
    (async () => {
      // Pick a single file
      try {
        const res = await DocumentPicker.pick({
          type: docType,
        });
        // console.log(res);
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
            this.props.uploadedItemsSetter({...file, craftId: this.state.craftId, uploadingArt: true });
            //this.setState({uploadedItems: [...this.state.uploadedItems, file]})
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

  setSubject = (value) => {
    const { subject } = this.state;

    if (subject.includes(value)) {
      subject.splice(subject.indexOf(value), 1);
    } else {
      subject.push(value);
    }
    this.setState({ subject }, () => {
      this.updateCraftData();
    });
  };

  setMoods = (mood) => {
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

  setColorOptions = (option) => {
    const { colorOptions } = this.state;

    if (colorOptions.includes(option)) {
      colorOptions.splice(colorOptions.indexOf(option), 1);
    } else {
      colorOptions.push(option);
    }
    this.setState({ colorOptions }, () => {
      this.updateCraftData();
    });
  };

  onRemoveFile = () => {
    this.setState({
      attach_url: false,
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

  showFileModal = (value) => {
    this.setState({
      fileModalVisible: value,
    });
  };

  setOrientation = (value) => {
    this.setState({ orientation: value });
  };

  onEditThumb = () => {
    cropper('square').then((image) => {
      this.showFileModal(false);
      this.setState({
        thumb_url: image.path,
      });
      PlayingCraftService.uploadFile(
        image.path,
        image.mime,
        image.filename,
        this.state.craftId,
        this.uploadingProgress,
      )
        .then((res) => {
          const file = res.data[0];

          this.props.uploadedItemsSetter({...file, craftId: this.state.craftId, uploadingArt: true });
          //this.setState({uploadedItems: [...this.state.uploadedItems, file]});

          this.setCraftMediaUrl('thumb', file.url, file.filename, this.state.orientation);
          this.showFileModal(false);
        })
        .catch((err) => {
          console.log(err);
        });
    });
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
    const {
      addMusicMethod,
      artTypes,
      moods,
      subject,
      colorOptions,
      attach_url,
      fileModalVisible,
      thumb_url,
      fileType,
      uploaderVisible
    } = this.state;

    console.log('render addMusicMethod = ', this.props.addMusicMethod);

    return (
      <ScrollView contentContainerStyle={styles.container}>
        <ScreenHeader
          pageTitle="Cover Art/Video"
          navigation={navigation}
          backAction={() => navigation.state.params.openModal()}
        />
        <View style={styles.titleWrapper}>
          <Text
            style={[
              STYLES.mediumText,
              { marginTop: METRICS.spacingNormal, marginBottom: METRICS.spacingTiny },
            ]}
          >
            Choose Cover Art/Video
          </Text>
          <Text
            style={[
              STYLES.normalText,
              { color: COLORS.lightGrey, fontFamily: 'lato', fontSize: METRICS.fontSizeOK },
            ]}
          >
            Note: Upload a watermarked file for display if you are selling your artwork.
          </Text>
        </View>
        <View style={styles.contentWrapper}>
          <TouchableOpacity
            style={styles.checkItemWrapper}
            onPress={() => this.setUploadMusicMethod('Upload')}
          >
            <CircleCheck
              value={this.props.addMusicMethod === 'Upload'}
              clickHandler={() => this.setUploadMusicMethod('Upload')}
            />
            <Button2
              title={this.props.addMusicMethod === 'Upload' ? 'File uploaded' : 'Upload'}
              style={styles.button}
              callback={() => this.setUploadMusicMethod('Upload')}
            />

            {/* {attach_url?
            <TouchableOpacity style={styles.attachWrapper} onPress={this.onRemoveFile}>
              <Image source={{uri: attach_url}} style={styles.avatar} />
              <View style={styles.editButton}>
                <CustomIcon
                  name="close"
                  size={METRICS.fontSizeBiggest}
                  style={styles.addImageIcon}
                />
              </View>
            </TouchableOpacity>:<Button2 title="Upload" style={styles.button} callback={this.pressUpload} />} */}
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
            <SectionHeader title="Edit Thumbnail" primary={false} />
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

          <View style={styles.section}>
            <SectionHeader title="Art Categories" primary={false} />
            <CustomAccordion primary isOpen title="Art Type">
              <View style={styles.collapseBody}>
                <View style={styles.checkItem}>
                  <CustomCheck
                    value={artTypes.includes('Video')}
                    clickHandler={() => this.setArtTypes('Video')}
                  />
                  <TouchableOpacity onPress={() => this.setArtTypes('Video')}>
                    <Text style={{ ...STYLES.normalText, ...styles.checkTitle }}>Video</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.checkItem}>
                  <CustomCheck
                    value={artTypes.includes('Photo')}
                    clickHandler={() => this.setArtTypes('Photo')}
                  />
                  <TouchableOpacity onPress={() => this.setArtTypes('Photo')}>
                    <Text style={{ ...STYLES.normalText, ...styles.checkTitle }}>Photo</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </CustomAccordion>
            <CustomAccordion primary isOpen title="Subject">
              <View style={styles.collapseBody}>
                <View style={styles.checkItem}>
                  <CustomCheck
                    value={subject.includes('People')}
                    clickHandler={() => this.setSubject('People')}
                  />
                  <TouchableOpacity onPress={() => this.setSubject('People')}>
                    <Text style={{ ...STYLES.normalText, ...styles.checkTitle }}>People</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.checkItem}>
                  <CustomCheck
                    value={subject.includes('Animals')}
                    clickHandler={() => this.setSubject('Animals')}
                  />
                  <TouchableOpacity onPress={() => this.setSubject('Animals')}>
                    <Text style={{ ...STYLES.normalText, ...styles.checkTitle }}>Animals</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.checkItem}>
                  <CustomCheck
                    value={subject.includes('Objects')}
                    clickHandler={() => this.setSubject('Objects')}
                  />
                  <TouchableOpacity onPress={() => this.setSubject('Objects')}>
                    <Text style={{ ...STYLES.normalText, ...styles.checkTitle }}>Objects</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.checkItem}>
                  <CustomCheck
                    value={subject.includes('Nature')}
                    clickHandler={() => this.setSubject('Nature')}
                  />
                  <TouchableOpacity onPress={() => this.setSubject('Nature')}>
                    <Text style={{ ...STYLES.normalText, ...styles.checkTitle }}>Nature</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.checkItem}>
                  <CustomCheck
                    value={subject.includes('Abstract')}
                    clickHandler={() => this.setSubject('Abstract')}
                  />
                  <TouchableOpacity onPress={() => this.setSubject('Abstract')}>
                    <Text style={{ ...STYLES.normalText, ...styles.checkTitle }}>Abstract</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </CustomAccordion>
            <CustomAccordion primary isOpen title="Colors">
              <View style={styles.collapseBody}>
                <View style={styles.swatchRow}>
                  <View style={styles.swatchItem}>
                    <CustomCheck
                      value={colorOptions.includes('red')}
                      clickHandler={() => this.setColorOptions('red')}
                    />
                    <TouchableOpacity onPress={() => this.setColorOptions('red')}>
                      <View style={[styles.swatchCircle, { backgroundColor: COLORS.redColor }]} />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.swatchItem}>
                    <CustomCheck
                      value={colorOptions.includes('teal')}
                      clickHandler={() => this.setColorOptions('teal')}
                    />
                    <TouchableOpacity onPress={() => this.setColorOptions('teal')}>
                      <View style={[styles.swatchCircle, { backgroundColor: COLORS.tealColor }]} />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.swatchItem}>
                    <CustomCheck
                      value={colorOptions.includes('black')}
                      clickHandler={() => this.setColorOptions('black')}
                    />
                    <TouchableOpacity onPress={() => this.setColorOptions('black')}>
                      <View style={[styles.swatchCircle, { backgroundColor: COLORS.blackColor }]} />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.swatchRow}>
                  <View style={styles.swatchItem}>
                    <CustomCheck
                      value={colorOptions.includes('orange')}
                      clickHandler={() => this.setColorOptions('orange')}
                    />
                    <TouchableOpacity onPress={() => this.setColorOptions('orange')}>
                      <View
                        style={[styles.swatchCircle, { backgroundColor: COLORS.orangeColor }]}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.swatchItem}>
                    <CustomCheck
                      value={colorOptions.includes('blue')}
                      clickHandler={() => this.setColorOptions('blue')}
                    />
                    <TouchableOpacity onPress={() => this.setColorOptions('blue')}>
                      <View style={[styles.swatchCircle, { backgroundColor: COLORS.blueColor }]} />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.swatchItem}>
                    <CustomCheck
                      value={colorOptions.includes('grey')}
                      clickHandler={() => this.setColorOptions('grey')}
                    />
                    <TouchableOpacity onPress={() => this.setColorOptions('grey')}>
                      <View
                        style={[styles.swatchCircle, { backgroundColor: COLORS.greygreyColor }]}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.swatchRow}>
                  <View style={styles.swatchItem}>
                    <CustomCheck
                      value={colorOptions.includes('yellow')}
                      clickHandler={() => this.setColorOptions('yellow')}
                    />
                    <TouchableOpacity onPress={() => this.setColorOptions('yellow')}>
                      <View
                        style={[styles.swatchCircle, { backgroundColor: COLORS.yellowColor }]}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.swatchItem}>
                    <CustomCheck
                      value={colorOptions.includes('violet')}
                      clickHandler={() => this.setColorOptions('violet')}
                    />
                    <TouchableOpacity onPress={() => this.setColorOptions('violet')}>
                      <View
                        style={[styles.swatchCircle, { backgroundColor: COLORS.violetColor }]}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.swatchItem}>
                    <CustomCheck
                      value={colorOptions.includes('white')}
                      clickHandler={() => this.setColorOptions('white')}
                    />
                    <TouchableOpacity onPress={() => this.setColorOptions('white')}>
                      <View style={[styles.swatchCircle, { backgroundColor: COLORS.whiteColor }]} />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.swatchRow}>
                  <View style={styles.swatchItem}>
                    <CustomCheck
                      value={colorOptions.includes('green')}
                      clickHandler={() => this.setColorOptions('green')}
                    />
                    <TouchableOpacity onPress={() => this.setColorOptions('green')}>
                      <View style={[styles.swatchCircle, { backgroundColor: COLORS.greenColor }]} />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.swatchItem}>
                    <CustomCheck
                      value={colorOptions.includes('pink')}
                      clickHandler={() => this.setColorOptions('pink')}
                    />
                    <TouchableOpacity onPress={() => this.setColorOptions('pink')}>
                      <View style={[styles.swatchCircle, { backgroundColor: COLORS.pinkColor }]} />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.swatchItem}>
                    <CustomCheck
                      value={colorOptions.includes('brown')}
                      clickHandler={() => this.setColorOptions('brown')}
                    />
                    <TouchableOpacity onPress={() => this.setColorOptions('brown')}>
                      <View style={[styles.swatchCircle, { backgroundColor: COLORS.brownColor }]} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </CustomAccordion>
            <CustomAccordion primary isOpen title="Mood">
              <View style={styles.collapseBody}>
                <View style={styles.checkItem}>
                  <CustomCheck
                    value={moods.includes('Happy')}
                    clickHandler={() => this.setMoods('Happy')}
                  />
                  <TouchableOpacity onPress={() => this.setMoods('Happy')}>
                    <Text style={{ ...STYLES.normalText, ...styles.checkTitle }}>Happy</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.checkItem}>
                  <CustomCheck
                    value={moods.includes('Sad')}
                    clickHandler={() => this.setMoods('Sad')}
                  />
                  <TouchableOpacity onPress={() => this.setMoods('Sad')}>
                    <Text style={{ ...STYLES.normalText, ...styles.checkTitle }}>Sad</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.checkItem}>
                  <CustomCheck
                    value={moods.includes('Angry')}
                    clickHandler={() => this.setMoods('Angry')}
                  />
                  <TouchableOpacity onPress={() => this.setMoods('Angry')}>
                    <Text style={{ ...STYLES.normalText, ...styles.checkTitle }}>Angry</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.checkItem}>
                  <CustomCheck
                    value={moods.includes('Upbeat')}
                    clickHandler={() => this.setMoods('Upbeat')}
                  />
                  <TouchableOpacity onPress={() => this.setMoods('Upbeat')}>
                    <Text style={{ ...STYLES.normalText, ...styles.checkTitle }}>Upbeat</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.checkItem}>
                  <CustomCheck
                    value={moods.includes('Calm')}
                    clickHandler={() => this.setMoods('Calm')}
                  />
                  <TouchableOpacity onPress={() => this.setMoods('Calm')}>
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
          </View>
        </View>
        <FileUpload
          onClose={() => this.showFileModal(false)}
          status={fileModalVisible}
          onCloseRequest={() => this.showFileModal(false)}
          setOrientation={this.setOrientation}
          uploadFromLocal={this.uploadFromLocal}
          uploadFromCloud={this.uploadFromCloud}
        />
        <Uploader
          onClose={() => this.showUploader(false)}
          status={uploaderVisible}
          onCloseRequest={() => this.showUploader(false)}
          onShowFileModal={this.showFileModal}
          storeType={'Art'}
          mainFile={true}
          onFilePress={(files) => {
            this.showUploader(false);
            let file = files[0];
            this.setState({
              attach_url: file.url,
            });
            if (file.fileType === 'image') {
              this.setState({
                thumb_url: file.url,
              });
            }
            this.props.updateAddMusicMethod('Upload');
            this.setCraftMediaUrl(file.filetype, file.url, file.filename, this.state.orientation);
          }}
          onUploadArt={() => {
            this.setState(
              {
                uploaderVisible: false,
              },
              () => this.showFileModal(true)
            );
          }}
          onUploadMusic={() => {}}
          uploadedItems={this.state.uploadedItems}
          deleteItem={(index)=>{
            const {uploadedItems} = this.state;
            uploadedItems.splice(index, 1);
            this.setState({uploadedItems})
          }}
          uploadingProgress={this.props.uploadingProgress.filter(item => item.craftId===this.state.craftId)}
          renderUploadingItem={this.renderUploadingItem}
          uploadedGlobal={this.props.uploadedItems.filter(item => item.craftId===this.state.craftId)}
        />
      </ScrollView>
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
    color: COLORS.primaryColor,
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
  editButtonText: {
    fontFamily: 'Lato',
    fontSize: METRICS.fontSizeNormal,
    color: COLORS.primaryColor,
  },
  addImageIcon: {
    color: COLORS.whiteColor,
  },
  collapseBody: {
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
  swatchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 70 * METRICS.ratioX,
  },
  swatchCircle: {
    width: 32 * METRICS.ratioX,
    height: 32 * METRICS.ratioX,
    borderRadius: 16 * METRICS.ratioX,
    borderWidth: 1 * METRICS.ratioX,
    borderColor: COLORS.whiteColor,
    overflow: 'hidden',
    position: 'relative',
  },
  attachWrapper: {
    position: 'relative',
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
    marginLeft: 20 * METRICS.ratioX,
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
    uploadedItems: state.uploadedItems,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withNavigation(CoverArtVideo));
