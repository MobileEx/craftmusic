import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import NavigationService from '../navigation/NavigationService';
import initialState from './initialState';
import firebaseService from '../services/FirebaseService';

// studio
export const ADD_ONLINE_STUDIO_USERS = 'ADD_ONLINE_STUDIO_USERS';
export const ADD_ONLINE_STUDIO_USER = 'ADD_ONLINE_STUDIO_USER'; // TODO: remove later
export const REMOVE_ONLINE_STUDIO_USER = 'REMOVE_ONLINE_STUDIO_USER'; // TODO: remove later
export const ADD_VIDEO = 'ADD_VIDEO';
export const COPY_VIDEO_TRACK = 'COPY_VIDEO_TRACK';
export const SPLIT_VIDEO = 'SPLIT_VIDEO';
export const DELETE_AUDIO_TRACK = 'DELETE_AUDIO_TRACK';
export const DELETE_VIDEO = 'DELETE_VIDEO';
export const UPDATE_VIDEO = 'UPDATE_VIDEO';
export const REMOVE_VIDEO = 'REMOVE_VIDEO';
export const ADD_AUDIO_TRACK = 'ADD_AUDIO_TRACK';
export const UPDATE_AUDIO_TRACK = 'UPDATE_AUDIO_TRACK';
export const SPLIT_AUDIO_TRACK = 'SPLIT_AUDIO_TRACK';
export const CLIPBOARD_COPY = 'CLIPBOARD_COPY';
export const PASTE_VIDEO_TRACK = 'PASTE_VIDEO_TRACK';
export const UPDATE_DIMENSIONS = 'UPDATE_DIMENSIONS';
export const TOGGLE_RECORDING = 'TOGGLE_RECORDING';
export const TOGGLE_PLAYING = 'TOGGLE_PLAYING';
export const ADD_TRACK_POSITION = 'ADD_TRACK_POSITION';
export const LOGIN_FAILED = 'LOGIN_FAILED';
export const UPDATE_TRACK_ID = 'UPDATE_TRACK_ID';
export const UPDATE_TRACK_POSITION = 'UPDATE_TRACK_POSITION';
export const SET_STUDIOCONTROLS_CALLBACK = 'SET_STUDIOCONTROLS_CALLBACK';
export const UPDATE_AUDIOEFFECT = 'UPDATE_AUDIOEFFECT';
export const SET_CHAT_CLIENT = 'SET_CHAT_CLIENT';
export const REGISTER_USER = 'REGISTER_USER';
export const RECEIVE_USER = 'RECEIVE_USER';
export const RECEIVE_SEARCH_USER = 'RECEIVE_SEARCH_USER';
export const FETCHING_START = 'FETCHING_START';
export const FETCHING_END = 'FETCHING_END';
export const PHONE_VERIFIED = 'PHONE_VERIFIED';
export const PHONE_VERIFICATION_FAILED = 'PHONE_VERIFICATION_FAILED';
export const UPDATE_USER_TOKEN = 'UPDATE_USER_TOKEN';

export const RECEIVE_COLLABORATION_RESULTS = 'RECEIVE_COLLABORATION_RESULTS';
export const ADD_COLLABORATION_REQUEST = 'ADD_COLLABORATION_REQUEST';
export const UPDATE_COLLABORATION_REQUEST = 'UPDATE_COLLABORATION_REQUEST';
export const REMOVE_COLLABORATION_REQUEST = 'REMOVE_COLLABORATION_REQUEST';
export const RECEIVE_CONTRIBUTION_RESULTS = 'RECEIVE_CONTRIBUTION_RESULTS';
export const ADD_CONTRIBUTION_REQUEST = 'ADD_CONTRIBUTION_REQUEST';
export const UPDATE_CONTRIBUTIONREQUEST = 'UPDATE_CONTRIBUTION_REQUEST';
export const REMOVE_CONTRIBUTION_REQUEST = 'REMOVE_CONTRIBUTION_REQUEST';

export const RECEIVE_NOTIFICATIONS = 'RECEIVE_NOTIFICATIONS';
export const ADD_NOTIFICATION = 'ADD_NOTIFCATION';
export const REMOVE_NOTIFICATION = 'REMOVE_NOTIFCATION';
export const UPDATE_NOTIFICATION = 'UPDATE_NOTIFCATION';
export const UPDATE_NOTIFICATION_COUNT = 'UPDATE_NOTIFICATION_COUNT';

export const RECEIVE_INVITES = 'RECEIVE_INVITES';
export const REMOVE_INVITE = 'REMOVE_INVITE';
export const ADD_INVITE = 'ADD_INVITE';
export const RECEIVE_STUDIOS = 'RECEIVE_STUDIOS';
export const RECEIVE_STUDIO = 'RECEIVE_STUDIO';
export const UPDATE_STUDIO = 'UPDATE_STUDIO';
export const RESET_STUDIO = 'RESET_STUDIO';

export const UPDATE_CRAFT_PLAYING = 'UPDATE_CRAFT_PLAYING';

export const UPDATE_DMCOUNT = 'UPDATE_DMCOUNT';
export const CHANGE_SEARCH_TEXT = 'CHANGE_SEARCH_TEXT';

