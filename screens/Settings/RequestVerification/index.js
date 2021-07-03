import React from 'react';
import { Text, TextInput, View, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { withNavigation } from 'react-navigation';
import ImagePicker from 'react-native-image-picker';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import { BaseScreen, ScreenHeader, SectionHeader, CustomButton } from '../../../components';
import { METRICS, STYLES, COLORS } from '../../../global';
import ProfileService from '../../../services/ProfileService';
import Env from '../../../helpers/environment';
import cropper from '../../../helpers/cropper';

class RequestVerification extends BaseScreen {
  navbarHidden = true;

  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      fullname: '',
      knownas: '',
      userId: 1,
      idphoto: '',
    };
  }

  updateSetting = (fieldName, value) => {
    this.setState((preState) => {
      const newState = preState;
      newState[fieldName] = value;
      return newState;
    });
  };

  submitRequest = () => {
    const { username, fullname, knownas, idphoto } = this.state;
    ProfileService.requestVerify(username, fullname, knownas, idphoto)
      .then((res) => {
        if (res.data === 'success')
          showMessage({
            message: 'Successfully submitted',
            type: 'default',
          });
        else {
          showMessage({
            message: res.data,
            type: 'default',
          });
        }
      })
      .catch((err) => {
        const { errors } = err.response.data;
        if (errors.username) {
          showMessage({
            message: 'Please enter your username.',
            type: 'default',
          });
        } else if (errors.fullname) {
          showMessage({
            message: 'Please enter your full name.',
            type: 'default',
          });
        } else if (errors.knownas) {
          showMessage({
            message: 'Please enter any aliases.',
            type: 'default',
          });
        } else {
          showMessage({
            message: 'Please attach a photo ID.',
            type: 'default',
          });
        }
      });
  };

  handleChoosePhoto = () => {
    const options = {
      noData: false,
    };
    cropper('square').then((image) => {
      ProfileService.uploadImage(image.path, image.filename, image.mime)
        .then((res) => {
          // console.log(res.data);
          this.setState({ idphoto: Env.S3URL + res.url });
        })
        .catch((err) => {
          // console.log(err.response.data.error);
        });
    });
  };

  render() {
    const { navigation } = this.props;
    const { username, fullname, knownas, idphoto } = this.state;
    return (
      <View
        style={{ height: '100%', backgroundColor: 'black', paddingBottom: METRICS.spacingGiant }}
      >
        <KeyboardAwareScrollView keyboardShouldPersistTaps="handled" style={styles.container}>
          <ScreenHeader navigation={navigation} pageTitle="Request Verification" />
          <SectionHeader title="Apply for Craft Music Verification" />
          <Text style={{ ...STYLES.normalText, textAlign: 'left' }}>
            A verified badge is a gold star that appears on your profile page and next to your
            username in other parts of the app. It indicates that the account is the authentic
            presence of a notable public figure, celebrity, or global business. Submitting a request
            for verification does not ensure that your account will be verified.
          </Text>
          <SectionHeader title="Username" />
          <TextInput
            selectionColor={COLORS.primaryColor}
            keyboardAppearance="dark"
            autoCapitalize="none"
            autoCorrect={false}
            autoCompleteType="username"
            style={styles.inputField}
            value={username}
            onChangeText={(text) => this.setState({ username: text })}
            placeholderTextColor={COLORS.whiteColor}
          />
          <SectionHeader title="Full Name" />
          <TextInput
            selectionColor={COLORS.primaryColor}
            keyboardAppearance="dark"
            autoCapitalize="words"
            autoCorrect={false}
            autoCompleteType="name"
            style={styles.inputField}
            value={fullname}
            onChangeText={(text) => this.setState({ fullname: text })}
            placeholderTextColor={COLORS.whiteColor}
          />
          <SectionHeader title="Known As" />
          <TextInput
            selectionColor={COLORS.primaryColor}
            keyboardAppearance="dark"
            autoCapitalize="none"
            autoCorrect={false}
            autoCompleteType="off"
            style={styles.inputField}
            value={knownas}
            onChangeText={(text) => this.setState({ knownas: text })}
            placeholderTextColor={COLORS.whiteColor}
          />
          <View style={styles.sectionWrapper}>
            <SectionHeader title="Please attach a photo of your ID" />
            <View style={styles.avatarWrapper}>
              {idphoto !== '' && <FastImage source={{ uri: idphoto }} style={styles.avatar} />}
              <CustomButton title="Choose File" clickHandler={this.handleChoosePhoto} />
            </View>
          </View>
          <Text style={{ ...STYLES.normalText, textAlign: 'left' }}>
            Please attach a photo of your government-issued photo ID with your name and date of
            birth (e.g., driver’s license, passport, or national identification card) or official
            business documents (e.g., tax filing, recent utility bill, article of incorporation) so
            we may review your request.
          </Text>
          <View style={styles.sectionWrapper}>
            <CustomButton title="Submit" clickHandler={this.submitRequest} />
          </View>
        </KeyboardAwareScrollView>
        <FlashMessage titleStyle={styles.flashStyle} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  flashStyle: {
    fontFamily: 'lato',
    fontSize: METRICS.fontSizeNormal,
  },
  inputField: {
    paddingVertical: METRICS.spacingSmall,
    borderBottomColor: COLORS.btnGrey,
    borderBottomWidth: 1 * METRICS.ratioX,
    fontFamily: 'Lato-Regular',
    color: COLORS.whiteColor,
    fontSize: METRICS.fontSizeBig,
    textAlign: 'center',
  },
  container: {
    paddingLeft: METRICS.spaceNormal,
    paddingRight: METRICS.spaceNormal,
    paddingBottom: METRICS.spacingHuge,
    backgroundColor: COLORS.blackColor,
    minHeight: '100%',
    marginTop: 40 * METRICS.ratioX,
    flex: 1,
  },
  sectionWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: METRICS.spacingBig,
  },
  avatarWrapper: {
    position: 'relative',
    flexDirection: 'column',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    borderColor: COLORS.btnGrey,
    borderWidth: 1 * METRICS.ratioX,
    width: 100 * METRICS.ratioX,
    height: 100 * METRICS.ratioX,
    justifyContent: 'center',
    resizeMode: 'cover',
    opacity: 0.5,
    marginBottom: METRICS.marginSmall,
  },
});

export default withNavigation(RequestVerification);
