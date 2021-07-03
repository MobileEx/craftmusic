import React from 'react';
import PropTypes from 'prop-types';
import { Modal, SafeAreaView, View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, METRICS } from '../global';

const ModalWrapper = ({ title, status, onClose, children, onCloseRequest }) => {
  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center' }}>
      <Modal
        animationType="fade"
        transparent
        modalDidClose={onCloseRequest}
        onRequestClose={onCloseRequest}
        visible={status}
      >
        <View style={styles.wrapper}>
          <SafeAreaView style={{ flex: 1, justifyContent: 'center' }}>
            <View style={styles.background}>
              <TouchableOpacity onPress={() => onClose(false)} style={styles.closeButton}>
                <Text style={styles.iconStyle}>X</Text>
              </TouchableOpacity>
              <View style={styles.titleWrapper}>
                <Text style={styles.title}>{title}</Text>
              </View>
              {children}
              <LinearGradient
                colors={['transparent', 'black', 'black']}
                style={styles.linearGradient}
              />
            </View>
          </SafeAreaView>
        </View>
      </Modal>
    </SafeAreaView>
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
    maxHeight: 0.9 * METRICS.screenHeight,
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

ModalWrapper.propTypes = {
  status: PropTypes.bool,
  onClose: PropTypes.func,
  title: PropTypes.string,
};

ModalWrapper.defaultProps = {
  status: false,
  onClose: () => {},
  title: 'title',
};

export default ModalWrapper;