export const UPDATE_CRAFT_STATE = 'UPDATE_CRAFT_STATE';
export const UPDATE_PLAYING_CRAFT = 'UPDATE_PLAYING_CRAFT';
export const UPDATE_PROFILE_USER_ID = 'UPDATE_PROFILE_USER_ID';
export const UPDATE_BACK_SCREEN = 'UPDATE_BACK_SCREEN';
export const UPDATE_EDITING_CRAFT_ID = 'UPDATE_EDITING_CRAFT_ID';
export const UPDATE_TITLE = 'UPDATE_TITLE';
export const UPDATE_CURRENT_CRAFT_ID = 'UPDATE_CURRENT_CRAFT_ID';
export const SAVE_PREV_STATE = 'SAVE_PREV_STATE';
export const UPDATE_OPEN_COMMENTS = 'UPDATE_OPEN_COMMENTS';
export const UPDATE_MINI_PLAY = 'UPDATE_MINI_PLAY';
export const UPDATE_CRAFTLIST_ID = 'UPDATE_CRAFTLIST_ID';
export const UPDATE_DEEPLINK_ALERT = 'UPDATE_DEEPLINK_ALERT';
export const UPDATE_BACKUP_CRAFT = 'UPDATE_BACKUP_CRAFT';
export const UPDATE_SEEK_ON_BACK = 'UPDATE_SEEK_ON_BACK';
export const UPDATE_CURRENT_TIME = 'UPDATE_CURRENT_TIME';
export const UPDATE_MIN_TIME = 'UPDATE_MIN_TIME';
export const UPDATE_FOLLOW_ID = 'UPDATE_FOLLOW_ID';
export const UPDATE_STORE_STATE = 'UPDATE_STORE_STATE';
export const UPDATE_ADD_MUSIC_METHOD = 'UPDATE_ADD_MUSIC_METHOD';
export const UPDATE_IS_ADMIN = 'UPDATE_IS_ADMIN';

export const UPDATE_STUDIO_OWNER_ID = 'UPDATE_STUDIO_OWNER_ID';
export const UPDATE_OPEN_MODAL_VALUE = 'UPDATE_OPEN_MODAL_VALUE';
export const UPDATE_ON_BACK_CRAFTLIST = 'UPDATE_ON_BACK_CRAFTLIST';
export const UPDATE_REPEAT = 'UPDATE_REPEAT';
export const UPDATE_IS_SHUFFLE = 'UPDATE_IS_SHUFFLE';
export const UPDATE_ON_BACK_PROFILE = 'UPDATE_ON_BACK_PROFILE';
export const PLAYING_TRACK_ID = 'PLAYING_TRACK_ID';
export const UPDATE_IS_COPY = 'UPDATE_IS_COPY';
export const UPDATE_IS_AUDIO_COPY = 'UPDATE_IS_AUDIO_COPY';
export const UPDATE_NEW_STUDIO_ID = 'UPDATE_NEW_STUDIO_ID';
export const UPDATE_OWNER_ID = 'UPDATE_OWNER_ID';
export const UPDATE_DURATION = 'UPDATE_DURATION';
export const UPDATE_IS_AUDIO_DELETE = 'UPDATE_IS_AUDIO_DELETE';
export const UPDATE_IS_PLAYING = 'UPDATE_IS_PLAYING';
export const UPDATE_UPLOAD_STATUS = 'UPDATE_UPLOAD_STATUS';
export const UPDATE_STUDIO_TRACK_ID = 'UPDATE_STUDIO_TRACK_ID';

// made by dongdong

export const UPDATE_IS_CRAFTINIT = 'UPDATE_IS_CRAFTINIT';

// storeState, addMusicMethod
// / Firebase Collection
export const MESSAGES = 'messages';

// const apiUrl = 'http://localhost/api';
// const  apiUrl = 'http://192.168.1.158/api';
// const apiUrl = 'https://stage.api.craftmusic.app/api';
const apiUrl = 'https://api.craftmusic.app/api';
// const apiUrl = 'http://111.93.38.134/api';

// Chat Api

export const GET_ALL_GROUPS = 'GET_ALL_GROUPS';
export const CREATE_GROUP = 'CREATE_GROUP';
export const DELETE_GROUP = 'DELETE_GROUP';
export const UPDATE_GROUP = 'UPDATE_GROUP';
export const UPDATE_ALL_GROUPS = 'UPDATE_ALL_GROUPS';
export const UPDATE_LAST_MESSAGE = 'UPDATE_LAST_MESSAGE';
export const UPLOADING_PROGRESS = 'UPLOADING_PROGRESS';
export const UPLOADED_ITEMS = 'UPLOADED_ITEMS';
export const MAKE_ADMIN = 'MAKE_ADMIN';
export const EXIT_GROUP = 'EXIT_GROUP';

const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

function getRequestHeaders(token) {
  headers.Authorization = `Bearer ${token}`;
  return headers;
}

export function updateDimensions(dimensions) {
  return {
    type: UPDATE_DIMENSIONS,
    dimensions,
  };
}

export function loginFailed() {
  return {
    type: LOGIN_FAILED,
  };
}

export function logout() {
  return function (dispatch, getState) {
    dispatch(updateCraftState({}));
    dispatch(updateFetching(FETCHING_START));
    const reqHeaders = getRequestHeaders(getState().user.token);
    const userId = getState().user.id;
    firebaseService.offline(userId);
    return fetch(`${apiUrl}/logout`, {
      method: 'GET',
      headers: reqHeaders,
    }).then(
      (response) => {
        dispatch(updateFetching(FETCHING_END));
        dispatch(deleteSavedAuth());
        dispatch(receiveUser(initialState.user));
        NavigationService.navigate('AuthLogout');
      },
      (error) => console.log('An error occurred during logout.', error)
    );
  };
}

export function login({ loginString = null, password = null } = {}) {
  return function (dispatch, getState) {
    dispatch(updateFetching(FETCHING_START));
    const body = JSON.stringify({
      login: loginString,
      password,
    });
    const reqHeaders = getRequestHeaders(getState().user.token);
    return fetch(`${apiUrl}/login`, {
      method: 'POST',
      headers: reqHeaders,
      body,
    })
      .then(
        (response) => {
          if (!response.ok) {
            return Promise.reject(new Error('Incorrect username or password.'));
          }
          return response.json();
        },
        (error) => console.log('An error occurred login:', error)
      )
      .then(
        (json) => {
          dispatch(updateFetching(FETCHING_END));
          dispatch(storeSavedAuth(json.token));
          return dispatch(receiveUser(json));
        },
        (error) => {
          dispatch(updateFetching(FETCHING_END));
          dispatch(loginFailed());
          console.warn(error.message);
        }
      );
  };
}

