export default {
  // device screen
  dimensions: {
    height: 0,
    width: 0,
  },
  // show loading spinner
  isFetching: false,
  loginFailed: false,
  // trackPositions dictionary holds multi level track objects and their nested tracks (time separated clips)
  /*
        trackPositionObj{
            id: 'asdzx123',
            positionStartMs: 12319123
            children: [
                ....
                {
                    id: 'zxca12',
                    positionStartMs: 1239129
                }
            ]
        }
    */
  // called when we want to trigger actions / player stuff in the studio
  // like clicking Play / Pause in player controls
  studioControlsCallback: null,
  // active effects indexed by id
  // effects object will be of type helpers/AudioEffectsConstants
  audioTrackEffects: {},
  user: {
    account_type_id: null,
    avatar: null,
    email: null,
    id: null,
    phone: null,
    phone_verified_at: null,
    username: null,
    token: null,
    notificationcount: 0,
  },
  chatClient: null,
  phoneVerificationFailed: false,
  searchUserResult: [],
  collaborationScreenResults: [],
  collaborationKeys: {},
  contributionScreenResults: [],
  contributionKeys: {},
  // invitesTab
  // invites: [],
  // inviteKeys: {},
  invitations: [],
  // notifications
  notifications: [],
  notificationKeys: {},

  // studio

  // currently recording
  recording: false,
  // currently playing project
  playing: false,
  // screen width of each ruler unit area
  rulerUnitWidth: 78,
  // millisecond length of studio canvas
  studioDuration: 7200000,
  // milliseconds represented by rulerUnitWidth
  timeScale: 30000,
  audioTracks: {},
  videos: {},
  videoKeysOrder: [],
  onlineStudioUsers: {},
  studios: {},
  audioTrackPositions: {},
  videoTrackPositions: {},
  clipboard: {
    // trackType: audio or video
    trackType: null,
    id: null,
  },
  studio: {
    id: null,
    playing: false,
    recording: false,
    studio_track_id: null
  },
  initialVolume: 1,
  initialPitch: 0,
  initialEcho: 0,
  initialReverb: 0,
  initialFlanger: 0,
  groups: {},
  updateCraftPlaying: false,
  uploadingProgress: [],
  uploadedItems: [],
  dmCount: 0,
  searchText: '',
  craftState: {
    title: 'Home',
    craftPlaying: -1,
    backScreen: 'Home',
    curCraftId: 0,
    playingCrafts: [],
    profileUserId: 0,
    editingCraftId: 0,
    openComments: false,
    miniPlay: -1,
    deepAlert: '',
    craftlistId: 0,
    backupCraft: {},
    seekOnBack: 0,
    currentTime: 0,
    followId: 0,
    storeState: null,
    addMusicMethod: false,
    prevState: {}
  },
  uploadState: {
    status: false,
    progress: 0
  }
};
