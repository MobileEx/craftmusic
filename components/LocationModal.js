import React from 'react';
import PropTypes from 'prop-types';
import { SafeAreaView, Modal, View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Button from './Button';
import { COLORS, METRICS } from '../global';

const LocationModal = ({ onClose, status, onCloseRequest, onUpdate, onRemove }) => {
  return (
    <Modal
      animationType="fade"
      transparent
      modalDidClose={onClose}
      visible={status}
      onRequestClose={() => onCloseRequest(false)}
    >
      <SafeAreaView style={{ flex: 1, justifyContent: 'center' }}>
        <View style={styles.wrapper}>
          <View style={styles.background}>
            <View style={styles.titleWrapper}>
              <Text style={styles.title}>Location</Text>
            </View>

            <View style={styles.buttonWrapper}>
              <TouchableOpacity
                onPress={() => onUpdate()}
                style={{ marginHorizontal: METRICS.spacingHuge }}
              >
                <Button
                  style={styles.location}
                  title="Update"
                  fontSize={METRICS.fontSizeNormal}
                  status={3}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.buttonWrapper}>
              <TouchableOpacity
                onPress={() => onRemove()}
                style={{ marginHorizontal: METRICS.spacingHuge }}
              >
                <Button
                  style={styles.location}
                  title="Remove"
                  fontSize={METRICS.fontSizeNormal}
                  status={3}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.buttonWrapper}>
              <TouchableOpacity
                onPress={() => onClose()}
                style={{ marginHorizontal: METRICS.spacingHuge }}
              >
                <Button
                  style={styles.button}
                  title="Cancel"
                  fontSize={METRICS.fontSizeNormal}
                  status={3}
                />
              </TouchableOpacity>
            </View>
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
    paddingBottom: METRICS.spacingNormal,
    paddingLeft: METRICS.spacingBig,
    paddingRight: METRICS.spacingBig,
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
  buttonWrapper: {
    flexDirection: 'column',
    alignSelf: 'center',
    justifyContent: 'center',
    padding: METRICS.spacingSmall,
  },
  location: {
    width: METRICS.followbuttonwidth,
    height: METRICS.sendbuttonheight,
  },
  button: {
    width: METRICS.followbuttonwidth,
    height: METRICS.sendbuttonheight,
  },
});

LocationModal.propTypes = {
  onClose: PropTypes.func,
  status: PropTypes.bool,
  onCloseRequest: PropTypes.func,
};

LocationModal.defaultProps = {
  onClose: () => {},
  status: false,
  onCloseRequest: () => {},
};

export default LocationModal;