export function fetchNotifications() {
  return function (dispatch, getState) {
    dispatch(updateFetching(FETCHING_START));
    const { token } = getState().user;
    const reqHeaders = getRequestHeaders(token);
    return fetch(`${apiUrl}/notifications`, {
      method: 'GET',
      headers: reqHeaders,
    })
      .then(
        (response) => {
          if (response.status !== 200) {
            throw new Error('Fetching notifications failed');
          }
          // console.log("notifications response",response)
          return response.json();
        },
        (error) => console.error(error)
      )
      .then(
        (json) => {
          dispatch(updateFetching(FETCHING_END));
          if (!json.error) {
            // pass along current user token
            dispatch(receiveNotifications(json));
            return true;
          }
        },
        () => false
      );
  };
}

export function fetchCurrentUserData() {
  return function (dispatch, getState) {
    dispatch(updateFetching(FETCHING_START));
    const { token } = getState().user;
    const reqHeaders = getRequestHeaders(token);
    return fetch(`${apiUrl}/user`, {
      method: 'GET',
      headers: reqHeaders,
    })
      .then(
        (response) => {
          if (response.status !== 200) {
            throw new Error('Fetching user data failed');
          }
          return response.json();
        },
        (error) => console.error(error)
      )
      .then(
        (json) => {
          dispatch(updateFetching(FETCHING_END));
          if (!json.error) {
            // pass along current user token
            dispatch(receiveUser({ ...json, token }));
            return true;
          }
        },
        () => false
      );
  };
}

export function updateUserToken(token) {
  return {
    type: UPDATE_USER_TOKEN,
    token,
  };
}

export function storeSavedAuth(token) {
  return async function () {
    try {
      await AsyncStorage.setItem('@craft_token', token);
    } catch (e) {
      console.error(e);
    }
  };
}

export function deleteSavedAuth() {
  return async function () {
    try {
      await AsyncStorage.removeItem('@craft_token');
    } catch (e) {
      console.error(e);
    }
  };
}

export function checkSavedAuth() {
  return function (dispatch, getState) {
    return (async () => {
      try {
        const token = await AsyncStorage.getItem('@craft_token');
        if (token !== null) {
          dispatch(updateUserToken(token));
          return dispatch(fetchCurrentUserData()).then((authed) => {
            if (authed) {
              setTimeout(() => {
                if (global.show_link == 'true') return;
                if (!getState().craftState) {
                  dispatch(updateTitle('Home'));
                }
                if (getState().craftState?.title === 'PlayingCraft') {
                  dispatch({
                    type: 'UPDATE_CRAFT_PLAYING',
                    playing: true,
                  });
                  dispatch(updateTitle('Home'));
                }
                NavigationService.navigate(getState().title);
              }, 3000);
            }
            return authed;
          });
        }
      } catch (e) {
        console.error(e);
      }
    })();
  };
}

export function searchUser(username) {
  return function (dispatch) {
    dispatch(updateFetching(FETCHING_START));
    const body = JSON.stringify({
      username,
    });
    return fetch(`${apiUrl}/searchUser`, {
      method: 'POST',
      headers,
      body,
    })
      .then(
        (response) => {
          dispatch(updateFetching(FETCHING_END));
          if (response.status !== 200) {
            throw new Error('Error fetching user search results!');
          }

          return response.json();
        },
        (error) => console.error(error)
      )
      .then(
        (json) => {
          if (!json.error) {
            return dispatch(receiveSearchUser(json));
          }
        },
        () => {
          return dispatch(receiveSearchUser([]));
        }
      );
  };
}

export function sendCollaborationRequest(userId, studioId, price, craftId) {
  return function (dispatch, getState) {
    dispatch(updateFetching(FETCHING_START));
    const body = JSON.stringify({
      recipient_id: userId,
      studio_id: studioId,
      price,
      craft_id: craftId, // added to check the craft id for multiple draft issue
    });
    const reqHeaders = getRequestHeaders(getState().user.token);
    return fetch(`${apiUrl}/collaboration`, {
      method: 'POST',
      headers: reqHeaders,
      body,
    })
      .then(
        (response) => {
          dispatch(updateFetching(FETCHING_END));

          return response.json();
        },
        (error) => console.error(error)
      )
      .then(
        (json) => {
          if (!json.error) {
            dispatch(addStudioCollaborationRequest(json));
            return json;
          }
          // console.log("send invite response",json)
        },
        () => {}
      );
  };
}

// api : to remove-collaborator
export function removeCollaborator(recipient_id, studioId, collabId) {
  return function (dispatch, getState) {
    dispatch(updateFetching(FETCHING_START));
    const body = JSON.stringify({
      recipient_id,
      studio_id: studioId,
    });
    const reqHeaders = getRequestHeaders(getState().user.token);
    return fetch(`${apiUrl}/remove-collaborator`, {
      method: 'POST',
      headers: reqHeaders,
      body,
    })
      .then(
        (response) => {
          dispatch(updateFetching(FETCHING_END));

          return response.json();
        },
        (error) => console.error(error)
      )
      .then(
        (json) => {
          if (!json.error) {
            // console.log("remove user response",json)
            return dispatch(removeStudioCollaborationRequest(collabId, recipient_id));
          }
        },
        () => {}
      );
  };
}

