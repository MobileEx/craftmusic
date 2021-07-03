import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import _ from 'lodash';
import { connect } from 'react-redux';
import CustomIcon from '../CustomIcon';
import { METRICS, COLORS } from '../../global';
import CraftlistService from '../../services/CraftlistService';
import ProfileService from '../../services/ProfileService';
import {
  updateCraftListId,
  setPlayingCrafts,
  updateProfileUserId,
  updateEditingCraftId,
  updateTitle,
  updateCurCraftId,
  updatePrevState,
  updateOpenComments,
  updateMiniPlay,
  updateOnBackCraftList,
} from '../../store/actions';
import store from '../../store/configureStore';

class AddToCraftlist extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      craftlist: [],
      curCraftId: 1,
    };
  }

  componentDidMount() {
    ProfileService.getContributedCraftlist(this.props.user.id)
      .then((res) => {
        // console.log('get contributed craftlist', res.data);
        this.setState({
          craftlist: res.data,
        });
      })
      .catch((err) => {
        console.log(err.response.data.error);
      });
  }

  newCraftlist = () => {
    CraftlistService.addNewCraftlist()
      .then((res) => {
        console.log('newCraftlistID:', res.data);
        this.props.updateCraftListId(res.data);
        this.props.updatePrevState(store.getState());
        this.props.updateTitle('Craft');

        this.props.updateOnBackCraftList(this.props.onBackCraftList);

        this.props.navigation.navigate('Craft', { reset: true });
        this.props.onGoCraftList();
      })
      .catch((err) => {
        console.log(err.response.data.error);
      });
  };

  gotoCraftList = (id) => {
    this.props.updateCraftListId(id);
    this.props.updatePrevState(store.getState());
    this.props.updateTitle('Craftlist');

    this.props.updateOnBackCraftList(this.props.onBackCraftList);
    this.props.navigation.navigate('Craftlist', { reset: true });
    this.props.onGoCraftList();
  };

  onAddCraftToList = (id) => {
    const { craftlist } = this.state;
    CraftlistService.addCraftToList(
      craftlist[id].id,
      this.props.playingCrafts[this.props.curCraftId].id
    )
      .then((res) => {
        showMessage({
          message: `Craft added to ${this.state.craftlist[id].title}`,
          type: 'default',
        });
        // alert(`Craft added to ${this.state.craftlist[id].title}`);
      })
      .catch((err) => {
        console.log('addCraftToList ERROR', err.response.data.error);
      });
  };

  render() {
    const { craftlist } = this.state;
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Share</Text>
        <View style={styles.wrapper}>
          <View style={styles.list}>
            <TouchableOpacity style={styles.row} onPress={() => this.newCraftlist()}>
              <TouchableOpacity onPress={() => this.props.tabSelected(3)}>
                <CustomIcon name="back" style={styles.backicon} />
              </TouchableOpacity>
              <Text style={styles.name} backgroundColor="red">
                Create New Craftlist
              </Text>
              <TouchableOpacity onPress={() => this.newCraftlist()}>
                <CustomIcon name="plus1" style={styles.icon} />
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
          <View style={styles.list}>
            {craftlist.map((item, index) => (
              <TouchableOpacity
                style={styles.row}
                key={index}
                onPress={() => this.gotoCraftList(item.id)}
              >
                <CustomIcon name="back" style={styles.iconBlack} />
                <Text style={styles.name}>{item.title}</Text>
                <TouchableOpacity onPress={() => this.onAddCraftToList(index)}>
                  <CustomIcon name="plus1" style={styles.iconRight} />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <FlashMessage titleStyle={styles.flashStyle} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  flashStyle: {
    fontFamily: 'lato',
    fontSize: METRICS.fontSizeNormal,
  },
  title: {
    color: COLORS.primaryColor,
    fontFamily: 'lato-bold',
    fontSize: METRICS.fontSizeMedium,
    textAlign: 'center',
    marginBottom: METRICS.spacingHuge,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: METRICS.spacingGiant,
  },
  name: {
    color: COLORS.whiteColor,
    fontSize: METRICS.fontSizelarge,
    fontFamily: 'lato',
    flex: 1,
  },
  backicon: {
    color: COLORS.whiteColor,
    fontSize: METRICS.fontSizelarge,
    marginHorizontal: METRICS.spacingBig,
  },
  icon: {
    color: COLORS.whiteColor,
    fontSize: METRICS.fontSizeHuge,
    marginHorizontal: METRICS.spacingBig,
  },
  iconBlack: {
    fontSize: METRICS.fontSizelarge,
    marginHorizontal: METRICS.spacingBig,
  },
  iconRight: {
    fontSize: METRICS.fontSizeHuge,
    color: COLORS.primaryColor,
    marginHorizontal: METRICS.spacingBig,
  },
});

function mapDispatchToProps(dispatch) {
  return {
    setPlayingCrafts: (data) => dispatch(setPlayingCrafts(data)),
    updateCurCraftId: (data) => dispatch(updateCurCraftId(data)),
    updatePrevState: (data) => dispatch(updatePrevState(data)),
    updateOpenComments: (data) => dispatch(updateOpenComments(data)),
    updateTitle: (data) => dispatch(updateTitle(data)),
    updateCraftListId: (data) => dispatch(updateCraftListId(data)),
    updateOnBackCraftList: (data) => dispatch(updateOnBackCraftList(data)),
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

export default connect(mapStateToProps, mapDispatchToProps)(AddToCraftlist);
