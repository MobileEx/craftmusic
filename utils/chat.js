import FastImage from 'react-native-fast-image';
import { createImageProgress } from 'react-native-image-progress';

export const ProgressImage = createImageProgress(FastImage);

export const MessageType = {
  TEXT: 'Text',
  IMAGE: 'Image',
  AUDIO: 'Audio',
  VIDEO: 'Video',
  ATTACHMENT: 'Attachment',
  GIF: 'Gif',
  STICKER: 'Sticker',
};

export const UpdatingMsgType = {
  TEXT: 'Text',
  IMAGE: '🏙 Image',
  AUDIO: '🎧 Audio',
  VIDEO: '🎥 Video',
  ATTACHMENT: '📄 Attachment',
  DELETED: '🗑 Message Deleted',
  GIF: '🌌 Gif',
  STICKER: '🌃 Sticker',
};

export const GIF_TYPES = {
  GIFS: 'gifs',
  STICKERS: 'stickers',
};

export const PATTERNS = {
  url: /(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#()?&//=]*)/g,
  phone: /[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,7}/,
  email: /\S+@\S+\.\S+/,
};

export const getInitials = (name) => {
  const parts = name.split(' ');
  let initials = '';
  for (let i = 0; i < parts.length; i++) {
    if (parts[i].length > 0 && parts[i] !== '') {
      initials += parts[i][0];
    }
  }
  return initials;
};

export const getFlashMessage = (blocked) => {
  switch (blocked) {
    case 'Both':
    case 'Blocking':
      return {
        message: 'Message Not Sent!',
        description: 'This user is not receiving messages at this time.',
        type: 'default',
      };
    case 'Blocked':
      return {
        message: 'User Blocked',
        description:
          'Please unblock this user from Settings> Account> Blocked Accounts to communicate with this user.',
        type: 'default',
        // duration: 4000,
      };
    default:
      return {};
  }
};

export const secondsToTime = (time) => {
  return `${~~(time / 60)}:${time % 60 < 10 ? '0' : ''}${time % 60}`;
};

export const getAudioTimeString = (seconds) => {
  const h = parseInt(seconds / (60 * 60), 0);
  const m = parseInt((seconds % (60 * 60)) / 60, 0);
  const s = parseInt(seconds % 60, 0);

  if (seconds < 60) {
    if (seconds < 1) {
      return `0s`;
    }
    return `${s < 10 ? `${s}` : s}s`;
  }
  if (seconds > 60 && seconds < 3600) {
    // return `${m < 10 ? `0${m}` : m}:${s < 10 ? `0${s}` : s}`;
    return `${m}:${s < 10 ? `0${s}` : s}`;
  }

  return `${h < 10 ? `0${h}` : h}:${m < 10 ? `0${m}` : m}:${s < 10 ? `0${s}` : s}`;
};

export const getFileExtension = (filename) => {
  const ext = /^.+\.([^.]+)$/.exec(filename);
  return ext == null ? '' : ext[1];
};
