import React from 'react';
import PropTypes from 'prop-types';
import { SafeAreaView, Modal, View, Text, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Button from './Button';
import { COLORS, METRICS, STYLES } from '../global';

const ConfirmModal = ({
  visible,
  onCloseRequest,
  onConfirm,
  onCancel,
  title = 'Delete',
  message = 'Are you sure you want to delete this craft?',
}) => {
  return (
    <Modal
      animationType="fade"
      transparent
      modalDidClose={onCancel}
      visible={visible}
      onRequestClose={() => onCloseRequest(false)}
    >
      <View style={styles.wrapper}>
        <SafeAreaView style={{ flex: 1, justifyContent: 'center' }}>
          <View style={styles.background}>
            <View style={styles.titleWrapper}>
              <Text style={styles.title}>{title}</Text>
            </View>
            <Text style={[STYLES.textStyle, styles.addTip]}>{message}</Text>

            <View style={styles.buttonWrapper}>
              <TouchableOpacity
                onPress={() => onConfirm()}
                style={{ marginRight: METRICS.marginHuge }}
              >
                <Button
                  style={styles.button}
                  title="Yes"
                  fontSize={METRICS.fontSizeNormal}
                  status={1}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => onCancel()}
                style={{ marginLeft: METRICS.marginHuge }}
              >
                <Button
                  style={styles.button}
                  title="No"
                  fontSize={METRICS.fontSizeNormal}
                  status={3}
                />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </View>
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
  addTip: {
    fontSize: METRICS.fontSizeNormal,
    paddingHorizontal: METRICS.spacingNormal,
    paddingVertical: METRICS.spacingNormal,
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    color: COLORS.lightGrey,
    fontFamily: 'lato',
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
  titleWrapper: {
    paddingBottom: METRICS.spacingSmall,
  },
  title: {
    color: COLORS.whiteColor,
    textAlign: 'center',
    fontSize: METRICS.fontSizeBig,
    fontFamily: 'Lato-Bold',
  },
});

ConfirmModal.propTypes = {
  onClose: PropTypes.func,
  visible: PropTypes.bool,
  onCloseRequest: PropTypes.func,
};

ConfirmModal.defaultProps = {
  onClose: () => {},
  visible: false,
  onCloseRequest: () => {},
};

export default ConfirmModal;
