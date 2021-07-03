import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Upload from 'react-native-background-upload';
import RNFS from 'react-native-fs';
import UUIDGenerator from 'react-native-uuid-generator';
import { RNFFmpeg } from 'react-native-ffmpeg';
import { VideoPlayer, ProcessingManager } from 'react-native-video-processing';
import firebase from 'react-native-firebase';
import moment from 'moment';
import axios from 'axios';
import _ from 'lodash';
import Env from '../helpers/environment';
import { Audio } from '../libs/rnsuperpowered';
import store from '../store/configureStore';
import { S3Policy } from '../RNS3/S3Policy';
import { parseResponse } from '../utils/xmlToJsonParser';
import {
  ADD_AUDIO_TRACK,
  UPDATE_AUDIO_TRACK,
  SPLIT_AUDIO_TRACK,
  ADD_VIDEO,
  addAudioTrack as addAudioTrackActionCreator,
  studioCheckIn,
  getStudioCollaborators,
  addOnlineStudioUsers,
  receiveStudio,
  saveStudioState as saveStudioStateActionCreator,
  updateAudioTrack as updateAudioTrackActionCreator,
  deleteAudioTrackAction as deleteAudioTrackActionCreator,
  copyVideoTrack as copyVideoTrackActionCreator,
  addVideo as addVideoActionCreator,
  updateVideo as updateVideoActionCreator,
  UPDATE_VIDEO,
  updateTrackId,
  DELETE_AUDIO_TRACK,
  DELETE_VIDEO,
  deleteVideo as deleteVideoTrackActionCreator,
  COPY_VIDEO_TRACK,
  PASTE_VIDEO_TRACK,
  SPLIT_VIDEO,
  updateEditingCraftId,
  updateIsAudioDelete,
  playingTrackId,
  updateUploadStatus,
  updateStudioTrackId,
} from '../store/actions';
import Queue from './Queue';
import AudioEffectsConstants from '../helpers/AudioEffectsConstants';

const queue = new Queue();
// dict local id point to their updated backend id
const localIdReference = {};

const { createContext } = React;

const channelKey = 'Studio';

export const StudioContext = createContext(null);

const headers = {
  Accept: 'application/json',
  ContentType: 'application/json',
};

function getRequestHeaders() {
  const state = store.getState();
  headers.Authorization = `Bearer ${state.user.token}`;
  return headers;
}

const StudioProvider = (props) => {
  state.dispatch = useDispatch();
  state.user = useSelector((state) => state.user);
  state.videoKeysOrder = useSelector((state) => state.videoKeysOrder);
  state.videoTrackPositions = useSelector((state) => state.videoTrackPositions);
  state.studio = useSelector((state) => state.studio);
  state.audioTracks = useSelector((state) => state.audioTracks);
  state.audioTrackPositions = useSelector((state) => state.audioTrackPositions);
  state.videos = useSelector((state) => state.videos);
  state.initialVolume = useSelector((state) => state.initialVolume);
  return <StudioContext.Provider value={state}>{props.children}</StudioContext.Provider>;
};

const setupStudio = (studioId, craftId, user) => {
  state.dispatch(studioCheckIn(studioId, craftId)).then((studio) => {
    state.dispatch(receiveStudio(studio));
    if (studio.craft_id) {
      state.dispatch(updateEditingCraftId(studio.craft_id));
    }
    if (!studioId) {
      checkCollaborators(studio.id, user);
    }
  });
  if (studioId) {
    checkCollaborators(studioId, user);
  }
};

const checkCollaborators = (studioId, user) => {
  joinInOnlineStudio(studioId, user);
  listenOnlineStudio(studioId);
  // state.dispatch(getStudioCollaborators(studioId)).then((response) => {
  //   console.log('response: ', response);
  //   if (response && response.length === 0) {
  //     return;
  //   }
  //   joinInOnlineStudio(studioId, user);
  // });
};

const listenOnlineStudio = (studioId) => {
  studioId = studioId || state.studio.id;
  const studioReference = firebase.database().ref(`/studio/${studioId}`);
  studioReference.on('value', (snapshot) => {
    // Set the Firestore User's online status to true
    const allUsers = {};
    snapshot.forEach((item) => {
      // console.log('current snapshot: ', item.key, item.val());
      const value = item.val();
      if (item.key && value) {
        allUsers[item.key] = value;
      }
    });
    state.dispatch(addOnlineStudioUsers(allUsers));
  });
};

