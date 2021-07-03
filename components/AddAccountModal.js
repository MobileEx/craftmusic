import React from 'react';
import PropTypes from 'prop-types';
import { SafeAreaView, Modal, View, Text, TextInput, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Button from './Button';
import { COLORS, METRICS, STYLES } from '../global';

const AddAccountModal = ({ onAdd, onClose, status, onCloseRequest, inputEmail }) => {
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
              <Text style={styles.title}>Manage Payment Account</Text>
            </View>

            <Text style={[STYLES.textStyle, styles.addTip]}>Add account email</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                selectionColor={COLORS.primaryColor}
                keyboardAppearance="dark"
                textContentType="emailAddress"
                keyboardType="email-address"
                style={styles.textInput}
                underlineColorAndroid="transparent"
                placeholderTextColor={COLORS.inActive}
                autoCapitalize="none"
                onChangeText={(changedText) => inputEmail(changedText)}
              />
            </View>

            <View style={styles.buttonWrapper}>
              <TouchableOpacity
                onPress={() => onAdd()}
                style={{ marginHorizontal: METRICS.spacingHuge }}
              >
                <Button
                  style={styles.button}
                  title="Add"
                  fontSize={METRICS.fontSizeNormal}
                  status={1}
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
    marginTop: METRICS.spacingSmall,
  },
  title: {
    color: COLORS.whiteColor,
    textAlign: 'center',
    fontSize: METRICS.fontSizeBig,
    fontFamily: 'Lato-Bold',
  },
  addTip: {
    fontSize: METRICS.fontSizeNormal,
    paddingHorizontal: METRICS.spacingHuge,
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    color: COLORS.lightGrey,
    fontFamily: 'lato',
  },
  inputWrapper: {
    width: METRICS.screenWidth - 2 * METRICS.spacingHuge,
    height: 40 * METRICS.ratioX,
    borderRadius: 5 * METRICS.ratioX,
    borderColor: COLORS.btnGrey,
    borderWidth: 0.8 * METRICS.ratioX,
    marginBottom: METRICS.marginSmall,
    marginTop: METRICS.spacingNormal,
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    paddingHorizontal: METRICS.spacingHuge,
  },
  textInput: {
    flex: 1,
    height: 40 * METRICS.ratioX,
    color: COLORS.whiteColor,
    textAlign: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  buttonWrapper: {
    flexDirection: 'row',
    alignSelf: 'center',
    paddingVertical: METRICS.spacingNormal,
  },
  button: {
    width: METRICS.followbuttonwidth,
    height: METRICS.sendbuttonheight,
  },
});

AddAccountModal.propTypes = {
  onClose: PropTypes.func,
  status: PropTypes.bool,
  onCloseRequest: PropTypes.func,
};

AddAccountModal.defaultProps = {
  onClose: () => {},
  status: false,
  onCloseRequest: () => {},
};

export default AddAccountModal;
