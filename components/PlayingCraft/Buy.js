import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Modal, SafeAreaView } from 'react-native';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import { connect } from 'react-redux';
import Checkbox from '../Checkbox';
import Button from '../Button';
import { METRICS, COLORS } from '../../global';
import {
  LicenseArtExclusive,
  LicenseArtLease,
  LicenseMusicExc,
  LicenseMusicNon,
  LicenseMusicSP,
} from '..';
import ProfileService from '../../services/ProfileService';
import { setPlayingCrafts } from '../../store/actions';

const radio_props = [
  { label: '  Buy Now', value: 0 },
  { label: '  Add to Cart', value: 1 },
];

class BuyCraft extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      buyOption: 0,
      checkTerm: false,
      ExcArtModalVisible: false,
      NonArtModalVisible: false,
      ExcMusicModalVisible: false,
      NonMusicModalVisible: false,
      SPModalVisible: false,
      isAgree: false,
      loginUserData: '',
      userProfile: Object,
      curCraftId: 0,
      filePath: '',
    };
    let strHtml = '';
    strHtml = strHtml.replace();
  }

  componentDidMount() {
    ProfileService.getUserProfile(this.props.user.id)
      .then((res) => {
        const userProfile = res.data;
        // console.log("userProfile-->",userProfile);
        this.setState({ userProfile });
      })
      .catch((err) => {
        console.log(err.response.data.error);
      });
  }

  onSelect = (index) => {
    this.setState({
      buyOption: index,
    });
  };

  onCheckTerm = () => {
    this.setState({
      checkTerm: !this.state.checkTerm,
    });
  };

  onPressBuy = () => {
    if (this.state.checkTerm === false) {
      showMessage({
        message: 'Please check licensing terms.',
        type: 'default',
      });
    } else {
      this.setState({ checkTerm: false });
      if (!this.state.filePath) {
        this.props.onBuy(this.state.buyOption, '');
      } else {
        this.props.onBuy(this.state.buyOption, this.state.filePath);
      }
    }
  };

  showExcArtModal = (value) => {
    this.setState({ ExcArtModalVisible: value });
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

  isAgree = (value) => {
    this.setState({
      checkTerm: value,
    });
  };

  updateData = (file) => {
    this.setState({ filepath: file });
    // console.log("updatedata",file)
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

  checkLicenceModal = (craftData) => {
    if (!craftData || !craftData.store_option) {
      return;
    }
    const storeItems = craftData.craft_items;
    if (!storeItems) {
      return;
    }

    if (
      craftData.store_option.type === 'Art' &&
      storeItems[0].purchase_option === 'Exclusive License'
    ) {
      this.showExcArtModal(true);
    } else if (craftData.store_option.type === 'Art' && storeItems[0].purchase_option === 'Lease') {
      this.showNonArtModal(true);
    } else if (
      craftData.store_option.type === 'Music' &&
      storeItems[0].purchase_option === 'Exclusive License'
    ) {
      this.showExcMusicModal(true);
    } else if (
      craftData.store_option.type === 'Music' &&
      storeItems[0].purchase_option === 'Lease WAV'
    ) {
      this.showNonMusicModal(true);
    } else if (
      craftData.store_option.type === 'Music' &&
      storeItems[0].purchase_option === 'Lease MP3'
    ) {
      this.showNonMusicModal(true);
    } else if (
      craftData.store_option.type === 'Music' &&
      storeItems[0].purchase_option === 'Lease Tracked Out'
    ) {
      this.showNonMusicModal(true);
    } else if (
      craftData.store_option.type === 'Music' &&
      storeItems[0].purchase_option === 'Buy Sample Pack'
    ) {
      this.showSPModal(true);
    }
  };

  render() {
    const { status, title, onClose, onBuy, updateData } = this.props;
    const craftData = this.props.craftData;

    return (
      <Modal animationType="fade" transparent visible={status} onClose={() => onClose(false)}>
        <View style={styles.wrapper}>
          <SafeAreaView style={{ flex: 1, justifyContent: 'center' }}>
            <View style={styles.background}>
              <View style={styles.titleWrapper}>
                <Text style={styles.title}>{title}</Text>
              </View>
              <RadioForm formHorizontal={false} animation>
                {radio_props.map((obj, i) => (
                  <RadioButton labelHorizontal key={i} style={styles.radioButton}>
                    {/*  You can set RadioButtonLabel before RadioButtonInput */}
                    <RadioButtonInput
                      obj={obj}
                      index={i}
                      isSelected={this.state.buyOption === i}
                      onPress={this.onSelect}
                      borderWidth={1}
                      buttonInnerColor="white"
                      buttonOuterColor="white"
                      buttonSize={15 * METRICS.ratioX}
                      buttonOuterSize={25 * METRICS.ratioX}
                      buttonStyle={{}}
                      marginTop={METRICS.marginNormal}
                    />
                    <RadioButtonLabel
                      obj={obj}
                      index={i}
                      labelHorizontal
                      onPress={this.onSelect}
                      labelStyle={styles.text}
                      labelWrapStyle={{}}
                    />
                  </RadioButton>
                ))}
              </RadioForm>
              <View style={styles.checkTerm}>
                <TouchableOpacity onPress={this.onCheckTerm}>
                  <Checkbox value={this.state.checkTerm} clickHandler={this.onCheckTerm} />
                </TouchableOpacity>
                <Text style={styles.text}>I have read and agree to the </Text>
                <TouchableOpacity onPress={() => this.checkLicenceModal(craftData)}>
                  <Text style={styles.link}>Licensing Terms.</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.buttonWrapper}>
                <TouchableOpacity
                  onPress={() => this.onPressBuy()}
                  style={{ marginHorizontal: METRICS.spacingHuge }}
                >
                  <Button
                    style={styles.button}
                    title={this.state.buyOption ? 'Add to cart' : 'Buy'}
                    fontSize={METRICS.fontSizeNormal}
                    status={1}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => onClose()}
                  style={{ marginHorizontal: METRICS.spacingHuge }}
                >
                  <Button
                    style={styles.button}
                    title="Cancel"
                    fontSize={METRICS.fontSizeNormal}
                    status={3}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </View>

        <LicenseArtExclusive
          onClose={() => this.showExcArtModal(false)}
          status={this.state.ExcArtModalVisible}
          userProfileData={this.state.userProfile}
          craftData={craftData}
          isAgree={() => this.isAgree(true)}
          onCloseRequest={() => this.showExcArtModal(false)}
        />
        <LicenseArtLease
          onClose={() => this.showNonArtModal(false)}
          status={this.state.NonArtModalVisible}
          userProfileData={this.state.userProfile}
          craftData={craftData}
          isAgree={() => this.isAgree(true)}
          onCloseRequest={() => this.showNonArtModal(false)}
        />
        <LicenseMusicExc
          onClose={() => this.showExcMusicModal(false)}
          isAgree={() => this.isAgree(true)}
          updateData={(filePath) => this.updateData(filePath)}
          status={this.state.ExcMusicModalVisible}
          userProfileData={this.state.userProfile}
          craftData={craftData}
          onCloseRequest={() => this.showExcMusicModal(false)}
        />
        <LicenseMusicNon
          isAgree={() => this.isAgree(true)}
          onClose={() => this.showNonMusicModal(false)}
          status={this.state.NonMusicModalVisible}
          userProfileData={this.state.userProfile}
          craftData={craftData}
          onCloseRequest={() => this.showNonMusicModal(false)}
        />
        <LicenseMusicSP
          isAgree={() => this.isAgree(true)}
          onClose={() => this.showSPModal(false)}
          status={this.state.SPModalVisible}
          userProfileData={this.state.userProfile}
          craftData={craftData}
          onCloseRequest={() => this.showSPModal(false)}
        />
        <FlashMessage titleStyle={styles.flashStyle} />
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
  },
  background: {
    borderColor: COLORS.whiteColor,
    borderWidth: 1 * METRICS.ratioX,
    backgroundColor: COLORS.blackColor,
    position: 'relative',
    paddingTop: METRICS.spacingNormal,
    paddingBottom: METRICS.spacingNormal,
    paddingLeft: METRICS.spacingBig,
    paddingRight: METRICS.spacingBig,
  },
  row: {
    marginBottom: METRICS.spacingBig,
  },
  titleWrapper: {
    marginBottom: METRICS.spacingNormal,
  },
  title: {
    color: COLORS.whiteColor,
    textAlign: 'center',
    fontSize: METRICS.fontSizeBig,
    fontFamily: 'Lato-Bold',
  },
  text: {
    color: COLORS.whiteColor,
    fontSize: METRICS.fontSizelarge,
    fontFamily: 'lato',
  },
  link: {
    color: COLORS.primaryColor,
    fontFamily: 'lato-bold',
    fontSize: METRICS.fontSizelarge,
  },
  buttonWrapper: {
    flexDirection: 'row',
    alignSelf: 'center',
    paddingBottom: METRICS.spacingNormal,
    paddingTop: METRICS.spacingSmall,
  },
  button: {
    width: METRICS.followbuttonwidth,
    height: METRICS.sendbuttonheight,
  },
  checkTerm: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    height: METRICS.rowHeight,
    paddingHorizontal: 0.5 * METRICS.spacingTiny,
    paddingTop: METRICS.spacingTiny,
  },
  radioButton: {
    marginBottom: METRICS.spacingNormal,
  },
  flashStyle: {
    fontFamily: 'lato',
    fontSize: METRICS.fontSizeNormal,
  },
});

function mapDispatchToProps(dispatch) {
  return {
    setPlayingCrafts: (crafts) => dispatch(setPlayingCrafts(crafts)),
  };
}

function mapStateToProps(state) {
  return {
    user: state.user,
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

export default connect(mapStateToProps, mapDispatchToProps)(BuyCraft);
