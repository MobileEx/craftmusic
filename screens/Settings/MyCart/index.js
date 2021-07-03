import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { withNavigation } from 'react-navigation';
import { TouchableOpacity } from 'react-native-gesture-handler';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import { connect } from 'react-redux';
import { BaseScreen, ScreenHeader, CircleClose, Thumbnail, PayModal } from '../../../components';
import { METRICS, COLORS, STYLES } from '../../../global';
import ProfileService from '../../../services/ProfileService';
import PaymentService from '../../../services/PaymentService';
import PlayingCraftService from '../../../services/PlayingCraftService';
import { craft } from '../../../global/Images';
import Env from '../../../helpers/environment';
import {
  updateBackScreen,
  updateCraftPlaying,
  setPlayingCrafts,
  updateProfileUserId,
  updateTitle,
  updateCurCraftId,
  updatePrevState,
  updateCraftListId,
  updateIsPlaying,
} from '../../../store/actions';
import store from '../../../store/configureStore';

class MyCart extends BaseScreen {
  navbarHidden = true;

  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      salesItems: [],
      userId: 1,
      payModalVisible: false,
    };
  }

  componentDidMount() {
    ProfileService.getMyCart()
      .then((res) => {
        this.setState({
          salesItems: res.data,
        });
      })
      .catch((err) => {
        // console.log(err.response.data.error);
      });
  }

  removeItem = (item) => {
    //
    PlayingCraftService.removeCraftFromCart(item.id)
      .then((res) => {
        this.setState({
          salesItems: res.data,
        });
      })
      .catch((err) => {
        // console.log(err.response.data.error);
      });
  };

  onCraft = (id) => {
    PlayingCraftService.getCraft(id)
      .then((res) => {
        this.props.setPlayingCrafts([res.data]);
        this.props.updateCurCraftId(0);
        this.props.updatePrevState(store.getState());
        this.props.updateIsPlaying(true);
        this.props.updateCraftPlaying(true);
        this.props.navigation.navigate('Home');
      })
      .catch((err) => {
        // console.log(err.response.data.error);
      });
  };

  onBuyCraft = () => {
    PaymentService.buyCart(this.state.salesItems)
      .then((res) => {
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
          showMessage({
            message: err.response.data.error,
            type: 'default',
          });
        }
      });
  };

  showPayModal = (value) => {
    this.setState({
      payModalVisible: value,
    });
  };

  onNavigationStateChange = (navState) => {
    if (navState.url.indexOf('https://www.sandbox.paypal') != 0) {
      this.showPayModal(false);
      if (navState.url.indexOf(`${Env.APIURL}/doCheckout`) == 0) {
        this.state.salesItems.forEach((item) => {
          PlayingCraftService.addCraftToPurchase(item.id)
            .then((res) => {
              PaymentService.addTransactionHistory(
                this.props.user.id,
                item.seller_id,
                item.id,
                item.price
              )
                .then((res) => {
                  PlayingCraftService.removeCraftFromCart(item.id)
                    .then((res) => {
                      this.setState({
                        salesItems: res.data,
                      });
                    })
                    .catch((err) => {
                      // console.log(err.response.data.error);
                    });
                })
                .catch((err) => {
                  // console.log(err.response.data.error);
                });
            })
            .catch((err) => {
              showMessage({
                message: 'Purchase failed!',
                type: 'default',
              });
            });
        });
      }
    }
  };

  renderScreen() {
    const { navigation } = this.props;
    const { salesItems } = this.state;
    let totalPrice = 0;
    salesItems.forEach((item) => {
      totalPrice += Math.abs(item.price);
    });

    return (
      <ScrollView contentContainerStyle={styles.container}>
        <ScreenHeader navigation={navigation} pageTitle="My Cart" />
        <View style={styles.contentContainer}>
          {salesItems.map((item) => (
            <View key={item.id} style={styles.cartItem}>
              <View style={STYLES.horizontalAlign}>
                <Thumbnail
                  imageSource={
                    item.thumbnail_url
                      ? {
                          uri:
                            item.thumbnail_url.search('http') >= 0
                              ? item.thumbnail_url
                              : Env.S3URL + item.thumbnail_url,
                        }
                      : craft
                  }
                  onCraft={() => this.onCraft(item.craft_id)}
                />
                <View style={{ marginLeft: METRICS.spaceNormal }}>
                  <Text style={STYLES.normalText}>{item.name}</Text>
                  <Text style={styles.mediaText}>{item.purchase_option}</Text>
                </View>
              </View>
              <View style={styles.priceWrapper}>
                <Text style={{ ...STYLES.normalText, marginBottom: 7 * METRICS.ratioX }}>
                  ${parseFloat(item.price).toFixed(2)}
                </Text>
                <CircleClose clickHandler={() => this.removeItem(item)} />
              </View>
            </View>
          ))}
        </View>
        <View>
          <View style={styles.totalPriceWrapper}>
            <Text style={styles.totalText}>Total</Text>
            <Text style={styles.totalPriceText}>${totalPrice.toFixed(2)}</Text>
          </View>
          <TouchableOpacity style={styles.payButton} onPress={this.onBuyCraft}>
            <Text style={styles.payButtonText}>Pay ${totalPrice.toFixed(2)}</Text>
          </TouchableOpacity>
        </View>
        <PayModal
          onClose={() => this.showPayModal(false)}
          status={this.state.payModalVisible}
          onNavigationStateChange={this.onNavigationStateChange}
          onCloseRequest={() => this.showPayModal(false)}
          paypalUrl={this.state.paypalUrl}
        />
        <FlashMessage titleStyle={styles.flashStyle} />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  flashStyle: {
    fontFamily: 'lato',
    fontSize: METRICS.fontSizeNormal,
  },
  container: {
    paddingLeft: METRICS.spaceNormal,
    paddingRight: METRICS.spaceNormal,
  },
  contentContainer: {
    paddingVertical: METRICS.spacingTiny,
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: METRICS.spacingSmall,
  },
  priceWrapper: {
    alignItems: 'flex-end',
  },
  mediaText: {
    fontFamily: 'Lato-Bold',
    fontSize: METRICS.fontSizeNormal,
    color: COLORS.primaryColor,
  },
  totalText: {
    fontFamily: 'Lato-Bold',
    fontSize: METRICS.fontSizeNormal,
    color: COLORS.primaryColor,
  },
  totalPriceText: {
    fontFamily: 'Lato-Bold',
    fontSize: METRICS.fontSizeNormal,
    color: COLORS.primaryColor,
  },
  totalPriceWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: METRICS.spacingNormal,
  },
  payButton: {
    backgroundColor: COLORS.blackColor,
    borderColor: COLORS.primaryColor,
    borderWidth: 1 * METRICS.ratioX,
    paddingVertical: METRICS.spacingTiny,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 7 * METRICS.ratioX,
  },
  payButtonText: {
    fontFamily: 'Lato-Bold',
    fontSize: METRICS.fontSizeMedium,
    color: COLORS.whiteColor,
    paddingVertical: METRICS.spacingTiny,
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

export default connect(mapStateToProps, mapDispatchToProps)(withNavigation(MyCart));