export function saveStudioState(studioId, action, data, track) {
  return function (dispatch, getState) {
    dispatch(updateFetching(FETCHING_START));
    const body = JSON.stringify({
      action,
      data,
    });
    const reqHeaders = getRequestHeaders(getState().user.token);
    let studioUpdateUrl = `${apiUrl}/studio/${studioId}`;
    if (track) {
      studioUpdateUrl += `/${data.id}`;
    }

    return fetch(studioUpdateUrl, {
      method: 'POST',
      headers: reqHeaders,
      body,
    })
      .then(
        (response) => {
          dispatch(updateFetching(FETCHING_END));

          return response.json();
        },
        (error) => console.error(error)
      )
      .then(
        (json) => {
          if (!json.error) {
            // dispatch(addStudioCollaborationRequest(json));
            return json;
          }
        },
        () => {}
      );
  };
}

export function getStudios() {
  return function (dispatch, getState) {
    dispatch(updateFetching(FETCHING_START));
    const reqHeaders = getRequestHeaders(getState().user.token);
    // console.log('list draft api', `${apiUrl}/playingCraft/listDrafts`, reqHeaders);
    return fetch(`${apiUrl}/playingCraft/listDrafts`, {
      method: 'GET',
      headers: reqHeaders,
    })
      .then(
        (response) => {
          // dispatch(updateFetching(FETCHING_END));
          return response.json();
        },
        (error) => console.error('error drafts', error)
      )
      .then(
        (json) => {
          // console.log('show studios', json);

          if (json.length > 0) {
            const studios = {};
            for (const studio of json) {
              studios[studio.updated_at] = studio;
            }
            dispatch(receiveStudios(studios));
            return studios;
          }
        },
        () => {}
      );
  };
}

export function updateCollaborationRequest(collaborationRequestId, update) {
  return function (dispatch, getState) {
    dispatch(updateFetching(FETCHING_START));
    const body = JSON.stringify(update);
    const reqHeaders = getRequestHeaders(getState().user.token);
    return fetch(`${apiUrl}/collaboration/${collaborationRequestId}`, {
      method: 'POST',
      headers: reqHeaders,
      body,
    })
      .then(
        (response) => {
          dispatch(updateFetching(FETCHING_END));
          if (response.status === 204) {
            return Promise.reject();
          }
          return response.json();
        },
        (error) => console.error(error)
      )
      .then(
        (json) => {
          if (json.error) {
            throw new Error(json.error);
          }
          // console.log("response",json)
          dispatch(updateFetching(FETCHING_END));

          // dispatch(updateNotification(collaborationRequestId, update));
        },
        (error) => console.log('update collab promise rejected error', error)
      );
  };
}

export function cancelCollaborationRequest(collaborationRequestId, userId) {
  return function (dispatch) {
    dispatch(updateFetching(FETCHING_START));
    const body = JSON.stringify({
      collaboration_request_id: collaborationRequestId,
    });
    return fetch(`${apiUrl}/collaboration/cancel`, {
      method: 'POST',
      headers,
      body,
    }).then(
      () => {
        dispatch(updateFetching(FETCHING_END));
        return dispatch(removeStudioCollaborationRequest(collaborationRequestId, userId));
      },
      (error) => console.error(error)
    );
  };
}

// studio or user
export function getCollaborationRequests(type, studioId) {
  return function (dispatch) {
    dispatch(updateFetching(FETCHING_START));
    let url = '/collaboration';
    if (type === 'studio') {
      url += `/studio/${studioId}`;
    }
    return fetch(`${apiUrl}${url}`, {
      method: 'GET',
      headers,
    })
      .then(
        (response) => {
          if (response.status !== 200) {
            throw new Error('Error fetching collaboration requests!');
          }
          dispatch(updateFetching(FETCHING_END));
          // console.log("collaboration request data===", response)
          return response.json();
        },
        (error) => console.error(error)
      )
      .then(
        (json) => {
          if (!json.error) {
            const keys = {};
            for (const req of json) {
              keys[req.recipient_id] = req.recipient_id;
            }
            // console.log("collaboration response===", json)
            return dispatch(receiveCollaborationResults(keys, json));
          }
          dispatch(loginFailed());
        },
        () => {
          return dispatch(receiveCollaborationResults([], []));
        }
      );
  };
}

// thunk async action
export function registerUser({
  username,
  email,
  phone,
  password,
  password_confirmation: passwordConfirmation,
  accountType,
}) {
  return function (dispatch) {
    dispatch(updateFetching(FETCHING_START));
    const body = JSON.stringify({
      username,
      email,
      phone,
      password,
      password_confirmation: passwordConfirmation,
      accountType,
    });
    return fetch(`${apiUrl}/register`, {
      method: 'POST',
      headers,
      body,
    })
      .then(
        (response) => {
          return response.json();
        },
        (error) => console.error(error)
      )
      .then((json) => {
        dispatch(updateFetching(FETCHING_END));
        if (!json || json.error) {
          return Promise.reject(Array.isArray(json.error) ? json.error[0] : json.error);
        }
        dispatch(receiveUser(json));
        return json;
      });
  };
}

export function submitVerificationCode(code, user_id) {
  return function (dispatch) {
    dispatch(updateFetching(FETCHING_START));
    const body = JSON.stringify({ verification_code: code, user_id });
    return fetch(`${apiUrl}/verificationCode`, {
      method: 'POST',
      headers,
      body,
    })
      .then(
        (response) => {
          return response.json();
        },
        (error) => Promise.reject(error)
      )
      .then((json) => {
        if (json.phone_verified_at) {
          dispatch(updateFetching(FETCHING_END));
          return dispatch(phoneVerified(json.phone_verified_at));
        }
        dispatch(phoneVerificationFailed());
        return Promise.reject(new Error('Verification failed.'));
      });
  };
}

