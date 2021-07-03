import React from 'react';
import {
  View,
  TextInput,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Upload from 'react-native-background-upload';
import FastImage from 'react-native-fast-image';
import { withNavigation } from 'react-navigation';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DocumentPicker from 'react-native-document-picker';
import ImagePicker from 'react-native-image-crop-picker';
import { connect } from 'react-redux';
import {
  BaseScreen,
  ScreenHeader,
  CircleCheck,
  CustomAccordion,
  FileUpload,
  LicenseArtExclusive,
  LicenseArtLease,
  LicenseMusicExc,
  LicenseMusicNon,
  LicenseMusicSP,
  Uploader,
  CustomIcon,
} from '../../../components';
import { METRICS, COLORS, STYLES } from '../../../global';
import PlayingCraftService from '../../../services/PlayingCraftService';
import cropper from '../../../helpers/cropper';
import { user } from '../../../global/Images';
import { teal } from '../../../styles/globals';

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
  updateUploadingProgress,
  uploadedItems,
} from '../../../store/actions';

class Store extends BaseScreen {
  navbarHidden = true;

  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      storeType: false,
      purchaseOptions: [],
      fileType: {
        exclusive: false,
        exclusive2: false,
        leaseWAV: false,
        leaseMP3: false,
        leaseTrackedOut: false,
        leaseTrackedOut2: false,
        buySamplePack: false,
        free: false,
      },
      descriptionText: '',
      craftId: 2,
      exclusivePrice: '',
      leaseWavPrice: '',
      leaseMP3Price: '',
      leaseTrackPrice: '',
      buySamplePrice: '',

      leaseWavQuantity: 0,
      leaseMP3Quantity: 0,
      leaseTrackQuantity: 0,
      buySampleQuantity: 0,
      freeQuantity: 0,

