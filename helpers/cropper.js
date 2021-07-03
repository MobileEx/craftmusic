import ImagePicker from 'react-native-image-crop-picker';

export default function (orientation) {
  let height = 1080;
  let width = 1920;
  if (orientation === 'portrait') {
    const oldHeight = height;
    height = width;
    width = oldHeight;
  } else if (orientation === 'square') {
    width = height;
  }

  return ImagePicker.openPicker({
    width,
    height,
    mediaType: 'video',
    cropping: true,
  });
}
