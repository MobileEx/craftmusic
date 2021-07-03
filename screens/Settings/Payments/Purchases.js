import React from 'react';
import { SafeAreaView, View, Text, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { connect } from 'react-redux';
import { CustomIcon, AddAccountModal } from '../../../components';
import { METRICS, COLORS, STYLES } from '../../../global';
import PaymentService from '../../../services/PaymentService';

class Purchases extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      buyerEmail: '',
      sellerEmail: '',
      userId: 1,
      addModalVisible: false,
      newEmail: '',
      emailType: false,
    };
  }

  componentDidMount() {
    PaymentService.getPaymentAccount(this.props.user.id)
      .then((res) => {
        this.setState({
          buyerEmail: res.data.buyer,
          sellerEmail: res.data.seller,
        });
      })
      .catch((err) => {
        // console.log(err.response.data.error);
      });
  }

  addRemoveBuyerAccount = () => {
    if (this.state.buyerEmail) {
      PaymentService.deleteBuyerAccount(this.state.userId)
        .then((res) => {
          this.setState({ buyerEmail: '' });
        })
        .catch((err) => {
          // console.log(err.response.data.error);
        });
    } else {
      this.setState({
        addModalVisible: true,
        emailType: false,
      });
    }
  };

  addRemoveSellerAccount = () => {
    if (this.state.sellerEmail) {
      PaymentService.deleteSellerAccount(this.state.userId)
        .then((res) => {
          this.setState({ sellerEmail: '' });
        })
        .catch((err) => {});
    } else {
      this.setState({
        addModalVisible: true,
        emailType: true,
      });
    }
  };

  inputEmail = (email) => {
    this.setState({ newEmail: email });
  };

  closeAddModal = () => {
    this.setState({ addModalVisible: false });
  };

  showAddModal = () => {
    this.setState({ addModalVisible: true });
  };

  onAddAccount = () => {
    const { newEmail, emailType, userId } = this.state;

    this.closeAddModal();

    if (emailType) {
      PaymentService.addSellerAccount(userId, newEmail)
        .then((res) => {
          this.setState({ sellerEmail: newEmail });
        })
        .catch((err) => {
          console.log(err.response.data.error);
        });
    } else {
      PaymentService.addBuyerAccount(userId, newEmail)
        .then((res) => {
          this.setState({ buyerEmail: newEmail });
        })
        .catch((err) => {
          console.log(err.response.data.error);
        });
    }
  };

  render() {
    const { buyerEmail, sellerEmail, addModalVisible } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <View style={[STYLES.horizontalAlign, styles.paymentItem]}>
          <View style={styles.paymentItemLeftContent}>
            <Text style={styles.paymentMethodText}>Buyer PayPal Account</Text>
            <Text style={styles.mailAddressText}>{buyerEmail}</Text>
          </View>
          <TouchableOpacity style={styles.removeButton} onPress={this.addRemoveBuyerAccount}>
            {buyerEmail ? (
              <CustomIcon
                name="delete1"
                size={METRICS.fontSizeBigger}
                style={{ color: COLORS.whiteColor }}
              />
            ) : (
              <CustomIcon
                name="add-plus-button"
                size={METRICS.fontSizeNormal}
                style={{ color: COLORS.whiteColor, padding: 0.5 * METRICS.spacingTiny }}
              />
            )}
          </TouchableOpacity>
        </View>
        <View style={[STYLES.horizontalAlign, styles.paymentItem]}>
          <View style={styles.paymentItemLeftContent}>
            <Text style={styles.paymentMethodText}>Seller PayPal Account</Text>
            <Text style={styles.mailAddressText}>{sellerEmail}</Text>
          </View>
          <TouchableOpacity style={styles.removeButton} onPress={this.addRemoveSellerAccount}>
            {sellerEmail ? (
              <CustomIcon
                name="delete1"
                size={METRICS.fontSizeBigger}
                style={{ color: COLORS.whiteColor }}
              />
            ) : (
              <CustomIcon
                name="add-plus-button"
                size={METRICS.fontSizeNormal}
                style={{ color: COLORS.whiteColor, padding: 0.5 * METRICS.spacingTiny }}
              />
            )}
          </TouchableOpacity>
        </View>

        <AddAccountModal
          onClose={this.closeAddModal}
          onAdd={this.onAddAccount}
          status={addModalVisible}
          onCloseRequest={this.showAddModal}
          inputEmail={this.inputEmail}
        />
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  paymentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: METRICS.spacingNormal,
  },
  paymentMethodText: {
    color: COLORS.whiteColor,
    fontSize: METRICS.fontSizeMedium,
    fontFamily: 'lato',
  },
  plusText: {
    color: COLORS.whiteColor,
    fontSize: METRICS.fontSizeHuge,
    fontFamily: 'lato',
    marginRight: 3,
  },
  mailAddressText: {
    color: COLORS.inActive,
    fontSize: METRICS.fontSizeNormal,
    fontFamily: 'lato',
    paddingTop: METRICS.spacingTiny,
  },
});

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

export default connect(mapStateToProps)(Purchases);
