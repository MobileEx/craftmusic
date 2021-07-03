import React from 'react';
import { View, TouchableOpacity, Text, TextInput, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { withNavigation } from 'react-navigation';
import _ from 'lodash';
import Geolocation from 'react-native-geolocation-service';
import {
  BaseScreen,
  ScreenHeader,
  SectionHeader,
  LocationModal,
  CustomIcon,
} from '../../../components';
import { METRICS, STYLES, COLORS } from '../../../global';
import ProfileService from '../../../services/ProfileService';
import { userType } from '../../../global/Seeds';
import cropper from '../../../helpers/cropper';
import Env from '../../../helpers/environment';
import store from '../../../store/configureStore';

const avatarImage = require('../../../assets/images/user.png');

class SettingsMainScreen extends BaseScreen {
  navbarHidden = true;

  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      userId: 1,
      userProfile: Object,
      bio: '',
      location: '',
      website_url: 'http://',
      instagram_url: 'http://',
      facebook_url: 'http://',
      twitter_url: 'http://',
      snapchat_url: 'http://',
      behance_url: 'http://',
      linkedin_url: 'http://',
      photo: null,
      avatar: '',
      locationModalVisible: false,
      selected: [],
    };
  }

  componentDidMount() {
    const state = store.getState();
    ProfileService.getUserProfile(state.user.id)
      .then((res) => {
        const userProfile = res.data;
        this.setState({ userProfile }, () => {
          this.prefillInputs();
        });
      })
      .catch((err) => {});
  }

  prefillInputs = () => {
    const { userProfile } = this.state;
    const selected = [];
    userProfile.usertype.forEach((type) => {
      selected.push(type.name);
    });
    this.setState({
      bio: userProfile.bio,
      location: userProfile.location,
      website_url: userProfile.website_url ? userProfile.website_url : 'http://',
      instagram_url: userProfile.instagram_url ? userProfile.instagram_url : 'http://',
      facebook_url: userProfile.facebook_url ? userProfile.facebook_url : 'http://',
      twitter_url: userProfile.twitter_url ? userProfile.twitter_url : 'http://',
      snapchat_url: userProfile.snapchat_url ? userProfile.snapchat_url : 'http://',
      behance_url: userProfile.behance_url ? userProfile.behance_url : 'http://',
      linkedin_url: userProfile.linkedin_url ? userProfile.linkedin_url : 'http://',
      avatar: userProfile.avatar,
      selected,
    });
  };

  handleChoosePhoto = () => {
    const options = {
      noData: true,
    };
    cropper('square').then((image) => {
      ProfileService.uploadAvatar(image.path, image.filename, image.mime)
        .then((res) => {
          this.setState({ avatar: Env.S3URL + res.url });
          ProfileService.updateProfileAvatar(res.url, res.filename, res.filetype).then((res) => {});
        })
        .catch((err) => {});
    });
  };

  saveChanges = () => {
    const params = {
      bio: this.state.bio,
      location: this.state.location,
      avatar: this.state.avatar,
      website_url: this.state.website_url,
      instagram_url: this.state.instagram_url,
      facebook_url: this.state.facebook_url,
      twitter_url: this.state.twitter_url,
      snapchat_url: this.state.snapchat_url,
      behance_url: this.state.behance_url,
      linkedin_url: this.state.linkedin_url,
      usertype: this.state.selected,
    };
    ProfileService.updateProfile(params)
      .then((res) => {})
      .catch((err) => {});
  };

  showLocationModal = (value) => {
    this.setState({
      locationModalVisible: value,
    });
  };

  getLocation = () => {
    const my_position = {};
    const { GOOGLE_API_KEY } = Env;
    Geolocation.getCurrentPosition(
      (position) => {
        const my_position = {
          latitude: parseFloat(position.coords.latitude),
          longitude: parseFloat(position.coords.longitude),
          latitudeDelta: 0.04864195044303443,
          longitudeDelta: 0.040142817690068,
        };
        fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${my_position.latitude},${my_position.longitude}&key=${GOOGLE_API_KEY}`
        )
          .then((response) => response.json())
          .then((responseJson) => {
            if (responseJson.status === 'OK') {
              const { results } = responseJson;
              let filtered_array = results[0].address_components.filter(function (
                address_component
              ) {
                return address_component.types.includes('country');
              });
              const country = filtered_array.length ? filtered_array[0].long_name : '';
              filtered_array = results[0].address_components.filter(function (address_component) {
                return address_component.types.includes('locality');
              });
              const locality = filtered_array.length ? filtered_array[0].long_name : '';
              filtered_array = results[0].address_components.filter(function (address_component) {
                return address_component.types.includes('administrative_area_level_1');
              });
              const admin_area = filtered_array.length ? filtered_array[0].short_name : '';

              this.setState({ location: `${locality} ${admin_area}, ${country}` });
              this.showLocationModal(false);
            }
          });
      },
      (error) => {},
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 }
    );
  };

  onRemove = () => {
    this.setState({ location: '' });
    this.showLocationModal(false);
  };

  select = (value) => {
    const { selected } = this.state;
    if (!_.includes(this.state.selected, value)) {
      selected.push(value);
      this.setState({
        selected,
      });
    } else {
      const removed = _.filter(selected, (item) => {
        return item !== value;
      });
      this.setState({
        selected: removed,
      });
    }
  };

  renderScreen() {
    const { navigation } = this.props;
    const { avatar } = this.state;
    return (
      <KeyboardAwareScrollView keyboardShouldPersistTaps="handled" style={STYLES.contentWrapper}>
        <ScreenHeader
          navigation={navigation}
          pageTitle="Edit Profile"
          saveChanges={this.saveChanges}
        />
        <View style={styles.coverImageSection}>
          <SectionHeader title="Cover Image" />
          <View style={styles.avatarWrapper}>
            <FastImage source={avatar ? { uri: avatar } : avatarImage} style={styles.avatar} />
            <TouchableOpacity style={styles.editButton} onPress={this.handleChoosePhoto}>
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.accounttype}>
          <SectionHeader title="Account Type" />
          <View style={styles.type}>
            {userType.map((item, index) => (
              <TouchableOpacity
                style={styles.box}
                onPress={() => this.select(item.label)}
                key={index}
              >
                <CustomIcon name={item.icon} style={styles.checkIcon} />
                <Text style={styles.checkText}>{item.label}</Text>
                <View style={styles.checkedSide}>
                  {_.includes(this.state.selected, item.label) && (
                    <CustomIcon name="check" style={styles.checked} />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={styles.bioSection}>
          <SectionHeader title="Bio" />
          <TextInput
            editable
            selectionColor={COLORS.primaryColor}
            keyboardAppearance="dark"
            multiline
            numberOfLines={5}
            maxLength={1000}
            onChangeText={(text) => this.setState({ bio: text })}
            value={this.state.bio}
            placeholderTextColor={COLORS.btnGrey}
            placeholder="Write your bio here..."
            style={styles.bioTextInput}
          />
        </View>
        <View style={styles.locationSection}>
          <SectionHeader title="Location" />
          <TouchableOpacity style={styles.button} onPress={() => this.showLocationModal(true)}>
            <Text style={styles.locationText} color="white">
              {this.state.location ? this.state.location : 'Add location'}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.linksSection}>
          <SectionHeader title="Links" />
          <View style={styles.linkInputWrapper}>
            <Text style={styles.linkInputLabelText}>Website:</Text>
            <TextInput
              editable
              selectionColor={COLORS.primaryColor}
              keyboardAppearance="dark"
              keyboardType="url"
              textContentType="URL"
              autoCompleteType="off"
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.singleTextInput}
              onChangeText={(text) => this.setState({ website_url: text })}
              value={this.state.website_url}
              placeholderTextColor={COLORS.whiteColor}
            />
          </View>
          <View style={styles.linkInputWrapper}>
            <Text style={styles.linkInputLabelText}>Instagram:</Text>
            <TextInput
              editable
              selectionColor={COLORS.primaryColor}
              keyboardAppearance="dark"
              keyboardType="url"
              textContentType="URL"
              autoCompleteType="off"
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.singleTextInput}
              onChangeText={(text) => this.setState({ instagram_url: text })}
              value={this.state.instagram_url}
              placeholderTextColor={COLORS.whiteColor}
            />
          </View>
          <View style={styles.linkInputWrapper}>
            <Text style={styles.linkInputLabelText}>Facebook:</Text>
            <TextInput
              editable
              selectionColor={COLORS.primaryColor}
              keyboardAppearance="dark"
              keyboardType="url"
              textContentType="URL"
              autoCompleteType="off"
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.singleTextInput}
              onChangeText={(text) => this.setState({ facebook_url: text })}
              value={this.state.facebook_url}
              placeholderTextColor={COLORS.whiteColor}
            />
          </View>
          <View style={styles.linkInputWrapper}>
            <Text style={styles.linkInputLabelText}>Twitter:</Text>
            <TextInput
              editable
              selectionColor={COLORS.primaryColor}
              keyboardAppearance="dark"
              keyboardType="url"
              textContentType="URL"
              autoCompleteType="off"
              autoCapitalize="none"
              autoCorrect={false}
              value={this.state.twitter_url}
              style={styles.singleTextInput}
              onChangeText={(text) => this.setState({ twitter_url: text })}
              placeholderTextColor={COLORS.whiteColor}
            />
          </View>
          <View style={styles.linkInputWrapper}>
            <Text style={styles.linkInputLabelText}>Snapchat:</Text>
            <TextInput
              editable
              selectionColor={COLORS.primaryColor}
              keyboardAppearance="dark"
              keyboardType="url"
              textContentType="URL"
              autoCompleteType="off"
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.singleTextInput}
              onChangeText={(text) => this.setState({ snapchat_url: text })}
              value={this.state.snapchat_url}
              placeholderTextColor={COLORS.whiteColor}
            />
          </View>
          <View style={styles.linkInputWrapper}>
            <Text style={styles.linkInputLabelText}>Behance:</Text>
            <TextInput
              editable
              selectionColor={COLORS.primaryColor}
              keyboardAppearance="dark"
              keyboardType="url"
              textContentType="URL"
              autoCompleteType="off"
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.singleTextInput}
              onChangeText={(text) => this.setState({ behance_url: text })}
              value={this.state.behance_url}
              placeholderTextColor={COLORS.whiteColor}
            />
          </View>
          <View style={styles.linkInputWrapper}>
            <Text style={styles.linkInputLabelText}>LinkedIn:</Text>
            <TextInput
              editable
              selectionColor={COLORS.primaryColor}
              keyboardAppearance="dark"
              keyboardType="url"
              textContentType="URL"
              autoCompleteType="off"
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.singleTextInput}
              onChangeText={(text) => this.setState({ linkedin_url: text })}
              value={this.state.linkedin_url}
              placeholderTextColor={COLORS.whiteColor}
            />
          </View>
        </View>
        <LocationModal
          onClose={() => this.showLocationModal(false)}
          status={this.state.locationModalVisible}
          onCloseRequest={() => this.showLocationModal(false)}
          onUpdate={this.getLocation}
          onRemove={this.onRemove}
        />
      </KeyboardAwareScrollView>
    );
  }
}

const styles = StyleSheet.create({
  coverImageSection: {
    marginBottom: 35 * METRICS.ratioY,
  },
  avatarWrapper: {
    position: 'relative',
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
  },
  avatar: {
    borderColor: COLORS.btnGrey,
    borderWidth: 1 * METRICS.ratioX,
    width: 100 * METRICS.ratioX,
    height: 100 * METRICS.ratioX,
    resizeMode: 'cover',
    opacity: 0.5,
  },
  editButton: {
    position: 'absolute',
    backgroundColor: COLORS.blackColor,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15 * METRICS.ratioX,
    height: 30 * METRICS.ratioX,
    borderRadius: 15 * METRICS.ratioX,
    borderColor: COLORS.btnGrey,
    borderWidth: 1 * METRICS.ratioX,
    top: 35 * METRICS.ratioX,
  },
  editButtonText: {
    fontFamily: 'Lato',
    fontSize: METRICS.fontSizeNormal,
    color: COLORS.primaryColor,
  },
  locationText: {
    fontFamily: 'Lato',
    fontSize: METRICS.fontSizeMedium,
    color: 'white',
    textAlign: 'center',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    height: METRICS.rowHeight,
    paddingHorizontal: METRICS.spacingHuge,
  },
  bioSection: {
    marginBottom: 35 * METRICS.ratioY,
  },
  bioTextInput: {
    borderColor: COLORS.darkbtnGrey,
    borderWidth: 1 * METRICS.ratioX,
    color: COLORS.whiteColor,
    padding: 10 * METRICS.ratioX,
    height: 250 * METRICS.ratioY,
    fontFamily: 'Lato',
    fontSize: METRICS.fontSizeMedium,
  },
  TextLocation: {
    fontFamily: 'Lato',
    fontSize: METRICS.fontSizeMedium,
    textAlign: 'center',
    color: 'white',
    borderBottomColor: COLORS.darkbtnGrey,
    borderBottomWidth: 1 * METRICS.ratioX,
    paddingVertical: METRICS.spacingTiny,
    flex: 1,
  },
  singleTextInput: {
    fontFamily: 'Lato',
    fontSize: METRICS.fontSizeMedium,
    color: 'white',
    borderBottomColor: COLORS.darkbtnGrey,
    borderBottomWidth: 1 * METRICS.ratioX,
    paddingVertical: METRICS.spacingTiny,
    flex: 1,
  },
  locationSection: {
    marginBottom: 35 * METRICS.ratioY,
  },
  linksSection: {
    marginBottom: 35 * METRICS.ratioY,
  },
  linkInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: METRICS.spacingTiny,
  },
  linkInputLabelText: {
    fontFamily: 'Lato',
    fontSize: METRICS.fontSizeMedium,
    color: COLORS.primaryColor,
    marginRight: METRICS.spacingSmall,
  },
  type: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: METRICS.spacingNormal,
  },
  box: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: METRICS.spacingHuge,
    position: 'relative',
  },
  checkIcon: {
    color: COLORS.primaryColor,
    fontSize: METRICS.fontSizeBiggest,
    marginBottom: METRICS.spacingNormal,
  },
  checkText: {
    color: COLORS.whiteColor,
    fontFamily: 'lato',
    fontSize: METRICS.fontSizeOK,
  },
  checked: {
    color: COLORS.primaryColor,
    fontSize: METRICS.fontSizeBiggest,
  },
  checkedSide: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 6 * METRICS.ratioY,
  },
  accounttype: {
    marginBottom: 25 * METRICS.ratioY,
  },
});

export default withNavigation(SettingsMainScreen);