      fileModalVisible: false,
      licenseArtModalVisible: false,
      uploaderVisible: false,
      orientation: 0,
      curPurchaseOption: '',
      attach_urls: [],
      curPrice: 0,
      curQuantity: 0,
      authors: [],
      websiteLink: 'http://',
      uploadedItems: [],
      uploadedMusic: [],
      craftItems: [],
      options: [],
      storeOwner: null,
      owner: '',
      royaltyPercentage: '25',
      nonTransformRoyaltyPercentage: '75',
      addFees: '0',
      noOfAdvertise: 'unlimited',
    };
  }

  componentDidMount() {
    const curid = this.props.editingCraftId;
    this.setState({ craftId: curid });

    PlayingCraftService.getFiles(curid)
      .then((res) => {
        this.setState({uploadedMusic: res.data})
      });

    PlayingCraftService.getCraft(curid)
      .then((res) => {

        const items = res.data.craft_items;
        const uploadedItems = [];
        const uploadedMusic = [];
        const purchaseOptions = [];
        for (let i = 0; i < items.length; i++) {
          items[i].files_for_export?.map((item) => {
            if (item.filetype === 'audio') {
              if (uploadedMusic.findIndex((file) => file.id === item.id) < 0)
                uploadedMusic.push(item);
            } else if (uploadedItems.findIndex((file) => file.id === item.id) < 0)
              uploadedItems.push(item);
          });
          if (items[i].in_app_file)
            if (items[i].in_app_file.filetype === 'audio') {
              if (uploadedMusic.findIndex((file) => file.id === items[i].in_app_file.id) < 0)
                uploadedMusic.push(items[i].in_app_file);
            } else if (uploadedItems.findIndex((file) => file.id === items[i].in_app_file.id) < 0)
              uploadedItems.push(items[i].in_app_file);

          purchaseOptions.push(items[i].purchase_option);
          if (items[i].purchase_option === 'Exclusive License') {
            this.setState({ exclusivePrice: `${items[i].price}` });
          } else if (items[i].purchase_option === 'Lease WAV') {
            this.setState({
              leaseWavPrice: `${items[i].price}`,
              leaseWavQuantity: items[i].quantity,
            });
          } else if (items[i].purchase_option === 'Lease MP3') {
            this.setState({
              leaseMP3Price: `${items[i].price}`,
              leaseMP3Quantity: items[i].quantity,
            });
          } else if (
            items[i].purchase_option === 'Lease' ||
            items[i].purchase_option === 'Lease Tracked Out'
          ) {
            this.setState({
              leaseTrackPrice: `${items[i].price}`,
              leaseTrackQuantity: items[i].quantity,
            });
          } else if (items[i].purchase_option === 'Buy Sample Pack') {
            this.setState({
              buySamplePrice: `${items[i].price}`,
              buySampleQuantity: items[i].quantity,
            });
          } else if (items[i].purchase_option === 'Free') {
            this.setState({ freeQuantity: items[i].quantity });
          }
        }

        this.setState(
          {
            descriptionText: res.data.product_description ? res.data.product_description : '',
            storeType:
              res.data.store_option === 3 ? 'Brand' : res.data.store_option === 2 ? 'Music' : 'Art',
            authors: res.data.authors,
            // uploadedItems,
            // uploadedMusic,
            purchaseOptions,
            enablePost: res.data.store,
            storeOwner: res.data.store_owner.id,
            owner: res.data.craft_owner,
            craftItems: [],
            options: res.data.craft_items,
          },
          () => {
            this.setAuthors();
            if (this.props.storeState) {
              this.setState(this.props.storeState);
            }
          }
        );
      })
      .catch((err) => {
        console.log('error', err);
      });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.state.craftId !== this.props.editingCraftId) {
      const curid = this.props.editingCraftId;
      this.setState({ craftId: curid });

      PlayingCraftService.getFiles(curid)
        .then((res) => {
          console.log('files', res)
          this.setState({uploadedMusic: res.data})
        });

      PlayingCraftService.getCraft(curid)
        .then((res) => {
          console.log('craft', res);

          const items = res.data.craft_items;
          const uploadedItems = [];
          const uploadedMusic = [];
          const purchaseOptions = [];
          for (let i = 0; i < items.length; i++) {
            items[i].files_for_export?.map((item) => {
              if (item.filetype === 'audio') {
                if (uploadedMusic.findIndex((file) => file.id === item.id) < 0)
                  uploadedMusic.push(item);
              } else if (uploadedItems.findIndex((file) => file.id === item.id) < 0)
                uploadedItems.push(item);
            });
            if (items[i].in_app_file)
              if (items[i].in_app_file.filetype === 'audio') {
                if (uploadedMusic.findIndex((file) => file.id === items[i].in_app_file.id) < 0)
                  uploadedMusic.push(items[i].in_app_file);
              } else if (uploadedItems.findIndex((file) => file.id === items[i].in_app_file.id) < 0)
                uploadedItems.push(items[i].in_app_file);

            purchaseOptions.push(items[i].purchase_option);
            if (items[i].purchase_option === 'Exclusive License') {
              this.setState({ exclusivePrice: `${items[i].price}` });
            } else if (items[i].purchase_option === 'Lease WAV') {
              this.setState({
                leaseWavPrice: `${items[i].price}`,
                leaseWavQuantity: items[i].quantity,
              });
            } else if (items[i].purchase_option === 'Lease MP3') {
              this.setState({
                leaseMP3Price: `${items[i].price}`,
                leaseMP3Quantity: items[i].quantity,
              });
            } else if (
              items[i].purchase_option === 'Lease' ||
              items[i].purchase_option === 'Lease Tracked Out'
            ) {
              this.setState({
                leaseTrackPrice: `${items[i].price}`,
                leaseTrackQuantity: items[i].quantity,
              });
            } else if (items[i].purchase_option === 'Buy Sample Pack') {
              this.setState({
                buySamplePrice: `${items[i].price}`,
                buySampleQuantity: items[i].quantity,
              });
            } else if (items[i].purchase_option === 'Free') {
              this.setState({ freeQuantity: items[i].quantity });
            }
          }
          this.setState(
            {
              descriptionText: res.data.product_description ? res.data.product_description : '',
              storeType:
                res.data.store_option === 3
                  ? 'Brand'
                  : res.data.store_option === 2
                  ? 'Music'
                  : 'Art',
              authors: res.data.authors,
              // uploadedItems,
              // uploadedMusic,
              purchaseOptions,
              enablePost: res.data.store,
              storeOwner: res.data.store_owner.id,
              owner: res.data.craft_owner,
              craftItems: [],
              options: res.data.craft_items,
            },
            () => {
              this.setAuthors();
              if (this.props.storeState) {
                this.setState(this.props.storeState);
              }
            }
          );
        })
        .catch((err) => {
          console.log('error', err);
        });
    }
  }

  setAuthors = () => {
    this.forceUpdate();
  };

  addCraftItem = (file_id) => {
    const selectedOption = this.state.options.find(
      (item) => item.purchase_option === this.state.curPurchaseOption
    );

    const in_app_file = this.state.mainFile
      ? { file_id }
      : selectedOption
      ? { file_id: selectedOption.in_app_file.id }
      : undefined;
    const files_for_export = selectedOption
      ? [...selectedOption.files_for_export.map((item) => item.id), file_id]
      : this.state.mainFile
      ? undefined
      : [file_id];


    if (selectedOption?.id) {
      PlayingCraftService.editCraftItem(
        selectedOption.id,
        this.state.curPurchaseOption,
        in_app_file,
        files_for_export,
        'number_of_ads_allowed',
        selectedOption.number_of_ads_allowed
      )
        .then((res) => {
          if (res.data) {
            const selectedOptionIndex = this.state.options.findIndex(
              (item) => item.id === selectedOption.id
            );
            this.state.options[selectedOptionIndex] = res.data;
            this.setState({ options: this.state.options });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      console.log(
        'curQuantity: ',
        file_id,
        this.state.royaltyPercentage,
        this.state.nonTransformRoyaltyPercentage,
        this.state.addFees,
        this.state.noOfAdvertise
      );
      PlayingCraftService.addCraftItem(
        this.state.craftId,
        this.state.storeType,
        this.state.curPurchaseOption,
        this.state.curPrice,
        in_app_file,
        files_for_export,
        this.state.curQuantity,
        this.state.royaltyPercentage,
        this.state.nonTransformRoyaltyPercentage,
        this.state.addFees,
        this.state.noOfAdvertise
      )
        .then((res) => {
          const { options } = this.state;

          console.log('resp', res);

          options.push(res.data);
          this.setState({
            options,
          });
          this.showFileModal(false);
        })
        .catch((err) => {
          console.log('Craft Item added: ', err);
        });
    }
  };

  deleteFile = (file_id) => {
    PlayingCraftService.deleteFile(this.props.editingCraftId, file_id)
      .then((res) => {
        //console.log('resp', res)
      })
      .catch((err) => {
        //console.log('File delete ', err.response);
      });
  };

  deleteCraftItem = (selectedOption, file_id) => {

    if (file_id) {

      let selectedFileIndex = selectedOption.files_for_export.findIndex((item)=>item.id===file_id);

      selectedOption.files_for_export.splice(selectedFileIndex, 1);

      let in_app_file = {file_id: selectedOption.in_app_file?.id};
      let files_for_export = selectedOption.files_for_export.map(item=>item.id);

      PlayingCraftService.editCraftItem(selectedOption.id, this.state.curPurchaseOption, in_app_file, files_for_export, 'number_of_ads_allowed', selectedOption.number_of_ads_allowed)
        .then((res) => {
          if (res.data){
            let selectedOptionIndex = this.state.options.findIndex((item)=>item.id===selectedOption.id);
            this.state.options[selectedOptionIndex] = res.data;
            this.setState({options: this.state.options})
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      let in_app_file = undefined;
      let files_for_export = selectedOption.files_for_export.map(item=>item.id);

      PlayingCraftService.editCraftItem(selectedOption.id, this.state.curPurchaseOption, in_app_file, files_for_export, 'number_of_ads_allowed', selectedOption.number_of_ads_allowed)
        .then((res) => {
          if (res.data){
            let selectedOptionIndex = this.state.options.findIndex((item)=>item.id===selectedOption.id);
            this.state.options[selectedOptionIndex] = res.data;
            this.setState({options: this.state.options})
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }

  };

  uploadFromLocal = (value) => {
    let type = 'square';
    const { orientation } = this.state;

    if (value) {
      ImagePicker.openPicker({
        mediaType: 'video',
      }).then((video) => {
        this.showFileModal(false);
        this.showUploader(true);
        PlayingCraftService.uploadFile(
          video.path,
          video.mime,
          video.filename,
          this.state.craftId,
          this.uploadingProgress,
          this.state.mainFile,
          this.state.uploadingArt
        )
          .then((res) => {
            const file = res.data[0];

            // let selectedOption = this.state.options.find((item)=>item.purchase_option===this.state.curPurchaseOption);
            // if (selectedOption)
            //   res.mainFile ?
            //     selectedOption.in_app_file = file
            //     :
            //     selectedOption.files_for_export.push(file)

            this.props.uploadedItemsSetter({...file, craftId: this.state.craftId, uploadingArt: res.uploadingArt });
            // res.uploadingArt
            //   ? this.setState({ uploadedItems: [...this.state.uploadedItems, file] })
            //   : this.setState({ uploadedMusic: [...this.state.uploadedMusic, file] });

            // this.addCraftItem(file.id);
          })
          .catch((err) => {
            console.log(err.response.data.error);
          });
      });
    } else {
      if (orientation === 1) type = 'portrait';
      if (orientation === 2) type = 'landscape';
      cropper(type).then((image) => {
        this.setState({
          attach_url: image.path,
        });
        this.showFileModal(false);
        this.showUploader(true);
        PlayingCraftService.uploadFile(
          image.path,
          image.mime,
          image.filename,
          this.state.craftId,
          this.uploadingProgress,
          this.state.mainFile,
          this.state.uploadingArt
        )
          .then((res) => {
            const file = res.data[0];

            // let selectedOption = this.state.options.find((item)=>item.purchase_option===this.state.curPurchaseOption);
            // if (selectedOption)
            //   res.mainFile ?
            //     selectedOption.in_app_file = file
            //     :
            //     selectedOption.files_for_export.push(file)

            this.props.uploadedItemsSetter({...file, craftId: this.state.craftId, uploadingArt: res.uploadingArt });
            // res.uploadingArt
            //   ? this.setState({ uploadedItems: [...this.state.uploadedItems, file] })
            //   : this.setState({ uploadedMusic: [...this.state.uploadedMusic, file] });
            // this.addCraftItem(file.id);
          })
          .catch((err) => {
            console.log('error', err);
          });
      });
    }
  };

  addFile = (files) => {
    files.map((file) => {
      // let selectedOption = this.state.options.find((item)=>item.purchase_option===this.state.curPurchaseOption);
      // if (selectedOption)
      //   this.state.mainFile ?
      //     selectedOption.in_app_file = file
      //     :
      //     selectedOption.files_for_export.push(file);

      this.addCraftItem(file.id);
      this.showUploader(false);
      this.showFileModal(false);
    });
  };

  uploadingProgress = (data) => {
    // data.id.abort();
    data.craftId = this.state.craftId;
    data.purchaseOption = this.state.curPurchaseOption;
    data.mainFile = this.state.mainFile;

    data.uploadingArt = this.state.uploadingArt;
    this.dispatchProgress(data);
  };

  dispatchProgress = (data) => {
    this.props.uploadingProgressSetter(data);
  };

  uploadFromCloud = (fileType = 'image') => {
    // store DocumentPicker class type for file type
    let docType;
    if (fileType === 'video') {
      docType = [DocumentPicker.types.video];
      this.setState({ fileType: 1 });
    } else if (fileType === 'audio') {
      docType = [DocumentPicker.types.audio];
    } else if (fileType === 'all') {
      docType = [DocumentPicker.types.allFiles];
    } else if (fileType === 'photo') {
      docType = [DocumentPicker.types.images];
      this.setState({ fileType: 0 });
    } else {
      return;
    }
    (async () => {
      // Pick a single file
      try {
        if (fileType === 'all'){
          const resArr = await DocumentPicker.pickMultiple({
            type: docType,
          });
          this.showFileModal(false);
          this.showUploader(true);
          resArr.map((res)=>PlayingCraftService.uploadFile(
            res.uri,
            res.type,
            res.name,
            this.state.craftId,
            this.uploadingProgress,
            this.state.mainFile,
            this.state.uploadingArt
          )
            .then((res) => {
              const file = res.data[0];

              // let selectedOption = this.state.options.find((item)=>item.purchase_option===this.state.curPurchaseOption);
              // if (selectedOption)
              //   res.mainFile ?
              //     selectedOption.in_app_file = file
              //     :
              //     selectedOption.files_for_export.push(file)


              this.props.uploadedItemsSetter({...file, craftId: this.state.craftId, uploadingArt: res.uploadingArt });
              // res.uploadingArt ?
              //   this.setState({uploadedItems: [...this.state.uploadedItems, file]})
              //   :
              //   this.setState({uploadedMusic: [...this.state.uploadedMusic, file]})
              //this.addCraftItem(file.id);
            })
            .catch((err) => {
              console.log(err);
            }))

        } else {
          const res = await DocumentPicker.pick({
            type: docType,
          });
          this.showFileModal(false);
          this.showUploader(true);
          PlayingCraftService.uploadFile(
            res.uri,
            res.type,
            res.name,
            this.state.craftId,
            this.uploadingProgress,
            this.state.mainFile,
            this.state.uploadingArt
          )
            .then((res) => {
              const file = res.data[0];

              // let selectedOption = this.state.options.find((item)=>item.purchase_option===this.state.curPurchaseOption);
              // if (selectedOption)
              //   res.mainFile ?
              //     selectedOption.in_app_file = file
              //     :
              //     selectedOption.files_for_export.push(file)

              this.props.uploadedItemsSetter({...file, craftId: this.state.craftId, uploadingArt: res.uploadingArt });
            // res.uploadingArt
            //   ? this.setState({uploadedItems: [...this.state.uploadedItems, file]})
            //   : this.setState({uploadedMusic: [...this.state.uploadedMusic, file]});
            // this.addCraftItem(file.id);
          })
          .catch((err) => {
            console.log(err);
          });
      }
      } catch (err) {
        if (DocumentPicker.isCancel(err)) {
          // User cancelled the picker, exit any dialogs or menus and move on
        } else {
          throw err;
        }
      }
    })();
  };

  handleUpdateDescription = (text) => {
    this.setState({ descriptionText: text });
  };

  storeTypesCheckHandler = (storeType) => {
    if (this.state.storeType !== storeType) {
      this.setState({
        exclusivePrice: '',
        leaseWavPrice: '',
        leaseMP3Price: '',
        leaseTrackPrice: '',
        buySamplePrice: '',

        leaseWavQuantity: 0,
        leaseMP3Quantity: 0,
        leaseTrackQuantity: 0,
        buySampleQuantity: 0,
        freeQuantity: 0,
        fileType: {
          exclusive: false,
          exclusive2: false,
          leaseWAV: false,
          leaseMP3: false,
          leaseTrackedOut: false,
          leaseTrackedOut2: false,
          buySamplePack: false,
          free: false,
        },
        options: [],
        purchaseOptions: [],
        uploadedItems: [],
        uploadedMusic: [],
      });
    }
    this.setState({ storeType });
    PlayingCraftService.setStoreType(this.state.craftId, storeType)
      .then((res) => {
        //console.log(res);
      })
      .catch((err) => {
        console.log(err.response.data.error);
      });
  };

  onSubmitDescription = () => {
    PlayingCraftService.setProductionDescription(this.state.craftId, this.state.descriptionText)
      .then((res) => {})
      .catch((err) => {
        console.log(err.response.data.error);
      });
  };

  onSubmitWebsitelink = () => {
    PlayingCraftService.setWebsiteLink(this.state.craftId, this.state.websiteLink)
      .then((res) => {})
      .catch((err) => {
        console.log(err.response.data.error);
      });
  };

  setPurchaseOption = (purchaseOption) => {
    const { purchaseOptions } = this.state;
    if (
      (purchaseOption === 'Lease' && purchaseOptions.includes('Buy')) ||
      (purchaseOption === 'Buy' && purchaseOptions.includes('Lease'))
    ) {
      alert('Cannot choose both Lease Tracked Out and Buy Sample Pack!');
    } else {
      if (purchaseOptions.includes(purchaseOption)) {
        purchaseOptions.splice(purchaseOptions.indexOf(purchaseOption), 1);
      } else {
        purchaseOptions.push(purchaseOption);
      }
      this.setState({ purchaseOptions });
    }
  };

  showFileModal = (value) => {
    this.setState({
      fileModalVisible: value,
    });
  };

  setOrientation = (value) => {
    this.setState({ orientation: value });
  };

  showExcArtModal = (value) => {
    this.setState({
      ExcArtModalVisible: value,
    });
  };

  showNonArtModal = (value) => {
    this.setState({
      NonArtModalVisible: value,
    });
  };

  showExcMusicModal = (value) => {
    this.setState({
      ExcMusicModalVisible: value,
    });
  };

  showNonMusicModal = (value) => {
    this.setState({
      NonMusicModalVisible: value,
    });
  };

  showSPModal = (value) => {
    this.setState({
      SPModalVisible: value,
    });
  };

  showUploader = (value) => {
    this.setState({
      uploaderVisible: value,
    });
  };

  onPressUpload = (purchase_option, price = 0, quantity = 0) => {
    this.setState(
      {
        curPurchaseOption: purchase_option,
        curPrice: price ? `${parseFloat(`${price}`)}` : 0,
        curQuantity: quantity,
      },
      () => {
        this.showUploader(true);
      }
    );
  };

  onChangePrice = (field, price, option) => {
    const selectedOption = this.state.options.find((item) => item.purchase_option === option);

    const regEx = /^[0-9]*\.?[0-9]*$/;
    if (regEx.test(price)) {
      this.setState({
        [field]: price,
      });
    }

    if (selectedOption?.id) {
      let in_app_file = {file_id: selectedOption.in_app_file?.id};
      let files_for_export = selectedOption.files_for_export.map(item=>item.id);

      PlayingCraftService.editCraftItem(selectedOption.id, this.state.curPurchaseOption, in_app_file, files_for_export, 'price', price)
        .then((res) => {console.log(res)})
        .catch((err) => {
          console.log(err.response.data.error);
        });
    }
  };

  onAuthor = (id) => {
    PlayingCraftService.setStoreOwner(this.state.craftId, id)
      .then((res) => {
        this.setState({
          storeOwner: id,
        });
      })
      .catch((err) => {
        alert(err.response.data.error);
      });
  };

  backAction = () => {
    this.props.updateStoreState(this.state);
    this.props.navigation.state.params.openModal();
  };

  onShowFileModal = () => {
    this.setState({
      fileModalVisible: true,
    });
  };

  updateData = (royalty, nonRoyalty, advertiseFee, noOfAdd) => {
    this.setState({ royaltyPercentage: royalty });
    this.setState({ nonTransformRoyaltyPercentage: nonRoyalty });
    this.setState({ addFees: advertiseFee });
    this.setState({ noOfAdvertise: noOfAdd });
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

  renderUploadedItem = (item, index, option) => (
    <View style={{ flexDirection: 'row', alignItems: 'center' }} key={index}>
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
        {item.filename}
      </Text>

      <TouchableOpacity
        onPress={() => {
          this.deleteCraftItem(option, item.id);
        }}
      >
        <CustomIcon name="cancel-button" style={styles.icon2} />
      </TouchableOpacity>
    </View>
  );

  renderScreen() {
    const { navigation } = this.props;
    const {
      storeType,
      fileType,
      purchaseOptions,
      descriptionText,
      exclusivePrice,
      leaseMP3Price,
      leaseWavPrice,
      leaseTrackPrice,
      buySamplePrice,
      fileModalVisible,
      ExcArtModalVisible,
      NonArtModalVisible,
      ExcMusicModalVisible,
      NonMusicModalVisible,
      SPModalVisible,
      websiteLink,
      storeOwner,
      uploaderVisible,
      authors,
    } = this.state;

    const exclusiveLicenseIndex = this.props.uploadingProgress.findIndex(
      (item) => false // item.craftId===this.state.craftId && item.purchaseOption === 'Exclusive License' && item.mainFile
    );
    const freeIndex = this.props.uploadingProgress.findIndex(
      (item) => false // item.craftId===this.state.craftId && item.purchaseOption === 'Free' && item.mainFile
    );
    const leaseIndex = this.props.uploadingProgress.findIndex(
      (item) => false // item.craftId===this.state.craftId && item.purchaseOption === 'Lease' && item.mainFile
    );
    const leaseWAVIndex = this.props.uploadingProgress.findIndex(
      (item) => false // item.craftId===this.state.craftId && item.purchaseOption === 'Lease WAV' && item.mainFile
    );
    const leaseMP3Index = this.props.uploadingProgress.findIndex(
      (item) => false // item.craftId===this.state.craftId && item.purchaseOption === 'Lease MP3' && item.mainFile
    );

    const exclusiveLicenseAdditional = this.props.uploadingProgress.filter(
      (item) => false // item.craftId===this.state.craftId && item.purchaseOption === 'Exclusive License' && !item.mainFile
    );
    const freeAdditional = this.props.uploadingProgress.filter(
      (item) => false // item.craftId===this.state.craftId && item.purchaseOption === 'Free' && !item.mainFile
    );
    const leaseAdditional = this.props.uploadingProgress.filter(
      (item) => false // item.craftId===this.state.craftId && item.purchaseOption === 'Lease' && !item.mainFile
    );
    const leaseWAVAdditional = this.props.uploadingProgress.filter(
      (item) => false // item.craftId===this.state.craftId && item.purchaseOption === 'Lease WAV' && !item.mainFile
    );
    const leaseMP3Additional = this.props.uploadingProgress.filter(
      (item) => false // item.craftId===this.state.craftId && item.purchaseOption === 'Lease MP3' && !item.mainFile
    );

    return (
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.container}
      >
        <ScreenHeader pageTitle="Store" navigation={navigation} backAction={this.backAction} />
        <View style={styles.container}>
          <Text
            style={[
              STYLES.normalText,
              { color: COLORS.lightGrey, fontFamily: 'lato', fontSize: METRICS.fontSizeOK },
            ]}
          >
            Use this section to upload art/music for sale or post a link to your brand website.
          </Text>
        </View>

        {/* select collaborator */}
        <View style={styles.container}>
          <View style={styles.section}>
            <CustomAccordion title="Select Seller" isOpen>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.collapseBody}
              >
                {authors.map(
                  (element, index) =>
                    element && (
                      <TouchableOpacity onPress={() => this.onAuthor(element.id)} key={index}>
                        <FastImage
                          source={element.avatar ? { uri: element.avatar } : user}
                          style={
                            storeOwner === element.id
                              ? styles.selectedAvatarWrapper
                              : styles.avatarWrapper
                          }
                        />
                      </TouchableOpacity>
                    )
                )}
              </ScrollView>
            </CustomAccordion>
          </View>

          {storeOwner &&
            <>

          {/* select store type */}
          <View style={styles.section}>
            <CustomAccordion isOpen title="Type">
              <TouchableOpacity
                style={styles.checkItemWrapper}
                onPress={() => this.storeTypesCheckHandler('Art')}
              >
                <CircleCheck
                  value={storeType === 'Art'}
                  clickHandler={() => this.storeTypesCheckHandler('Art')}
                />
                <Text style={[STYLES.mediumText, { marginLeft: METRICS.spacingNormal }]}>Art</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.checkItemWrapper}
                onPress={() => this.storeTypesCheckHandler('Music')}
              >
                <CircleCheck
                  value={storeType === 'Music'}
                  clickHandler={() => this.storeTypesCheckHandler('Music')}
                />
                <Text style={[STYLES.mediumText, { marginLeft: METRICS.spacingNormal }]}>
                  Music
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.checkItemWrapper}
                onPress={() => this.storeTypesCheckHandler('Brand')}
              >
                <CircleCheck
                  value={storeType === 'Brand'}
                  clickHandler={() => this.storeTypesCheckHandler('Brand')}
                />
                <Text style={[STYLES.mediumText, { marginLeft: METRICS.spacingNormal }]}>
                  Brand Website
                </Text>
              </TouchableOpacity>
            </CustomAccordion>

            {/* product/service description */}
          </View>
          <View style={styles.section}>
            <CustomAccordion title="Product/Service Description" isOpen>
              <View style={styles.collapseBody}>
                <TextInput
                  selectionColor={COLORS.primaryColor}
                  keyboardAppearance="dark"
                  autoCapitalize="sentences"
                  autoCompleteType="off"
                  multiline
                  style={styles.descriptionInput}
                  value={descriptionText}
                  onChangeText={this.handleUpdateDescription}
                  onBlur={this.onSubmitDescription}
                />
              </View>
            </CustomAccordion>
          </View>

          {/* brand website link */}
          {storeType === 'Brand' && (
            <View style={styles.section}>
              <CustomAccordion title="Enter Website Link" isOpen>
                <TextInput
                  selectionColor={COLORS.primaryColor}
                  keyboardAppearance="dark"
                  autoCapitalize="none"
                  autoCorrect={false}
                  textContentType="URL"
                  keyboardType="url"
                  style={styles.webInput}
                  value={websiteLink}
                  onChangeText={(text) => this.setState({ websiteLink: text })}
                  onBlur={this.onSubmitWebsitelink}
                />
              </CustomAccordion>
            </View>
          )}

          {/* purchase options */}
          {storeType !== 'Brand' && (
            <CustomAccordion isOpen title="Purchase Options">
              {/* ART: Exclusive */}
              {storeType === 'Art' && (
                <TouchableOpacity
                  style={styles.checkItemWrapper}
                  onPress={() => this.setPurchaseOption('Exclusive License')}
                >
                  <CircleCheck
                    value={purchaseOptions.includes('Exclusive License')}
                    clickHandler={() => this.setPurchaseOption('Exclusive License')}
                  />
                  <Text style={[STYLES.mediumText, { marginLeft: METRICS.spacingNormal }]}>
                    Exclusive License
                  </Text>
                </TouchableOpacity>
              )}
              {storeType !== 'Music' && purchaseOptions.includes('Exclusive License') && (
                <View style={styles.contentWrapper}>
                  <TouchableOpacity onPress={() => this.showExcArtModal(true)}>
                    <Text
                      style={[
                        STYLES.normalText,
                        { paddingBottom: METRICS.marginBig, color: COLORS.primaryColor },
                      ]}
                    >
                      View/Edit Licensing Agreement
                    </Text>
                  </TouchableOpacity>
                  <View style={[styles.section, { marginBottom: METRICS.marginBig }]}>
                    <Text style={[STYLES.normalText, { marginBottom: METRICS.marginTiny }]}>
                      Add Price
                    </Text>
                    <TextInput
                      selectionColor={COLORS.primaryColor}
                      keyboardAppearance="dark"
                      style={styles.textInput}
                      value={`${exclusivePrice}`}
                      keyboardType="numeric"
                      onChangeText={(text) =>
                        this.onChangePrice('exclusivePrice', text, 'Exclusive License')
                      }
                    />
                  </View>
                  <Text style={[STYLES.mediumText, { marginBottom: METRICS.spacingTiny }]}>
                    Choose In-App File
                  </Text>
                  <Text
                    style={[
                      STYLES.normalText,
                      {
                        color: COLORS.lightGrey,
                        fontFamily: 'lato',
                        fontSize: METRICS.fontSizeOK,
                        marginBottom: METRICS.spacingSmall,
                      },
                    ]}
                  >
                    File the buyer can use as cover art/video, such as a studio session or a single
                    photo or video.
                  </Text>
                  <TouchableOpacity
                    style={{ flexDirection: 'row', alignItems: 'center' }}
                    onPress={() => {
                      this.setState(
                        { fileType: { ...fileType, exclusive: 'Upload' }, mainFile: true },
                        () => this.onPressUpload('Exclusive License', exclusivePrice)
                      );
                    }}
                  >
                    {exclusiveLicenseIndex >= 0 ? (
                      <ActivityIndicator size="small" color={COLORS.purpleColor} />
                    ) : null}
                    <Text
                      style={[
                        STYLES.mediumText,
                        {
                          paddingVertical: METRICS.spacingSmall,
                          marginLeft: METRICS.spacingNormal,
                        },
                        {
                          color: this.state.options.find(
                            (item) => item.purchase_option === 'Exclusive License'
                          )?.in_app_file
                            ? COLORS.purpleColor
                            : COLORS.primaryColor,
                        },
                      ]}
                    >
                      {exclusiveLicenseIndex >= 0
                        ? `Uploading ${this.props.uploadingProgress[
                            exclusiveLicenseIndex
                          ].progress.toFixed(2)}%`
                        : this.state.options.find(
                            (item) => item.purchase_option === 'Exclusive License'
                          )?.in_app_file?.filename || '+ Choose File'}
                    </Text>
                    {this.state.options.find(item=>item.purchase_option==='Exclusive License')?.in_app_file?.filename &&
                    <TouchableOpacity onPress={() => {
                      this.deleteCraftItem(this.state.options.find(item=>item.purchase_option==='Exclusive License'))
                    }}>
                      <CustomIcon name="cancel-button" style={styles.icon2}/>
                    </TouchableOpacity>
                    }
                  </TouchableOpacity>

                  <Text
                    style={[
                      STYLES.mediumText,
                      { marginBottom: METRICS.spacingTiny, marginTop: METRICS.spacingNormal },
                    ]}
                  >
                    Choose Export File(s)
                  </Text>
                  <Text
                    style={[
                      STYLES.normalText,
                      {
                        color: COLORS.lightGrey,
                        fontFamily: 'lato',
                        fontSize: METRICS.fontSizeOK,
                        marginBottom: METRICS.spacingSmall,
                      },
                    ]}
                  >
                    Files the buyer can use outside the app, such as psd, obj, etc.
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState(
                        { fileType: { ...fileType, exclusive: 'Upload' }, mainFile: false },
                        () => this.onPressUpload('Exclusive License', exclusivePrice)
                      );
                    }}
                  >
                    <Text
                      style={[
                        STYLES.mediumText,
                        {
                          paddingVertical: METRICS.spacingSmall,
                          marginLeft: METRICS.spacingNormal,
                          color: COLORS.primaryColor,
                        },
                      ]}
                    >
                      + Choose File(s)
                    </Text>
                  </TouchableOpacity>
                  {this.state.options
                    .find((item) => item.purchase_option === 'Exclusive License')
                    ?.files_for_export.map((item, index) =>
                      this.renderUploadedItem(
                        item,
                        index,
                        this.state.options.find(
                          (item) => item.purchase_option === 'Exclusive License'
                        )
                      )
                    )}
                  {exclusiveLicenseAdditional.map(this.renderUploadingItem)}
                </View>
              )}

              {/* ART: Lease */}
              {storeType === 'Art' && (
                <TouchableOpacity
                  style={styles.checkItemWrapper}
                  onPress={() => this.setPurchaseOption('Lease')}
                >
                  <CircleCheck
                    value={purchaseOptions.includes('Lease')}
                    clickHandler={() => this.setPurchaseOption('Lease')}
                  />
                  <Text style={[STYLES.mediumText, { marginLeft: METRICS.spacingNormal }]}>
                    Lease
                  </Text>
                </TouchableOpacity>
              )}
              {storeType === 'Art' && purchaseOptions.includes('Lease') && (
                <View style={styles.contentWrapper}>
                  <TouchableOpacity onPress={() => this.showNonArtModal(true)}>
                    <Text
                      style={[
                        STYLES.normalText,
                        { paddingBottom: METRICS.marginBig, color: COLORS.primaryColor },
                      ]}
                    >
                      View/Edit Licensing Agreement
                    </Text>
                  </TouchableOpacity>
                  <View style={[styles.section, { marginBottom: METRICS.marginBig }]}>
                    <Text style={[STYLES.normalText, { marginBottom: METRICS.marginTiny }]}>
                      Add Price
                    </Text>
                    <TextInput
                      selectionColor={COLORS.primaryColor}
                      keyboardAppearance="dark"
                      style={styles.textInput}
                      value={leaseTrackPrice}
                      keyboardType="numeric"
                      onChangeText={(text) => this.onChangePrice('leaseTrackPrice', text, 'Lease')}
                    />
                  </View>
                  <Text style={[STYLES.mediumText, { marginBottom: METRICS.spacingTiny }]}>
                    Choose In-App File
                  </Text>
                  <Text
                    style={[
                      STYLES.normalText,
                      {
                        color: COLORS.lightGrey,
                        fontFamily: 'lato',
                        fontSize: METRICS.fontSizeOK,
                        marginBottom: METRICS.spacingSmall,
                      },
                    ]}
                  >
                    File the buyer can use as cover art/video, such as a studio session or a single
                    photo or video.
                  </Text>
                  <TouchableOpacity
                    style={{ flexDirection: 'row', alignItems: 'center' }}
                    onPress={() => {
                      this.setState(
                        { fileType: { ...fileType, leaseTrackedOut: 'Upload' }, mainFile: true },
                        () => this.onPressUpload('Lease', leaseTrackPrice)
                      );
                    }}
                  >
                    {leaseIndex >= 0 ? (
                      <ActivityIndicator size="small" color={COLORS.purpleColor} />
                    ) : null}
                    <Text
                      style={[
                        STYLES.mediumText,
                        {
                          paddingVertical: METRICS.spacingSmall,
                          marginLeft: METRICS.spacingNormal,
                        },
                        {
                          color: this.state.options.find((item) => item.purchase_option === 'Lease')
                            ?.in_app_file
                            ? COLORS.purpleColor
                            : COLORS.primaryColor,
                        },
                      ]}
                    >
                      {leaseIndex >= 0
                        ? `Uploading ${this.props.uploadingProgress[leaseIndex].progress.toFixed(
                            2
                          )}%`
                        : this.state.options.find((item) => item.purchase_option === 'Lease')
                            ?.in_app_file?.filename || '+ Choose File'}
                    </Text>
                    {this.state.options.find(item => item.purchase_option === 'Lease')?.in_app_file?.filename &&
                    <TouchableOpacity onPress={() => {
                      this.deleteCraftItem(this.state.options.find(item => item.purchase_option === 'Lease'))
                    }}>
                      <CustomIcon name="cancel-button" style={styles.icon2}/>
                    </TouchableOpacity>
                    }
                  </TouchableOpacity>

                  <Text
                    style={[
                      STYLES.mediumText,
                      { marginBottom: METRICS.spacingTiny, marginTop: METRICS.spacingNormal },
                    ]}
                  >
                    Choose Export File(s)
                  </Text>
                  <Text
                    style={[
                      STYLES.normalText,
                      {
                        color: COLORS.lightGrey,
                        fontFamily: 'lato',
                        fontSize: METRICS.fontSizeOK,
                        marginBottom: METRICS.spacingSmall,
                      },
                    ]}
                  >
                    Files the buyer can use outside the app, such as psd, obj, etc.
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState(
                        { fileType: { ...fileType, exclusive: 'Upload' }, mainFile: false },
                        () => this.onPressUpload('Lease', exclusivePrice)
                      );
                    }}
                  >
                    <Text
                      style={[
                        STYLES.mediumText,
                        {
                          paddingVertical: METRICS.spacingSmall,
                          marginLeft: METRICS.spacingNormal,
                          color: COLORS.primaryColor,
                        },
                      ]}
                    >
                      + Choose File(s)
                    </Text>
                  </TouchableOpacity>
                  {this.state.options
                    .find((item) => item.purchase_option === 'Lease')
                    ?.files_for_export.map((item, index) =>
                      this.renderUploadedItem(
                        item,
                        index,
                        this.state.options.find((item) => item.purchase_option === 'Lease')
                      )
                    )}
                  {leaseAdditional.map(this.renderUploadingItem)}
                </View>
              )}

              {/* ART: Free */}
              {storeType === 'Art' && (
                <TouchableOpacity
                  style={styles.checkItemWrapper}
                  onPress={() => this.setPurchaseOption('Free')}
                >
                  <CircleCheck
                    value={purchaseOptions.includes('Free')}
                    clickHandler={() => this.setPurchaseOption('Free')}
                  />
                  <Text style={[STYLES.mediumText, { marginLeft: METRICS.spacingNormal }]}>
                    Free
                  </Text>
                </TouchableOpacity>
              )}
              {storeType !== 'Music' && purchaseOptions.includes('Free') && (
                <View style={styles.contentWrapper}>
                  <Text style={[STYLES.mediumText, { marginBottom: METRICS.spacingTiny }]}>
                    Choose In-App File
                  </Text>
                  <Text
                    style={[
                      STYLES.normalText,
                      {
                        color: COLORS.lightGrey,
                        fontFamily: 'lato',
                        fontSize: METRICS.fontSizeOK,
                        marginBottom: METRICS.spacingSmall,
                      },
                    ]}
                  >
                    File the buyer can use as cover art/video, such as a studio session or a single
                    photo or video.
                  </Text>
                  <TouchableOpacity
                    style={{ flexDirection: 'row', alignItems: 'center' }}
                    onPress={() => {
                      this.setState(
                        { fileType: { ...fileType, free: 'Upload' }, mainFile: true },
                        () => this.onPressUpload('Free')
                      );
                    }}
                  >
                    {freeIndex >= 0 ? (
                      <ActivityIndicator size="small" color={COLORS.purpleColor} />
                    ) : null}
                    <Text
                      style={[
                        STYLES.mediumText,
                        {
                          paddingVertical: METRICS.spacingSmall,
                          marginLeft: METRICS.spacingNormal,
                        },
                        {
                          color: this.state.options.find((item) => item.purchase_option === 'Free')
                            ?.in_app_file
                            ? COLORS.purpleColor
                            : COLORS.primaryColor,
                        },
                      ]}
                    >
                      {freeIndex >= 0
                        ? `Uploading ${this.props.uploadingProgress[freeIndex].progress.toFixed(
                            2
                          )}%`
                        : this.state.options.find((item) => item.purchase_option === 'Free')
                            ?.in_app_file?.filename || '+ Choose File'}
                    </Text>
                    {this.state.options.find(item => item.purchase_option === 'Free')?.in_app_file?.filename &&
                    <TouchableOpacity onPress={() => {
                      this.deleteCraftItem(this.state.options.find(item => item.purchase_option === 'Free'))
                    }}>
                      <CustomIcon name="cancel-button" style={styles.icon2}/>
                    </TouchableOpacity>
                    }
                  </TouchableOpacity>

                  <Text
                    style={[
                      STYLES.mediumText,
                      { marginBottom: METRICS.spacingTiny, marginTop: METRICS.spacingNormal },
                    ]}
                  >
                    Choose Export File(s)
                  </Text>
                  <Text
                    style={[
                      STYLES.normalText,
                      {
                        color: COLORS.lightGrey,
                        fontFamily: 'lato',
                        fontSize: METRICS.fontSizeOK,
                        marginBottom: METRICS.spacingSmall,
                      },
                    ]}
                  >
                    Files the buyer can use outside the app, such as psd, obj, etc.
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState(
                        { fileType: { ...fileType, exclusive: 'Upload' }, mainFile: false },
                        () => this.onPressUpload('Free', exclusivePrice)
                      );
                    }}
                  >
                    <Text
                      style={[
                        STYLES.mediumText,
                        {
                          paddingVertical: METRICS.spacingSmall,
                          marginLeft: METRICS.spacingNormal,
                          color: COLORS.primaryColor,
                        },
                      ]}
                    >
                      + Choose File(s)
                    </Text>
                  </TouchableOpacity>
                  {this.state.options
                    .find((item) => item.purchase_option === 'Free')
                    ?.files_for_export.map((item, index) =>
                      this.renderUploadedItem(
                        item,
                        index,
                        this.state.options.find((item) => item.purchase_option === 'Free')
                      )
                    )}
                  {freeAdditional.map(this.renderUploadingItem)}
                </View>
              )}

              {/* MUSIC: Exclusive */}
              {storeType === 'Music' && (
                <TouchableOpacity
                  style={styles.checkItemWrapper}
                  onPress={() => this.setPurchaseOption('Exclusive License')}
                >
                  <CircleCheck
                    value={purchaseOptions.includes('Exclusive License')}
                    clickHandler={() => this.setPurchaseOption('Exclusive License')}
                  />
                  <Text style={[STYLES.mediumText, { marginLeft: METRICS.spacingNormal }]}>
                    Exclusive License
                  </Text>
                </TouchableOpacity>
              )}
              {storeType !== 'Art' && purchaseOptions.includes('Exclusive License') && (
                <View style={styles.contentWrapper}>
                  <TouchableOpacity onPress={() => this.showExcMusicModal(true)}>
                    <Text
                      style={[
                        STYLES.normalText,
                        { paddingBottom: METRICS.marginBig, color: COLORS.primaryColor },
                      ]}
                    >
                      View/Edit Licensing Agreement
                    </Text>
                  </TouchableOpacity>
                  <View style={[styles.section, { marginBottom: METRICS.marginBig }]}>
                    <Text style={[STYLES.normalText, { marginBottom: METRICS.marginTiny }]}>
                      Add Price
                    </Text>
                    <TextInput
                      selectionColor={COLORS.primaryColor}
                      keyboardAppearance="dark"
                      style={styles.textInput}
                      value={`${exclusivePrice}`}
                      keyboardType="numeric"
                      onChangeText={(text) =>
                        this.onChangePrice('exclusivePrice', text, 'Exclusive License')
                      }
                    />
                  </View>
                  <Text style={[STYLES.mediumText, { marginBottom: METRICS.spacingTiny }]}>
                    Choose In-App File
                  </Text>
                  <Text
                    style={[
                      STYLES.normalText,
                      {
                        color: COLORS.lightGrey,
                        fontFamily: 'lato',
                        fontSize: METRICS.fontSizeOK,
                        marginBottom: METRICS.spacingSmall,
                      },
                    ]}
                  >
                    File the buyer can use in-app, such as a studio session or a single audio file.
                  </Text>
                  <TouchableOpacity
                    style={{ flexDirection: 'row', alignItems: 'center' }}
                    onPress={() => {
                      this.setState(
                        { fileType: { ...fileType, exclusive: 'Upload' }, mainFile: true },
                        () => this.onPressUpload('Exclusive License', exclusivePrice)
                      );
                    }}
                  >
                    {exclusiveLicenseIndex >= 0 ? (
                      <ActivityIndicator size="small" color={COLORS.purpleColor} />
                    ) : null}
                    <Text
                      style={[
                        STYLES.mediumText,
                        {
                          paddingVertical: METRICS.spacingSmall,
                          marginLeft: METRICS.spacingNormal,
                        },
                        {
                          color: this.state.options.find(
                            (item) => item.purchase_option === 'Exclusive License'
                          )?.in_app_file
                            ? COLORS.purpleColor
                            : COLORS.primaryColor,
                        },
                      ]}
                    >
                      {exclusiveLicenseIndex >= 0
                        ? `Uploading ${this.props.uploadingProgress[
                            exclusiveLicenseIndex
                          ].progress.toFixed(2)}%`
                        : this.state.options.find(
                            (item) => item.purchase_option === 'Exclusive License'
                          )?.in_app_file?.filename || '+ Choose File(s)'}
                    </Text>
                    {this.state.options.find(item => item.purchase_option === 'Exclusive License')?.in_app_file?.filename &&
                    <TouchableOpacity onPress={() => {
                      this.deleteCraftItem(this.state.options.find(item => item.purchase_option === 'Exclusive License'))
                    }}>
                      <CustomIcon name="cancel-button" style={styles.icon2}/>
                    </TouchableOpacity>
                    }
                  </TouchableOpacity>

                  <Text
                    style={[
                      STYLES.mediumText,
                      { marginBottom: METRICS.spacingTiny, marginTop: METRICS.spacingNormal },
                    ]}
                  >
                    Choose Export File(s)
                  </Text>
                  <Text
                    style={[
                      STYLES.normalText,
                      {
                        color: COLORS.lightGrey,
                        fontFamily: 'lato',
                        fontSize: METRICS.fontSizeOK,
                        marginBottom: METRICS.spacingSmall,
                      },
                    ]}
                  >
                    Files the buyer can use outside the app, such as tracked out audio files.
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState(
                        { fileType: { ...fileType, exclusive: 'Upload' }, mainFile: false },
                        () => this.onPressUpload('Exclusive License', exclusivePrice)
                      );
                    }}
                  >
                    <Text
                      style={[
                        STYLES.mediumText,
                        {
                          paddingVertical: METRICS.spacingSmall,
                          marginLeft: METRICS.spacingNormal,
                          color: COLORS.primaryColor,
                        },
                      ]}
                    >
                      + Choose File(s)
                    </Text>
                  </TouchableOpacity>
                  {this.state.options
                    .find((item) => item.purchase_option === 'Exclusive License')
                    ?.files_for_export.map((item, index) =>
                      this.renderUploadedItem(
                        item,
                        index,
                        this.state.options.find(
                          (item) => item.purchase_option === 'Exclusive License'
                        )
                      )
                    )}
                  {exclusiveLicenseAdditional.map(this.renderUploadingItem)}
                </View>
              )}

              {/* MUSIC: Lease WAV */}
              {storeType === 'Music' && (
                <TouchableOpacity
                  style={styles.checkItemWrapper}
                  onPress={() => this.setPurchaseOption('Lease WAV')}
                >
                  <CircleCheck
                    value={purchaseOptions.includes('Lease WAV')}
                    clickHandler={() => this.setPurchaseOption('Lease WAV')}
                  />
                  <Text style={[STYLES.mediumText, { marginLeft: METRICS.spacingNormal }]}>
                    Lease WAV
                  </Text>
                </TouchableOpacity>
              )}
              {storeType === 'Music' && purchaseOptions.includes('Lease WAV') && (
                <View style={styles.contentWrapper}>
                  <TouchableOpacity onPress={() => this.showNonMusicModal(true)}>
                    <Text
                      style={[
                        STYLES.normalText,
                        { paddingBottom: METRICS.marginBig, color: COLORS.primaryColor },
                      ]}
                    >
                      View/Edit Licensing Agreement
                    </Text>
                  </TouchableOpacity>
                  <View style={[styles.section, { marginBottom: METRICS.marginBig }]}>
                    <Text style={[STYLES.normalText, { marginBottom: METRICS.marginTiny }]}>
                      Add Price
                    </Text>
                    <TextInput
                      selectionColor={COLORS.primaryColor}
                      keyboardAppearance="dark"
                      style={styles.textInput}
                      value={leaseWavPrice}
                      keyboardType="numeric"
                      onChangeText={(text) =>
                        this.onChangePrice('leaseWavPrice', text, 'Lease WAV')
                      }
                    />
                  </View>
                  <Text style={[STYLES.mediumText, { marginBottom: METRICS.spacingTiny }]}>
                    Choose WAV File
                  </Text>
                  <TouchableOpacity
                    style={{ flexDirection: 'row', alignItems: 'center' }}
                    onPress={() => {
                      this.setState(
                        { fileType: { ...fileType, leaseWAV: 'Upload' }, mainFile: true },
                        () => this.onPressUpload('Lease WAV', leaseWavPrice)
                      );
                    }}
                  >
                    {leaseWAVIndex >= 0 ? (
                      <ActivityIndicator size="small" color={COLORS.purpleColor} />
                    ) : null}
                    <Text
                      style={[
                        STYLES.mediumText,
                        {
                          paddingVertical: METRICS.spacingSmall,
                          marginLeft: METRICS.spacingNormal,
                        },
                        {
                          color: this.state.options.find(
                            (item) => item.purchase_option === 'Lease WAV'
                          )?.in_app_file
                            ? COLORS.purpleColor
                            : COLORS.primaryColor,
                        },
                      ]}
                    >
                      {leaseWAVIndex >= 0
                        ? `Uploading ${this.props.uploadingProgress[leaseWAVIndex].progress.toFixed(
                            2
                          )}%`
                        : this.state.options.find((item) => item.purchase_option === 'Lease WAV')
                            ?.in_app_file?.filename || '+ Choose File'}
                    </Text>
                    {this.state.options.find(item => item.purchase_option === 'Lease WAV')?.in_app_file?.filename &&
                    <TouchableOpacity onPress={() => {
                      this.deleteCraftItem(this.state.options.find(item => item.purchase_option === 'Lease WAV'))
                    }}>
                      <CustomIcon name="cancel-button" style={styles.icon2}/>
                    </TouchableOpacity>
                    }
                  </TouchableOpacity>
                </View>
              )}

              {/* MUSIC: Lease MP3 */}
              {storeType === 'Music' && (
                <TouchableOpacity
                  style={styles.checkItemWrapper}
                  onPress={() => this.setPurchaseOption('Lease MP3')}
                >
                  <CircleCheck
                    value={purchaseOptions.includes('Lease MP3')}
                    clickHandler={() => this.setPurchaseOption('Lease MP3')}
                  />
                  <Text style={[STYLES.mediumText, { marginLeft: METRICS.spacingNormal }]}>
                    Lease MP3
                  </Text>
                </TouchableOpacity>
              )}
              {storeType === 'Music' && purchaseOptions.includes('Lease MP3') && (
                <View style={styles.contentWrapper}>
                  <TouchableOpacity onPress={() => this.showNonMusicModal(true)}>
                    <Text
                      style={[
                        STYLES.normalText,
                        { paddingBottom: METRICS.marginBig, color: COLORS.primaryColor },
                      ]}
                    >
                      View/Edit Licensing Agreement
                    </Text>
                  </TouchableOpacity>
                  <View style={[styles.section, { marginBottom: METRICS.marginBig }]}>
                    <Text style={[STYLES.normalText, { marginBottom: METRICS.marginTiny }]}>
                      Add Price
                    </Text>
                    <TextInput
                      selectionColor={COLORS.primaryColor}
                      keyboardAppearance="dark"
                      style={styles.textInput}
                      value={leaseMP3Price}
                      keyboardType="numeric"
                      onChangeText={(text) =>
                        this.onChangePrice('leaseMP3Price', text, 'Lease MP3')
                      }
                    />
                  </View>
                  <Text style={[STYLES.mediumText, { marginBottom: METRICS.spacingTiny }]}>
                    Choose MP3 File
                  </Text>
                  <TouchableOpacity
                    style={{ flexDirection: 'row', alignItems: 'center' }}
                    onPress={() => {
                      this.setState(
                        { fileType: { ...fileType, leaseMP3: 'Upload' }, mainFile: true },
                        () => this.onPressUpload('Lease MP3', leaseMP3Price)
                      );
                    }}
                  >
                    {leaseMP3Index >= 0 ? (
                      <ActivityIndicator size="small" color={COLORS.purpleColor} />
                    ) : null}
                    <Text
                      style={[
                        STYLES.mediumText,
                        {
                          paddingVertical: METRICS.spacingSmall,
                          marginLeft: METRICS.spacingNormal,
                        },
                        {
                          color: this.state.options.find(
                            (item) => item.purchase_option === 'Lease MP3'
                          )?.in_app_file
                            ? COLORS.purpleColor
                            : COLORS.primaryColor,
                        },
                      ]}
                    >
                      {leaseMP3Index >= 0
                        ? `Uploading ${this.props.uploadingProgress[leaseMP3Index].progress.toFixed(
                            2
                          )}%`
                        : this.state.options.find((item) => item.purchase_option === 'Lease MP3')
                            ?.in_app_file?.filename || '+ Choose File'}
                    </Text>
                    {this.state.options.find(item => item.purchase_option === 'Lease MP3')?.in_app_file?.filename &&
                    <TouchableOpacity onPress={() => {
                      this.deleteCraftItem(this.state.options.find(item => item.purchase_option === 'Lease MP3'))
                    }}>
                      <CustomIcon name="cancel-button" style={styles.icon2}/>
                    </TouchableOpacity>
                    }
                  </TouchableOpacity>
                </View>
              )}

              {/* MUSIC: Lease Tracked Out */}
              {storeType === 'Music' && (
                <TouchableOpacity
                  style={styles.checkItemWrapper}
                  onPress={() => this.setPurchaseOption('Lease Tracked Out')}
                >
                  <CircleCheck
                    value={purchaseOptions.includes('Lease Tracked Out')}
                    clickHandler={() => this.setPurchaseOption('Lease Tracked Out')}
                  />
                  <Text style={[STYLES.mediumText, { marginLeft: METRICS.spacingNormal }]}>
                    Lease Tracked Out
                  </Text>
                </TouchableOpacity>
              )}
              {storeType === 'Music' && purchaseOptions.includes('Lease Tracked Out') && (
                <View style={styles.contentWrapper}>
                  <TouchableOpacity onPress={() => this.showNonMusicModal(true)}>
                    <Text
                      style={[
                        STYLES.normalText,
                        { paddingBottom: METRICS.marginBig, color: COLORS.primaryColor },
                      ]}
                    >
                      View/Edit Licensing Agreement
                    </Text>
                  </TouchableOpacity>
                  <View style={[styles.section, { marginBottom: METRICS.marginBig }]}>
                    <Text style={[STYLES.normalText, { marginBottom: METRICS.marginTiny }]}>
                      Add Price
                    </Text>
                    <TextInput
                      selectionColor={COLORS.primaryColor}
                      keyboardAppearance="dark"
                      style={styles.textInput}
                      value={leaseTrackPrice}
                      keyboardType="numeric"
                      onChangeText={(text) =>
                        this.onChangePrice('leaseTrackPrice', text, 'Lease Tracked Out')
                      }
                    />
                  </View>
                  <Text style={[STYLES.mediumText, { marginBottom: METRICS.spacingTiny }]}>
                    Choose In-App File
                  </Text>
                  <Text
                    style={[
                      STYLES.normalText,
                      {
                        color: COLORS.lightGrey,
                        fontFamily: 'lato',
                        fontSize: METRICS.fontSizeOK,
                        marginBottom: METRICS.spacingSmall,
                      },
                    ]}
                  >
                    You may add a studio session with tracked-out samples for the buyer to use
                    in-app.
                  </Text>
                  <TouchableOpacity>
                    <Text
                      style={[
                        STYLES.mediumText,
                        {
                          paddingVertical: METRICS.spacingSmall,
                          marginLeft: METRICS.spacingNormal,
                          color: COLORS.primaryColor,
                        },
                      ]}
                    >
                      + Studio
                    </Text>
                  </TouchableOpacity>

                  <Text
                    style={[
                      STYLES.mediumText,
                      { marginBottom: METRICS.spacingTiny, marginTop: METRICS.spacingNormal },
                    ]}
                  >
                    Choose Tracked Out WAV Files
                  </Text>
                  <Text
                    style={[
                      STYLES.normalText,
                      {
                        color: COLORS.lightGrey,
                        fontFamily: 'lato',
                        fontSize: METRICS.fontSizeOK,
                        marginBottom: METRICS.spacingSmall,
                      },
                    ]}
                  >
                    Select multiple audio files.
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState(
                        { fileType: { ...fileType, exclusive: 'Upload' }, mainFile: false },
                        () => this.onPressUpload('Lease Tracked Out', exclusivePrice)
                      );
                    }}
                  >
                    <Text
                      style={[
                        STYLES.mediumText,
                        {
                          paddingVertical: METRICS.spacingSmall,
                          marginLeft: METRICS.spacingNormal,
                          color: COLORS.primaryColor,
                        },
                      ]}
                    >
                      + Choose Files
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* MUSIC: Buy Sample Pack */}
              {storeType === 'Music' && (
                <TouchableOpacity
                  style={styles.checkItemWrapper}
                  onPress={() => this.setPurchaseOption('Buy Sample Pack')}
                >
                  <CircleCheck
                    value={purchaseOptions.includes('Buy Sample Pack')}
                    clickHandler={() => this.setPurchaseOption('Buy Sample Pack')}
                  />
                  <Text style={[STYLES.mediumText, { marginLeft: METRICS.spacingNormal }]}>
                    Buy Sample Pack
                  </Text>
                </TouchableOpacity>
              )}
              {storeType === 'Music' && purchaseOptions.includes('Buy Sample Pack') && (
                <View style={styles.contentWrapper}>
                  <TouchableOpacity onPress={() => this.showSPModal(true)}>
                    <Text
                      style={[
                        STYLES.normalText,
                        { paddingBottom: METRICS.marginBig, color: COLORS.primaryColor },
                      ]}
                    >
                      View/Edit Licensing Agreement
                    </Text>
                  </TouchableOpacity>
                  <View style={[styles.section, { marginBottom: METRICS.marginBig }]}>
                    <Text style={[STYLES.normalText, { marginBottom: METRICS.marginTiny }]}>
                      Add Price
                    </Text>
                    <TextInput
                      selectionColor={COLORS.primaryColor}
                      keyboardAppearance="dark"
                      style={styles.textInput}
                      value={buySamplePrice}
                      keyboardType="numeric"
                      onChangeText={(text) =>
                        this.onChangePrice('buySamplePrice', text, 'Buy Sample Pack')
                      }
                    />
                  </View>
                  <Text style={[STYLES.mediumText, { marginBottom: METRICS.spacingTiny }]}>
                    Choose In-App File
                  </Text>
                  <Text
                    style={[
                      STYLES.normalText,
                      {
                        color: COLORS.lightGrey,
                        fontFamily: 'lato',
                        fontSize: METRICS.fontSizeOK,
                        marginBottom: METRICS.spacingSmall,
                      },
                    ]}
                  >
                    You may add a studio session with tracked-out samples for the buyer to use
                    in-app.
                  </Text>
                  <TouchableOpacity>
                    <Text
                      style={[
                        STYLES.mediumText,
                        {
                          paddingVertical: METRICS.spacingSmall,
                          marginLeft: METRICS.spacingNormal,
                          color: COLORS.primaryColor,
                        },
                      ]}
                    >
                      + Studio
                    </Text>
                  </TouchableOpacity>
                  <Text
                    style={[
                      STYLES.mediumText,
                      { marginBottom: METRICS.spacingTiny, marginTop: METRICS.spacingNormal },
                    ]}
                  >
                    Choose Samples
                  </Text>
                  <Text
                    style={[
                      STYLES.normalText,
                      {
                        color: COLORS.lightGrey,
                        fontFamily: 'lato',
                        fontSize: METRICS.fontSizeOK,
                        marginBottom: METRICS.spacingSmall,
                      },
                    ]}
                  >
                    Select multiple audio files.
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState(
                        { fileType: { ...fileType, exclusive: 'Upload' }, mainFile: false },
                        () => this.onPressUpload('Buy Sample Pack', exclusivePrice)
                      );
                    }}
                  >
                    <Text
                      style={[
                        STYLES.mediumText,
                        {
                          paddingVertical: METRICS.spacingSmall,
                          marginLeft: METRICS.spacingNormal,
                          color: COLORS.primaryColor,
                        },
                      ]}
                    >
                      + Choose Files
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* MUSIC: Free */}
              {storeType === 'Music' && (
                <TouchableOpacity
                  style={styles.checkItemWrapper}
                  onPress={() => this.setPurchaseOption('Free')}
                >
                  <CircleCheck
                    value={purchaseOptions.includes('Free')}
                    clickHandler={() => this.setPurchaseOption('Free')}
                  />
                  <Text style={[STYLES.mediumText, { marginLeft: METRICS.spacingNormal }]}>
                    Free
                  </Text>
                </TouchableOpacity>
              )}

              {storeType !== 'Art' && purchaseOptions.includes('Free') && (
                <View style={styles.contentWrapper}>
                  <Text style={[STYLES.mediumText, { marginBottom: METRICS.spacingTiny }]}>
                    Choose In-App File
                  </Text>
                  <Text
                    style={[
                      STYLES.normalText,
                      {
                        color: COLORS.lightGrey,
                        fontFamily: 'lato',
                        fontSize: METRICS.fontSizeOK,
                        marginBottom: METRICS.spacingSmall,
                      },
                    ]}
                  >
                    File the buyer can use in-app, such as a studio session or a single audio file.
                  </Text>
                  <TouchableOpacity
                    style={{ flexDirection: 'row', alignItems: 'center' }}
                    onPress={() => {
                      this.setState(
                        { fileType: { ...fileType, free: 'Upload' }, mainFile: true },
                        () => this.onPressUpload('Free')
                      );
                    }}
                  >
                    {freeIndex >= 0 ? (
                      <ActivityIndicator size="small" color={COLORS.purpleColor} />
                    ) : null}
                    <Text
                      style={[
                        STYLES.mediumText,
                        {
                          paddingVertical: METRICS.spacingSmall,
                          marginLeft: METRICS.spacingNormal,
                        },
                        {
                          color: this.state.options.find((item) => item.purchase_option === 'Free')
                            ?.in_app_file
                            ? COLORS.purpleColor
                            : COLORS.primaryColor,
                        },
                      ]}
                    >
                      {freeIndex >= 0
                        ? `Uploading ${this.props.uploadingProgress[freeIndex].progress.toFixed(
                            2
                          )}%`
                        : this.state.options.find((item) => item.purchase_option === 'Free')
                            ?.in_app_file?.filename || '+ Choose File(s)'}
                    </Text>
                    {this.state.options.find(item => item.purchase_option === 'Free')?.in_app_file?.filename &&
                    <TouchableOpacity onPress={() => {
                      this.deleteCraftItem(this.state.options.find(item => item.purchase_option === 'Free'))
                    }}>
                      <CustomIcon name="cancel-button" style={styles.icon2}/>
                    </TouchableOpacity>
                    }
                  </TouchableOpacity>

                  <Text
                    style={[
                      STYLES.mediumText,
                      { marginBottom: METRICS.spacingTiny, marginTop: METRICS.spacingNormal },
                    ]}
                  >
                    Choose Export File(s)
                  </Text>
                  <Text
                    style={[
                      STYLES.normalText,
                      {
                        color: COLORS.lightGrey,
                        fontFamily: 'lato',
                        fontSize: METRICS.fontSizeOK,
                        marginBottom: METRICS.spacingSmall,
                      },
                    ]}
                  >
                    Files the buyer can use outside the app, such as tracked out audio files.
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState(
                        { fileType: { ...fileType, exclusive: 'Upload' }, mainFile: false },
                        () => this.onPressUpload('Free', exclusivePrice)
                      );
                    }}
                  >
                    <Text
                      style={[
                        STYLES.mediumText,
                        {
                          paddingVertical: METRICS.spacingSmall,
                          marginLeft: METRICS.spacingNormal,
                          color: COLORS.primaryColor,
                        },
                      ]}
                    >
                      + Choose File(s)
                    </Text>
                  </TouchableOpacity>
                  {this.state.options
                    .find((item) => item.purchase_option === 'Free')
                    ?.files_for_export.map((item, index) =>
                      this.renderUploadedItem(
                        item,
                        index,
                        this.state.options.find((item) => item.purchase_option === 'Free')
                      )
                    )}
                  {freeAdditional.map(this.renderUploadingItem)}
                </View>
              )}
            </CustomAccordion>
          )}
          <View style={{ paddingBottom: 200 * METRICS.ratioY }} />

            </>
          }
        </View>

        <FileUpload
          onClose={() => this.showFileModal(false)}
          status={fileModalVisible}
          storeType={storeType}
          onCloseRequest={() => this.showFileModal(false)}
          setOrientation={this.setOrientation}
          uploadFromLocal={this.uploadFromLocal}
          uploadFromCloud={this.uploadFromCloud}
        />
        <LicenseArtExclusive
          onClose={() => this.showExcArtModal(false)}
          status={ExcArtModalVisible}
          craftData=""
          royaltyData={() =>
            this.updateData(
              royaltyPercentage,
              nonTransformRoyaltyPercentage,
              addFees,
              noOfAdvertise
            )
          }
          userProfileData=""
          onCloseRequest={() => this.showExcArtModal(false)}
          royaltyData={(royaltyPercentage, nonTransformRoyaltyPercentage, addFees, noOfAdvertise) =>
            this.updateData(
              royaltyPercentage,
              nonTransformRoyaltyPercentage,
              addFees,
              noOfAdvertise
            )
          }
        />
        <LicenseArtLease
          onClose={() => this.showNonArtModal(false)}
          status={NonArtModalVisible}
          craftData=""
          userProfileData=""
          onCloseRequest={() => this.showNonArtModal(false)}
          royaltyData={(royaltyPercentage, nonTransformRoyaltyPercentage, addFees, noOfAdvertise) =>
            this.updateData(
              royaltyPercentage,
              nonTransformRoyaltyPercentage,
              addFees,
              noOfAdvertise
            )
          }
        />
        <LicenseMusicExc
          onClose={() => this.showExcMusicModal(false)}
          status={ExcMusicModalVisible}
          craftData=""
          royaltyData={(royaltyPercentage, nonTransformRoyaltyPercentage, addFees, noOfAdvertise) =>
            this.updateData(
              royaltyPercentage,
              nonTransformRoyaltyPercentage,
              addFees,
              noOfAdvertise
            )
          }
          userProfileData=""
          onCloseRequest={() => this.showExcMusicModal(false)}
          royaltyData={(royaltyPercentage, nonTransformRoyaltyPercentage, addFees, noOfAdvertise) =>
            this.updateData(
              royaltyPercentage,
              nonTransformRoyaltyPercentage,
              addFees,
              noOfAdvertise
            )
          }
        />
        <LicenseMusicNon
          onClose={() => this.showNonMusicModal(false)}
          status={NonMusicModalVisible}
          craftData=""
          userProfileData=""
          onCloseRequest={() => this.showNonMusicModal(false)}
          royaltyData={(royaltyPercentage, nonTransformRoyaltyPercentage, addFees, noOfAdvertise) =>
            this.updateData(
              royaltyPercentage,
              nonTransformRoyaltyPercentage,
              addFees,
              noOfAdvertise
            )
          }
        />
        <LicenseMusicSP
          onClose={() => this.showSPModal(false)}
          status={SPModalVisible}
          craftData=""
          userProfileData=""
          onCloseRequest={() => this.showSPModal(false)}
          royaltyData={(royaltyPercentage, nonTransformRoyaltyPercentage, addFees, noOfAdvertise) =>
            this.updateData(
              royaltyPercentage,
              nonTransformRoyaltyPercentage,
              addFees,
              noOfAdvertise
            )
          }
        />
        <Uploader
          onClose={() => this.showUploader(false)}
          status={uploaderVisible}
          onCloseRequest={() => this.showUploader(false)}
          onShowFileModal={this.onShowFileModal}
          storeType={this.state.storeType}
          mainFile={this.state.mainFile}
          onFilePress={(files) => this.addFile(files)}
          onUploadArt={() => {
            this.setState(
              {
                uploaderVisible: false,
                uploadingArt: true,
              },
              () => this.showFileModal(true)
            );
          }}
          onUploadMusic={() => {
            this.setState({ uploadingArt: false });
            this.uploadFromCloud('all');
          }}
          uploadedItems={this.state.uploadedItems}
          deleteItem={(index, id)=>{
            const {uploadedItems} = this.state;
            this.state.options.map(option=>{
              option.files_for_export.map(item=>{
                if (item.id===uploadedItems[index].id)
                  this.deleteCraftItem(option, item.id)
              });
              if (option.in_app_file?.id ===uploadedItems[index].id)
                this.deleteCraftItem(option)
            });
            setTimeout(()=>this.deleteFile(id), 2000);
            uploadedItems.splice(index, 1);
            this.setState({uploadedItems})
          }}
          uploadedMusic={this.state.uploadedMusic}
          deleteMusic={(index, id)=>{
            const {uploadedMusic} = this.state;
            this.state.options.map(option=>{
              option.files_for_export.map(item=>{
                if (item.id===uploadedMusic[index].id)
                  this.deleteCraftItem(option, item.id)
              });
              if (option.in_app_file?.id ===uploadedMusic[index].id)
                this.deleteCraftItem(option)
            });
            setTimeout(()=>this.deleteFile(id), 2000);
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
    paddingVertical: METRICS.spacingSmall,
  },
  contentWrapper: {
    paddingLeft: METRICS.spacingHuge,
    paddingRight: METRICS.spacingNormal,
    paddingVertical: METRICS.spacingNormal,
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
    marginBottom: METRICS.spacingSmall,
  },
  collapseBody: {
    paddingBottom: METRICS.marginSmall,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    height: METRICS.rowHeight,
  },
  checkTitle: {
    marginLeft: METRICS.spacingTiny,
  },
  textInput: {
    height: METRICS.rowHeightSmall,
    width: 200 * METRICS.ratioX,
    borderWidth: 1 * METRICS.ratioX,
    borderColor: COLORS.primaryColor,
    padding: METRICS.spacingTiny,
    fontFamily: 'lato',
    color: COLORS.whiteColor,
  },
  webInput: {
    height: METRICS.rowHeightSmall,
    borderWidth: 1 * METRICS.ratioX,
    borderColor: COLORS.primaryColor,
    padding: METRICS.spacingTiny,
    fontFamily: 'lato',
    color: COLORS.whiteColor,
  },
  descriptionInput: {
    minHeight: 2 * METRICS.rowHeightSmall,
    maxHeight: 7 * METRICS.rowHeightSmall,
    borderWidth: 1 * METRICS.ratioX,
    borderColor: COLORS.primaryColor,
    padding: METRICS.spacingTiny,
    fontFamily: 'lato',
    color: COLORS.whiteColor,
  },
  avatarWrapper: {
    width: METRICS.avatar,
    height: METRICS.avatar,
    borderRadius: METRICS.avatarsmall,
    marginHorizontal: METRICS.spacingNormal,
    opacity: 0.5,
  },
  selectedAvatarWrapper: {
    width: METRICS.avatar,
    height: METRICS.avatar,
    borderRadius: METRICS.avatarsmall,
    marginHorizontal: METRICS.spacingNormal,
    borderColor: COLORS.primaryColor,
    borderWidth: 1 * METRICS.ratioX,
    opacity: 1,
  },
  icon2: {
    color: COLORS.purpleColor,
    fontSize: METRICS.fontSizeBigger,
    justifyContent: 'center',
    alignSelf: 'center',
    paddingRight: METRICS.spacingSmall,
    paddingLeft: METRICS.spacingSmall,
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
    updateStoreState: (data) => dispatch(updateStoreState(data)),
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

export default connect(mapStateToProps, mapDispatchToProps)(withNavigation(Store));
