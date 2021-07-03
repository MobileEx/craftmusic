import React from 'react';
import PropTypes from 'prop-types';
import { Modal, View, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { WebView } from 'react-native-webview';
import CustomIcon from './CustomIcon';
import { COLORS, METRICS } from '../global';

const PayModal = ({ onClose, status, onCloseRequest, paypalUrl, onNavigationStateChange }) => {
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
          <TouchableOpacity onPress={() => onClose()} style={styles.closeButton}>
            <View style={styles.closeButtonWrapper}>
              <CustomIcon
                name="close"
                size={METRICS.fontSizeBiggest}
                style={[styles.iconStyle, { color: COLORS.whiteColor }]}
              />
            </View>
          </TouchableOpacity>
          <WebView
            source={{ uri: paypalUrl }}
            onNavigationStateChange={onNavigationStateChange}
            startInLoadingState
            scalesPageToFit
            javaScriptEnabled
            style={{ flex: 1 }}
            injectedJavaScript="window.callSomeFunction(); void(0);"
          />
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
    width: METRICS.screenWidth - METRICS.marginNormal,
    height: 700 * METRICS.ratioX,
    backgroundColor: COLORS.blackColor,
    marginTop: (METRICS.screenHeight - 700 * METRICS.ratioX) / 2,
    marginLeft: METRICS.marginNormal / 2,
  },
  closeButton: {
    marginLeft: METRICS.marginTiny,
    marginTop: METRICS.marginSmall,
    marginBottom: METRICS.marginSmall,
  },
  closeButtonWrapper: {
    flexDirection: 'row',
    marginRight: METRICS.marginBig,
  },
  iconStyle: {
    color: COLORS.primaryColor,
    marginLeft: METRICS.marginSmall,
  },
});

PayModal.propTypes = {
  onClose: PropTypes.func,
  status: PropTypes.bool,
  onCloseRequest: PropTypes.func,
  paypalUrl: PropTypes.any,
};

PayModal.defaultProps = {
  onClose: () => {},
  status: false,
  onCloseRequest: () => {},
  paypalUrl: '',
};

export default PayModal;