const joinInOnlineStudio = (studioId, user) => {
  studioId = studioId || state.studio.id;
  user = user || state.user;
  const currentUser = { ...user };
  delete currentUser.token;
  const userReference = firebase.database().ref(`/studio/${studioId}/${currentUser.id}`);
  userReference.set(currentUser).then(() => console.log('Online presence set'));

  userReference
    .onDisconnect()
    .remove()
    .then(() => console.log('On disconnect function configured.'));
};

const leaveOnlineStudio = (studioId, userId) => {
  studioId = studioId || state.studio.id;
  userId = userId || state.user.id;
  const reference = firebase.database().ref(`/studio/${studioId}/${userId}`);

  reference.set(null).then(() => console.log('Online presence set'));
};

const setPlayerVolume = (trackId, volume) => {
  new Audio().setPlayerVolume(trackId, volume);
};

const setPlayerPitchShift = (trackId, pitchShiftCents) => {
  new Audio().setPlayerPitchShift(trackId, pitchShiftCents);
};

const setPlayerEcho = (trackId, mix) => {
  new Audio().setPlayerEcho(trackId, mix);
};

const setPlayerReverb = (trackId, mix) => {
  new Audio().setPlayerReverb(trackId, mix);
};

const setPlayerFlanger = (trackId, enabled) => {
  new Audio().setPlayerFlanger(trackId, enabled);
};

const setPlayerPlaybackRate = (trackId, playbackRate) => {
  new Audio().setPlayerPlaybackRate(trackId, playbackRate);
};

const toggleRecorder = (trackId, positions, callback) => {
  new Audio().toggleRecorder(trackId, positions, callback);
};

const registerEvent = (eventName, eventHandler) => {
  // registerEchoEvent(channelKey, eventName, eventHandler);
};

const exportStudio = () => {
  Audio.export();
};

const prepareFile = async (id, filepath, filename, remote = false) => {
  if (!id || !filepath || !filename) {
    throw new Error('Invalid parameters for prepareFile function');
  }
  const cachePath = `${RNFS.CachesDirectoryPath}/craftmusic_workspace/${id}`;
  const newFilepath = `${cachePath}/${filename}`;
  // TODO: handle cache file cleanup
  RNFS.mkdir(cachePath, { NSURLIsExcludedFromBackupKey: true });
  if (remote) {
    // download file
    const download = RNFS.downloadFile({ fromUrl: filepath, toFile: newFilepath });
    const downloadResult = await download.promise;
  } else {
    // move file from document picker tmp directory to cache
    await RNFS.moveFile(filepath, newFilepath);
  }
  return newFilepath;
};

const updateAudioTrack = async (audioTrack, finalEvent = true) => {
  const { id, volume, pitchShift, startPositionMs, endPositionMs, echo } = audioTrack;
  if (volume === 0 || (volume >= 0 && volume <= 100)) {
    setPlayerVolume(id, volume);
    if (!finalEvent) {
      return false;
    }
  }
  state.dispatch(updateAudioTrackActionCreator(audioTrack, startPositionMs, endPositionMs));
  return false;
};

const copyVideoTrack = (id) => {
  state.dispatch(copyVideoTrackActionCreator(id));
};

const pasteVideoTrack = async (id, positionMs) => {
  const videoId = await UUIDGenerator.getRandomUUID();
  const video = getVideo(id);

  const newVideo = { ...video, id: videoId };
  const endPositionMs = newVideo.durationMs + positionMs;
  state.dispatch(addVideoActionCreator(newVideo, positionMs, endPositionMs));
  // state.dispatch(pasteVideoTrackActionCreator(id));
};

const deleteVideoTrack = (id) => {
  state.dispatch(deleteVideoTrackActionCreator(id));
};

const deleteAudioTrack = (id) => {
  state.dispatch(deleteAudioTrackActionCreator(id));
  Audio.deleteTrack(id);
  state.dispatch(playingTrackId(null));
  state.dispatch(updateIsAudioDelete(true));
};

