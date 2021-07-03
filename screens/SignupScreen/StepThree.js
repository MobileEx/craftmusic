import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { CustomButton } from '../../components';
import { COLORS, METRICS } from '../../global';

class StepThree extends React.Component {
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

  render() {
    const { onPress, resend, phoneVerificationFailed } = this.props;
    return (
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleWrapper}>
          <Text style={styles.title}>You received a 4-digit code via SMS.</Text>
          {phoneVerificationFailed && (
            <Text style={styles.failureText}>Incorrect code entered.</Text>
          )}
          <Text style={styles.title}>Enter the code below:</Text>
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
        <View style={styles.buttonWrapper}>
          <CustomButton
            title="SUBMIT"
            style={styles.button}
            clickHandler={() => onPress(3, this.state.pinCode)}
          />
        </View>
        <View>
          <TouchableOpacity onPress={resend}>
            <Text style={styles.forgetPassword}>Re-send PIN</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    );
  }
}
const styles = StyleSheet.create({
  content: {
    flexDirection: 'column',
    flex: 1,
    width: '100%',
    marginTop: 2.5 * METRICS.spacingHuge,
  },
  titleWrapper: {
    marginBottom: METRICS.spacingHuge,
  },
  title: {
    fontSize: METRICS.fontSizeBig,
    color: COLORS.whiteColor,
    textAlign: 'center',
    fontFamily: 'lato-bold',
  },
  failureText: {
    color: COLORS.purpleColor,
    fontSize: METRICS.fontSizeBig,
    fontFamily: 'lato',
    textAlign: 'center',
  },
  formRow: {
    flexDirection: 'row',
    marginBottom: METRICS.spacingGiant + METRICS.spacingGiant + METRICS.spacingGiant,
    width: '100%',
    paddingLeft: METRICS.spacingHuge,
    paddingRight: METRICS.spacingHuge,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  formControl: {
    color: COLORS.whiteColor,
    fontSize: 50 * METRICS.ratioX,
    borderBottomColor: COLORS.whiteColor,
    paddingBottom: METRICS.spacingSmall,
    borderBottomWidth: 1,
    textAlign: 'center',
  },
  buttonWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: METRICS.spacingGiant,
  },
  button: {
    backgroundColor: COLORS.primaryColor,
    borderColor: COLORS.primaryColor,
    fontSize: METRICS.fontSizeMedium,
  },
  forgetPassword: {
    fontSize: METRICS.fontSizeOK,
    color: COLORS.nameDM,
    textAlign: 'center',
  },
});

export default connect(null, null, null, { forwardRef: true })(StepThree);