export function resendSms() {
  return function (dispatch, getState) {
    dispatch(updateFetching(FETCHING_START));
    const { token } = getState().user;
    const reqHeaders = getRequestHeaders(token);
    return fetch(`${apiUrl}/resendSms`, {
      method: 'GET',
      headers,
    }).then(
      (response) => {
        dispatch(updateFetching(FETCHING_END));
      },
      (error) => {
        dispatch(updateFetching(FETCHING_END));
      }
    );
  };
}

export function studioCheckIn(studioId, craftId) {
  return function (dispatch, getState) {
    const { token } = getState().user;
    const reqHeaders = getRequestHeaders(token);
    const studioUrl = `${apiUrl}/checkin_new`;
    // console.log('details at api call', studioId, craftId);
    // if (studioId) {
    //   studioUrl += `/${studioId}`;
    // } else {
    //   studioUrl += '/'+ null
    // }
    // if (craftId) {
    //   studioUrl += `/${craftId}`;
    // } else {
    //   studioUrl += '/' + null
    // }
    const body = JSON.stringify({
      studio_id: studioId,
      craft_id: craftId,
    });
    // console.log('checkin url & BODY=', studioUrl, body);
    return fetch(studioUrl, {
      method: 'POST',
      headers: reqHeaders,
      body,
    })
      .then(
        (response) => {
          // console.log("check-in response",response)
          if (!response.ok) {
            throw new Error('Studio Check-in failed');
          }
          return response.json();
        },
        (error) => console.error('check-in error', error)
      )
      .then((json) => {
        // console.log("check-in json res",json)
        return json;
      });
  };
}
export function getContributionRequests(type, craftlistId) {
  return function (dispatch) {
    dispatch(updateFetching(FETCHING_START));
    let url = '/contribution';
    if (type === 'craftlist') {
      url += `/craftlist/${craftlistId}`;
    }
    return fetch(`${apiUrl}${url}`, {
      method: 'GET',
      headers,
    })
      .then(
        (response) => {
          if (response.status !== 200) {
            throw new Error('Error fetching collaboration requests!');
          }
          dispatch(updateFetching(FETCHING_END));

          return response.json();
        },
        (error) => console.error(error)
      )
      .then(
        (json) => {
          if (!json.error) {
            const keys = {};
            for (const req of json) {
              keys[req.recipient_id] = req.recipient_id;
            }
            return dispatch(receiveCollaborationResults(keys, json));
          }
          dispatch(loginFailed());
        },
        () => {
          return dispatch(receiveCollaborationResults([], []));
        }
      );
  };
}

export function getStudioCollaborators(studioId) {
  return function (dispatch, getState) {
    const { token } = getState().user;
    const reqHeaders = getRequestHeaders(token);
    const url = `/collaboration/studio/${studioId}`;
    return fetch(url, {
      method: 'GET',
      headers: reqHeaders,
    })
      .then(
        (response) => {
          // console.log("check-in response",response)
          if (!response.ok) {
            throw new Error('Studio Check-in failed');
          }
          return response.json();
        },
        (error) => console.error('check-in error', error)
      )
      .then((json) => {
        // console.log("check-in json res",json)
        return json;
      });
  };
}

export function getAllChatGroups() {
  return function (dispatch, getState) {
    dispatch(updateFetching(FETCHING_START));

    const reqHeaders = getRequestHeaders(getState().user.token);
    return fetch(`${apiUrl}/chat/getAllGroups`, {
      method: 'GET',
      headers: reqHeaders,
    })
      .then(
        (response) => {
          if (response.status !== 200) {
            throw new Error('Error fetching chat groups!');
          }
          return response.json();
        },
        (error) => console.log('An error occurred :', error)
      )
      .then(
        (json) => {
          const userId = getState().user.id;
          dispatch(updateFetching(FETCHING_END));
          return dispatch(getAllgroups(json));
        },
        (error) => {
          dispatch(updateFetching(FETCHING_END));
          console.warn(error.message);
        }
      );
  };
}

export function createChatGroup({ name, user_list, image, isPersonal, usersid, bi_ids }) {
  return function (dispatch, getState) {
    return new Promise(async (resolve, reject) => {
      dispatch(updateFetching(FETCHING_START));
      const reqHeaders = getRequestHeaders(getState().user.token);
      const body = JSON.stringify({
        name,
        user_list,
        image,
        isPersonal,
        usersid,
        bi_ids,
      });
      return fetch(`${apiUrl}/chat/createGroup`, {
        method: 'POST',
        headers: reqHeaders,
        body,
      }).then((response) => {
        if (!response.ok) {
          throw new Error('Error creating a chat group!');
        }
        response
          .json()
          .then((json) => {
            resolve(json);
            const modifier = json.group_details ? json : { group_details: { ...json } };
            firebaseService.createGroup(modifier).then((res) => console.log('res', res));

            dispatch(updateFetching(FETCHING_END));
            let newGroups = getState().groups.groups;
            const filtered = newGroups.filter((g) => g === json);
            newGroups = [...newGroups, ...filtered];
            dispatch(createGroup(newGroups));
            return json;
          })
          .catch((error) => {
            dispatch(updateFetching(FETCHING_END));
            // console.warn(error.message);
          });
      });
    }).catch((error) => {});
  };
}

export function deleteChatGroup(id) {
  return function (dispatch, getState) {
    dispatch(updateFetching(FETCHING_START));

    const reqHeaders = getRequestHeaders(getState().user.token);

    return fetch(`${apiUrl}/chat/deletGroup/${id}`, {
      method: 'DELETE',
      headers: reqHeaders,
    })
      .then(
        (response) => {
          if (response.status !== 200) {
            throw new Error('Error deleting a chat group!');
          }
          return response.json();
        },
        (error) => console.log('An error occurred :', error)
      )
      .then(
        (json) => {
          firebaseService.deleteGroup(id);
          dispatch(updateFetching(FETCHING_END));
          const newGroups = getState().groups.groups;
          newGroups.filter((g) => g.id !== id);
          return dispatch(deleteGroup(newGroups));
        },
        (error) => {
          dispatch(updateFetching(FETCHING_END));
          // console.warn(error.message);
        }
      );
  };
}

