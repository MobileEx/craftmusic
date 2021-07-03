const AudioEffects = {
  flanger: {
    id: 12,
    value: 0,
    title: 'Flanger',
    effectKey: 'flanger',
    minimumValue: 0,
    maximumValue: 1,
    step: 1,
  },
  reverb: {
    id: 1,
    value: 0,
    title: 'Reverb',
    effectKey: 'reverb',
    minimumValue: 0,
    maximumValue: 1,
  },
  echo: {
    id: 2,
    value: 0,
    title: 'Echo',
    effectKey: 'echo',
    minimumValue: 0,
    maximumValue: 1,
  },
  pitch: {
    id: 3,
    value: 0,
    title: 'Pitch',
    effectKey: 'pitch',
    minimumValue: -1200,
    maximumValue: 1200,
  },
  // tempo cannot be changed when in synced bpm and tempo mode
  // tempo: {
  //   id: 4,
  //   value: 0,
  //   title: 'Tempo',
  //   effectKey: 'tempo',
  //   minimumValue: 0.0002,
  //   maximumValue: 2,
  // },
};

export default AudioEffects;
