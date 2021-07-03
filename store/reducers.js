import { combineReducers } from 'redux';
import _ from 'lodash';
import {
  UPDATE_DIMENSIONS,
  TOGGLE_RECORDING,
  TOGGLE_PLAYING,
  UPDATE_TRACK_POSITION,
  SET_STUDIOCONTROLS_CALLBACK,
  UPDATE_AUDIOEFFECT,
  FETCHING_START,
  FETCHING_END,
  RECEIVE_USER,
  PHONE_VERIFIED,
  PHONE_VERIFICATION_FAILED,
  LOGIN_FAILED,
  RECEIVE_SEARCH_USER,
  UPDATE_USER_TOKEN,
  UPDATE_NOTIFICATION_COUNT,
  RECEIVE_COLLABORATION_RESULTS,
  ADD_COLLABORATION_REQUEST,
  REMOVE_COLLABORATION_REQUEST,
  RECEIVE_CONTRIBUTION_RESULTS,
  ADD_CONTRIBUTION_REQUEST,
  REMOVE_CONTRIBUTION_REQUEST,
  RECEIVE_NOTIFICATIONS,
  RECEIVE_INVITES,
  ADD_INVITE,
  REMOVE_INVITE,
  ADD_NOTIFICATION,
  REMOVE_NOTIFICATION,
  UPDATE_NOTIFICATION,
  ADD_ONLINE_STUDIO_USER,
  ADD_ONLINE_STUDIO_USERS,
  REMOVE_ONLINE_STUDIO_USER,
  RECEIVE_STUDIOS,
  RECEIVE_STUDIO,
  UPDATE_STUDIO,
  RESET_STUDIO,
  ADD_AUDIO_TRACK,
  UPDATE_AUDIO_TRACK,
  ADD_VIDEO,
  UPDATE_VIDEO,
  REMOVE_VIDEO,
  SET_CHAT_CLIENT,
  UPDATE_TRACK_ID,
  DELETE_AUDIO_TRACK,
  COPY_VIDEO_TRACK,
  DELETE_VIDEO,
  GET_ALL_GROUPS,
  CREATE_GROUP,
  DELETE_GROUP,
  UPDATE_GROUP,
  EXIT_GROUP,
  MAKE_ADMIN,
  UPDATE_LAST_MESSAGE,
  UPDATE_CRAFT_PLAYING,
  UPLOADING_PROGRESS,
  UPDATE_DMCOUNT,
  UPDATE_ALL_GROUPS,
  CHANGE_SEARCH_TEXT,
  // Global Data State
  UPDATE_CRAFT_STATE,
  UPDATE_PLAYING_CRAFT,
  UPDATE_PROFILE_USER_ID,
  UPDATE_BACK_SCREEN,
  UPDATE_EDITING_CRAFT_ID,
  UPDATE_TITLE,
  UPDATE_CURRENT_CRAFT_ID,
  SAVE_PREV_STATE,
  UPDATE_OPEN_COMMENTS,
  UPDATE_MINI_PLAY,
  UPDATE_DEEPLINK_ALERT,
  UPDATE_CRAFTLIST_ID,
  UPDATE_BACKUP_CRAFT,
  UPDATE_SEEK_ON_BACK,
  UPDATE_CURRENT_TIME,
  UPDATE_FOLLOW_ID,
  UPDATE_ADD_MUSIC_METHOD,
  UPDATE_STORE_STATE,
  UPDATE_STUDIO_OWNER_ID,
  UPDATE_OPEN_MODAL_VALUE,
  UPDATE_ON_BACK_CRAFTLIST,
  UPDATE_ON_BACK_PROFILE,
  PLAYING_TRACK_ID,
  UPDATE_NEW_STUDIO_ID,
  UPDATE_OWNER_ID,
  UPDATE_DURATION,
  UPDATE_IS_AUDIO_DELETE,
  UPDATE_REPEAT,
  UPDATE_IS_SHUFFLE,
  UPDATE_IS_COPY,
  UPDATE_IS_AUDIO_COPY,
  UPDATE_IS_PLAYING,
  UPDATE_UPLOAD_STATUS,
  UPLOADED_ITEMS,
  UPDATE_STUDIO_TRACK_ID,
  //made by dongdong
  UPDATE_IS_CRAFTINIT,
  UPDATE_IS_ADMIN,
} from './actions';
import initialState from './initialState';
import AudioEffectsConstants from '../helpers/AudioEffectsConstants';

