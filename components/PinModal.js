import React from 'react';
import PropTypes from 'prop-types';
import { SafeAreaView, Modal, View, Text, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import { connect } from 'react-redux';
import Button from './Button';
import { COLORS, METRICS } from '../global';
import { resendSms } from '../store/actions';

class PinModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pinCode: '',
    };
  }

  codeRef = React.createRef();

  clear = () => {
    this.codeRef.current.shake().then(() => {
      this.setState({ pinCode: '' });
    });
  };

  resend = () => {
    this.props.dispatch(resendSms());
  };

  render() {
    const { onPress, onClose, status, onCloseRequest, phoneVerificationFailed } = this.props;
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
                <Text style={styles.title}>Enter Confirmation Code</Text>
                {phoneVerificationFailed && (
                  <Text style={styles.failureText}>Incorrect code entered.</Text>
                )}
              </View>

              <View style={styles.formRow}>
                <SmoothPinCodeInput
                  keyboardType="number-pad"
                  inputProps={{
                    keyboardAppearance: 'dark',
                  }}
                  cellStyle={{
                    borderBottomWidth: 2 * METRICS.ratioX,
                    borderColor: 'white',
                  }}
                  cellStyleFocused={{
                    borderColor: COLORS.primaryColor,
                  }}
                  textStyle={{
                    fontSize: 25 * METRICS.ratioX,
                    color: COLORS.whiteColor,
                  }}
                  textStyleFocused={{
                    color: COLORS.primaryColor,
                  }}
                  ref={this.codeRef}
                  value={this.state.pinCode}
                  onTextChange={(code) => this.setState({ pinCode: code })}
                  onFulfill={this._checkCode}
                  onBackspace={this._focusePrevInput}
                />
              </View>

              <TouchableOpacity onPress={this.resend}>
                <Text style={styles.forgetPassword}>Re-send PIN</Text>
              </TouchableOpacity>

              <View />

              <View style={styles.buttonWrapper}>
                <TouchableOpacity
                  onPress={() => {
                    onPress(3, this.state.pinCode);
                  }}
                  style={{ marginHorizontal: METRICS.spacingHuge }}
                >
                  <Button
                    style={styles.button}
                    title="Submit"
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
          </SafeAreaView>
        </View>
      </Modal>
    );
  }
}

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
  failureText: {
    color: COLORS.purpleColor,
    fontSize: METRICS.fontSizeNormal,
    fontFamily: 'lato',
    textAlign: 'center',
  },
  formRow: {
    flexDirection: 'row',
    marginBottom: METRICS.spacingNormal,
    width: '100%',
    paddingLeft: METRICS.spacingHuge,
    paddingRight: METRICS.spacingHuge,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  forgetPassword: {
    fontSize: METRICS.fontSizeOK,
    color: COLORS.nameDM,
    textAlign: 'center',
    paddingVertical: METRICS.spacingSmall,
  },
});

PinModal.propTypes = {
  onClose: PropTypes.func,
  status: PropTypes.bool,
  onCloseRequest: PropTypes.func,
};

PinModal.defaultProps = {
  onClose: () => {},
  status: false,
  onCloseRequest: () => {},
};

export default connect(null, null, null, { forwardRef: true })(PinModal);
