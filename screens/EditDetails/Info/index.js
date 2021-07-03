import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { withNavigation } from 'react-navigation';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import _ from 'lodash';
import FastImage from 'react-native-fast-image';
import { useDispatch, connect } from 'react-redux';
import TagInput from '../../../custom_modules/react-native-tags-input';
import { BaseScreen, ScreenHeader, SectionHeader, CustomAccordion } from '../../../components';
import { METRICS, COLORS, STYLES } from '../../../global';
import PlayingCraftService from '../../../services/PlayingCraftService';
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
  updateOwnerId,
} from '../../../store/actions';

const avatarImage = require('../../../assets/images/user.png');
const craftImage = require('../../../assets/images/craft.png');

class Info extends BaseScreen {
  navbarHidden = true;

  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      title: '',
      hashTags: {
        tag: '',
        tagsArray: [],
      },
      descriptionText: '',
      craftId: 2,
      authors: [],
      studioId: '',
      owner: '',
      ownerId: '',
    };
  }

  componentWillUnmount() {
    // Remove the event listener
    this.focusListener.remove();
  }

  componentDidMount() {
    this.focusListener = this.props.navigation.addListener("didFocus", () => {
      let curid = 0;
      if (this.props.editingCraftId) {
        curid = this.props.editingCraftId;
      } else {
        curid = this.props.crafts[this.props.curCraftId].id;
      }

      this.setState({ craftId: curid });

      console.log('urid = ', curid);

      PlayingCraftService.getCraft(curid)
        .then((res) => {
          console.log('ReceiveData: ', res.data);
          this.setState(
            {
              title: res.data.title ? res.data.title : '',
              hashTags: res.data.hashtags
                ? {
                  tag: '',
                  tagsArray: res.data.hashtags.map((item) => {
                    return item.tags;
                  }),
                }
                : {
                  tag: '',
                  tagsArray: [],
                },
              descriptionText: res.data.description ? res.data.description : '',
              authors: res.data.authors,
              studioId: res.data.studio_id,
              owner: res.data.craft_owner,
              ownerId: res.data.owner_id,
            },
            () => {
              this.setAuthors();
            }
          );
        })
        .catch((err) => {
          console.log(err.response.data.error);
        });
    })
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.editingCraftId !== undefined) {
      if (this.state.craftId !== this.props.editingCraftId) {
        const curid = this.props.editingCraftId;
        this.setState({ craftId: curid });

        PlayingCraftService.getCraft(curid)
          .then((res) => {
            this.setState(
              {
                title: res.data.title ? res.data.title : '',
                hashTags: res.data.hashtags
                  ? {
                      tag: '',
                      tagsArray: res.data.hashtags.map((item) => {
                        return item.tags;
                      }),
                    }
                  : {
                      tag: '',
                      tagsArray: [],
                    },
                descriptionText: res.data.description ? res.data.description : '',
                authors: res.data.authors,
                studioId: res.data.studio_id,
                owner: res.data.craft_owner,
                ownerId: res.data.owner_id,
              },
              () => {
                this.setAuthors();
              }
            );
          })
          .catch((err) => {
            console.log(err.response.data.error);
          });
      }
    }
  }

  setAuthors = () => {
    const { ownerId } = this.state;
    this.forceUpdate();
    this.props.updateOwnerId(ownerId);
  };


  handleUpdateDescription = (text) => {
    this.setState({ descriptionText: text });
  };

  onSubmitTitle = () => {
    console.log('craftId = ', this.state.craftId);
    console.log('title = ', this.state.title);
    PlayingCraftService.setTitle(this.state.craftId, this.state.title).then((res) => {});
  };

  updateTagState = (state) => {
    state.tagsArray = _.uniq(
      state.tagsArray
        .map((tag) => {
          return tag.replace(/^#+/g, '#');
        })
        .filter((tag) => {
          return tag.startsWith('#') && /^#[^#]+$/.test(tag);
        })
    );
    this.setState({
      hashTags: state,
    });
    this.onSubmitHashtags(state);
  };

  onSubmitHashtags = _.debounce((state) => {
    PlayingCraftService.setHashTags(this.state.craftId, state.tagsArray).then((res) => {});
  }, 300);

  onSubmitDescription = () => {
    PlayingCraftService.setDescription(
      this.state.craftId,
      this.state.descriptionText
    ).then((res) => {});
  };

  onAuthor = (id) => {
    this.props.updateProfileUserId(id);
    this.props.navigation.push('Profile', { refresh: true });
  };

  onPressBack = (navigation) => {
    navigation.state.params.openModal();
    this.onSubmitTitle();
    this.onSubmitDescription();
  };

  renderScreen() {
    const { navigation } = this.props;
    const { descriptionText, authors } = this.state;

    return (
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.container}
      >
        <ScreenHeader
          pageTitle="Info"
          navigation={navigation}
          backAction={() => this.onPressBack(navigation)}
        />
        <View style={styles.contentWrapper}>
          <View style={styles.section}>
            <CustomAccordion isOpen title="Title">
              <View style={styles.collapseBody}>
                <TextInput
                  selectionColor={COLORS.primaryColor}
                  keyboardAppearance="dark"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoCompleteType="off"
                  style={styles.textInput}
                  onBlur={this.onSubmitTitle}
                  value={this.state.title}
                  onChangeText={(text) => this.setState({ title: text })}
                  maxLength={21}
                />
              </View>
            </CustomAccordion>
            <CustomAccordion isOpen title="Hashtags">
              <TagInput
                selectionColor={COLORS.primaryColor}
                keyboardAppearance="dark"
                autoCapitalize="none"
                autoCorrect={false}
                autoCompleteType="off"
                updateState={this.updateTagState}
                tags={this.state.hashTags}
                containerStyle={[styles.containerTagInput]}
                inputStyle={[styles.tagInput]}
                deleteIconStyles={{
                  backgroundColor: COLORS.blackColor,
                  color: COLORS.whiteColor,
                }}
                tagStyle={{
                  backgroundColor: COLORS.blackColor,
                  borderColor: COLORS.primaryColor,
                  color: COLORS.whiteColor,
                  borderWidth: 1 * METRICS.ratioX,
                }}
                tagTextStyle={{
                  color: COLORS.whiteColor,
                }}
                keysForTag={' '}
              />
            </CustomAccordion>
            <CustomAccordion isOpen title="Description">
              <View style={styles.collapseBody}>
                <TextInput
                  selectionColor={COLORS.primaryColor}
                  keyboardAppearance="dark"
                  autoCapitalize="sentences"
                  multiline
                  style={styles.descriptionInput}
                  value={descriptionText}
                  onChangeText={this.handleUpdateDescription}
                  onBlur={this.onSubmitDescription}
                  maxLength={250}
                />
                <Text
                  style={[STYLES.smallText, styles.descriptionLengthCounter]}
                >{`${descriptionText.length}/250`}</Text>
              </View>
            </CustomAccordion>
            <SectionHeader
              title="Authors"
              iconName="plus"
              primary={false}
              navigation={navigation}
              moveTo="AddCollaborator"
              studioId={
                !this.props.navigation.getParam('studioId')
                  ? this.state.studioId
                  : this.props.navigation.getParam('studioId')
              }
            />

            <View style={styles.usersWrapper}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {authors &&
                  authors.map(
                    (element, index) =>
                      element && (
                        <TouchableOpacity onPress={() => this.onAuthor(element.id)} key={index}>
                          <FastImage
                            source={element.avatar == null ? avatarImage : { uri: element.avatar }}
                            style={styles.avatarWrapper}
                          />
                        </TouchableOpacity>
                      )
                  )}
              </ScrollView>
            </View>

            <SectionHeader title="Derived From" primary={false} />
            <View style={styles.usersWrapper}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <TouchableOpacity>
                  <FastImage source={craftImage} style={styles.userAvatar} />
                </TouchableOpacity>
                <TouchableOpacity>
                  <FastImage source={craftImage} style={styles.userAvatar} />
                </TouchableOpacity>
                <TouchableOpacity>
                  <FastImage source={craftImage} style={styles.userAvatar} />
                </TouchableOpacity>
                <TouchableOpacity>
                  <FastImage source={craftImage} style={styles.userAvatar} />
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: METRICS.spaceNormal,
    paddingRight: METRICS.spaceNormal,
  },
  authorItem: {
    flexDirection: 'row',
  },
  textInput: {
    borderWidth: 1 * METRICS.ratioX,
    borderColor: COLORS.primaryColor,
    padding: METRICS.spacingTiny,
    minHeight: METRICS.rowHeightSmall,
    color: COLORS.whiteColor,
  },
  commentTextInput: {
    borderWidth: 1,
    borderColor: COLORS.primaryColor,
    padding: METRICS.spacingTiny,
    minHeight: 30 * METRICS.ratioY,
    color: COLORS.whiteColor,
  },
  contentWrapper: {
    paddingHorizontal: METRICS.spacingNormal,
    paddingVertical: METRICS.spacingSmall,
  },
  section: {
    flex: 1,
    marginBottom: 30 * METRICS.ratioY,
  },
  collapseBody: {
    position: 'relative',
    paddingVertical: METRICS.marginSmallY,
  },
  descriptionInput: {
    borderColor: COLORS.primaryColor,
    minHeight: METRICS.rowHeightBig,
    borderWidth: 1 * METRICS.ratioX,
    color: COLORS.whiteColor,
    padding: METRICS.spacingTiny,
    paddingBottom: METRICS.spacingBig,
  },
  descriptionLengthCounter: {
    position: 'absolute',
    left: METRICS.marginSmall,
    bottom: 2 * METRICS.marginSmall,
  },
  avatarWrapper: {
    width: METRICS.avatar,
    height: METRICS.avatar,
    borderRadius: METRICS.avatar,
    marginHorizontal: METRICS.spacingNormal,
  },
  usersWrapper: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: METRICS.spacingNormal,
  },
  userAvatar: {
    width: METRICS.smallcrafts,
    height: METRICS.smallcrafts,
    borderRadius: METRICS.craftborder,
    marginHorizontal: METRICS.spacingNormal,
  },
  containerTagInput: {
    borderWidth: 1 * METRICS.ratioX,
    borderColor: COLORS.primaryColor,
    padding: METRICS.spacingTiny,
    paddingHorizontal: METRICS.ratioX,
    minHeight: METRICS.rowHeightSmall,
    margin: 0,
  },
  tagInput: {
    marginHorizontal: 0,
    padding: 0,
    color: COLORS.whiteColor,
    fontSize: METRICS.fontSizeLight,
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
    updateOwnerId: (data) => dispatch(updateOwnerId(data)),
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

export default connect(mapStateToProps, mapDispatchToProps)(withNavigation(Info));