const addAudioTrack = async (track, remote = false) => {
  const {
    id,
    title,
    filename,
    filepath,
    scrollx,
    durationSeconds,
    waveform,
    player,
    volume,
  } = track;

  const newTrack = { ...track };

  state.dispatch(addAudioTrackActionCreator(newTrack, 0, 0));
  // add initial track position
  // state.dispatch(updateTrackPosition(newTrack.id, 'audio', 0, 0));
  let job;
  if (filepath) {
    job = async () => {
      const newFilepath = await prepareFile(newTrack.id, filepath, filename, remote);
      // setup superpowered audio player
      const audio = new Audio(newFilepath, 44100);
      audio.addAudioPlayer(newTrack.id, newFilepath, (error, results) => {
        // grab new id change if applicable
        if (localIdReference[newTrack.id]) {
          newTrack.id = localIdReference[newTrack.id];
          delete localIdReference[newTrack.id];
        }
        // update audio track
        state.dispatch(
          updateAudioTrackActionCreator(
            {
              id: newTrack.id,
              track: newFilepath,
              durationSeconds: results.durationSeconds,
              waveform: results.waveform.slice(700, 1400),
            },
            0,
            results.durationSeconds * 1000
          )
        );
        // update track position with endPositionMs
        // state.dispatch(
        //   updateTrackPosition(newTrack.id, 'audio', 0, results.durationSeconds * 1000)
        // );
      });
    };
  }
  return job;
};

const getLastVideoPositionMs = () => {
  const lastVideoId = state.videoKeysOrder[state.videoKeysOrder.length - 1];
  if (state.videoTrackPositions[lastVideoId]) {
    return state.videoTrackPositions[lastVideoId].endPositionMs;
  }
  return 0;
};

const addVideo = async (id, title, filepath, filename, duration = 0, remote = false) => {
  // if (!id || !title || !filepath) {
  //   throw new Error('Insufficient video data available to add video.');
  // }
  // let { videoSrc } = state;
  // // if no video in player set this one up
  // if (!videoSrc) {
  //   videoSrc = { uri: filepath };
  // }
  let videoId = id;
  if (!videoId) {
    videoId = await UUIDGenerator.getRandomUUID();
  }

  const video = {
    id,
    title,
    filepath,
    selected: false,
    // render loading indicator section
    loading: true,
    thumbs: [],
    durationMs: duration,
  };
  const startPosition = getLastVideoPositionMs();
  const endPosition = startPosition + duration;
  state.dispatch(addVideoActionCreator(video, startPosition, endPosition));
  if (filepath) {
    const cachePath = `${RNFS.CachesDirectoryPath}/craftmusic_workspace/${id}`;

    const newFilepath = await prepareFile(videoId, filepath, filename, remote);
    // get video file information: duration, fps, codec, resolution etc
    const info = await RNFFmpeg.getMediaInformation(newFilepath);

    let latest = 0;
    // get last position
    for (const [videoId, videoPosition] of Object.entries(state.videoTrackPositions)) {
      if (videoPosition.endPositionMs >= latest) {
        latest = videoPosition.endPositionMs;
      }
    }
    // state.dispatch(updateTrackPosition(id, 'video', latest, latest + info.duration));
    state.dispatch(
      updateVideoActionCreator(
        { id, durationMs: info.duration, filepath: newFilepath },
        startPosition,
        startPosition + info.duration
      )
    );
    // to get multiple thumbnails calculate desired fps so we get 4 screenshots every 25% apart:
    // duration in ms converted to s
    // let fps = (info.duration / 1000) / 4
    // using single thumbnail for now

    // get thumbnail
    RNFFmpeg.execute(`-i '${newFilepath}' -ss 00:00:00 -vframes 1 '${cachePath}/thumb%d.png'`).then(
      (result) => {
        // update the video entry in state with new thumb paths
        // turn off loading indicator
        // set up new video object payload: copy existing into new object, replace  with new data
        const newVideo = {
          id,
          loading: false,
          // durationMs: info.duration,
          thumbs: [`${cachePath}/thumb1.png`],
        };
        state.dispatch(updateVideoActionCreator(newVideo));
      }
    );
  }
};

const updateVideo = (videoTrack) => {
  const { startPositionMs, endPositionMs } = videoTrack;
  state.dispatch(updateVideoActionCreator(videoTrack, startPositionMs, endPositionMs));
};

const saveStudioState = (action, data, trackUpdate) => {
  const studioId = state.studio.id;
  state.dispatch(saveStudioStateActionCreator(studioId, action, data, trackUpdate));
};