function fetchingUpdated(state = initialState.isFetching, action) {
  switch (action.type) {
    case FETCHING_START:
      return true;
    case FETCHING_END:
      return false;
    default:
      return state;
  }
}

function loginFailed(state = initialState.loginFailed, action) {
  switch (action.type) {
    case LOGIN_FAILED:
      return true;
    default:
      return state;
  }
}

function dimensionsUpdated(state = initialState.dimensions, action) {
  switch (action.type) {
    case UPDATE_DIMENSIONS:
      return action.dimensions;
    default:
      return state;
  }
}

function userUpdated(state = initialState.user, action) {
  const {
    id,
    username,
    avatar,
    email,
    phone,
    account_type_id,
    phone_verified_at,
    type,
    token,
    notificationcount,
  } = action;
  switch (type) {
    case RECEIVE_USER:
      return {
        id,
        username,
        avatar,
        email,
        phone,
        account_type_id,
        phone_verified_at,
        token,
        notificationcount,
      };
    case PHONE_VERIFIED:
      return { ...state, phone_verified_at };
    case RECEIVE_NOTIFICATIONS:
      return { ...state, notificationcount };
    case UPDATE_NOTIFICATION_COUNT:
      return { ...state, notificationcount };
    case UPDATE_USER_TOKEN:
      return { ...state, token };
    default:
      return state;
  }
}

function recordingUpdated(state = initialState.recording, action) {
  switch (action.type) {
    case TOGGLE_RECORDING:
      return !state;
    default:
      return state;
  }
}

function playingUpdated(state = initialState.playing, action) {
  switch (action.type) {
    case TOGGLE_PLAYING:
      return !state;
    default:
      return state;
  }
}

function updateCraftPlaying(state = initialState.updateCraftPlaying, action) {
  switch (action.type) {
    case UPDATE_CRAFT_PLAYING:
      return action.playing;
    default:
      return state;
  }
}

function timeScaleUpdated(state = initialState.timeScale, action) {
  switch (action.type) {
    default:
      return state;
  }
}

function unitWidthUpdated(state = initialState.rulerUnitWidth, action) {
  switch (action.type) {
    default:
      return state;
  }
}

function videoTrackPositionUpdate(state = {}, action) {
  const { startPositionMs, endPositionMs, trackType, id, newId } = action;
  if (action.type === UPDATE_TRACK_ID && trackType === 'video') {
    const oldPosition = state[id];
    const newState = { ...state, [newId]: { ...oldPosition } };
    delete newState[id];
    return newState;
  }
  if (
    action.type === DELETE_VIDEO ||
    (action.type === UPDATE_VIDEO &&
      startPositionMs !== undefined &&
      endPositionMs !== undefined) ||
    (action.type === ADD_VIDEO && startPositionMs !== undefined && endPositionMs !== undefined) ||
    (action.type === UPDATE_TRACK_POSITION && action.trackType === 'video')
  ) {
    return trackPositionsUpdated(state, action);
  }
  return state;
}

function audioTrackPositionUpdate(state = {}, action) {
  const { startPositionMs, endPositionMs, trackType, id, newId } = action;
  if (action.type === UPDATE_TRACK_ID && trackType === 'audio') {
    const oldPosition = state[id];
    const newState = { ...state, [newId]: { ...oldPosition } };
    delete newState[id];
    return newState;
  }

  if (
    action.type === DELETE_AUDIO_TRACK ||
    (action.type === ADD_AUDIO_TRACK &&
      startPositionMs !== undefined &&
      endPositionMs !== undefined) ||
    (action.type === UPDATE_AUDIO_TRACK &&
      startPositionMs !== undefined &&
      endPositionMs !== undefined) ||
    (action.type === UPDATE_TRACK_POSITION && action.trackType === 'audio')
  ) {
    return trackPositionsUpdated(state, action);
  }
  return state;
}

function audioTrackEffectsUpdated(state = {}, action) {
  switch (action.type) {
    case UPDATE_AUDIOEFFECT: {
      const newState = { ...state };
      const { id, effect, value } = action;
      const effectObj = { ...AudioEffectsConstants[effect], value };
      let newEffectsArray = [];
      if (newState[id]) {
        newEffectsArray = newState[id];
      }
      newEffectsArray = newEffectsArray.concat(effectObj);
      delete newState[id];
      newState[id] = newEffectsArray;
      return newState;
    }
    default:
      return state;
  }
}

