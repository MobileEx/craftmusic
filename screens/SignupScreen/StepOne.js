import React from 'react';
import {
  Linking,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  FlatList,
  TouchableWithoutFeedback,
  SafeAreaView,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import validate from 'validate.js';
import { TextInputMask } from 'react-native-masked-text';
import { TouchableHighlight } from 'react-native-gesture-handler';
import Geolocation from 'react-native-geolocation-service';
import { connect } from 'react-redux';
import { CustomIcon, CustomButton } from '../../components';
import { COLORS, METRICS, STYLES } from '../../global';
import NavigationService from '../../navigation/NavigationService';
import LocationService from '../../services/LocationService';
import { updatePrevState } from '../../store/actions';
import store from '../../store/configureStore';
// native base imports
import data from './Countries';

// Default render of country flag
const defaultFlag = data.filter((obj) => obj.name === 'United States')[0].flag;

const formData = {
  username: null,
  email: null,
  password: null,
  password_confirmation: null,
};

function updateState(field, value) {
  formData[field] = value;
}

class StepOne extends React.Component {
  constructor(props) {
    super(props);
    formData.username = props.username;
    formData.email = props.email;
    formData.password = props.password;
    formData.password_confirmation = props.password_confirmation;

    this.state = {
      birthday: props.birthday,
      formErrors: [],
      countryCode: '+1',
      // phone input
      flag: defaultFlag,
      modalVisible: false,
      phoneNumber: props.phone,
    };
  }

  componentDidMount() {
    Geolocation.requestAuthorization();
    Geolocation.getCurrentPosition(
      (position) => {
        LocationService.getCountryCodeAndName(position.coords.latitude, position.coords.longitude)
          .then((res) => {
            const { data } = res;
            const country = data.results[data.results.length - 1].formatted_address;
            this.getCountry(country);
          })
          .catch((err) => console.log(err));
      },
      (error) => {
        console.log(error.code, error.message);
        this.setState({
          countryCode: '+1',
        });
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 15000 }
    );
  }

  updateCountryCode(country) {
    const items = data.filter((i) => i.name === country);
    if (items.length != 0) {
      this.setState({
        countryCode: items[0].dial_code,
      });
    }
  }

  onConfirm = (date) => {
    this.setState(() => {
      return {
        date,
        dateSelected: true,
        showDatePicker: false,
      };
    });
  };

  validateForm = () => {
    const { username, password, password_confirmation, email } = formData;
    const { phoneNumber, birthday } = this.state;
    const constraints = {
      username: {
        presence: { allowEmpty: false },
      },
      birthday: {
        presence: { allowEmpty: false },
      },
      email: {
        presence: { allowEmpty: false },
        email: true,
      },
      phoneNumber: {
        presence: { allowEmpty: false },
      },
      password: {
        presence: { allowEmpty: false },
        length: {
          minimum: 6,
          message: 'must be at least 6 characters',
        },
      },
      password_confirmation: {
        equality: 'password',
      },
    };
    const validation = validate(
      { username, password, password_confirmation, email, phoneNumber, birthday },
      constraints,
      {
        format: 'flat',
      }
    );
    return validation;
  };

  submitForm = () => {
    const { onPress } = this.props;
    let validationErrors = this.validateForm();
    if (!this.state.birthday || this.state.birthday.length != 10) {
      if (!validationErrors) {
        validationErrors = ['Incorrect birthday length'];
      } else {
        validationErrors.push('Incorrect birthday length');
      }
    }
    if (validationErrors) {
      this.setState({ formErrors: validationErrors });
      return;
    }
    onPress(1, { ...formData, birthday: this.state.birthday, phone: this.state.phoneNumber });
  };

  onCancel = () => {
    this.setState({
      showDatePicker: false,
    });
  };

  toggleDatePicker = () => {
    this.setState((state) => {
      return { showDatePicker: !state.showDatePicker };
    });
  };

  navigate = (routeName) => {
    this.props.updatePrevState(store.getState());
    this.props.updateTitle(routeName);
    NavigationService.navigate(routeName);
  };

  openUrl(url) {
    Linking.openURL(url).catch((err) => console.error('An error occurred', err));
  }

  // Phone Input

  onChangeText(key, value) {
    this.setState({
      [key]: value,
    });
  }

  showModal() {
    this.setState({ modalVisible: true });
  }

  hideModal() {
    this.setState({ modalVisible: false });
    // Refocus on the Input field after selecting the country code
    // this.refs.PhoneInput._root.focus()
  }

  async getCountry(country) {
    const countryData = await data;
    try {
      const countryCode = await countryData.filter((obj) => obj.name === country)[0].dial_code;
      const countryFlag = await countryData.filter((obj) => obj.name === country)[0].flag;
      // Set data from user choice of country
      this.setState({ phoneNumber: countryCode, flag: countryFlag, countryCode });
      await this.hideModal();
    } catch (err) {
      // console.log(err);
    }
  }

  render() {
    const { formErrors, flag, countryCode } = this.state;
    const { error } = this.props;
    const errors = [];
    const countryData = data;
    formErrors.forEach((errorMessage) => {
      errors.push(<Text style={styles.errorText}>{errorMessage}</Text>);
    });
    if (error) {
      errors.push(<Text style={styles.errorText}>{error}</Text>);
    }
    return (
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <SafeAreaView>
          <Text style={styles.title}>Register</Text>
          <View style={styles.errorRow}>{errors}</View>
          <View style={styles.formRow}>
            <View style={styles.iconWrapper}>
              <CustomIcon name="user-3" style={styles.icon} />
            </View>
            <TextInput
              placeholder="Username"
              maxLength={30}
              selectionColor={COLORS.primaryColor}
              keyboardAppearance="dark"
              placeholderTextColor={COLORS.whiteColor}
              defaultValue={formData.username}
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.formControl}
              onChangeText={(val) => {
                updateState('username', val);
              }}
            />
          </View>
          <View style={styles.formRow}>
            <View style={styles.iconWrapper}>
              <CustomIcon name="info" style={styles.icon} />
            </View>
            <TextInputMask
              type="datetime"
              options={{
                format: 'MM/DD/YYYY',
              }}
              value={this.state.birthday}
              style={styles.formControl}
              selectionColor={COLORS.primaryColor}
              keyboardAppearance="dark"
              keyboardType="number-pad"
              placeholder="Birthdate (MM/DD/YYYY)"
              placeholderTextColor={COLORS.whiteColor}
              onChangeText={(text) => {
                this.setState({ birthday: text });
                // formData.birthday = text;
              }}
            />
          </View>
          <View style={styles.formRow}>
            <View style={styles.iconWrapper}>
              <CustomIcon name="email" style={styles.icon} />
            </View>
            <TextInput
              placeholder="Email"
              selectionColor={COLORS.primaryColor}
              textContentType="emailAddress"
              keyboardType="email-address"
              keyboardAppearance="dark"
              autoCompleteType="email"
              autoCorrect={false}
              placeholderTextColor={COLORS.whiteColor}
              style={styles.formControl}
              autoCapitalize="none"
              defaultValue={formData.email}
              onChangeText={(val) => {
                updateState('email', val);
              }}
            />
          </View>
          <View style={styles.formRow}>
            <View style={styles.iconWrapper}>
              <CustomIcon name="smartphone-call" style={styles.icon} />
            </View>
            <View style={styles.phoneNumberWrapper}>
              {/* country flag */}
              <TouchableWithoutFeedback onPress={() => this.showModal()}>
                <View style={STYLES.horizontalAlign}>
                  <Text style={{ fontSize: METRICS.fontSizelarge }}>{flag}</Text>
                  {/* open modal */}
                  <CustomIcon
                    name="ionicons_svg_md-arrow-dropdown"
                    style={[styles.iconStyle, { marginLeft: 5 * METRICS.ratioX }]}
                  />
                </View>
              </TouchableWithoutFeedback>
              <TextInput
                type="custom"
                value={this.state.phoneNumber}
                style={styles.phoneNumberField}
                selectionColor={COLORS.primaryColor}
                autoCompleteType="tel"
                keyboardAppearance="dark"
                keyboardType="phone-pad"
                placeholderTextColor={COLORS.whiteColor}
                onChangeText={(val) => {
                  if (this.state.phoneNumber === '') {
                    // render UK phone code by default when Modal is not open
                    this.onChangeText('phoneNumber', countryCode + val);
                  } else {
                    // render country code based on users choice with Modal
                    this.onChangeText('phoneNumber', val);
                  }
                }}
              />
              {/* Modal for country code and flag */}
              <Modal
                animationType="slide" // fade
                transparent={false}
                visible={this.state.modalVisible}
                style={{ backgroundColor: COLORS.blackColor }}
              >
                <View style={{ flex: 1, backgroundColor: COLORS.blackColor }}>
                  <View
                    style={{
                      flex: 10,
                      paddingTop: 80,
                      backgroundColor: COLORS.blackColor,
                    }}
                  >
                    <FlatList
                      data={countryData}
                      keyExtractor={(item, index) => index.toString()}
                      renderItem={({ item }) => (
                        <TouchableWithoutFeedback onPress={() => this.getCountry(item.name)}>
                          <View
                            style={[
                              styles.countryStyle,
                              {
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                              },
                            ]}
                          >
                            <Text style={styles.countrytext}>
                              {item.flag} {item.name}
                            </Text>
                            <Text style={styles.countrytext}>({item.dial_code})</Text>
                          </View>
                        </TouchableWithoutFeedback>
                      )}
                    />
                  </View>
                  <TouchableOpacity
                    onPress={() => this.hideModal()}
                    style={styles.closeButtonStyle}
                  >
                    <Text style={styles.textStyle}>Close</Text>
                  </TouchableOpacity>
                </View>
              </Modal>
            </View>
          </View>
          <View style={styles.formRow}>
            <View style={styles.iconWrapper}>
              <CustomIcon name="key" style={styles.icon} />
            </View>
            <TextInput
              placeholder="Password"
              placeholderTextColor={COLORS.whiteColor}
              selectionColor={COLORS.primaryColor}
              keyboardAppearance="dark"
              style={styles.formControl}
              secureTextEntry
              defaultValue={formData.password}
              onChangeText={(val) => {
                updateState('password', val);
              }}
            />
          </View>
          <View style={styles.formRow}>
            <View style={styles.iconWrapper}>
              <CustomIcon name="key" style={styles.icon} />
            </View>
            <TextInput
              placeholder="Re-enter Password"
              placeholderTextColor={COLORS.whiteColor}
              selectionColor={COLORS.primaryColor}
              keyboardAppearance="dark"
              style={styles.formControl}
              secureTextEntry
              defaultValue={formData.password_confirmation}
              onChangeText={(val) => {
                updateState('password_confirmation', val);
              }}
            />
          </View>
          <View style={styles.buttonWrapper}>
            <CustomButton title="NEXT" style={styles.button} clickHandler={this.submitForm} />
          </View>
          <Text style={styles.forgetPassword}>By signing up, you agree to our</Text>
          <View style={styles.text1}>
            <TouchableHighlight onPress={() => this.openUrl('https://craftmusicapp.com/terms')}>
              <Text style={styles.linktext}>Terms of Service</Text>
            </TouchableHighlight>
            <Text style={styles.forgetPassword}> and</Text>
            <TouchableHighlight onPress={() => this.openUrl('https://craftmusicapp.com/privacy')}>
              <Text style={styles.linktext}> Privacy Policy</Text>
            </TouchableHighlight>
            <Text style={styles.forgetPassword}>.</Text>
          </View>
          <View style={styles.text2}>
            <TouchableOpacity onPress={() => NavigationService.navigate('Signin')}>
              <Text style={styles.forgetPassword}>Have an account? Sign in</Text>
            </TouchableOpacity>
          </View>
          <View style={{ height: METRICS.spacingHuge }} />
        </SafeAreaView>
      </KeyboardAwareScrollView>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    flexDirection: 'column',
    flex: 1,
    width: 0.7 * METRICS.screenWidth,
    marginTop: 1.1 * METRICS.spacingHuge * METRICS.ratioY * METRICS.ratioY,
  },
  title: {
    fontSize: METRICS.fontSizeBig,
    color: COLORS.whiteColor,
    textAlign: 'center',
    marginBottom: METRICS.spacingNormal * METRICS.ratioY * METRICS.ratioY,
    fontFamily: 'lato-bold',
  },
  formRow: {
    flexDirection: 'row',
    marginBottom: METRICS.spacingHuge,
    width: '100%',
  },
  errorRow: {
    marginBottom: METRICS.spacingHuge,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWrapper: {
    paddingRight: METRICS.spacingNormal,
  },
  icon: {
    color: COLORS.whiteColor,
    fontSize: METRICS.fontSizeBig,
  },
  formControl: {
    color: COLORS.whiteColor,
    fontSize: METRICS.fontSizeNormal,
    fontFamily: 'lato',
    borderBottomColor: COLORS.whiteColor,
    paddingBottom: METRICS.spacingSmall,
    borderBottomWidth: 1 * METRICS.ratioX,
    flex: 1,
  },
  phoneNumberWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: COLORS.whiteColor,
    paddingBottom: METRICS.spacingSmall,
    borderBottomWidth: 1 * METRICS.ratioX,
  },
  phoneNumberField: {
    color: COLORS.whiteColor,
    fontSize: METRICS.fontSizeNormal,
    fontFamily: 'lato',
    flex: 1,
    marginLeft: 5,
  },
  countryCodeField: {
    color: COLORS.whiteColor,
    fontSize: METRICS.fontSizeNormal,
    fontFamily: 'lato',
    paddingRight: 6,
  },
  errorText: {
    color: COLORS.purpleColor,
    fontSize: METRICS.fontSizeNormal,
    fontFamily: 'lato',
  },
  formField: {
    width: '100%',
  },
  forgetButton: {
    marginBottom: METRICS.spacingHuge,
  },
  buttonWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: METRICS.spacingHuge,
  },
  button: {
    backgroundColor: COLORS.primaryColor,
    borderColor: COLORS.primaryColor,
    fontSize: METRICS.fontSizeMedium,
  },
  text1: {
    paddingTop: METRICS.spacingTiny,
    flexDirection: 'row',
    textAlign: 'center',
    justifyContent: 'center',
  },
  text2: {
    paddingTop: METRICS.spacingHuge,
  },
  forgetPassword: {
    fontSize: METRICS.fontSizeOK,
    fontFamily: 'lato',
    color: COLORS.nameDM,
    textAlign: 'center',
  },
  linktext: {
    fontSize: METRICS.fontSizeOK,
    fontFamily: 'lato',
    color: COLORS.primaryColor,
    textAlign: 'center',
  },
  // Phone Input Style
  iconStyle: {
    color: COLORS.whiteColor,
    fontSize: METRICS.fontSizeOK,
    marginLeft: 10 * METRICS.ratioX,
  },
  textStyle: {
    padding: 5 * METRICS.ratioX,
    fontSize: METRICS.fontSizeNormal,
    color: COLORS.whiteColor,
    fontFamily: 'lato-bold',
  },
  countrytext: {
    fontSize: METRICS.fontSizeMedium,
    color: COLORS.whiteColor,
    fontFamily: 'lato',
  },
  countryStyle: {
    flex: 1,
    backgroundColor: COLORS.blackColor,
    borderTopColor: COLORS.whiteColor,
    borderTopWidth: 1 * METRICS.ratioX,
    padding: 12 * METRICS.ratioX,
  },
  closeButtonStyle: {
    flex: 1,
    padding: 12 * METRICS.ratioX,
    alignItems: 'center',
    backgroundColor: COLORS.blackColor,
  },
});

function mapDispatchToProps(dispatch) {
  return {
    updatePrevState: (data) => dispatch(updatePrevState(data)),
  };
}

function mapStateToProps(state) {
  return {
    user: state.user,
    craftPlaying: state.craftPlaying,
    prevState: state.prevState,
    playingCrafts: state.playingCrafts,
    profileUserId: state.profileUserId,
    backScreen: state.backScreen,
    editingCraftId: state.editingCraftId,
    title: state.title,
    curCraftId: state.curCraftId,
    openComments: state.openComments,
    miniPlay: state.miniPlay,
    deepAlert: state.deepAlert,
    craftlistId: state.craftlistId,
    backupCraft: state.backupCraft,
    seekOnBack: state.seekOnBack,
    currentTime: state.currentTime,
    followId: state.followId,
    storeState: state.storeState,
    addMusicMethod: state.addMusicMethod,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(StepOne);