const uploadFile = async (
  filepath,
  filetype,
  filename,
  requestPayload = {},
  hasVideoTrack,
  videoTrackId
) => {
  const uuidName = await UUIDGenerator.getRandomUUID();
  const key = `studio/${moment().format('MM-DD-YYYY')}/${uuidName}`;
  return new Promise((resolve, reject) => {
    const options = {
      type: 'multipart',
      method: 'POST',
      headers: {
        'content-type': 'multipart/form-data', // server requires a content-type header
      },
      url: Env.S3URL,
      field: 'file',
      path: filepath,
      useUtf8Charset: true,
      parameters: {
        ...S3Policy.generate({
          keyPrefix: 'studio/',
          bucket: Env.bucket,
          region: Env.region,
          accessKey: Env.accessKey,
          secretKey: Env.secretKey,
          successActionStatus: 201,
          key,
          date: new Date(),
          contentType: filetype,
        }),
      },
    };

    updateUploadProgress(true, 0);
    Upload.startUpload(options)
      .then((uploadId) => {
        Upload.addListener('progress', uploadId, (data) => {
          updateUploadProgress(true, Math.trunc(data.progress));
        });
        Upload.addListener('error', uploadId, (data) => {
          updateUploadProgress(false, 0);
          reject(data);
        });
        Upload.addListener('cancelled', uploadId, (data) => {
          updateUploadProgress(false, 0);
          reject(data);
        });

        Upload.addListener('completed', uploadId, (data) => {
          if (filetype === 'audio') {
            RNFS.unlink(filepath)
              .then(() => {
                // File Deleted
              })
              // `unlink` will throw an error, if the item to unlink does not exist
              .catch((err) => {
                // console.log(err.message);
              });
          }
          updateUploadProgress(true, 100);
          if (data && data.responseBody) {
            const isAudio = filetype === 'audio';
            const jsonData = parseResponse(data.responseBody);
            const _uploadType = isAudio ? 'audio' : 'video';
            const studioId = state.studio.id;
            let apiUrl = `${Env.APIURL}/api/studio/${studioId}/track/${_uploadType}`;
            const url = jsonData.key;
            const _files = [
              {
                url,
                filetype,
                filename,
              },
            ];
            const body = {
              url,
              filename,
              filetype,
              files: _files,
              data: JSON.stringify(requestPayload.data),
            };

            if (_uploadType === 'video' && hasVideoTrack) {
              apiUrl = `${Env.APIURL}/api/studio/track/${videoTrackId}`;
              body.action = 'UPDATE_TRACK';
            }
            axios
              .post(apiUrl, body, {
                headers: getRequestHeaders(),
              })
              .then((result) => {
                resolve(result.data);
              })
              .catch((error) => {
                // console.log('Data error =====', error);
                updateUploadProgress(false, 0);
                // alert('Video track for the studio already exists.');
                reject(error);
              });
          }
        });
      })
      .catch((err) => {
        updateUploadProgress(false, 0);
        reject(err);
      });
  });
};

const splitAudioTrack = async (id, positionMs) => {
  const originalTrack = getAudioTrack(id);
  const originalTrackPosition = getAudioTrackPosition(id);

  const clipADurationSeconds = positionMs / 1000;
  const clipBDurationSeconds = originalTrack.durationSeconds - clipADurationSeconds;
  const clipAEndPosition = originalTrackPosition.startPositionMs + positionMs;
  const clipBEndPosition = clipAEndPosition + clipBDurationSeconds * 1000;

  // we want to immediately update ui with track changes and put them in a loading state / show loaders
  state.dispatch(
    updateAudioTrackActionCreator(
      {
        id,
        durationSeconds: clipADurationSeconds,
      },
      originalTrackPosition.startPositionMs,
      clipAEndPosition
    )
  );

  const clipBId = await UUIDGenerator.getRandomUUID();
  const newTrack = {
    id: clipBId,
    title: '',
    filename: '',
    filepath: '',
    durationSeconds: clipBDurationSeconds,
    waveform: originalTrack.waveform,
    volume: 0.5,
    echo: 0,
    pitch: 0,
    reverb: 0,
    flanger: 0,
    // parentId: id,
  };
  // clipB setup new audio track
  state.dispatch(addAudioTrackActionCreator(newTrack, clipAEndPosition, clipBEndPosition));

  // positionMs indicates how many milliseconds into this clip where the cut should occur
  Audio.split(id, clipBId, positionMs, splitAudioTrackCallback);
};

