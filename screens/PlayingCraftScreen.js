import React from 'react';
import 'react-native-gesture-handler';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Linking,
  Clipboard,
  Modal,
  Share,
  AppState,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Swiper from 'react-native-swiper';
import Orientation from 'react-native-orientation-locker';
import _ from 'lodash';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import { connect } from 'react-redux';
import { CustomIcon, ReportModal, ConfirmModal, PayModal, ModalWrapper } from '../components';
import Playing from '../components/PlayingCraft/index';
import Infor from '../components/PlayingCraft/Infor';
import Store from '../components/PlayingCraft/Store';
import SocialShare from '../components/PlayingCraft/SocialShare';
import AddToCraftlish from '../components/PlayingCraft/AddToCraftlish';
import Contest from '../components/PlayingCraft/Contest';
import Buy from '../components/PlayingCraft/Buy';
import Env from '../helpers/environment';
import { COLORS, METRICS } from '../global';
import { craft } from '../global/Images';
import PlayingCraftService from '../services/PlayingCraftService';
import PaymentService from '../services/PaymentService';
import Report from '../components/PlayingCraft/Report';
import Option from '../components/PlayingCraft/Option';
import { AudioPlayer } from '../libs/rnsuperpowered';
import Derivatives from './Derivatives';
import Comments from '../components/PlayingCraft/Comment/CommentScreen';
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
  updateOnBackCraftList,
  updateIsShuffle,
  updateIsPlaying,
  updateRepeat,
  updateOpenModalValue,
  updateIsCraftInit,
} from '../store/actions';
import store from '../store/configureStore';

const radio_props = [
  { label: '  Miscategorized Content', value: 0 },
  { label: '  Inappropriate Content', value: 1 },
  { label: '  Abuse/Harassment', value: 2 },
  { label: '  Intellectual Property/Copyright Infringement', value: 3 },
];

class PlayingCraftScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tab: 0,
      likeStatus: false,
      toggle: {
        report: false,
        option: false,
      },
      buyModal: {
        visible: false,
        title: 'Buy Exclusive',
      },
      scrollStatus: false,
      curCraftId: 0,
      selectedItem: 0,
      payModalVisible: false,
      editDetailModalVisible: false,
      paypalUrl: '',
      playOrientation: 'Portrait',
      playingStatusArr: [],
      isShowControl: -1,
      isScrollTop: true,
      reportModalVisible: false,
      reportOptionSelected: 0,
      deleteModalVisible: false,
      isShuffle: false,
      buyPrice: 0,
      storeOption: 1,
      storeTitle: '',
      filePath: '',
      resData: Object,
      modalDerivatives: false,
      modalComments: this.props.title === 'CommentReport',
      crafts: [],
      progress: 0,

      exist_select: false, // made by dongdong
    };

    this.navigation = this.props.navigation;
    this.scrollDownOffset = 0.9 * METRICS.screenHeight;
    this.inforef = React.createRef();
    this.storeref = React.createRef();
    this.playingref = React.createRef();
    this.commentref = React.createRef();
    this.swiperref = null;
    this.timeInterval = null;
    this.backupCrafts = [];
    if (this.props.playingCrafts === undefined) {
      const crafts = [];
      this.props.setPlayingCrafts(crafts);
    }

    this.onPlay = this.onPlay.bind(this);
    this.onLike = this.onLike.bind(this);
    this.onRepeat = this.onRepeat.bind(this);
    this.onShuffle = this.onShuffle.bind(this);
    this.togglePlay = this.togglePlay.bind(this);
    this.setFinsihSliderStatus = this.setFinsihSliderStatus.bind(this);
    this.setChangeSliderStatus = this.setChangeSliderStatus.bind(this);
  }

  static navigationOptions = () => ({
    header: null,
  });

  setFinsihSliderStatus = () => {
    // console.log('not');
  };

  setChangeSliderStatus = () => {
    // console.log('not');
  };

  onLike = () => {
    // console.log('not');
  };

  onRepeat = () => {
    // console.log('not');
  };

  togglePlay = () => {
    // console.log('not');
  };

  componentDidMount() {
    this.props.setCraftInit(1); // made by dongdong
    this.props.updateSeekOnBack(this.state.progress);
    this.props.updatePrevState(store.getState());
    this.setState({ withoutPause: true }, () =>
      setTimeout(() => {
        if (this.swiperref && !this.state.exist_select) {
          this.swiperref.scrollBy(this.props.curCraftId, false);
        } else {
          if (this.props.curCraftId != this.state.curCraftId)
            this.swiperref.scrollBy(this.props.curCraftId - this.state.curCraftId, false);  
          else 
            this.swiperref.scrollBy(this.props.curCraftId, false);
        }
        this.setState({ exist_select: false });
      }, 2000)
    );
    this.props.setPlayPause(this.onPlay);
    this.props.onLike(this.onLike);
    this.props.onRepeat(this.onRepeat);
    this.props.onShuffle(this.onShuffle);
    this.props.togglePlay(this.togglePlay);
    this.props.setFinsihSliderStatus(this.setFinsihSliderStatus);
    this.props.setChangeSliderStatus(this.setChangeSliderStatus);

    if (typeof this.props.onBackCraftList === 'function') {
      this.props.open();
      setTimeout(() => this.tabSelected(7), 100);
      this.props.updateOnBackCraftList(null);
    }

    setInterval(() => {
      this.props.onLike(this.onLike);
      this.props.onRepeat(this.onRepeat);
      this.props.onShuffle(this.onShuffle);
      this.props.togglePlay(this.togglePlay);
      this.props.setFinsihSliderStatus(this.setFinsihSliderStatus);
      this.props.setChangeSliderStatus(this.setChangeSliderStatus);
    }, 1000);

    if (this.props.openComments) {
      this.props.updateOpenComments(false);
      this.tabSelected(2);
    }
    this.backupCrafts = _.cloneDeep(this.props.playingCrafts);
    this.setState({ crafts: this.props.playingCrafts });
    this.setState({ isShowControl: -1, curCraftId: this.props.curCraftId });

    // Initialize craft playing status in swiper
    const playingStatusArr = new Array(this.props.playingCrafts.length);
    playingStatusArr.fill(0);
    playingStatusArr[this.props.curCraftId] = 1;
    this.props.updateMiniPlay(true);
    if (this.props.isPlaying === 0) playingStatusArr[this.props.curCraftId] = 0;

    if (this.props.editingCraftId) {
      const { playingStatusArr } = this.state;
      playingStatusArr[this.props.curCraftId] = false;
    }

    this.props.updateEditingCraftId(this.props.playingCrafts[this.props.curCraftId].id);
    PlayingCraftService.getCraft(this.props.playingCrafts[this.props.curCraftId].id)
      .then((res) => {
        this.setState({ resData: res.data });
        this.setState({ storeType: res.data.store_option.type });
        this.props.playingCrafts[this.props.curCraftId].authors = res.data.authors;
        const items = res.data.craft_items;
        for (let i = 0; i < items.length; i++) {
          if (items[i].purchase_option === 'Exclusive License' && items[i].quantity === -1) {
            this.setState({ storeOption: 0 });
            break;
          }
        }
        this.setState({ crafts: this.props.playingCrafts });
      })
      .catch((err) => {
        // console.log(err);
      });

    this.setState({ playingStatusArr });
    if (this.props.openModalValue === 1) {
      this.props.updateOpenModalValue(0);
      this.setState({
        toggle: {
          option: true,
        },
        editDetailModalVisible: true,
      });
    }

    Orientation.lockToPortrait();
  }

  componentWillUnmount() {
    AudioPlayer.pause();
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.isCraftInit === -1) {
      AudioPlayer.pause();
      // if (this.swiperref) {
      //   console.log('ino 0')
        
      // }
      this.setState({ exist_select: true });
      this.componentDidMount();
      return;
    }
    if (prevState.curCraftId !== this.state.curCraftId) {
      setTimeout(() => {
        this.props.onLike(this.onLike);
        this.props.onRepeat(this.onRepeat);
        this.props.onShuffle(this.onShuffle);
        this.props.togglePlay(this.togglePlay);
        this.props.setFinsihSliderStatus(this.setFinsihSliderStatus);
        this.props.setChangeSliderStatus(this.setChangeSliderStatus);
      }, 500);
      clearTimeout(this.timeInterval);
      if (this.state.isShowControl !== -1) this.setState({ isShowControl: -1 });
    }
    if (this.state.crafts !== this.props.playingCrafts) {
      AudioPlayer.pause();
      setTimeout(() => {
        this.props.onLike(this.onLike);
        this.props.onRepeat(this.onRepeat);
        this.props.onShuffle(this.onShuffle);
        this.props.togglePlay(this.togglePlay);
        this.props.setFinsihSliderStatus(this.setFinsihSliderStatus);
        this.props.setChangeSliderStatus(this.setChangeSliderStatus);
      }, 500);
      this.props.updateRepeat(false);
      if (this.props.openComments) {
        this.props.updateOpenComments(false);
        this.tabSelected(2);
      } else {
        this.setState({ tab: 0, scrollStatus: false });
        this.scrollView.scrollTo({ x: 0, y: 0, animated: true });
        this.props.setSwipeAwailable(true);
      }
      this.backupCrafts = _.cloneDeep(this.props.playingCrafts);

      this.swiperref.scrollBy(this.props.curCraftId - this.state.curCraftId, false);
      this.setState({ crafts: this.props.playingCrafts });
      this.setState({ isShowControl: -1, progress: 0, curCraftId: this.props.curCraftId });

      // Initialize craft playing status in swiper
      const playingStatusArr = new Array(this.props.playingCrafts.length);
      playingStatusArr.fill(0);
      playingStatusArr[this.props.curCraftId] = 1;
      this.props.updateMiniPlay(true);
      if (this.props.isPlaying === 0) playingStatusArr[this.props.curCraftId] = 0;

      if (this.props.editingCraftId) {
        const { playingStatusArr } = this.state;
        playingStatusArr[this.props.curCraftId] = false;
      }
      
      Dimensions.addEventListener('change', () => {
        this.getInitByOrientation();
      });

      this.props.updateEditingCraftId(this.props.playingCrafts[this.props.curCraftId].id);
      PlayingCraftService.getCraft(this.props.playingCrafts[this.props.curCraftId].id)
        .then((res) => {
          this.setState({ resData: res.data });
          this.setState({ storeType: res.data.store_option.type });
          this.props.playingCrafts[this.props.curCraftId].authors = res.data.authors;
          const items = res.data.craft_items;
          for (let i = 0; i < items.length; i++) {
            if (items[i].purchase_option === 'Exclusive License' && items[i].quantity === -1) {
              this.setState({ storeOption: 0 });
              break;
            }
          }
          this.setState({ crafts: this.props.playingCrafts });
        })
        .catch((err) => {
          // console.log(err);
        });

      this.setState({ playingStatusArr });
      AudioPlayer.loadFile(this.props.playingCrafts[this.props.curCraftId].audio_url);
      if (this.props.isPlaying === 1) AudioPlayer.togglePlayback();
      if (this.props.openModalValue === 1) {
        this.props.updateOpenModalValue(0);
        this.setState({
          toggle: {
            option: true,
          },
          editDetailModalVisible: true,
        });
      }
    } else if (prevProps.updateCraftPlaying === false && this.props.craftPlaying === true) {
      // else if (prevProps.updateCraftPlaying === false && this.props.updateCraftPlaying === true) {
      setTimeout(() => {
        this.props.onLike(this.onLike);
        this.props.onRepeat(this.onRepeat);
        this.props.onShuffle(this.onShuffle);
        this.props.togglePlay(this.togglePlay);
        this.props.setFinsihSliderStatus(this.setFinsihSliderStatus);
        this.props.setChangeSliderStatus(this.setChangeSliderStatus);
      }, 500);
      AudioPlayer.pause();
      this.props.updateRepeat(false);
      if (this.props.openComments) {
        this.props.updateOpenComments(false);
        this.tabSelected(2);
      } else {
        this.setState({ tab: 0, scrollStatus: false });
        this.scrollView.scrollTo({ x: 0, y: 0, animated: true });
        this.props.setSwipeAwailable(true);
      }
      this.swiperref.scrollBy(this.props.curCraftId - this.state.curCraftId, false);
      this.backupCrafts = _.cloneDeep(this.props.playingCrafts);
      this.setState({ crafts: this.props.playingCrafts });
      this.setState({ isShowControl: -1, progress: 0, curCraftId: this.props.curCraftId });
      // Initialize craft playing status in swiper
      const playingStatusArr = new Array(this.props.playingCrafts.length);
      playingStatusArr.fill(0);
      playingStatusArr[this.props.curCraftId] = 1;
      this.props.updateMiniPlay(true);
      if (this.props.isPlaying === 0) playingStatusArr[this.props.curCraftId] = 0;

      if (this.props.editingCraftId) {
        const { playingStatusArr } = this.state;
        playingStatusArr[this.props.curCraftId] = false;
      }
      Dimensions.addEventListener('change', () => {
        this.getInitByOrientation();
      });
      this.props.updateEditingCraftId(this.props.playingCrafts[this.props.curCraftId].id);
      PlayingCraftService.getCraft(this.props.playingCrafts[this.props.curCraftId].id)
        .then((res) => {
          // console.log("store ResData = ", res.data);
          this.setState({ resData: res.data });
          this.setState({ storeType: res.data.store_option.type });
          // console.log("store ResData = ", res.data);
          this.props.playingCrafts[this.props.curCraftId].authors = res.data.authors;
          const items = res.data.craft_items;
          for (let i = 0; i < items.length; i++) {
            // console.log('quantity = ', items[i]);
            if (items[i].purchase_option === 'Exclusive License' && items[i].quantity === -1) {
              this.setState({ storeOption: 0 });
              break;
            }
          }
          // console.log('finish');
          this.setState({ crafts: this.props.playingCrafts });
        })
        .catch((err) => {
          // console.log(err);
        });

      this.setState({ playingStatusArr });
      AudioPlayer.loadFile(this.props.playingCrafts[this.props.curCraftId].audio_url);
      if (this.props.isPlaying === 1) AudioPlayer.togglePlayback();
      if (this.props.openModalValue === 1) {
        this.props.updateOpenModalValue(0);
        this.setState({
          toggle: {
            option: true,
          },
          editDetailModalVisible: true,
        });
      }
    }
  }

  // Media Control
  onPlay = () => {
    const { playingStatusArr } = this.state;
    this.props.updateMiniPlay(!playingStatusArr[this.props.curCraftId]);
    this.props.updateIsPlaying(!playingStatusArr[this.props.curCraftId])
    playingStatusArr[this.props.curCraftId] = !playingStatusArr[this.props.curCraftId];
    this.setState({ playingStatusArr });
  };

  // CHECK THIS
  onPrev = () => {
    AudioPlayer.pause();
    this.setState({ tab: 0, scrollStatus: false });
    this.scrollView.scrollTo({ x: 0, y: 0, animated: true });
    this.props.setSwipeAwailable(true);

    if (this.props.curCraftId === 0) {
      return;
    }

    this.props.updateRepeat(false);
    this.props.updateCurCraftId(this.props.curCraftId - 1);
    this.props.updateCurrentTime(0);

    this.swiperref.scrollBy(-1);
  };

  // CHECK THIS
  onNext = () => {
    AudioPlayer.pause();
    this.setState({ tab: 0, scrollStatus: false });
    this.scrollView.scrollTo({ x: 0, y: 0, animated: true });
    this.props.setSwipeAwailable(true);

    if (this.props.curCraftId === this.props.playingCrafts.length - 1) {
      // if(this.props.curCraftId!==0)
      //   this.swiperref.scrollBy(-this.props.curCraftId);
      // this.props.updateCurCraftId(0);
      // this.props.updateCurrentTime(0);
      return;
    }

    this.props.updateRepeat(false);
    this.props.updateCurCraftId(this.props.curCraftId + 1);
    this.props.updateCurrentTime(0);

    // console.log('next: ', this.props.curCraftId);
    this.swiperref.scrollBy(1);
  };

  // Screen Control
  isPortrait = () => {
    const dim = Dimensions.get('screen');
    return dim.height >= dim.width;
  };

  getInitByOrientation = () => {
    const craft_data = this.props.playingCrafts[this.props.curCraftId];
    if (craft_data.orientation.type === 'Landscape') {
      Orientation.getDeviceOrientation((deviceOrientation) => {
        if (deviceOrientation === 'LANDSCAPE-LEFT' || deviceOrientation === 'LANDSCAPE-RIGHT') {
          this.setState({ playOrientation: 'Landscape' });
          Orientation.lockToPortrait();
        } else {
          this.setState({ playOrientation: 'Portrait' });
          Orientation.lockToPortrait();
        }
      });
    } else {
      this.setState({ playOrientation: 'Portrait' });
      Orientation.lockToPortrait();
    }
  };

  getIndex(id) {
    for (let i = 0; i < this.props.playingCrafts.length; i++) {
      if (this.props.playingCrafts[i].id === id) {
        this.setState({ idx: i });
        break;
      }
    }
  }

  onViewChange = (index) => {
    // console.warn('view change');
    if (this.timeInterval) {
      clearTimeout(this.timeInterval);
    }
    if (this.state.withoutPause) this.setState({ withoutPause: false });
    else AudioPlayer.pause();

    this.setState({ isShowControl: -1, tab: 0, scrollStatus: false });
    this.scrollView.scrollTo({ x: 0, y: 0, animated: true });
    this.props.setSwipeAwailable(true);

    // const { index } = context.state;

    if (index != -1) {
      this.props.updateCurCraftId(index);
    }
    this.props.updateCurrentTime(0);
    this.refreshTabs();

    const playingStatusArr = new Array(this.props.playingCrafts.length);
    playingStatusArr.fill(0);
    playingStatusArr[index] = 1;

    if (index < 0) {
      // add dongdong
      index = 0;
    }
    this.setState(
      {
        curCraftId: index, // this.props.curCraftId,
        playingStatusArr,
      },
      () => {
        if (
          this.props.playingCrafts[this.state.curCraftId].orientation.type ===
            'Full-screen Portrait' &&
          this.state.isScrollTop
        ) {
          this.setState(
            {
              isShowControl: index,
            },
            () => {
              this.onShowControl();
            }
          );
        }
      }
    );
  };

  onShowControl = (clickevent = false) => {
    if (
      !this.state.isScrollTop ||
      this.props.playingCrafts[this.state.curCraftId].orientation.type !== 'Full-screen Portrait'
    ) {
      return;
    }
    if (this.state.isShowControl >= 0 || clickevent) {
      if (this.timeInterval) clearTimeout(this.timeInterval);
      this.setState({ isShowControl: -1 }, () => {
        if (
          this.props.playingCrafts[this.state.curCraftId].orientation.type ===
          'Full-screen Portrait'
        ) {
          this.timeInterval = setTimeout(() => {
            this.setState({ isShowControl: this.props.curCraftId });
          }, 15000);
        }
      });
    } else {
      this.setState({ isShowControl: this.props.curCraftId + 1 });
    }
  };

  handleScroll = (event) => {
    if (event.nativeEvent.contentOffset.y === 0) {
      this.props.setSwipeAwailable(true);
      if (this.state.tab !== 0) this.setState({ tab: 0, scrollStatus: false });
      if (!this.state.isScrollTop) this.setState({ isScrollTop: true });
      if (
        this.props.playingCrafts[this.state.curCraftId].orientation.type === 'Full-screen Portrait'
      )
        this.onShowControl();
    } else if (event.nativeEvent.contentOffset.y < -70) {
      this.props.updateBackupCraft(this.props.playingCrafts[this.props.curCraftId]);
      this.props.updateIsPlaying(this.state.playingStatusArr[this.props.curCraftId]);
      const screen = this.props.backScreen;

      if (!this.state.goingDown) {
        this.setState({ goingDown: true, tab: 0, scrollStatus: false });
        this.props.goDown();
        this.props.updateCraftPlaying(0);
        setTimeout(() => this.setState({ goingDown: false }), 600);
      }
    } else {
      if (this.state.isScrollTop) this.setState({ isScrollTop: false });
      if (this.timeInterval) {
        clearTimeout(this.timeInterval);
      }
      if (this.state.isShowControl !== -1) this.setState({ isShowControl: -1 });
    }
  };

  // More modal
  onDeleteCraft = () => {
    PlayingCraftService.deleteCraft(this.props.playingCrafts[this.props.curCraftId].id)
      .then((res) => {
        this.props.playingCrafts.splice(this.props.curCraftId, 1);
        this.props.updateCurCraftId(this.props.curCraftId % this.props.playingCrafts.length);
        this.setState({ curCraftId: this.props.curCraftId });
        this.refreshTabs();
        this.closeDeleteModal();
        this.setToggle('option', false);
      })
      .catch((err) => {
        // console.log(err.response.data.error);
      });
  };

  setToggle = (key, value) => {
    this.setState({
      toggle: {
        ...this.state.toggle,
        [key]: value,
      },
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

  onHide = (isHide) => {
    if (isHide) {
      PlayingCraftService.makeHidden(this.props.editingCraftId)
        .then((res) => {})
        .catch((err) => {
          // console.log(err.response.data.error);
        });
    } else {
      PlayingCraftService.makeVisible(this.props.editingCraftId)
        .then((res) => {})
        .catch((err) => {
          // console.log(err.response.data.error);
        });
    }
    this.props.playingCrafts[this.props.curCraftId].is_visible = !isHide;
  };

  onPrivate = (isPrivate) => {
    if (isPrivate) {
      PlayingCraftService.makePrivate(this.props.editingCraftId)
        .then((res) => {})
        .catch((err) => {
          // console.log(err.data.response.error);
        });
    } else {
      PlayingCraftService.makePublic(this.props.editingCraftId)
        .then((res) => {})
        .catch((err) => {
          // console.log(err.data.response.error);
        });
    }
    this.props.playingCrafts[this.props.curCraftId].is_public = !isPrivate;
  };

  closeDeleteModal = () => {
    this.setState({
      deleteModalVisible: false,
    });
  };

  // Edit detail
  showEditModal = () => {
    this.props.updateEditingCraftId(this.state.crafts[this.state.curCraftId].id);
    this.props.updateAddMusicMethod('');
    this.setState({
      editDetailModalVisible: true,
    });
  };

  navigationHandler = (routeName) => {
    const { playingStatusArr } = this.state;
    if (playingStatusArr[this.props.curCraftId]) {
      playingStatusArr[this.props.curCraftId] = false;
      this.props.updateMiniPlay(false);
      AudioPlayer.togglePlayback();
    }
    this.setState({ playingStatusArr });
    this.props.updateSeekOnBack(this.state.progress);
    this.props.updateTitle('PlayingCraft');
    this.props.updateBackScreen(
      this.props.navigation.state.routeKeyHistory[
        this.props.navigation.state.routeKeyHistory.length - 1
      ]
    );

    this.setState(
      {
        editDetailModalVisible: false,
        toggle: {
          option: false,
        },
      },
      () => {
        this.props.navigation.navigate(routeName, {
          openModal: () => {
            this.setState({
              editDetailModalVisible: true,
              toggle: {
                option: true,
              },
            });
          },
        });
      }
    );
  };

  onCraftSave = () => {
    PlayingCraftService.getCraft(this.props.playingCrafts[this.props.curCraftId].id)
      .then((result) => {
        this.props.playingCrafts[this.props.curCraftId] = result.data;
        this.setState({
          editDetailModalVisible: false,
        });
      })
      .catch((err) => {
        // console.log(err.response.data.error);
      });
    this.refreshTabs();
    this.setState({
      editDetailModalVisible: false,
    });
  };

  closeEditModal = () => {
    this.props.updateStoreState(null);
    this.props.updateEditingCraftId(0);
    this.setState({ editDetailModalVisible: false });
  };

  // Report
  onReport = () => {
    this.setState({
      reportModalVisible: true,
    });
  };

  onSubmitReport = () => {
    PlayingCraftService.reportCraft(
      radio_props[this.state.reportOptionSelected].label,
      this.props.playingCrafts[this.props.curCraftId].id
    ).then((res) => {});
    this.closeReportModal();
  };

  reportActionSelected = (index) => {
    this.setState({
      reportOptionSelected: index,
    });
  };

  setReportModalVisible = (visible) => {
    this.setState({ reportModalVisible: visible });
  };

  editModalCloseRequest = () => {
    this.setState({ editDetailModalVisible: false });
  };

  closeReportModal = () => {
    this.setState({
      reportModalVisible: false,
    });
  };

  // Tab manage section
  refreshTabs = () => {
    if (this.state.tab === 5 && !this.props.playingCrafts[this.props.curCraftId].store) {
      this.setState({
        tab: 4,
      });
    }
    if (this.inforef.current) {
      this.inforef.current.refreshContent();
    }
    if (this.storeref.current) {
      this.storeref.current.refreshContent();
    }
    if (this.commentref.current) {
      this.commentref.current.updateCommentsData();
    }
  };

  refresh = () => {
    this.scrollView.scrollTo({ x: 0, y: 0, animated: true });
  };

  tabSelected = (value) => {
    if (this.timeInterval) {
      clearTimeout(this.timeInterval);
    }
    this.setState({ isShowControl: -1 });

    switch (value) {
      case 1:
        break;
      case 2:
        this.setState(
          {
            tab: value,
          },
          () => {
            this.props.updatePrevState(store.getState());
            this.props.updateTitle('Comments');
            this.setState({ modalComments: true });
          }
        );
        break;
      case 3:
      case 4:
      case 5:
      case 7:
      case 8:
        this.setState(
          {
            tab: value,
            scrollStatus: true,
          },
          () => {
            this.scrollView.scrollTo({
              x: 0,
              y: Math.ceil(METRICS.taboffset),
              animated: true,
            });
            this.props.setSwipeAwailable(false);
          }
        );
        break;
      case 6:
        this.setState(
          {
            tab: value,
          },
          () => {
            this.props.updatePrevState(store.getState());
            this.props.updateTitle('Derivatives');
            this.setState({ modalDerivatives: true });
          }
        );
        break;
    }
  };

  // Share Tab
  addCraftlist = () => {
    this.setState({
      tab: 7,
    });
  };

  onClickCopyTab = () => {
    Clipboard.setString(`craftmusicapp://craft/${this.props.editingCraftId}`);
  };

  onClickMore = async () => {
    await AsyncStorage.setItem('user_info', JSON.stringify(this.props.user)); // add dongdong

    Share.share(
      {
        url: `craftmusicapp://craft/${this.props.editingCraftId}`,
      },
      {
        excludedActivityTypes: [
          'com.apple.UIKit.activity.PostToWeibo',
          'com.apple.UIKit.activity.Print',
          'com.apple.UIKit.activity.AssignToContact',
          'com.apple.UIKit.activity.SaveToCameraRoll',
          'com.apple.UIKit.activity.AddToReadingList',
          'com.apple.UIKit.activity.PostToFlickr',
          'com.apple.UIKit.activity.PostToVimeo',
          'com.apple.UIKit.activity.PostToTencentWeibo',
          'com.apple.UIKit.activity.AirDrop',
          'com.apple.UIKit.activity.OpenInIBooks',
          'com.apple.UIKit.activity.MarkupAsPDF',
          'com.apple.reminders.RemindersEditorExtension',
          'com.apple.mobilenotes.SharingExtension',
          'com.apple.mobileslideshow.StreamShareService',
          'com.linkedin.LinkedIn.ShareExtension',
          'pinterest.ShareExtension',
          'com.google.GooglePlus.ShareExtension',
          'com.tumblr.tumblr.Share-With-Tumblr',
        ],
      }
    );
  };

  // Info Tab
  onAuthor = (id) => {
    this.props.updateProfileUserId(id);
    this.props.navigation.navigate('Profile', { refresh: true });
    this.onMinimized();
    this.scrollView.scrollTo({ x: 0, y: 0, animated: true });
    this.setState({ tab: 0 });
  };

  onDerivedFrom = (id) => {
    for (let i = 0; i < this.props.playingCrafts.length; i++) {
      if (this.props.playingCrafts[i].id === id) {
        this.props.updateCurCraftId(i);
        break;
      }
    }
    this.setState(
      {
        curCraftId: this.props.curCraftId,
      },
      () => {
        this.refreshTabs();
      }
    );
  };

  // Store tab
  onAddToWishlist = () => {
    PlayingCraftService.addCraftToWishlist(this.props.playingCrafts[this.props.curCraftId].id)
      .then((res) => {
        showMessage({
          message: 'Successfully added!',
          type: 'default',
        });
      })
      .catch((err) => {
        // console.log(err.response.data.error);
      });
  };

  updateData = (file) => {
    this.setState({ filePath: file });
  };

  onBuyCraft = (buyOption) => {
    this.setState({ storeTitle: this.state.buyModal.title });
    if (buyOption === 0) {
      PaymentService.sendMoney(
        this.props.user.id,
        this.props.playingCrafts[this.props.curCraftId].owner_id,
        this.state.buyPrice,
        'price'
      )
        .then((res) => {
          if (res.data?.search('http') >= 0)
            this.setState({
              buyModal: {
                visible: false,
              },
              payModalVisible: true,
              paypalUrl: res.data,
            });
        })
        .catch((err) => {
          if (err.response.status === 422) {
          }
        });
    } else {
      PlayingCraftService.addCraftToCart(this.state.selectedItem)
        .then((res) => {
          showMessage({
            message: 'Successfully added!',
            type: 'default',
          });
        })
        .catch((err) => {
          showMessage({
            message: 'Failed adding to cart.',
            type: 'default',
          });
        });
    }
    this.showBuyModal(false);
  };

  showBuyModal = (isVal, title, itemId, price) => {
    if (title === 'Free') {
      PlayingCraftService.addCraftToPurchase(itemId)
        .then((res) => {
          showMessage({
            message: 'Successfully purchased!',
            type: 'default',
          });
        })
        .catch((err) => {
          showMessage({
            message: 'Purchase failed.',
            type: 'default',
          });
        });
      return;
    }
    this.setState({
      buyModal: {
        ...this.state.buyModal,
        visible: isVal,
        title,
      },
    });
    if (isVal === true) {
      this.setState({
        selectedItem: itemId,
        buyPrice: price,
      });
    }
  };

  showPayModal = (value) => {
    this.setState({
      payModalVisible: value,
    });
  };

  onNavigationStateChange = (navState) => {
    if (navState.url.indexOf('https://www.sandbox.paypal') !== 0) {
      this.showPayModal(false);
      if (navState.url.indexOf(`${Env.APIURL}/doCheckout`) === 0) {
        PlayingCraftService.addCraftToPurchase(this.state.selectedItem)
          .then((res) => {
            showMessage({
              message: 'Successfully purchased!',
              type: 'default',
            });

            PaymentService.sendEmail(this.state.resData.craft_items[0].id)
              .then((res) => {})
              .catch((err) => {});
            if (this.state.storeTitle === 'Exclusive License') {
              PlayingCraftService.editCraftItem(
                this.props.playingCrafts[this.props.curCraftId].id,
                'Exclusive License',
                'quantity',
                -1
              )
                .then((res) => {})
                .catch((err) => {});
              this.setState({ storeOption: 0 });
            }

            PaymentService.addTransactionHistory(
              this.props.user.id,
              this.props.playingCrafts[this.props.curCraftId].owner_id,
              this.state.selectedItem,
              this.state.buyPrice
            )
              .then((res) => {})
              .catch((err) => {});
          })
          .catch((err) => {
            showMessage({
              message: 'Purchase failed.',
              type: 'default',
            });
          });
      }
    }
  };

  onWebsiteLink = (id, url) => {
    PlayingCraftService.browseLink(id).then((res) => {
      Linking.canOpenURL(url)
        .then((supported) => {
          if (!supported) {
          } else {
            return Linking.openURL(url);
          }
        })
        .catch((err) => console.error('An error occurred', err));
    });
  };

  onMinimized = () => {
    this.props.updateTitle(this.props.backScreen);
    this.props.updateBackupCraft(this.props.playingCrafts[this.props.curCraftId]);
    this.props.updateIsPlaying(this.state.playingStatusArr[this.props.curCraftId]);
    this.props.goDown();
    this.props.updateCraftPlaying(false);
  };

  shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  // CHECK THIS
  onShuffle = (id) => {
    const { isShuffle } = this.state;
    if (!isShuffle) {
      this.shuffle(this.props.playingCrafts);
      let playingId;
      for (let i = 0; i < this.props.playingCrafts.length; i++) {
        if (this.props.playingCrafts[i].id === id) {
          playingId = i;
          break;
        }
      }
      [this.props.playingCrafts[playingId], this.props.playingCrafts[this.props.curCraftId]] = [
        this.props.playingCrafts[this.props.curCraftId],
        this.props.playingCrafts[playingId],
      ];
      this.setState({ isShuffle: true });
      this.props.updateIsShuffle(true);
    } else {
      console.log('data = ', this.backupCrafts)
      //this.props.setPlayingCrafts(this.backupCrafts);

      let playingId;
      for (let i = 0; i < this.props.playingCrafts.length; i++) {
        if (this.props.playingCrafts[i].id === id) {
          playingId = i;
          break;
        }
      }
      this.swiperref.scrollBy(this.props.curCraftId - playingId, false);
      this.setState({ isShuffle: false });
      this.props.updateIsShuffle(false);
    }
  };

  onSwipeDown(gestureState) {
    this.props.updateBackupCraft(this.props.playingCrafts[this.props.curCraftId]);
    Orientation.lockToPortrait(); // init potrait
    this.props.updateIsPlaying(this.state.playingStatusArr[this.props.curCraftId]);
    const screen = this.props.backScreen;
    if (!this.state.goingDown) {
      this.setState({ goingDown: true });
      this.props.goDown();
      this.props.updateCraftPlaying(false);
      this.setState({ goingDown: true });
      setTimeout(() => this.setState({ goingDown: false }), 600);
    }
  }

  render() {
    const config = {
      detectSwipeUp: false,
      detectSwipeLeft: false,
      detectSwipeRight: false,
    };

    const { playOrientation } = this.state;
    return (
      <View style={styles.container}>
        <ScrollView
          ref={(view) => {
            this.scrollView = view;
          }}
          onScroll={this.handleScroll}
          scrollEnabled={this.state.scrollStatus}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          scrollEventThrottle={16}
          bounces={false}
        >
          <Swiper
            key={1}
            dotColor="transparent"
            activeDotColor="transparent"
            showsButtons={false}
            loop={false}
            ref={(swiper) => {
              this.swiperref = swiper;
            }}
            onIndexChanged={this.onViewChange}
            // index={this.state.curCraftId}
            // index={this.state.curCraftId}
          >
            {this.state.crafts.map((element, index) => {
              return (
                <ScrollView
                  key={element.id}
                  scrollEnabled={false}
                  style={styles.wrapper_swipe}
                  showsVerticalScrollIndicator={false}
                >
                  {playOrientation === 'Portrait' && (
                    <Playing
                      key={element.id}
                      craft_idx={index}
                      craft={element}
                      isSingle={this.state.crafts.length === 1}
                      isPlaying={this.state.playingStatusArr[index]}
                      curCraftId={this.state.curCraftId}
                      storeOption={this.state.storeOption}
                      image={craft}
                      navigation={this.props.navigation}
                      onPressTab={this.tabSelected}
                      onToggle={this.setToggle}
                      selectedTab={this.state.tab}
                      likeStatus={this.state.likeStatus}
                      ref={this.playingref}
                      isShowControl={this.state.isShowControl}
                      refreshTabs={() => this.refreshTabs()}
                      minimize={() => this.onMinimized()}
                      onPrev={this.onPrev}
                      onNext={this.onNext}
                      onPlay={this.onPlay}
                      onShowControl={this.onShowControl}
                      onShuffle={this.onShuffle}
                      isShuffle={this.state.isShuffle}
                      onLike={(func) => {
                        this.onLike = () => func();
                      }}
                      onRepeat={(func) => {
                        this.onRepeat = () => func();
                      }}
                      togglePlay={(func) => {
                        this.togglePlay = () => func();
                      }}
                      onProgress={(value) => {
                        this.setState({ progress: value });
                        this.props.onProgress(value);
                      }}
                      setFinsihSliderStatus={(func) => {
                        this.setFinsihSliderStatus = (value) => func(value);
                      }}
                      setChangeSliderStatus={(func) => {
                        this.setChangeSliderStatus = (value) => func(value);
                      }}
                    />
                  )}

                  {playOrientation === 'Landscape' && (
                    <Playing
                      key={element.id}
                      craft={element}
                      isSingle={this.state.crafts.length === 1}
                      curCraftId={this.state.curCraftId}
                      storeOption={this.state.storeOption}
                      image={craft}
                      navigation={this.props.navigation}
                      onPressTab={this.tabSelected}
                      onToggle={this.setToggle}
                      minimize={() => this.onMinimized()}
                      selectedTab={this.state.tab}
                      likeStatus={this.state.likeStatus}
                      refreshTabs={() => this.refreshTabs()}
                      isPlaying={this.state.playingStatusArr[index]}
                      ref={this.playingref}
                      onPrev={this.onPrev}
                      onNext={this.onNext}
                      onPlay={this.onPlay}
                      onLike={(func) => {
                        this.onLike = () => func();
                      }}
                      onRepeat={(func) => {
                        this.onRepeat = () => func();
                      }}
                      togglePlay={(func) => {
                        this.togglePlay = () => func();
                      }}
                      onProgress={(value) => {
                        this.setState({ progress: value });
                        this.props.onProgress(value);
                      }}
                      setFinsihSliderStatus={(func) => {
                        this.setFinsihSliderStatus = (value) => func(value);
                      }}
                      setChangeSliderStatus={(func) => {
                        this.setChangeSliderStatus = (value) => func(value);
                      }}
                    />
                  )}
                </ScrollView>
              );
            })}
          </Swiper>
          {playOrientation === 'Portrait' && (
            <View style={styles.wrapper}>
              {this.state.tab === 3 && (
                <SocialShare
                  addCraftlist={this.addCraftlist}
                  onClickCopy={this.onClickCopyTab}
                  onClickMore={this.onClickMore}
                />
              )}
              {this.state.tab === 4 && (
                <Infor
                  ref={this.inforef}
                  onAuthor={this.onAuthor}
                  onDerivedFrom={this.onDerivedFrom}
                />
              )}
              {this.state.tab === 5 && (
                <Store
                  ref={this.storeref}
                  showBuyModal={this.showBuyModal}
                  onAddToWishlist={this.onAddToWishlist}
                  onWebsiteLink={this.onWebsiteLink}
                />
              )}
              {this.state.tab === 7 && (
                <AddToCraftlish
                  navigation={this.props.navigation}
                  tabSelected={this.tabSelected}
                  onGoCraftList={() => {
                    this.onMinimized();
                  }}
                  onBackCraftList={() => {
                    this.props.goUp();
                    this.setState({ tab: 7 });
                  }}
                />
              )}
              {this.state.tab === 8 && <Contest navigation={this.props.navigation} />}
            </View>
          )}
        </ScrollView>
        {/* </GestureRecognizer> */}
        {this.state.toggle.report && (
          <Report
            onClose={() => this.setToggle('report', false)}
            onReport={() => this.onReport()}
          />
        )}
        {this.state.toggle.option && (
          <Option
            onClose={() => this.setToggle('option', false)}
            onReport={() => this.onReport()}
            onDelete={() => this.onDelete()}
            onPrivate={this.onPrivate}
            onHide={this.onHide}
            onEditDetail={() => this.showEditModal()}
          />
        )}
        <Buy
          status={this.state.buyModal.visible}
          updateData={(filePath) => this.updateData(this.state.filePath)}
          onBuy={this.onBuyCraft}
          craftData={this.state.crafts[this.state.curCraftId]}
          title={this.state.buyModal.title}
          onClose={() => this.showBuyModal(false)}
        />
        <PayModal
          onClose={() => this.showPayModal(false)}
          status={this.state.payModalVisible}
          onNavigationStateChange={this.onNavigationStateChange}
          onCloseRequest={() => this.showPayModal(false)}
          paypalUrl={this.state.paypalUrl}
        />
        <ReportModal
          status={this.state.reportModalVisible}
          onClose={this.closeReportModal}
          onCloseRequest={this.setReportModalVisible}
          onPress={this.reportActionSelected}
          selectedOption={this.state.reportOptionSelected}
          radio_props={radio_props}
          onSubmitReport={this.onSubmitReport}
        />
        <ConfirmModal
          visible={this.state.deleteModalVisible}
          onCloseRequest={this.setDeleteModalVisible}
          onCancel={this.closeDeleteModal}
          onConfirm={this.onDeleteCraft}
        />
        <ModalWrapper
          title="Edit Details"
          status={this.state.editDetailModalVisible}
          onClose={this.closeEditModal}
          onCloseRequest={this.editModalCloseRequest}
          style={{ zIndex: 999 }}
        >
          <View style={styles.contentWrapper}>
            <View style={styles.itemWrapper}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => this.navigationHandler('Info', { modalVisible: true })}
              >
                <CustomIcon name="info-1" color={COLORS.primaryColor} size={35 * METRICS.ratioX} />
                <Text style={styles.buttonText}>Info</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.itemWrapper}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => this.navigationHandler('Store', { modalVisible: true })}
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
                onPress={() => this.onCraftSave()}
              >
                <Text style={styles.publishButtonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => this.navigationHandler('Music', { modalVisible: true })}
              >
                <CustomIcon name="music" color={COLORS.primaryColor} size={35 * METRICS.ratioX} />
                <Text style={styles.buttonText}>Music</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.itemWrapper}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => this.navigationHandler('CoverArtVideo', { modalVisible: true })}
              >
                <CustomIcon name="brush" color={COLORS.primaryColor} size={35 * METRICS.ratioX} />
                <Text style={styles.buttonText}>Cover Art/Video</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ModalWrapper>
        <FlashMessage titleStyle={styles.flashStyle} />

        {this.state.modalDerivatives ? (
          <Modal
            animationType="slide"
            transparent
            visible={this.state.modalDerivatives}
            onRequestClose={() => {
              this.scrollView.scrollTo({ x: 0, y: 0, animated: true });
              this.setState({ modalDerivatives: false, tab: 0 });
            }}
          >
            <Derivatives
              onGoBack={() => {
                this.scrollView.scrollTo({ x: 0, y: 0, animated: true });
                this.setState({ modalDerivatives: false, tab: 0 });
              }}
            />
          </Modal>
        ) : null}

        {this.state.modalComments ? (
          <Modal
            animationType="slide"
            transparent
            visible={this.state.modalComments}
            onRequestClose={() => {
              this.scrollView.scrollTo({ x: 0, y: 0, animated: true });
              this.setState({ modalComments: false, tab: 0 });
            }}
          >
            <Comments
              onGoProfile={() => {
                this.onMinimized();
                this.scrollView.scrollTo({ x: 0, y: 0, animated: true });
                this.setState({ modalComments: false, tab: 0 });
              }}
              onBackProfile={() => {
                this.props.goUp();
                this.setState({ modalComments: true });
              }}
              onGoBack={() => {
                this.scrollView.scrollTo({ x: 0, y: 0, animated: true });
                this.setState({ modalComments: false, tab: 0 });
              }}
            />
          </Modal>
        ) : null}
      </View>
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
    updateAddMusicMethod: (data) => dispatch(updateAddMusicMethod(data)),
    updateStoreState: (data) => dispatch(updateStoreState(data)),
    updateOpenModalValue: (data) => dispatch(updateOpenModalValue(data)),
    updateOnBackCraftList: (data) => dispatch(updateOnBackCraftList(data)),
    updateRepeat: (data) => dispatch(updateRepeat(data)),
    updateIsShuffle: (data) => dispatch(updateIsShuffle(data)),
    updateIsPlaying: (data) => dispatch(updateIsPlaying(data)),
    // made by dongdong
    setCraftInit: (data) => dispatch(updateIsCraftInit(data)),
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
    openModalValue: state.openModalValue,
    onBackCraftList: state.onBackCraftList,
    isPlaying: state.isPlaying,
    isCraftInit: state.isCraftInit,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayingCraftScreen);