function trackPositionsUpdated(state = {}, action) {
  const newState = { ...state };
  const { id, startPositionMs, endPositionMs, type } = action;
  delete newState[id];
  if (type === DELETE_AUDIO_TRACK || type === DELETE_VIDEO) {
    return newState;
  }
  newState[id] = {
    startPositionMs,
    endPositionMs,
  };
  return newState;
}

function studioControlsCallbackUpdated(state = initialState.studioControlsCallback, action) {
  switch (action.type) {
    case SET_STUDIOCONTROLS_CALLBACK:
      return action.callback;
    default:
      return state;
  }
}

function phoneVerificationUpdated(state = initialState.phoneVerificationFailed, action) {
  switch (action.type) {
    case PHONE_VERIFICATION_FAILED:
      return true;
    default:
      return state;
  }
}

function searchUserResultUpdated(state = initialState.searchUserResult, action) {
  const { user } = action;
  switch (action.type) {
    case RECEIVE_SEARCH_USER:
      return user;
    default:
      return state;
  }
}

function collaborationResultsUpdated(state = initialState.collaborationScreenResults, action) {
  const { collaborationRequests, collaborationRequestId } = action;
  switch (action.type) {
    case RECEIVE_COLLABORATION_RESULTS:
      return collaborationRequests;
    case ADD_COLLABORATION_REQUEST:
      return [...state, action.collabRequest];
    case REMOVE_COLLABORATION_REQUEST:
      return state.filter((collaborationRequest) => {
        if (collaborationRequest.id === collaborationRequestId) {
          return false;
        }
        return true;
      });
    default:
      return state;
  }
}

function collaborationKeysUpdated(state = initialState.collaborationKeys, action) {
  const { collaborationKeys, userId } = action;
  const newState = { ...state };
  switch (action.type) {
    case RECEIVE_COLLABORATION_RESULTS:
      return collaborationKeys;
    case ADD_COLLABORATION_REQUEST:
      newState[action.collabRequest.recipient.id] = action.collabRequest.recipient.id;
      return newState;
    case REMOVE_COLLABORATION_REQUEST:
      delete newState[userId];
      return newState;
    default:
      return state;
  }
}

function contributionResultsUpdated(state = initialState.contributionScreenResults, action) {
  const { collaborationRequests, collaborationRequestId } = action;
  switch (action.type) {
    case RECEIVE_CONTRIBUTION_RESULTS:
      return collaborationRequests;
    case ADD_CONTRIBUTION_REQUEST:
      return [...state, action.collabRequest];
    case REMOVE_CONTRIBUTION_REQUEST:
      return state.filter((collaborationRequest) => {
        if (collaborationRequest.id === collaborationRequestId) {
          return false;
        }
        return true;
      });
    default:
      return state;
  }
}

function contributionKeysUpdated(state = initialState.contributionKeys, action) {
  const { collaborationKeys, userId } = action;
  const newState = { ...state };
  switch (action.type) {
    case RECEIVE_CONTRIBUTION_RESULTS:
      return collaborationKeys;
    case ADD_CONTRIBUTION_REQUEST:
      newState[action.collabRequest.recipient.id] = action.collabRequest.recipient.id;
      return newState;
    case REMOVE_CONTRIBUTION_REQUEST:
      delete newState[userId];
      return newState;
    default:
      return state;
  }
}

function notificationsUpdated(state = initialState.notifications, action) {
  const {
    id,
    type,
    notifications = {},
    notification,
    updateData,
    removeDuplicate,
    notifiable_type,
    notifiable_id,
  } = action;
  const { pushnotification = [] } = notifications;
  switch (type) {
    case RECEIVE_NOTIFICATIONS:
      return pushnotification;
    case ADD_NOTIFICATION:
      return [{ ...notification }, ...state];
    case UPDATE_NOTIFICATION:
      return state.map((notif) => {
        if (notif.id === id) {
          return {
            ...notif,
            ...updateData,
          };
        }
        if (notif.invite_id === id) {
          return {
            ...notif,
            ...updateData,
          };
        }
        return notif;
      });
    case REMOVE_NOTIFICATION:
      return state.filter((n) => {
        if (removeDuplicate) {
          if (n.notifiable_id === notifiable_id && n.notifiable_type === notifiable_type) {
            return false;
          }
        }
        if (n.id === id) {
          return false;
        }
        return true;
      });
    default:
      return state;
  }
}

