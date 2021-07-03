import React from 'react';
import PropTypes from 'prop-types';
import { SafeAreaView, Modal, View, Text, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';
import Button from './Button';
import { COLORS, METRICS, STYLES } from '../global';

const ReportModal = ({
  onClose,
  status,
  onCloseRequest,
  onPress,
  onSubmitReport,
  selectedOption,
  radio_props,
}) => {
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
              <Text style={styles.title}>Report</Text>
            </View>
            <Text style={[STYLES.textStyle, styles.addTip]}>
              Please choose a reason for reporting.
            </Text>
            <View style={styles.optionWrapper}>
              <RadioForm formHorizontal={false} animation>
                {/* To create radio buttons, loop through your array of options */}
                {radio_props.map((obj, i) => (
                  <RadioButton labelHorizontal key={i} style={styles.radioButton}>
                    {/*  You can set RadioButtonLabel before RadioButtonInput */}
                    <RadioButtonInput
                      obj={obj}
                      index={i}
                      isSelected={selectedOption === i}
                      onPress={onPress}
                      borderWidth={1 * METRICS.ratioX}
                      buttonInnerColor="white"
                      buttonOuterColor="white"
                      buttonSize={17 * METRICS.ratioX}
                      buttonOuterSize={27 * METRICS.ratioX}
                      buttonStyle={{}}
                      marginTop={METRICS.marginNormal}
                    />
                    <RadioButtonLabel
                      obj={obj}
                      index={i}
                      labelHorizontal
                      onPress={onPress}
                      labelStyle={{
                        fontSize: METRICS.fontSizeNormal,
                        fontFamily: 'lato',
                        color: 'white',
                      }}
                      labelWrapStyle={{}}
                    />
                  </RadioButton>
                ))}
              </RadioForm>
            </View>

            <View style={styles.buttonWrapper}>
              <TouchableOpacity
                onPress={() => onSubmitReport()}
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
    marginLeft: METRICS.marginNormal,
    marginTop: METRICS.spacingSmall,
    color: COLORS.lightGrey,
    fontFamily: 'lato',
  },
  optionWrapper: {
    width: METRICS.screenWidth - METRICS.marginBig * 2,
    marginHorizontal: METRICS.marginNormal,
    marginTop: METRICS.marginNormal,
  },
  buttonWrapper: {
    flexDirection: 'row',
    alignSelf: 'center',
    paddingTop: METRICS.spacingBig,
    paddingBottom: METRICS.spacingNormal,
  },
  button: {
    width: METRICS.followbuttonwidth,
    height: METRICS.sendbuttonheight,
  },
  radioButton: {
    marginTop: METRICS.marginNormal,
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

ReportModal.propTypes = {
  onClose: PropTypes.func,
  status: PropTypes.bool,
  onCloseRequest: PropTypes.func,
};

ReportModal.defaultProps = {
  onClose: () => {},
  status: false,
  onCloseRequest: () => {},
};

export default ReportModal;