const styles = StyleSheet.create({
  flashStyle: {
    fontFamily: 'lato',
    fontSize: METRICS.fontSizeNormal,
  },
  container: {
    backgroundColor: COLORS.blackColor,
    width: METRICS.screenWidth,
    height: METRICS.screenHeight,
  },
  wrapper_scroll: {
    backgroundColor: COLORS.blackColor,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  wrapper: {
    marginTop:
      0.01 /
      (METRICS.ratioY *
        METRICS.ratioY *
        METRICS.ratioY *
        METRICS.ratioY *
        METRICS.ratioY *
        METRICS.ratioY *
        METRICS.ratioY *
        METRICS.ratioY *
        METRICS.ratioY *
        METRICS.ratioY *
        METRICS.ratioY *
        METRICS.ratioY *
        METRICS.ratioY *
        METRICS.ratioY *
        METRICS.ratioY *
        METRICS.ratioY *
        METRICS.ratioY *
        METRICS.ratioY *
        METRICS.ratioY *
        METRICS.ratioY *
        METRICS.ratioY *
        METRICS.ratioY *
        METRICS.ratioY *
        METRICS.ratioY),
    minHeight: METRICS.screenHeight * 0.835,
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
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
  wrapper_swipe: {
    flex: 1,
    height: 0.8 * METRICS.screenHeight,
    backgroundColor: COLORS.blackColor,
  },
});