function invitationsUpdated(state = initialState.invitations, action) {
  const {
    id,
    notification,
    notifications = {},
    updateData,
    type,
    removeDuplicate,
    notifiable_type,
    notifiable_id,
  } = action;
  const { invites = [] } = notifications;
  switch (type) {
    case RECEIVE_NOTIFICATIONS:
      return invites.filter((notif) => {
        if (notif.type === 'App\\Notifications\\CollaborationRequested') {
          return true;
        }
        return false;
      });
    case ADD_NOTIFICATION:
      // if an invitation type
      if (notification.type === 'App\\NotificationsCollaboration\\Requested') {
        return [{ ...notification }, ...state];
      }
      return state;
    case UPDATE_NOTIFICATION:
      return state.map((notif) => {
        if (notif.id === id) {
          return {
            ...notif,
            ...updateData,
          };
        }
        if (notif.invite_id === id) {
          return {
            ...notif,
            ...updateData,
          };
        }
        return notif;
      });
    case REMOVE_NOTIFICATION:
      return state.filter((n) => {
        if (removeDuplicate) {
          if (n.notifiable_id === notifiable_id && n.notifiable_type === notifiable_type) {
            return false;
          }
        }
        if (n.id === id) {
          return false;
        }
        return true;
      });
    default:
      return state;
  }
}

function notificationKeysUpdated(state = initialState.notificationKeys, action) {
  const { notifications, type, id } = action;
  const newState = { ...state };
  const notificationKeys = {};
  switch (type) {
    case RECEIVE_NOTIFICATIONS:
      for (let i = 0; i < notifications.length; i++) {
        notificationKeys[notifications[i].id] = i;
      }
      return notificationKeys;
    case ADD_NOTIFICATION:
      newState[id] = id;
      return newState;
    case REMOVE_NOTIFICATION:
      delete newState[id];
      return newState;
    default:
      return state;
  }
}

// function invitesUpdated(state = initialState.invites, action) {
//   const { type, invites, invite } = action;
//   switch (type) {
//     case RECEIVE_INVITES:
//       return invites;
//     case ADD_INVITE:
//       return [...state, invite];
//     case REMOVE_INVITE:
//       return state.filter(i => {
//         if (i.id === invite.id) {
//           return false;
//         }
//         return true;
//       });
//     default:
//       return state;
//   }
// }

// function inviteKeysUpdated(state = initialState.inviteKeys, action) {
//   const { keys, type, id } = action;
//   const newState = { ...state };
//   switch (type) {
//     case RECEIVE_INVITES:
//       return keys;
//     case ADD_INVITE:
//       newState[invite.id] = invite.id;
//       return newState;
//     case REMOVE_INVITE:
//       delete newState[id];
//       return newState;
//     default:
//       return state;
//   }
// }

function onlineStudioUsersUpdated(state = initialState.onlineStudioUsers, action) {
  const { type, users, user, id } = action;
  let newState;
  switch (type) {
    case ADD_ONLINE_STUDIO_USERS:
      return { ...users };
    case ADD_ONLINE_STUDIO_USER: // TODO: remove later
      return { ...state, [user.id]: { username: user.name, avatar: user.avatar } };
    case REMOVE_ONLINE_STUDIO_USER: // TODO: remove later
      newState = { ...state };
      delete newState[id];
      return newState;
    default:
      return state;
  }
}

function studiosUpdated(state = initialState.studios, action) {
  const { type, studios } = action;
  switch (type) {
    case RECEIVE_STUDIOS:
      return { ...studios };
    default:
      return state;
  }
}

function initialVolumeReducer(state = initialState.initialVolume) {
  return state;
}

function studioUpdated(state = { ...initialState.studio }, action) {
  const { type, studio } = action;

  switch (type) {
    case RECEIVE_STUDIO:
      return { ...studio };
    case UPDATE_STUDIO:
      return { ...state, ...studio };
    case UPDATE_STUDIO_TRACK_ID:
      return { ...state, studio_track_id: action.studio_track_id };
    case RESET_STUDIO:
      return { ...initialState.studio };
    default:
      return state;
  }
}

