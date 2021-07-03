import React from 'react';
import PropTypes from 'prop-types';
import { SafeAreaView, Modal, View, Text, TextInput, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import Button from './Button';
import { COLORS, METRICS, STYLES } from '../global';

class TipModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
    };
  }

  onChangeText = (text) => {
    const regEx = /^[0-9]*\.?[0-9]*$/;
    if (regEx.test(text)) {
      this.setState({
        text,
      });
    }
  };

  render() {
    const { onSend, onClose, status, onCloseRequest } = this.props;
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
                <Text style={styles.title}>Tip User</Text>
              </View>

              <Text style={[STYLES.textStyle, styles.addTip]}>Add tip amount ($ USD)</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  selectionColor={COLORS.primaryColor}
                  keyboardAppearance="dark"
                  style={styles.textInput}
                  value={this.state.text}
                  underlineColorAndroid="transparent"
                  placeholderTextColor={COLORS.inActive}
                  keyboardType="numeric"
                  onChangeText={(changedText) => this.onChangeText(changedText)}
                />
              </View>

              <View style={styles.buttonWrapper}>
                <TouchableOpacity
                  onPress={() => {
                    onSend(this.state.text);
                  }}
                  style={{ marginHorizontal: METRICS.spacingHuge }}
                >
                  <Button
                    style={styles.button}
                    title="Send"
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
              <View>
                <FlashMessage />
              </View>
            </View>
          </SafeAreaView>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
    paddingHorizontal: METRICS.spacingHuge,
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    color: COLORS.lightGrey,
    fontFamily: 'lato',
  },
  inputWrapper: {
    width: METRICS.screenWidth - 3 * METRICS.spacingHuge,
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
    textAlign: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    color: COLORS.whiteColor,
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
    marginBottom: METRICS.spacingNormal,
  },
  title: {
    color: COLORS.whiteColor,
    textAlign: 'center',
    fontSize: METRICS.fontSizeBig,
    fontFamily: 'Lato-Bold',
  },
});

TipModal.propTypes = {
  onClose: PropTypes.func,
  status: PropTypes.bool,
  onCloseRequest: PropTypes.func,
};

TipModal.defaultProps = {
  onClose: () => {},
  status: false,
  onCloseRequest: () => {},
};

export default TipModal;
