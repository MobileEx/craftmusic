import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import CustomIcon from '../../CustomIcon';
import { COLORS, METRICS } from '../../../global';

const FileComponent = ({ content }) => {
  return (
    <TouchableOpacity style={styles.wrapper}>
      <CustomIcon name="paper-clip-button" style={styles.icon} />
      <Text style={styles.text}>MySong Lyrics.docx</Text>
      <CustomIcon name="download" style={styles.icon} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderColor: '#237c7a',
    borderWidth: 1,
    padding: METRICS.sliderpadding,
    paddingTop: METRICS.sliderpadvertical,
    paddingBottom: METRICS.sliderpadvertical,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    color: COLORS.whiteColor,
    fontSize: METRICS.fontSizeHuge,
  },
  text: {
    paddingLeft: METRICS.marginTiny,
    color: COLORS.whiteColor,
    flex: 1,
  },
});

export default FileComponent;