const splitVideo = (id, positionMs) => {
  const originalVideo = getVideo(id);
  const endPositionSeconds = positionMs / 1000;

  const options = {
    startTime: 0,
    endTime: endPositionSeconds,
    quality: VideoPlayer.Constants.quality.QUALITY_1280x720, // iOS only
    saveToCameraRoll: false, // default is false // iOS only
    saveWithCurrentDate: false, // default is false // iOS only
  };
  ProcessingManager.trim(originalVideo.filepath, options).then((data) => console.log(data));

  // console.log('cutting second video');
  // // cut second half
  // const secondOptions = {
  //   startTime: endPositionSeconds,
  //   quality: VideoPlayer.Constants.quality.QUALITY_1280x720, // iOS only
  //   saveToCameraRoll: false, // default is false // iOS only
  //   saveWithCurrentDate: false, // default is false // iOS only
  // };
  // ProcessingManager.trim(originalVideo.filepath, secondOptions).then(data => console.log(data));
};

const getAudioTrack = (id) => {
  return state.audioTracks[id];
};

const getVideo = (id) => {
  return state.videos[id];
};

const getAudioTrackPosition = (id) => {
  const trackPosition = state.audioTrackPositions[id];
  return trackPosition;
};

const splitAudioTrackCallback = (error, { id, clipA, clipB }) => {
  // return;
  const originalTrackPosition = getAudioTrackPosition(id);
  // clipA update the old audio track
  const clipAStartPosition = originalTrackPosition.startPositionMs;
  const clipAEndPosition = clipAStartPosition + clipA.durationSeconds * 1000;
  const clipBEndPosition = clipAEndPosition + clipB.durationSeconds * 1000;
  state.dispatch(
    updateAudioTrackActionCreator(
      {
        id,
        track: clipA.filepath,
        durationSeconds: clipA.durationSeconds,
        waveform: clipA.waveform.slice(0, 700),
      },
      clipAStartPosition,
      clipAEndPosition
    )
  );

  state.dispatch(
    updateAudioTrackActionCreator(
      {
        id: clipB.id,
        track: clipB.filepath,
        durationSeconds: clipB.durationSeconds,
        waveform: clipB.waveform.slice(0, 700),
      },
      clipAEndPosition,
      clipBEndPosition
    )
  );

  // clipB setup new audio track
  // state.dispatch(addAudioTrackActionCreator(newTrack, clipAEndPosition, clipBEndPosition));
};

// update upload progress and status
const updateUploadProgress = (status, progress = 0) => {
  state.dispatch(updateUploadStatus(status, progress));
};

const updateActiveStudioTrackId = (studioTrackId) => {
  state.dispatch(updateStudioTrackId(studioTrackId));
};