function audioTracksUpdated(state = { ...initialState.audioTracks }, action) {
  const { id, newId, type, audioTrack = { id: undefined } } = action;
  let newState;
  let oldTrack;
  switch (type) {
    case ADD_AUDIO_TRACK:
      return { ...state, [audioTrack.id]: { ...audioTrack } };
    case DELETE_AUDIO_TRACK:
      newState = { ...state };
      delete newState[id];
      return newState;
    case UPDATE_AUDIO_TRACK:
      if (audioTrack.id) {
        return { ...state, [audioTrack.id]: { ...state[audioTrack.id], ...audioTrack } };
      }
      return state;
    case UPDATE_TRACK_ID:
      oldTrack = state[id];
      newState = { ...state, [newId]: { ...oldTrack, id: newId } };
      delete newState[id];
      return newState;
    default:
      return state;
  }
}

function videosUpdated(state = { ...initialState.videos }, action) {
  const { type, video, id } = action;
  switch (type) {
    case ADD_VIDEO:
      return { ...state, [video.id]: { ...video } };
    case UPDATE_VIDEO:
      return { ...state, [video.id]: { ...state[video.id], ...video } };
    case DELETE_VIDEO:
      const newState = { ...state };
      delete newState[id];
      return newState;
    default:
      return state;
  }
}

function videoKeysOrderUpdated(state = [...initialState.videoKeysOrder], action) {
  const { type, video, id } = action;
  switch (type) {
    case ADD_VIDEO:
      return state.concat(video.id);
    case DELETE_VIDEO:
      return state.filter((videoKey) => videoKey !== id);
    default:
      return state;
  }
}

function chatClientUpdated(state = initialState.chatClient, action) {
  const { chatClient, type } = action;
  switch (type) {
    case SET_CHAT_CLIENT:
      return chatClient;
    default:
      return state;
  }
}

const studioDuration = () => initialState.studioDuration;

function clipboardUpdated(state = initialState.clipboard, action) {
  const { type, id } = action;
  switch (type) {
    case COPY_VIDEO_TRACK:
      const newState = {
        id,
        trackType: 'video',
      };
      return newState;
    default:
      return state;
  }
}

function getChatGroups(state = initialState.groups, action) {
  const { type, groups } = action;
  switch (type) {
    case GET_ALL_GROUPS:
    case CREATE_GROUP:
    case DELETE_GROUP:
    case UPDATE_GROUP:
    case EXIT_GROUP:
    case MAKE_ADMIN:
    case UPDATE_ALL_GROUPS:
    case UPDATE_LAST_MESSAGE:
      const newState = {
        groups,
      };
      return newState;

    default:
      return state;
  }
}

function getDMCount(state = initialState.dmCount, action) {
  const { type, dmCount } = action;
  switch (type) {
    case UPDATE_DMCOUNT:
      const newState = dmCount;
      return newState;
    default:
      return state;
  }
}

function changeSearch(state = initialState.searchText, action) {
  const { type, text } = action;
  switch (type) {
    case CHANGE_SEARCH_TEXT:
      const newState = text;
      return newState;
    default:
      return state;
  }
}

function uploadingProgress(state = initialState.uploadingProgress, action) {
  const { type, data } = action;
  switch (type) {
    case UPLOADING_PROGRESS:
      const index = state.findIndex((item) => item.id === data.id);
      const newState = [...state];
      if (index < 0) newState.push(data);
      else if (data.progress === 100) newState.splice(index, 1);
      else newState.splice(index, 1, data);
      return newState;
    default:
      return state;
  }
}

function uploadedItems(state = initialState.uploadedItems, action) {
  const { type, data } = action;
  switch (type) {
    case UPLOADED_ITEMS:
      const newState = [...state];
      newState.push(data);
      return newState;
    default:
      return state;
  }
}

function updateStudioOwnerId(state = 0, action) {
  switch (action.type) {
    case UPDATE_STUDIO_OWNER_ID:
      return action.data;
    default:
      return state;
  }
}

function updateOpenModalValue(state = 0, action) {
  switch (action.type) {
    case UPDATE_OPEN_MODAL_VALUE:
      return action.data;
    default:
      return state;
  }
}

function updateOnBackCraftList(state = null, action) {
  switch (action.type) {
    case UPDATE_ON_BACK_CRAFTLIST:
      return action.data;
    default:
      return state;
  }
}

function updateRepeat(state = 0, action) {
  switch (action.type) {
    case UPDATE_REPEAT:
      return action.data;
    default:
      return state;
  }
}

