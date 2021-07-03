import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  Dimensions,
  Platform,
  Image,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import SortableList from 'react-native-sortable-list';
import { connect } from 'react-redux';
import { CustomButton, CustomIcon } from '../components';
import { CraftBg } from '../global/Images';
import { METRICS, COLORS } from '../global';
import CraftlistService from '../services/CraftlistService';
import PlayingCraftService from '../services/PlayingCraftService';
import { logoIcon } from '../assets/images';
import Environment from '../helpers/environment';
import {
  updateCraftPlaying,
  setPlayingCrafts,
  updateCurCraftId,
  updateIsPlaying,
} from '../store/actions';

const window = Dimensions.get('window');

class Row extends React.Component {
  constructor(props) {
    super(props);

    this._active = new Animated.Value(0);

    this._style = {
      ...Platform.select({
        ios: {
          transform: [
            {
              scale: this._active.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1.1],
              }),
            },
          ],
          shadowRadius: this._active.interpolate({
            inputRange: [0, 1],
            outputRange: [2, 10],
          }),
        },

        android: {
          transform: [
            {
              scale: this._active.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1.07],
              }),
            },
          ],
          elevation: this._active.interpolate({
            inputRange: [0, 1],
            outputRange: [2, 6],
          }),
        },
      }),
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.active !== nextProps.active) {
      Animated.timing(this._active, {
        duration: 300,
        easing: Easing.bounce,
        toValue: Number(nextProps.active),
      }).start();
    }
  }

  _swipeoutBtns = [
    {
      text: 'Delete',
      backgroundColor: COLORS.primaryColor,
      onPress: () => {
        const { id, list_id } = this.props.data;
        CraftlistService.deleteCraftFromList(list_id, id)
          .then((res) => {
            this.props.reRenderCraftList();
          })
          .catch((err) => {
            console.log(err.response.data.error);
          });
      },
    },
  ];

  onCraft(id) {
    // console.log(id)
    PlayingCraftService.getCraft(id)
      .then((res) => {
        this.props.setPlayingCrafts([res.data]);
        this.props.updateCurCraftId(0);
        this.props.updateIsPlaying(1);
        this.props.updateCraftPlaying(1);
      })
      .catch((err) => {
        console.log(err.response.data.error);
      });
  }

  render() {
    const { data, active } = this.props;
    // console.log(data)
    return (
      <Animated.View style={[styles.row, this._style]}>
        <View style={styles.wrapper}>
          <FastImage
            source={
              data.thumbnail_url
                ? {
                    uri:
                      data.thumbnail_url.search('http') >= 0
                        ? data.thumbnail_url
                        : Environment.S3URL + data.thumbnail_url,
                  }
                : CraftBg
            }
            style={styles.image}
          />
          <View style={styles.contentWrapper}>
            <Text style={styles.title}>{data.title}</Text>
          </View>
          <TouchableOpacity onPress={() => this.onCraft(data.id)}>
            <CustomIcon name="angle-right" size={METRICS.rightarrow} style={styles.rightIcon} />
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  }
}

class CraftListSortScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      craftlistId: 1,
      crafts: null,
      craftIDs: null,
    };
  }

  componentDidMount() {
    this.setState(
      {
        craftlistId: this.props.craftlistId,
      },
      () => {
        this.getCraftlistInfo();
      }
    );
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.craftlistId != nextProps.craftlistId) {
      return {
        craftlistId: nextProps.craftlistId,
      };
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.craftlistId !== this.state.craftlistId) {
      this.getCraftlistInfo();
    }
  }

  getCraftlistInfo = () => {
    CraftlistService.getCraftlist(this.state.craftlistId)
      .then((res) => {
        this.setState({
          crafts: res.data.crafts,
          craftIDs: res.data.crafts.map((craft) => {
            return craft.id;
          }),
        });
      })
      .catch((err) => {
        console.log(err.response.data.error);
      });
  };

  handleGoBack = () => {
    this.props.navigation.goBack();
  };

  saveOrder = () => {
    if (this.state.craftIDs) {
      CraftlistService.saveCraftlistOrder(this.state.craftlistId, this.state.craftIDs)
        .then((res) => {
          this.props.navigation.goBack();
        })
        .catch((err) => {
          console.log(err.response.data.error);
        });
    }
  };

  _renderRow = ({ data, active }) => {
    const { navigation } = this.props;
    return (
      <Row
        data={data}
        active={active}
        navigation={navigation}
        reRenderCraftList={this.getCraftlistInfo}
      />
    );
  };

  onReleaseRow = (key, currentOrder) => {
    this.setState({
      craftIDs: currentOrder.map((orderIndex) => {
        return this.state.crafts[orderIndex].id;
      }),
    });
  };

  render() {
    const { crafts } = this.state;
    return (
      <SafeAreaView style={styles.flatlist}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={this.handleGoBack}>
            <CustomIcon
              name="back"
              size={METRICS.fontSizeBigger}
              style={{ color: COLORS.whiteColor }}
            />
          </TouchableOpacity>
          <View style={styles.pageTitleContainer}>
            <Image source={logoIcon} style={styles.logoImage} />
            <Text style={styles.pageTitleText}>Edit Craftlist</Text>
          </View>
          <TouchableOpacity style={styles.doneButton}>
            <CustomButton title="Done" style={styles.done2} clickHandler={() => this.saveOrder()} />
          </TouchableOpacity>
        </View>
        {crafts && (
          <SortableList
            style={styles.list}
            contentContainerStyle={styles.contentContainer}
            data={crafts}
            renderRow={this._renderRow}
            onChangeOrder={this.onChangeOrder}
            onReleaseRow={this.onReleaseRow}
          />
        )}
      </SafeAreaView>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    updateCraftPlaying: (data) => dispatch(updateCraftPlaying(data)),
    setPlayingCrafts: (data) => dispatch(setPlayingCrafts(data)),
    updateCurCraftId: (data) => dispatch(updateCurCraftId(data)),
    updateIsPlaying: (data) => dispatch(updateIsPlaying(data)),
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

export default connect(mapStateToProps, mapDispatchToProps)(CraftListSortScreen);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    height: METRICS.rowHeightMedium,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.blackColor,
    marginHorizontal: METRICS.spacingNormal,
  },
  pageTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    width: METRICS.logosize,
    height: METRICS.logosize,
    resizeMode: 'contain',
    marginRight: METRICS.spacingTiny,
  },
  pageTitleText: {
    fontFamily: 'Lato-Semibold',
    fontSize: METRICS.fontSizeBig,
    color: COLORS.whiteColor,
  },
  backButton: {
    position: 'absolute',
    left: -12 * METRICS.ratioX,
    top: 4 * METRICS.ratioX,
    padding: 10 * METRICS.ratioX,
    paddingRight: METRICS.spacingBig,
    zIndex: 101,
  },
  flatlist: {
    backgroundColor: COLORS.blackColor,
    minHeight: '100%',
  },
  rowBack: {
    backgroundColor: COLORS.primaryColor,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  rightButton: {
    width: 100 * METRICS.ratioX,
    height: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    // justifyContent: 'flex-end',
  },
  list: {
    flex: 1,
  },
  contentContainer: {
    width: window.width,

    ...Platform.select({
      ios: {
        paddingHorizontal: 0,
      },

      android: {
        paddingHorizontal: 0,
      },
    }),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.blackColor,
    flex: 1,
    marginVertical: 0,

    ...Platform.select({
      ios: {
        width: window.width,
        shadowColor: 'rgba(0,0,0,0.2)',
        shadowOpacity: 1,
        shadowOffset: { height: 2 * METRICS.ratioX, width: 2 * METRICS.ratioX },
        shadowRadius: 2 * METRICS.ratioX,
      },

      android: {
        width: window.width,
        elevation: 0,
      },
    }),
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: METRICS.spacingNormal,
    paddingRight: METRICS.spacingNormal,
    paddingBottom: METRICS.spacingNormal,
    paddingTop: METRICS.spacingNormal,
    backgroundColor: COLORS.blackColor,
  },
  image: {
    width: METRICS.smallcrafts,
    height: METRICS.smallcrafts,
    borderRadius: METRICS.craftborder,
    marginRight: METRICS.spacingBig,
    marginLeft: METRICS.spacingTiny,
  },
  contentWrapper: {
    flex: 1,
  },
  title: {
    color: COLORS.whiteColor,
    fontSize: METRICS.fontSizeNormal,
  },
  count: {
    color: COLORS.nameDM,
    fontSize: METRICS.fontSizeLight,
  },
  rightIcon: {
    color: COLORS.whiteColor,
  },
  doneButton: {
    position: 'absolute',
    right: 20 * METRICS.ratioX,
    padding: 10 * METRICS.ratioX,
    paddingLeft: METRICS.spacingNormal,
    zIndex: 101,
  },
  done2: {
    width: '180%',
  },
});
