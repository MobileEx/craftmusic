import React from 'react';
import PropTypes from 'prop-types';
import { SafeAreaView, Modal, View, Text, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Button from './Button';
import { COLORS, METRICS, STYLES } from '../global';
import CustomSwitch from './CustomSwitch';
import PlayingCraftService from '../services/PlayingCraftService';

let isPublic = true;

updatePublicSetting = (fieldName, value) => {
  isPublic = value;
};

const PublishModal = ({ onClose, status, onCloseRequest, onPublishNo, onPublishYes }) => {
  return (
    <Modal
      animationType="fade"
      transparent
      modalDidClose={onClose}
      visible={status}
      onRequestClose={() => onCloseRequest(false)}
    >
      <View style={styles.wrapper}>
        <SafeAreaView style={{ flex: 1, justifyContent: 'center' }}>
          <View style={styles.background}>
            <View style={styles.titleWrapper}>
              <Text style={styles.title}>Publish</Text>
            </View>

            <Text style={[STYLES.textStyle, styles.addTip]}>
              Are you ready to publish this craft?
            </Text>
            <View style={styles.row}>
              <CustomSwitch
                primary
                value
                title="Publicly Visible"
                fieldName="private"
                swipeHandler={this.updatePublicSetting}
              />
              <CustomSwitch
                primary
                value
                title="Enable Downloads"
                fieldName="downloads"
                swipeHandler={() => {}}
              />
            </View>
            <View style={styles.buttonWrapper}>
              <TouchableOpacity
                onPress={() => {
                  onPublishYes(isPublic);
                }}
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
                onPress={() => onPublishNo()}
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
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    color: COLORS.lightGrey,
    fontFamily: 'lato',
  },
  buttonWrapper: {
    flexDirection: 'row',
    alignSelf: 'center',
    paddingTop: METRICS.spacingSmall,
    paddingBottom: METRICS.spacingNormal,
  },
  button: {
    width: METRICS.followbuttonwidth,
    height: METRICS.sendbuttonheight,
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
  radioButton: {
    marginTop: METRICS.marginNormal,
  },
  text: {
    color: COLORS.whiteColor,
    fontSize: METRICS.fontSizelarge,
    fontFamily: 'lato',
  },
  row: {
    marginHorizontal: METRICS.spacingHuge,
    marginVertical: METRICS.spacingSmall,
  },
});

PublishModal.propTypes = {
  onClose: PropTypes.func,
  status: PropTypes.bool,
  onCloseRequest: PropTypes.func,
};

PublishModal.defaultProps = {
  onClose: () => {},
  status: false,
  onCloseRequest: () => {},
};

export default PublishModal;
