import React from 'react';
import FastImage from 'react-native-fast-image';

const VideoThumbs = ({ thumbs }) => {
  return thumbs.map((thumb) => {
    const parts = thumb.split('/');
    const key = parts[parts.length - 1];
    return (
      <FastImage
        key={key}
        source={{ uri: thumb }}
        style={{ width: '100%', height: '100%' }}
        imageStyle={{ width: '100%' }}
      />
    );
  });
};

export default VideoThumbs;
