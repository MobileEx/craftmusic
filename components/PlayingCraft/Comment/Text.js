import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import { COLORS, METRICS } from '../../../global';
import TwitterTextView from '../../../custom_modules/react-native-twitter-textview';

const TextComponent = ({ content, type, onPressHashtag, onPressMention, onPressLink }) => {
  return (
    <TwitterTextView
      onPressMention={onPressMention}
      onPressHashtag={onPressHashtag}
      onPressLink={onPressLink}
      style={[styles.text, type && styles.userText]}
      hashtagStyle={styles.hashtagStyle}
      mentionStyle={styles.mentionStyle}
      linkStyle={styles.linkStyle}
    >
      {content}
    </TwitterTextView>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: 'lato',
    fontSize: METRICS.fontSizeOK,
    color: COLORS.whiteColor,
    flex: 1,
  },
  userText: {
    fontFamily: 'lato',
    backgroundColor: COLORS.primaryColor,
    color: COLORS.blackColor,
    borderColor: COLORS.primaryColor,
  },
  hashtagStyle: {
    color: COLORS.purpleColor,
  },
  mentionStyle: {
    color: COLORS.primaryColor,
  },
  linkStyle: {
    color: COLORS.primaryColor,
  },
});

TextComponent.propTypes = {
  content: PropTypes.string,
  type: PropTypes.bool,
  onPressHashtag: PropTypes.func,
  onPressMention: PropTypes.func,
};

TextComponent.defaultProps = {
  content: '',
  type: false,
};

export default TextComponent;