function updateIsShuffle(state = 0, action) {
  switch (action.type) {
    case UPDATE_IS_SHUFFLE:
      return action.data;
    default:
      return state;
  }
}

function updateOnBackProfile(state = 0, action) {
  switch (action.type) {
    case UPDATE_ON_BACK_PROFILE:
      return action.data;
    default:
      return state;
  }
}

function playingTrackId(state = 0, action) {
  switch (action.type) {
    case PLAYING_TRACK_ID:
      return action.data;
    default:
      return state;
  }
}

function updateIsCopy(state = 0, action) {
  switch (action.type) {
    case UPDATE_IS_COPY:
      return action.data;
    default:
      return state;
  }
}

function updateIsAudioCopy(state = 0, action) {
  switch (action.type) {
    case UPDATE_IS_AUDIO_COPY:
      return action.data;
    default:
      return state;
  }
}

function updateNewStudioId(state = 0, action) {
  switch (action.type) {
    case UPDATE_NEW_STUDIO_ID:
      return action.data;
    default:
      return state;
  }
}

function updateOwnerId(state = 0, action) {
  switch (action.type) {
    case UPDATE_OWNER_ID:
      return action.data;
    default:
      return state;
  }
}

function updateIsAudioDelete(state = 0, action) {
  switch (action.type) {
    case UPDATE_IS_AUDIO_DELETE:
      return action.data;
    default:
      return state;
  }
}

function updateDuration(state = 0, action) {
  switch (action.type) {
    case UPDATE_DURATION:
      return action.data;
    default:
      return state;
  }
}

function updateIsPlaying(state = -1, action) {
  switch (action.type) {
    case UPDATE_IS_PLAYING:
      return action.data;
    default:
      return state;
  }
}

function updateCraftState(state = initialState.updateCraftPlaying, action) {
  switch (action.type) {
    case UPDATE_CRAFT_STATE:
      return action.data;
    default:
      return state;
  }
}

function updatePlayingCraft(state = [], action) {
  switch (action.type) {
    case UPDATE_PLAYING_CRAFT:
      return action.data;
    default:
      return state;
  }
}

function updateProfileUserId(state = 0, action) {
  switch (action.type) {
    case UPDATE_PROFILE_USER_ID:
      return action.data;
    default:
      return state;
  }
}

function updateBackScreen(state = 'Home', action) {
  switch (action.type) {
    case UPDATE_BACK_SCREEN:
      return action.data;
    default:
      return state;
  }
}

function updateEditingCraftId(state = 0, action) {
  switch (action.type) {
    case UPDATE_EDITING_CRAFT_ID:
      return action.data;
    default:
      return state;
  }
}

function updateTitle(state = '', action) {
  switch (action.type) {
    case UPDATE_TITLE:
      return action.data;
    default:
      return state;
  }
}

function updateCurCraftId(state = 0, action) {
  switch (action.type) {
    case UPDATE_CURRENT_CRAFT_ID:
      return action.data;
    default:
      return state;
  }
}

function updatePrevState(state = null, action) {
  switch (action.type) {
    case SAVE_PREV_STATE:
      return action.data;
    default:
      return state;
  }
}

function updateOpenComments(state = false, action) {
  switch (action.type) {
    case UPDATE_OPEN_COMMENTS:
      return action.data;
    default:
      return state;
  }
}

function updateMiniPlay(state = 0, action) {
  switch (action.type) {
    case UPDATE_MINI_PLAY:
      return action.data;
    default:
      return state;
  }
}

function updateDeepAlert(state = '', action) {
  switch (action.type) {
    case UPDATE_DEEPLINK_ALERT:
      return action.data;
    default:
      return state;
  }
}

function updateCraftListId(state = 0, action) {
  switch (action.type) {
    case UPDATE_CRAFTLIST_ID:
      return action.data;
    default:
      return state;
  }
}

function updateBackupCraft(state = null, action) {
  switch (action.type) {
    case UPDATE_BACKUP_CRAFT:
      return action.data;
    default:
      return state;
  }
}

function updateSeekOnBack(state = false, action) {
  switch (action.type) {
    case UPDATE_SEEK_ON_BACK:
      return action.data;
    default:
      return state;
  }
}

function updateCurrentTime(state = 0, action) {
  switch (action.type) {
    case UPDATE_CURRENT_TIME:
      return action.data;
    default:
      return state;
  }
}

