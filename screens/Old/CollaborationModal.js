import React from 'react';
import PropTypes from 'prop-types';
import { Modal, View, TouchableOpacity, Text, TextInput, StyleSheet } from 'react-native';
import Button from './Button';
import { COLORS, METRICS, STYLES } from '../global';

const CollaborationModal = ({ onSend, onClose, status, onCloseRequest, inputTipAmount }) => {
  const [value, onChangeText] = React.useState('');
  const handleSend = () => {
    onSend(value);
  };

  return (
    <Modal
      animationType="fade"
      transparent
      modalDidClose={onClose}
      visible={status}
      onRequestClose={() => onCloseRequest(false)}
    >
      <View style={styles.wrapper}>
        <View style={styles.background}>
          <View style={[STYLES.columnCenterAlign, styles.topContainer]}>
            <Text style={[styles.text, styles.inviteTitle]}>Invite Collaborator</Text>
            <Text style={[styles.text, styles.collabDescription]}>
              You can offer a Collaborator funds or simply send an invite. Choose options below.
            </Text>
          </View>

          <Text style={[styles.text, styles.addPrice]}>Add price (optional):</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              underlineColorAndroid="transparent"
              placeholderTextColor={COLORS.inActive}
              autoCapitalize="none"
              keyboardType="numeric"
              onChangeText={(text) => onChangeText(text)}
              value={value}
            />
          </View>

          <View style={styles.buttonWrapper}>
            <TouchableOpacity
              onPress={handleSend}
              style={{ marginHorizontal: METRICS.spacingHuge }}
            >
              <Button
                style={styles.button}
                title="Send"
                fontSize={METRICS.fontSizeNormal}
                status={3}
              />
            </TouchableOpacity>
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
    </Modal>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  background: {
    width: METRICS.screenWidth,
    borderBottomColor: COLORS.primaryColor,
    borderTopColor: COLORS.primaryColor,
    borderWidth: 0.5 * METRICS.ratioX,
    backgroundColor: COLORS.blackColor,
    marginTop: (METRICS.screenHeight - 280 * METRICS.ratioX) / 2,
  },
  topContainer: {
    paddingHorizontal: METRICS.marginHuge,
    paddingVertical: METRICS.spacingSmall,
  },
  addPrice: {
    marginLeft: METRICS.marginHuge,
  },
  inviteTitle: {
    marginBottom: METRICS.spacingSmall,
  },
  text: {
    fontSize: METRICS.fontSizeNormal,
    color: COLORS.whiteColor,
    fontFamily: 'lato',
  },
  collabDescription: {
    marginBottom: METRICS.spacingSmall,
  },
  inputWrapper: {
    width: METRICS.screenWidth - METRICS.marginBig * 2,
    height: 40 * METRICS.ratioX,
    borderRadius: 5 * METRICS.ratioX,
    borderColor: COLORS.btnGrey,
    borderWidth: 0.8 * METRICS.ratioX,
    marginLeft: METRICS.marginBig,
    marginTop: METRICS.marginSmall,
    justifyContent: 'center',
    alignContent: 'center',
  },
  textInput: {
    flex: 1,
    height: 40 * METRICS.ratioX,
    marginLeft: METRICS.marginTiny,
    marginRight: METRICS.marginTiny,
    color: COLORS.whiteColor,
  },
  buttonWrapper: {
    flexDirection: 'row',
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'space-between',
    marginTop: 45 * METRICS.ratioX,
    marginBottom: 45 * METRICS.ratioX,
  },
  button: {
    width: METRICS.followbuttonwidth,
    height: METRICS.sendbuttonheight,
  },
});

CollaborationModal.propTypes = {
  onSend: PropTypes.func,
  onClose: PropTypes.func,
  status: PropTypes.bool,
  onCloseRequest: PropTypes.func,
};

CollaborationModal.defaultProps = {
  onSend: () => {},
  onClose: () => {},
  status: false,
  onCloseRequest: () => {},
};

export default CollaborationModal;
