import store from '../store/configureStore';
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
} from '../store/actions';
import initialState from '../store/initialState';

const CraftStateService = {
  updateCraftState(previous) {
    // console.log('Update Craft State');
    if (!previous.playingCrafts) {
      previous = initialState.craftState;
    }
    // console.log(previous);
    const {
      playingCrafts,
      profileUserId,
      backScreen,
      editingCraftId,
      title,
      curCraftId,
      openComments,
      miniPlay,
      deepAlert,
      craftlistId,
      backupCraft,
      seekOnBack,
      currentTime,
      followId,
      storeState,
      addMusicMethod,
      prevState,
    } = previous;
    store.dispatch(setPlayingCrafts(playingCrafts));
    store.dispatch(updateProfileUserId(profileUserId));
    store.dispatch(updateBackScreen(backScreen));
    store.dispatch(updateEditingCraftId(editingCraftId));
    store.dispatch(updateTitle(title));
    store.dispatch(updateCurCraftId(curCraftId));
    store.dispatch(updateOpenComments(openComments));
    store.dispatch(updateMiniPlay(miniPlay));
    store.dispatch(updateDeeplinkAlert(deepAlert));
    store.dispatch(updateCraftListId(craftlistId));
    store.dispatch(updateBackupCraft(backupCraft));
    store.dispatch(updateSeekOnBack(seekOnBack));
    store.dispatch(updateCurrentTime(currentTime));
    store.dispatch(updateFollowId(followId));
    store.dispatch(updateStoreState(storeState));
    store.dispatch(updateAddMusicMethod(addMusicMethod));
    store.dispatch(updatePrevState(prevState));
  },
};

export default CraftStateService;