export function updateChatGroup({ group_id, name, user_list, image, usersid, isPersonal }) {
  return function (dispatch, getState) {
    dispatch(updateFetching(FETCHING_START));
    const reqHeaders = getRequestHeaders(getState().user.token);
    const body = JSON.stringify({
      group_id,
      name,
      user_list,
      image,
      usersid,
      isPersonal,
    });

    return fetch(`${apiUrl}/chat/editGroup`, {
      method: 'POST',
      headers: reqHeaders,
      body,
    })
      .then(
        (response) => {
          if (response.status !== 200) {
            throw new Error('Error updating a chat group!');
          }
          return response.json();
        },
        (error) => console.log('An error occurred :', error)
      )
      .then(
        (json) => {
          const modifier = json.group_details ? json : { group_details: { ...json } };

          firebaseService.updateGroup(modifier);
          dispatch(updateFetching(FETCHING_END));
          let newGroups = getState().groups.groups;
          newGroups.push(json);

          newGroups = [...newGroups, json];
          return dispatch(updateGroup(newGroups));
        },
        (error) => {
          dispatch(updateFetching(FETCHING_END));
        }
      );
  };
}

export function updateGroups(groups) {
  return function (dispatch, getState) {
    return dispatch(uppdateAllgroups(groups));
  };
}

export function makeChatAdmin({ group_id, new_admin_id }) {
  return function (dispatch, getState) {
    dispatch(updateFetching(FETCHING_START));
    const reqHeaders = getRequestHeaders(getState().user.token);
    const body = JSON.stringify({
      group_id,
      new_admin_id,
    });
    return fetch(`${apiUrl}/chat/makeAdmin`, {
      method: 'POST',
      headers: reqHeaders,
      body,
    })
      .then(
        (response) => {
          if (response.status !== 200) {
            throw new Error('Error updating a chat group!');
          }
          return response.json();
        },
        (error) => console.log('An error occurred :', error)
      )
      .then(
        (json) => {
          if (json.status) {
            firebaseService.makeAdmin({ group_id, new_admin_id });
          }
          dispatch(updateFetching(FETCHING_END));
          const newGroups = getState().groups.groups;
          return dispatch(makeAdmin());
        },
        (error) => {
          dispatch(updateFetching(FETCHING_END));
          // console.warn(error.message);
        }
      );
  };
}
export function leaveChatGroup({ group_id, user_list }) {
  return function (dispatch, getState) {
    dispatch(updateFetching(FETCHING_START));
    const reqHeaders = getRequestHeaders(getState().user.token);
    const body = JSON.stringify({
      group_id,
      user_list,
    });
    return fetch(`${apiUrl}/chat/exitGroup`, {
      method: 'POST',
      headers: reqHeaders,
      body,
    })
      .then(
        (response) => {
          if (response.status !== 200) {
            throw new Error('Error leaving a chat group!');
          }
          return response.json();
        },
        (error) => console.log('An error occurred :', error)
      )
      .then(
        (json) => {
          dispatch(updateFetching(FETCHING_END));
          let newGroups = getState().groups.groups;
          const userId = getState().user.id;
          newGroups.push(json);
          newGroups = [...newGroups, json];
          firebaseService.hideChannel(group_id, userId);
          dispatch(exitGroup(newGroups));
          return Promise.resolve(json);
        },
        (error) => {
          dispatch(updateFetching(FETCHING_END));
          // console.warn(error.message);
        }
      );
  };
}

export function updateLastMsg({ group_id, last_message }) {
  return function (dispatch, getState) {
    dispatch(updateFetching(FETCHING_START));
    const reqHeaders = getRequestHeaders(getState().user.token);
    const body = JSON.stringify({
      group_id,
      last_message,
    });
    return fetch(`${apiUrl}/chat/updateLastMessage`, {
      method: 'POST',
      headers: reqHeaders,
      body,
    })
      .then(
        (response) => {
          if (response.status !== 200) {
            throw new Error('Error updating last message!');
          }
          return response.json();
        },
        (error) => console.log('An error occurred :', error)
      )
      .then(
        (json) => {
          dispatch(updateFetching(FETCHING_END));
          const newGroups = getState().groups.groups;
          dispatch(updateLastMessage());
          return json;
        },
        (error) => {
          dispatch(updateFetching(FETCHING_END));
          // console.warn(error.message);
        }
      );
  };
}

export function updateDMCounter(dmcount) {
  return function (dispatch, getState) {
    return dispatch(updateDMCount(dmcount));
  };
}
export function changeSearchText(text) {
  return function (dispatch, getState) {
    return dispatch(changeSearchText(text));
  };
}

// action creators
export function phoneVerified(phone_verified_at) {
  return {
    type: PHONE_VERIFIED,
    phone_verified_at,
  };
}

export function phoneVerificationFailed() {
  return {
    type: PHONE_VERIFICATION_FAILED,
  };
}

export function deleteVideo(id) {
  return {
    type: DELETE_VIDEO,
    id,
  };
}

export function updateStudioTrackId(studio_track_id) {
  return {
    type: UPDATE_STUDIO_TRACK_ID,
    studio_track_id,
  };
}

export function deleteAudioTrack(track_id) {
  return {
    type: DELETE_AUDIO_TRACK,
    id: track_id,
  };
}

