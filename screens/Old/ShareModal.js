import React from 'react';
import { SafeAreaView, Modal, View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import _ from 'lodash';
import ModalWrapper from './ModalWrapper';
import CustomIcon from './CustomIcon';
import Button from './Button';
import { social, sharelink } from '../global/Seeds';
import { METRICS, COLORS } from '../global';

const ShareModal = ({ status, onClose, onCloseRequest, shareWithSocial }) => {
  return (
    <Modal
      animationType="fade"
      transparent
      modalDidClose={onClose}
      visible={status}
      onRequestClose={() => onCloseRequest(false)}
      title="Share"
    >
      <View style={styles.wrapper}>
        <TouchableOpacity style={styles.buttonWrapper} onPress={() => onClose()}>
          <CustomIcon
            name="stop-1"
            style={{ paddingHorizontal: METRICS.screenWidth, paddingTop: METRICS.screenHeight / 2 }}
          />
        </TouchableOpacity>
        <SafeAreaView style={{ flex: 1, justifyContent: 'center' }}>
          <View style={styles.background}>
            {_.map(sharelink, (item, index) => {
              return (
                <TouchableOpacity
                  style={styles.row}
                  onPress={shareWithSocial.bind(this, index)}
                  key={index}
                >
                  <Image source={item.image} style={styles.image} />
                  <Text style={styles.name}>{item.text}</Text>
                  <CustomIcon name="right" style={styles.icon} />
                </TouchableOpacity>
              );
            })}
          </View>
          <TouchableOpacity style={styles.buttonWrapper} onPress={() => onClose()}>
            <CustomIcon
              name="stop-1"
              style={{
                paddingHorizontal: METRICS.screenWidth,
                paddingBottom: METRICS.screenHeight / 2,
              }}
            />
          </TouchableOpacity>
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: METRICS.spacingGiant / 2,
  },
  image: {
    width: 26 * METRICS.ratioX,
    height: 26 * METRICS.ratioX,
    marginRight: METRICS.spacingNormal,
  },
  name: {
    color: COLORS.whiteColor,
    fontSize: METRICS.fontSizelarge,
    flex: 1,
    fontFamily: 'lato',
  },
  icon: {
    color: COLORS.whiteColor,
    fontSize: METRICS.fontSizelarge,
  },
  buttonWrapper: {
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  button: {
    width: METRICS.followbuttonwidth,
    height: METRICS.sendbuttonheight,
  },
});

export default ShareModal;