// handle studio updates
const update = async (
  updateEvent,
  data = {},
  remote = false,
  hasVideoTrack = false,
  videoTrackId
) => {
  let {
    id,
    title,
    filepath,
    type,
    path,
    studio_id,
    filetype,
    filename,
    duration,
    prepareFile: prepareFilePayload = { filepath: null, remote: false },
    audioTrack = {},
    videoTrack,
    // finalEvent is a boolean from the <CustomSlider> slide update, we only want to update state when slider completes moving
    finalEvent = true,
    positionMs,
    studioId,
    craftId,
    user,
  } = data;

  const { volume } = audioTrack;
  let job;
  let trackUpdate = false;
  let transmissible = false;
  let transmissibleData;
  switch (updateEvent) {
    case DELETE_VIDEO:
      deleteVideoTrack(data.videoId);
      break;
    case PASTE_VIDEO_TRACK:
      pasteVideoTrack(data.pasteVideo);
      break;
    case COPY_VIDEO_TRACK:
      copyVideoTrack(data.videoTrack);
      break;
    case DELETE_AUDIO_TRACK:
      deleteAudioTrack(id);
      break;
    case SPLIT_VIDEO:
      splitVideo(id, positionMs);
      break;
    case SPLIT_AUDIO_TRACK:
      splitAudioTrack(id, positionMs);
      break;
    case UPDATE_AUDIO_TRACK:
      transmissible = true;
      trackUpdate = true;
      transmissibleData = audioTrack;
      if (volume && !finalEvent) {
        transmissible = false;
      }
      job = await updateAudioTrack(audioTrack, finalEvent);
      break;
    case ADD_AUDIO_TRACK:
      transmissible = true;
      // transmissibleData = data;
      if (!filetype) {
        filetype = data.fileType;
      }
      if (filepath) {
        const updatedFileName = filename; // removeEmojis(filename); // To remove emoji's from file name
        const result = await uploadFile(filepath, 'audio', updatedFileName, { ...data });
        const state = store.getState();
        if (result && result.id) {
          const trackId = result.files[result.files.length - 1].pivot.file_id;
          const filePath = result.files[result.files.length - 1].url;
          const studioTrackId = result.files[result.files.length - 1].pivot.studio_track_id;
          updateActiveStudioTrackId(studioTrackId);
          const newTrack = {
            id: trackId,
            title,
            filename: updatedFileName,
            filepath: filePath,
            durationSeconds: 0,
            waveform: [],
            volume: state.initialVolume,
            parentId: undefined,
          };
          // add in audio effects initial defaults
          for (const [key, data] of Object.entries(AudioEffectsConstants)) {
            // set default value, replace with incoming value if necessary
            newTrack[key] = data.value;
          }
          job = await addAudioTrack(newTrack, true);
          setupStudio(studioId, craftId, user);
          updateUploadProgress(false, 100);
          // const requestPayload = {
          //   action: updateEvent,
          //   ...data,
          //   data: newTrack
          // }
          // localIdReference[requestPayload.id] = trackId;
          // state.dispatch(updateTrackId(filetype, trackId, trackId));
          // if (filetype == 'audio') {
          //   // update the native audio track
          //   const audio = new Audio(null, 44100);
          //   // console.log('updateTrackId', requestPayload.id, responseData.id);
          //   audio.updateTrackId(trackId, trackId);
          // }
        } else {
          alert('audio upload failed');
          updateUploadProgress(false, 100);
        }
      }
      // this event will not be transmissible with saveStudioState
      // because the state change was submitted and stored with the uploadFile request
      transmissible = false;
      break;
    case ADD_VIDEO:
      transmissible = true;
      if (!filetype) {
        filetype = data.fileType;
      }
      if (filepath) {
        /**
         * Uploading file on S3
         */
        const result = await uploadFile(
          filepath,
          'video',
          filename,
          { ...data },
          hasVideoTrack,
          videoTrackId
        );
        // Handling for video tracks
        if (result && result.id) {
          const filesArray = result.files;
          filesArray.sort(function (a, b) {
            if (a.id > b.id) return -1;
            if (a.id < b.id) return 1;
            return 0;
          });
          const trackId = filesArray[0].pivot.file_id;
          const s3FilePath = filesArray[0].url;
          const studioTrackId = filesArray[0].pivot.studio_track_id;
          updateActiveStudioTrackId(studioTrackId);
          job = await addVideo(trackId, title, s3FilePath, filename, duration, true);
          setupStudio(studioId, craftId, user);
          updateUploadProgress(false, 100);
        } else {
          alert('audio upload failed');
          updateUploadProgress(false, 100);
        }
      }

      transmissible = false;
      break;
    case UPDATE_VIDEO:
      if (!videoTrack) {
        throw new Error('StudioService: UPDATE_VIDEO No video track was provided.');
      }
      transmissible = true;
      transmissibleData = videoTrack;
      trackUpdate = true;
      updateVideo(videoTrack);
      break;
    default:
      throw new Error('Unprocessable Studio Service update.');
  }

  if (transmissible !== false) {
    // transmit update
    saveStudioState(updateEvent, transmissibleData, trackUpdate);
  }

  if (job) {
    Queue.add(job);
  }
};
const state = { update };
export {
  StudioProvider,
  exportStudio,
  registerEvent,
  setPlayerVolume,
  setPlayerPitchShift,
  setPlayerEcho,
  setPlayerReverb,
  setPlayerPlaybackRate,
  setPlayerFlanger,
  toggleRecorder,
  setupStudio,
  update,
  listenOnlineStudio,
  joinInOnlineStudio,
  leaveOnlineStudio,
};