export function deleteAudioTrackAction(file_id) {
  return function (dispatch, getState) {
    const state = getState();
    const { studio_track_id } = state.studio;
    const reqHeaders = getRequestHeaders(state.user.token);
    axios
      .delete(`${apiUrl}/studio/track/${studio_track_id}/${file_id}`, {
        headers: reqHeaders,
      })
      .then((result) => {
        dispatch(deleteAudioTrack(file_id));
      })
      .catch((error) => {
        dispatch(deleteAudioTrack(file_id));
      });
  };
}

export function receiveUser({
  id,
  username,
  email,
  phone,
  password,
  avatar,
  account_type_id,
  phone_verified_at,
  token,
  notificationcount,
}) {
  if (id) {
    firebaseService.presence(id);
  }
  return {
    id,
    avatar,
    type: RECEIVE_USER,
    username,
    email,
    phone,
    password,
    phone_verified_at,
    account_type_id,
    token,
    notificationcount,
  };
}

// studio

export function addAudioTrack(audioTrack, startPositionMs, endPositionMs) {
  return {
    type: ADD_AUDIO_TRACK,
    id: audioTrack.id,
    audioTrack,
    startPositionMs,
    endPositionMs,
  };
}

export function updateAudioTrack(audioTrack, startPositionMs, endPositionMs) {
  return {
    type: UPDATE_AUDIO_TRACK,
    audioTrack,
    id: audioTrack.id,
    startPositionMs,
    endPositionMs,
  };
}

export function addVideo(video, startPositionMs, endPositionMs) {
  return {
    type: ADD_VIDEO,
    id: video.id,
    video,
    startPositionMs,
    endPositionMs,
  };
}
export function updateVideo(video, startPositionMs, endPositionMs) {
  return {
    type: UPDATE_VIDEO,
    id: video.id,
    video,
    startPositionMs,
    endPositionMs,
  };
}

export function addOnlineStudioUser(user) {
  return {
    type: ADD_ONLINE_STUDIO_USER,
    user,
  };
}

export function addOnlineStudioUsers(users) {
  return {
    type: ADD_ONLINE_STUDIO_USERS,
    users,
  };
}

export function receiveStudios(studios = {}) {
  return {
    type: RECEIVE_STUDIOS,
    studios,
  };
}

export function removeOnlineStudioUser(id) {
  return {
    type: REMOVE_ONLINE_STUDIO_USER,
    id,
  };
}

export function receiveStudio(studio) {
  return {
    type: RECEIVE_STUDIO,
    studio,
  };
}

export function resetStudio() {
  return {
    type: RESET_STUDIO,
  };
}

// notifications
export function addNotification(notification) {
  return {
    type: ADD_NOTIFICATION,
    notification,
  };
}
export function removeNotification(
  { id, notifiable_type, notifiable_id },
  removeDuplicate = false
) {
  return {
    type: REMOVE_NOTIFICATION,
    id,
    notifiable_type,
    notifiable_id,
    removeDuplicate,
  };
}

export function receiveNotifications(notifications) {
  return {
    type: RECEIVE_NOTIFICATIONS,
    notifications,
    notificationcount: notifications.notificationcount,
  };
}

export function updateNotificationCount(notificationcount) {
  return {
    type: UPDATE_NOTIFICATION_COUNT,
    notificationcount,
  };
}

export function updateNotification(id, updateData) {
  return {
    type: UPDATE_NOTIFICATION,
    id,
    updateData,
  };
}

export function setChatClient(chatClient) {
  return {
    type: SET_CHAT_CLIENT,
    chatClient,
  };
}

export function addStudioCollaborationRequest(collabRequest) {
  return {
    type: ADD_COLLABORATION_REQUEST,
    collabRequest,
  };
}

export function removeStudioCollaborationRequest(collaborationRequestId, userId) {
  return {
    type: REMOVE_COLLABORATION_REQUEST,
    collaborationRequestId,
    userId,
  };
}

export function receiveCollaborationResults(collaborationKeys, collaborationRequests) {
  return {
    type: RECEIVE_COLLABORATION_RESULTS,
    collaborationKeys,
    collaborationRequests,
  };
}

export function receiveContributionResults(collaborationKeys, collaborationRequests) {
  return {
    type: RECEIVE_CONTRIBUTION_RESULTS,
    collaborationKeys,
    collaborationRequests,
  };
}

export function receiveSearchUser(user) {
  return {
    user,
    type: RECEIVE_SEARCH_USER,
  };
}

export function updateFetching(type) {
  return {
    type,
  };
}

export function toggleRecording() {
  return {
    type: TOGGLE_RECORDING,
  };
}

export function togglePlaying() {
  return {
    type: TOGGLE_PLAYING,
  };
}

export function copyVideoTrack(id) {
  return {
    type: COPY_VIDEO_TRACK,
    id,
  };
}

export function copyTrackToClipboard(id, trackType) {
  return {
    type: CLIPBOARD_COPY,
    id,
    trackType,
  };
}

export function updateTrackId(trackType, id, newId) {
  return {
    type: UPDATE_TRACK_ID,
    trackType,
    id,
    newId,
  };
}

export function updateTrackPosition(id, trackType, startPositionMs, endPositionMs) {
  return {
    type: UPDATE_TRACK_POSITION,
    id,
    trackType,
    startPositionMs,
    endPositionMs,
  };
}

export function setStudioControlsCallback(callbackFn) {
  return {
    type: SET_STUDIOCONTROLS_CALLBACK,
    callback: callbackFn,
  };
}

export function updateAudioEffect(id, effectKey, value = 0) {
  return {
    type: UPDATE_AUDIOEFFECT,
    id,
    effect: effectKey,
    value,
  };
}

export function getAllgroups(groups) {
  return {
    type: GET_ALL_GROUPS,
    groups,
  };
}

