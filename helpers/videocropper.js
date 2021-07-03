import { ProcessingManager } from 'react-native-video-processing';

export default function (source, orientation) {
  let height = 1080;
  let width = 1920;
  if (orientation === 1) {
    // portrait
    const oldHeight = height;
    height = width;
    width = oldHeight;
  } else if (orientation === 0) {
    // square
    width = height;
  }
  const options = {
    width,
    height,
    bitrateMultiplier: 3,
    saveToCameraRoll: true, // default is false, iOS only
    saveWithCurrentDate: true, // default is false, iOS only
    minimumBitrate: 300000,
    removeAudio: false, // default is false
  };

  return ProcessingManager.compress(source, options);
}
