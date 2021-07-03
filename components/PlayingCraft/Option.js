import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import CustomIcon from '../CustomIcon';
import { COLORS, METRICS } from '../../global';
import { setPlayingCrafts } from '../../store/actions';

class OptionModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hideStatus: false,
      privateStatus: false,
    };
  }

  componentDidMount() {
    const craft = this.props.playingCrafts[this.props.curCraftId];
    this.setState({ hideStatus: !craft.is_visible, privateStatus: !craft.is_public });
  }

  onHide = () => {
    this.setState(
      {
        hideStatus: !this.state.hideStatus,
      },
      () => {
        this.props.onHide(this.state.hideStatus);
      }
    );
  };

  onPrivate = () => {
    this.setState(
      {
        privateStatus: !this.state.privateStatus,
      },
      () => {
        this.props.onPrivate(this.state.privateStatus);
      }
    );
  };

  render() {
    const { onClose, onDelete } = this.props;
    return (
      <View style={styles.modalContainer}>
        <View style={styles.container}>
          <View style={styles.wrapper}>
            <TouchableOpacity style={styles.button} onPress={() => this.props.onEditDetail()}>
              <CustomIcon name="info-1" style={styles.icon} />
              <Text style={styles.text}>Edit Details</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.wrapper}>
            <TouchableOpacity style={styles.button} onPress={this.onHide}>
              <CustomIcon name={this.state.hideStatus ? 'show' : 'hide'} style={styles.icon} />
              <Text style={styles.text}>{this.state.hideStatus ? 'Show' : 'Hide'}</Text>
            </TouchableOpacity>
            {/* <CustomButton title="Delete" style={styles.buttonCenter} clickHandler = {() => onDelete()}/> */}
            <View style={styles.buttonCenter} />
            <TouchableOpacity style={styles.button} onPress={this.onPrivate}>
              <CustomIcon
                name={this.state.privateStatus ? 'lock-1' : 'block'}
                style={styles.icon}
              />
              <Text style={styles.text}>{this.state.privateStatus ? 'Private' : 'Public'}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.wrapper}>
            <TouchableOpacity style={styles.button} onPress={() => onDelete()}>
              <CustomIcon name="stop1" style={styles.icon} />
              <Text style={styles.text}>Delete</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => onClose()} style={styles.closeButton}>
            <CustomIcon name="close" style={styles.closeButton} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.64)',
    flexDirection: 'column',
    position: 'absolute',
    zIndex: 10,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    height: METRICS.screenHeight,
    width: METRICS.screenWidth,
  },
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    flexDirection: 'column',
    position: 'absolute',
    zIndex: 10,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    height: METRICS.screenWidth,
    width: METRICS.screenWidth,
    top: METRICS.storeheight,
  },
  wrapper: {
    justifyContent: 'space-around',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    flex: 1,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  buttonCenter: {
    borderColor: COLORS.primaryColor,
    paddingHorizontal: METRICS.spacingBig,
  },
  icon: {
    color: COLORS.primaryColor,
    marginRight: METRICS.spacingNormal,
    fontSize: METRICS.fontSizeHuge,
  },
  text: {
    color: COLORS.whiteColor,
    fontSize: METRICS.fontSizeBig,
    fontFamily: 'lato-bold',
  },
  closeButton: {
    position: 'absolute',
    top: 5 * METRICS.ratioX,
    left: 5 * METRICS.ratioX,
    zIndex: 100,
    color: COLORS.whiteColor,
    fontSize: METRICS.fontSizeHuge,
    padding: METRICS.spacingNormal,
  },
});

function mapDispatchToProps(dispatch) {
  return {
    setPlayingCrafts: (crafts) => dispatch(setPlayingCrafts(crafts)),
  };
}

function mapStateToProps(state) {
  return {
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

export default connect(mapStateToProps, mapDispatchToProps)(OptionModal);
