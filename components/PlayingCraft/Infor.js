import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import FastImage from 'react-native-fast-image';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { useDispatch, connect } from 'react-redux';
import { COLORS, METRICS } from '../../global';
import { CraftBg, user } from '../../global/Images';
import Environment from '../../helpers/environment';
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
} from '../../store/actions';

class InfoTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      curCraftId: 0,
      authorsList: [],
      owner: '',
    };
  }

  componentDidMount() {
    this.setState(
      {
        curCraftId: this.props.curCraftId,
        authorsList: this.props.playingCrafts
          ? this.props.playingCrafts[this.props.curCraftId].authors
          : [],
        owner: this.props.playingCrafts
          ? this.props.playingCrafts[this.props.curCraftId].craft_owner
          : '',
      },
      () => {
        this.updateAuthors();
      }
    );
  }

  updateAuthors = () => {
    const { authorsList, owner } = this.state;
    const selfData = {
      recipient: owner,
    };
    if (authorsList.findIndex((item) => item.id === owner.id) === -1) {
      authorsList.unshift(selfData);
      this.forceUpdate();
    }
  };

  refreshContent = () => {
    this.setState({
      curCraftId: this.props.curCraftId,
    });
  };

  render() {
    const { authorsList } = this.state;
    const craft = this.props.playingCrafts ? this.props.playingCrafts[this.state.curCraftId] : null;
    return (
      <View style={styles.container}>
        <View style={styles.from}>
          <Text style={styles.title}>Authors</Text>
          <View style={styles.derivedspace}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {authorsList &&
                authorsList.map((userItem, index) =>
                  userItem ? (
                    <TouchableOpacity onPress={() => this.props.onAuthor(userItem.id)} key={index}>
                      <FastImage
                        source={userItem.avatar ? { uri: userItem.avatar } : user}
                        style={styles.avatar}
                      />
                    </TouchableOpacity>
                  ) : null
                )}
            </ScrollView>
          </View>
        </View>
        {craft.derivedfrom.length != 0 && (
          <View style={styles.from}>
            <Text style={styles.title}>Derived From</Text>
            <View style={styles.derivedspace}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {craft.derivedfrom.map((craftitem, index) => (
                  <TouchableOpacity
                    onPress={() => this.props.onDerivedFrom(craftitem.id)}
                    key={index}
                  >
                    <FastImage
                      source={
                        craftitem.thumbnail_url
                          ? { uri: Environment.S3URL + craftitem.thumbnail_url }
                          : CraftBg
                      }
                      style={styles.artistAvatar}
                    />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        )}
        {craft.art_categories.length != 0 && (
          <View style={styles.from}>
            <Text style={styles.title}>Art Categories</Text>
            <View style={styles.derived}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  flexGrow: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {craft.art_categories.map((item, index) => (
                  <TouchableOpacity key={index}>
                    {item.category == 'Art Colors' ? (
                      item.type == 'grey' ? (
                        <View
                          style={[styles.swatchCircle, { backgroundColor: COLORS.greygreyColor }]}
                        />
                      ) : (
                        <View
                          style={[
                            styles.swatchCircle,
                            { backgroundColor: COLORS[`${item.type}Color`] },
                          ]}
                        />
                      )
                    ) : (
                      item.category != 'Explicit' && <Text style={styles.name}>{item.type}</Text>
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        )}
        {craft.music_categories.length != 0 && (
          <View style={styles.from}>
            <Text style={styles.title}>Music Categories</Text>
            <View style={styles.derived}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {craft.music_categories.map((item, index) => (
                  <TouchableOpacity key={index}>
                    {item.category != 'Explicit' && <Text style={styles.name}>{item.type}</Text>}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        )}
        {craft.hashtags.length != 0 && (
          <View style={styles.from}>
            <Text style={styles.title}>Hashtags</Text>
            <View style={styles.derived}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {craft.hashtags.map((item, index) => (
                  <TouchableOpacity key={index}>
                    <Text style={styles.name}>{item.tags}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        )}
        {craft.description != null && (
          <View style={styles.from}>
            <Text style={styles.title}>Description</Text>
            <Text style={styles.name}>{craft.description}</Text>
          </View>
        )}
        {craft.lyrics != null && (
          <View style={styles.from}>
            <Text style={styles.title}>Lyrics</Text>
            <Text style={styles.name}>{craft.lyrics}</Text>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: METRICS.spacingNormal,
    paddingLeft: METRICS.spacingNormal,
  },
  name: {
    color: COLORS.whiteColor,
    fontSize: METRICS.fontSizeNormal,
    padding: METRICS.spacingNormal,
    fontFamily: 'lato',
    textAlign: 'center',
    justifyContent: 'center',
  },
  title: {
    color: COLORS.primaryColor,
    fontSize: METRICS.fontSizeNormal,
    fontFamily: 'lato-bold',
    textAlign: 'center',
  },
  avatar: {
    marginRight: METRICS.spacingNormal,
    marginLeft: METRICS.spacingNormal,
    width: METRICS.avatar,
    height: METRICS.avatar,
    borderRadius: METRICS.avatar / 2,
  },
  nameWapper: {
    flexDirection: 'row',
    flexGrow: 1,
  },
  from: {
    marginBottom: METRICS.spacingNormal,
  },
  derived: {
    flexDirection: 'row',
    marginTop: METRICS.spacingNormal,
  },
  derivedspace: {
    flexDirection: 'row',
    marginTop: METRICS.spacingNormal,
    paddingVertical: METRICS.spacingSmall,
  },
  artistAvatar: {
    width: METRICS.smallcrafts,
    height: METRICS.smallcrafts,
    borderRadius: METRICS.craftborder,
    marginRight: METRICS.spacingNormal,
    marginLeft: METRICS.spacingNormal,
  },
  swatchCircle: {
    width: 32 * METRICS.ratioX,
    height: 32 * METRICS.ratioX,
    borderRadius: 16 * METRICS.ratioX,
    borderWidth: 1 * METRICS.ratioX,
    borderColor: COLORS.whiteColor,
    marginHorizontal: METRICS.spacingNormal,
    justifyContent: 'center',
    flexGrow: 1,
  },
});

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
    updateCurrentTime: (data) => dispatch(updateCurrentTime(data)),
    updateFollowId: (data) => dispatch(updateFollowId(data)),
    updateStoreState: (data) => dispatch(updateStoreState(data)),
    updateAddMusicMethod: (data) => dispatch(updateAddMusicMethod(data)),
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

export default connect(mapStateToProps, mapDispatchToProps)(InfoTab);