function updateFollowId(state = 0, action) {
  switch (action.type) {
    case UPDATE_FOLLOW_ID:
      return action.data;
    default:
      return state;
  }
}

function updateStoreState(state = 0, action) {
  switch (action.type) {
    case UPDATE_STORE_STATE:
      return action.data;
    default:
      return state;
  }
}

function updateAddMusicMethod(state = '', action) {
  switch (action.type) {
    case UPDATE_ADD_MUSIC_METHOD:
      return action.data;
    default:
      return state;
  }
}

function updateUploadStatus(state = initialState.uploadState, action) {
  switch (action.type) {
    case UPDATE_UPLOAD_STATUS:
      return {
        ...state,
        status: action.status,
        progress: action.progress,
      };
    default:
      return state;
  }
}
//made by dongdong

function updateIsCraftInit(state ='', action) {
  switch(action.type) {
    case UPDATE_IS_CRAFTINIT:
      return action.data
    default: 
      return state
  }
}

function updateIsAdmin(state = false, action) {
  switch (action.type) {
    case UPDATE_IS_ADMIN:
      return action.data;
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  dimensions: dimensionsUpdated,
  isFetching: fetchingUpdated,
  recording: recordingUpdated,
  playing: playingUpdated,
  studioDuration,
  timeScale: timeScaleUpdated,
  rulerUnitWidth: unitWidthUpdated,
  audioTrackPositions: audioTrackPositionUpdate,
  videoTrackPositions: videoTrackPositionUpdate,
  studioControlsCallback: studioControlsCallbackUpdated,
  audioTrackEffects: audioTrackEffectsUpdated,
  user: userUpdated,
  phoneVerificationFailed: phoneVerificationUpdated,
  loginFailed,
  searchUserResult: searchUserResultUpdated,
  collaborationScreenResults: collaborationResultsUpdated,
  collaborationKeys: collaborationKeysUpdated,
  contributionScreenResults: contributionResultsUpdated,
  contributionKeys: contributionKeysUpdated,
  notifications: notificationsUpdated,
  notificationKeys: notificationKeysUpdated,
  groups: getChatGroups,
  dmCount: getDMCount,
  searchText: changeSearch,
  // createGroup: createChatGroup,
  // deleteGroup: deleteChatGroup,
  // updateGroup: updateChatGroup,
  // invites: invitesUpdated,
  // inviteKeys: inviteKeysUpdated,
  onlineStudioUsers: onlineStudioUsersUpdated,
  studios: studiosUpdated,
  studio: studioUpdated,
  audioTracks: audioTracksUpdated,
  videos: videosUpdated,
  videoKeysOrder: videoKeysOrderUpdated,
  invitations: invitationsUpdated,
  chatClient: chatClientUpdated,
  clipboard: clipboardUpdated,
  initialVolume: initialVolumeReducer,
  uploadingProgress,
  uploadedItems,
  // Global Data State
  craftPlaying: updateCraftPlaying,
  studioOwnerId: updateStudioOwnerId,
  openModalValue: updateOpenModalValue,
  onBackCraftList: updateOnBackCraftList,
  repeat: updateRepeat,
  isShuffle: updateIsShuffle,
  onBackProfile: updateOnBackProfile,
  trackId: playingTrackId,
  isCopy: updateIsCopy,
  isAudioCopy: updateIsAudioCopy,
  newStudioId: updateNewStudioId,
  ownerId: updateOwnerId,
  duration: updateDuration,
  isAudioDelete: updateIsAudioDelete,
  isPlaying: updateIsPlaying,
  prevState: updatePrevState,
  craftState: updateCraftState,
  playingCrafts: updatePlayingCraft,
  profileUserId: updateProfileUserId,
  backScreen: updateBackScreen,
  editingCraftId: updateEditingCraftId,
  title: updateTitle,
  curCraftId: updateCurCraftId,
  openComments: updateOpenComments,
  miniPlay: updateMiniPlay,
  deepAlert: updateDeepAlert,
  craftlistId: updateCraftListId,
  backupCraft: updateBackupCraft,
  seekOnBack: updateSeekOnBack,
  currentTime: updateCurrentTime,
  followId: updateFollowId,
  storeState: updateStoreState,
  addMusicMethod: updateAddMusicMethod,
  uploadStatus: updateUploadStatus,
  isCraftInit : updateIsCraftInit,
  isAdmin: updateIsAdmin,
});

export default rootReducer;
