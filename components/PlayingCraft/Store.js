import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import { connect } from 'react-redux';
import CustomIcon from '../CustomIcon';
import CustomButton from '../CustomButton';
import { user } from '../../global/Images';
import { METRICS, COLORS } from '../../global';
import { setPlayingCrafts } from '../../store/actions';

class StoreTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      curCraftId: 0,
    };
  }

  componentDidMount() {
    this.setState({
      curCraftId: this.props.curCraftId,
    });
  }

  refreshContent = () => {
    this.setState({
      curCraftId: this.props.curCraftId,
    });
  };

  render() {
    const craft = this.props.playingCrafts ? this.props.playingCrafts[this.state.curCraftId] : null;
    return (
      <View style={styles.container}>
        <View style={styles.nameWapper}>
          <FastImage
            source={craft.store_owner.avatar ? { uri: craft.store_owner.avatar } : user}
            style={styles.avatar}
          />
          <Text style={styles.name}>{craft.store_owner.username}</Text>
          {craft.store_option.type == 'Art' && <CustomIcon name="brush" style={styles.nameIcon} />}
          {craft.store_option.type == 'Music' && (
            <CustomIcon name="music" style={styles.nameIcon} />
          )}
          {craft.store_option.type == 'Brand' && (
            <CustomIcon name="briefcase" style={styles.nameIcon} />
          )}
        </View>
        {craft.product_description != null && (
          <View style={styles.subInfo}>
            <Text style={styles.name}>Description</Text>
            <Text style={styles.desc}>{craft.product_description}</Text>
          </View>
        )}
        {craft.store_option.type == 'Brand' && (
          <View style={styles.storeWrapper}>
            {craft.craft_items.map((item, index) => (
              <View>
                {item.store_option == '3' && (
                  <TouchableOpacity
                    style={styles.store}
                    onPress={() => this.props.onWebsiteLink(item.id, item.website_link)}
                  >
                    <Text style={styles.storeText}>Go To Website</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        )}
        {craft.store_option.type == 'Music' && (
          <View style={styles.storeWrapper}>
            {craft.craft_items.map((item, index) => (
              <View>
                {item.store_option == '2' && (
                  <TouchableOpacity
                    style={styles.store}
                    onPress={() =>
                      this.props.showBuyModal(true, item.purchase_option, item.id, item.price)
                    }
                  >
                    <Text style={styles.storeText}>{item.purchase_option}</Text>
                    <Text style={styles.storeMainText}>{`$${item.price}`}</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
            <CustomButton
              title="Add to Wishlist"
              style={styles.add}
              clickHandler={this.props.onAddToWishlist}
            />
          </View>
        )}
        {craft.store_option.type == 'Art' && (
          <View style={styles.storeWrapper}>
            {craft.craft_items.map((item, index) => (
              <View>
                {item.store_option == '1' && (
                  <TouchableOpacity
                    style={styles.store}
                    onPress={() =>
                      this.props.showBuyModal(true, item.purchase_option, item.id, item.price)
                    }
                  >
                    <Text style={styles.storeText}>{item.purchase_option}</Text>
                    <Text style={styles.storeMainText}>{`$${item.price}`}</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
            <CustomButton
              title="Add to Wishlist"
              style={styles.add}
              clickHandler={this.props.onAddToWishlist}
            />
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameWapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: METRICS.spacingNormal,
  },
  avatar: {
    marginRight: METRICS.spacingNormal,
    width: METRICS.avatar,
    height: METRICS.avatar,
    borderRadius: METRICS.avatar / 2,
  },
  name: {
    color: COLORS.primaryColor,
    fontSize: METRICS.fontSizeNormal,
    fontFamily: 'lato-bold',
    textAlign: 'center',
  },
  nameIcon: {
    fontSize: METRICS.fontSizeNormal,
    color: COLORS.primaryColor,
    marginLeft: METRICS.spacingSmall,
  },
  desc: {
    color: COLORS.whiteColor,
    fontSize: METRICS.fontSizeNormal,
    marginTop: METRICS.spacingNormal,
    fontFamily: 'lato',
    textAlign: 'center',
  },
  subInfo: {
    paddingLeft: METRICS.spacingHuge,
    paddingRight: METRICS.spacingHuge,
    marginBottom: METRICS.spacingHuge,
  },
  storeWrapper: {
    justifyContent: 'center',
    alignContent: 'center',
  },
  store: {
    width: METRICS.storewidth,
    height: METRICS.storeheight,
    borderWidth: 1,
    borderColor: COLORS.primaryColor,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: METRICS.spacingBig,
  },
  storeText: {
    color: COLORS.whiteColor,
    fontSize: METRICS.fontSizeLight,
    fontFamily: 'lato',
  },
  storeMainText: {
    color: COLORS.whiteColor,
    fontSize: METRICS.fontSizelarge,
    fontFamily: 'lato-bold',
  },
  add: {
    color: COLORS.whiteColor,
    backgroundColor: COLORS.primaryColor,
    borderColor: COLORS.primaryColor,
    width: METRICS.storewidth,
    marginBottom: METRICS.spacingBig,
    fontFamily: 'lato-bold',
  },
});

function mapDispatchToProps(dispatch) {
  return {
    setPlayingCrafts: (crafts) => dispatch(setPlayingCrafts(crafts)),
  };
}

function mapStateToProps(state) {
  return {
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

export default connect(mapStateToProps, mapDispatchToProps)(StoreTab);
