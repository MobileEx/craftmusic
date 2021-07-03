import React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  Modal,
} from 'react-native';
import PropTypes from 'prop-types';
import { COLORS, METRICS } from '../../global';
import { CustomIcon } from '..';

const FileModal = ({ visible, callback, status, onClose, onCloseRequest }) => {
  const action = (actionType) => {
    callback(actionType);
  };
  return (
    <Modal
      animationType="fade"
      transparent
      modalDidClose={onClose}
      visible={visible}
      onClose={this.closeModal}
    >
      <SafeAreaView style={{ flex: 1, justifyContent: 'center' }}>
        <View style={styles.wrapper}>
          <View style={styles.background}>
            <TouchableOpacity onPress={() => onCloseRequest()} style={styles.closeButton}>
              <Text style={styles.iconStyle}>X</Text>
            </TouchableOpacity>
            <ScrollView>
              <View style={styles.titleWrapper}>
                <Text style={styles.title}>Add a Track</Text>
              </View>

              <View style={styles.row}>
                <View style={styles.modalContent}>
                  <TouchableHighlight onPress={() => action('audio')}>
                    <View style={styles.button}>
                      <View style={styles.audioButton}>
                        <CustomIcon
                          name="volume-up"
                          size={30 * METRICS.ratioX}
                          style={styles.icon}
                        />
                      </View>
                      <Text style={styles.label}>Audio Track</Text>
                    </View>
                  </TouchableHighlight>
                  <TouchableHighlight onPress={() => action('record_audio')}>
                    <View style={styles.button}>
                      <View style={styles.audioButton}>
                        <CustomIcon
                          name="microphone"
                          size={30 * METRICS.ratioX}
                          style={styles.icon}
                        />
                      </View>
                      <Text style={styles.label}>Record Audio</Text>
                    </View>
                  </TouchableHighlight>
                </View>

                <View style={styles.modalContent}>
                  <TouchableHighlight onPress={() => action('video_roll')}>
                    <View style={styles.button}>
                      <View style={styles.audioButton}>
                        <CustomIcon
                          name="video-player"
                          size={30 * METRICS.ratioX}
                          style={styles.icon}
                        />
                      </View>
                      <Text style={styles.label}>Video Track</Text>
                    </View>
                  </TouchableHighlight>
                  <TouchableHighlight>
                    <View style={styles.button}>
                      <View style={styles.audioButton}>
                        <CustomIcon name="camera" size={30 * METRICS.ratioX} style={styles.icon} />
                      </View>
                      <Text style={styles.label}>Record Video</Text>
                    </View>
                  </TouchableHighlight>
                </View>

                <View style={styles.modalContent}>
                  <TouchableHighlight onPress={() => action('video')}>
                    <View style={styles.button}>
                      <View style={styles.audioButton}>
                        <CustomIcon
                          name="cloud-download"
                          size={30 * METRICS.ratioX}
                          style={styles.icon}
                        />
                      </View>
                      <Text style={styles.label}>Video Track</Text>
                    </View>
                  </TouchableHighlight>
                  <TouchableHighlight>
                    <View style={styles.button}>
                      <View style={styles.audioButton}>
                        <CustomIcon
                          name="gift-bag"
                          size={30 * METRICS.ratioX}
                          style={styles.icon}
                        />
                      </View>
                      <Text style={styles.label}>Purchased</Text>
                    </View>
                  </TouchableHighlight>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
  },
  background: {
    borderColor: COLORS.whiteColor,
    borderWidth: 1 * METRICS.ratioX,
    backgroundColor: COLORS.blackColor,
    position: 'relative',
    paddingTop: METRICS.spacingNormal,
    paddingBottom: METRICS.spacingBig,
    paddingLeft: METRICS.spacingBig,
    paddingRight: METRICS.spacingBig,
  },
  row: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  audioButton: {
    flexDirection: 'column',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'column',
  },
  icon: {
    color: COLORS.whiteColor,
    paddingTop: METRICS.spacingNormal,
    paddingHorizontal: METRICS.spacingGiant,
  },
  label: {
    marginTop: METRICS.spacingNormal,
    color: COLORS.whiteColor,
    fontFamily: 'lato',
    fontSize: METRICS.fontSizeOK,
    textAlign: 'center',
    paddingBottom: METRICS.spacingNormal,
  },
  modalContent: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  closeButton: {
    marginLeft: METRICS.marginBig,
    marginTop: METRICS.marginBig,
    position: 'absolute',
    top: -15,
    left: -20,
    zIndex: 100,
  },
  iconStyle: {
    marginLeft: METRICS.marginSmall,
    color: COLORS.whiteColor,
    fontSize: METRICS.fontSizeBig,
    fontFamily: 'Lato-Bold',
    paddingLeft: METRICS.spacingTiny,
    paddingTop: METRICS.spacingTiny,
    paddingBottom: METRICS.spacingHuge,
    paddingRight: METRICS.spacingHuge,
  },
  titleWrapper: {
    marginBottom: METRICS.spacingNormal,
  },
  title: {
    color: COLORS.whiteColor,
    textAlign: 'center',
    fontSize: METRICS.fontSizeBig,
    fontFamily: 'Lato-Bold',
  },
});

FileModal.propTypes = {
  onClose: PropTypes.func,
  status: PropTypes.bool,
  onCloseRequest: PropTypes.func,
};

FileModal.defaultProps = {
  onClose: () => {},
  status: false,
  onCloseRequest: () => {},
};

export default FileModal;