export function updateAllgroups(groups) {
  return {
    type: UPDATE_ALL_GROUPS,
    groups,
  };
}

export function updateDMCount(dmCount) {
  return {
    type: UPDATE_DMCOUNT,
    dmCount,
  };
}

export function createGroup(groups) {
  return {
    type: CREATE_GROUP,
    groups,
  };
}

export function deleteGroup(groups) {
  return {
    type: DELETE_GROUP,
    groups,
  };
}

export function updateGroup(groups) {
  return {
    type: UPDATE_GROUP,
  };
}

export function exitGroup(groups) {
  return {
    type: EXIT_GROUP,
  };
}
export function makeAdmin() {
  return {
    type: MAKE_ADMIN,
  };
}
export function updateLastMessage() {
  return {
    type: UPDATE_LAST_MESSAGE,
  };
}

export function updateCraftPlaying(playing) {
  return {
    type: UPDATE_CRAFT_PLAYING,
    playing,
  };
}

export function updateUploadingProgress(data) {
  return {
    type: UPLOADING_PROGRESS,
    data,
  };
}

export function uploadedItems(data) {
  return {
    type: UPLOADED_ITEMS,
    data,
  };
}

export function updateSearch(text) {
  return {
    type: CHANGE_SEARCH_TEXT,
    text,
  };
}
/** **************************** */
// State actions for global data
/** **************************** */

export function updateCraftState(data) {
  return {
    type: UPDATE_CRAFT_STATE,
    data,
  };
}

export function setPlayingCrafts(data) {
  return {
    type: UPDATE_PLAYING_CRAFT,
    data,
  };
}

export function updateProfileUserId(data) {
  return {
    type: UPDATE_PROFILE_USER_ID,
    data,
  };
}

export function updateBackScreen(data) {
  return {
    type: UPDATE_BACK_SCREEN,
    data,
  };
}

export function updateEditingCraftId(data) {
  return {
    type: UPDATE_EDITING_CRAFT_ID,
    data,
  };
}

export function updateTitle(data) {
  return {
    type: UPDATE_TITLE,
    data,
  };
}

export function updateCurCraftId(data) {
  return {
    type: UPDATE_CURRENT_CRAFT_ID,
    data,
  };
}

export function updatePrevState(data) {
  return {
    type: SAVE_PREV_STATE,
    data,
  };
}

export function updateOpenComments(data) {
  return {
    type: UPDATE_OPEN_COMMENTS,
    data,
  };
}

export function updateMiniPlay(data) {
  return {
    type: UPDATE_MINI_PLAY,
    data,
  };
}

export function updateDeeplinkAlert(data) {
  return {
    type: UPDATE_DEEPLINK_ALERT,
    data,
  };
}

export function updateCraftListId(data) {
  return {
    type: UPDATE_CRAFTLIST_ID,
    data,
  };
}

export function updateBackupCraft(data) {
  return {
    type: UPDATE_BACKUP_CRAFT,
    data,
  };
}

export function updateSeekOnBack(data) {
  return {
    type: UPDATE_SEEK_ON_BACK,
    data,
  };
}

export function updateCurrentTime(data) {
  return {
    type: UPDATE_CURRENT_TIME,
    data,
  };
}

export function updateMinTime(data) {
  return {
    type: UPDATE_MIN_TIME,
    data,
  };
}

export function updateFollowId(data) {
  return {
    type: UPDATE_FOLLOW_ID,
    data,
  };
}

export function updateStoreState(data) {
  return {
    type: UPDATE_STORE_STATE,
    data,
  };
}

export function updateAddMusicMethod(data) {
  return {
    type: UPDATE_ADD_MUSIC_METHOD,
    data,
  };
}

export function updateStudioOwnerId(data) {
  return {
    type: UPDATE_STUDIO_OWNER_ID,
    data,
  };
}

export function updateOpenModalValue(data) {
  return {
    type: UPDATE_OPEN_MODAL_VALUE,
    data,
  };
}

export function updateOnBackCraftList(data) {
  return {
    type: UPDATE_ON_BACK_CRAFTLIST,
    data,
  };
}

export function updateRepeat(data) {
  return {
    type: UPDATE_REPEAT,
    data,
  };
}

export function updateIsShuffle(data) {
  return {
    type: UPDATE_IS_SHUFFLE,
    data,
  };
}

export function updateOnBackProfile(data) {
  return {
    type: UPDATE_ON_BACK_PROFILE,
    data,
  };
}

export function playingTrackId(data) {
  return {
    type: PLAYING_TRACK_ID,
    data,
  };
}

export function updateIsCopy(data) {
  return {
    type: UPDATE_IS_COPY,
    data,
  };
}

export function updateIsAudioCopy(data) {
  return {
    type: UPDATE_IS_AUDIO_COPY,
    data,
  };
}

export function updateNewStudioId(data) {
  return {
    type: UPDATE_NEW_STUDIO_ID,
    data,
  };
}

export function updateOwnerId(data) {
  return {
    type: UPDATE_OWNER_ID,
    data,
  };
}

export function updateDuration(data) {
  return {
    type: UPDATE_DURATION,
    data,
  };
}

export function updateIsAudioDelete(data) {
  return {
    type: UPDATE_IS_AUDIO_DELETE,
    data,
  };
}

export function updateIsPlaying(data) {
  return {
    type: UPDATE_IS_PLAYING,
    data,
  };
}

export function updateUploadStatus(status, progress = 0) {
  return {
    type: UPDATE_UPLOAD_STATUS,
    status,
    progress,
  };
}

export function updateIsAdmin(data) {
  return {
    type: UPDATE_IS_ADMIN,
    data,
  };
}

// made by dongdong

export function updateIsCraftInit(data) {
  return {
    type: UPDATE_IS_CRAFTINIT,
    data,
  };
}
