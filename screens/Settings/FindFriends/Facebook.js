import React from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import { withNavigation } from 'react-navigation';
import { LoginManager, AccessToken } from 'react-native-fbsdk';
import { BaseScreen, ScreenHeader, SearchInput } from '../../../components';
import { METRICS, STYLES, COLORS } from '../../../global';
import ProfileService from '../../../services/ProfileService';

class FacebookFriendsScreen extends BaseScreen {
  navbarHidden = true;

  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      nameFilterText: '',
      contactUsers: [],
      userId: 1,
      statusFlags: [],
    };
  }

  componentDidMount() {
    LoginManager.logInWithPermissions(['public_profile', 'email'])
      .then((result) => {
        if (result.isCancelled) {
          // console.log("Login was cancelled");
        }
        return AccessToken.getCurrentAccessToken();
      })
      .then((data) => {
        const infoRequest = new GraphRequest(
          '/me/friends',
          {
            accessToken:
              'EAADGMp1I4RkBAL72YcoZBEPrjHScKQvrwkJpSs3wyd6oQME3EZBfrkUjqFrREv6iL2hsLxl2YK8EZB0HZBqKFZB2ZAblwckkhmQPczKohLE2brP8bjXsH4KQfBm289bofdH7c655BQg5HsuZCXSoGkOjxtvWLWHoFyyfdnigv5w0Due3CWsZCbj7EKoPniHXqcEMayWKjGeFKEGLNUIAdoffNQZCI8oZB6ALUhrtIfPVFdIAZDZD',
            parameters: {
              fields: {
                string:
                  'email, name, first_name, middle_name, last_name, picture.type(large), cover, birthday, location, friends',
              },
            },
          },
          (res, err) => {
            // console.log(res);
          }
        );
      })
      .catch((err) => {
        console.log(err.response.data.error);
      });
  }

  updateFilterText = (text) => {
    this.setState({
      nameFilterText: text,
    });
  };

  follow = (id) => {
    const { statusFlags, contactUsers } = this.state;
    if (statusFlags[id]) {
      ProfileService.unFollow(contactUsers[id].id).then((res) => {});
    } else {
      ProfileService.follow(contactUsers[id].id).then((res) => {});
    }
    const tmp = statusFlags;
    tmp[id] = !tmp[id];
    this.setState({ statusFlags: tmp });
  };

  renderScreen() {
    const { navigation } = this.props;
    const { nameFilterText, contactUsers, statusFlags } = this.state;

    return (
      <SafeAreaView style={styles.contain}>
        <View style={{ paddingHorizontal: METRICS.spacingNormal }}>
          <ScreenHeader navigation={navigation} pageTitle="Facebook" />
        </View>
        <View style={styles.searchWrapper}>
          <View style={styles.searchItem}>
            <SearchInput
              placeholder="Search users"
              value={nameFilterText}
              changeHandler={this.updateFilterText}
            />
          </View>
        </View>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.usersWrapper}>
            {contactUsers
              .filter((item) => item.username.toLowerCase().includes(nameFilterText.toLowerCase()))
              .map((userItem, index) => (
                <View style={styles.userItem} key={index}>
                  <View style={STYLES.horizontalAlign}>
                    <FastImage
                      source={userItem.avatar ? { uri: userItem.avatar } : user}
                      style={styles.avatar}
                    />
                    <Text style={styles.usernameText}>{userItem.username}</Text>
                  </View>
                  {statusFlags[index] ? (
                    <TouchableOpacity
                      style={{
                        ...styles.followingButton,
                        ...STYLES.centerAlign,
                      }}
                      onPress={this.follow.bind(this, index)}
                    >
                      <Text style={styles.buttonText}>Following</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={{ ...styles.followButton, ...STYLES.centerAlign }}
                      onPress={this.follow.bind(this, index)}
                    >
                      <Text style={styles.buttonText}>Follow</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  contain: {
    backgroundColor: COLORS.blackColor,
    minHeight: '100%',
  },
  container: {
    paddingLeft: METRICS.spaceNormal,
    paddingRight: METRICS.spaceNormal,
  },
  searchWrapper: {
    flexDirection: 'row',
    paddingHorizontal: METRICS.marginNormal,
    paddingVertical: METRICS.marginSmall,
  },
  searchItem: {
    flex: 10,
    height: 40 * METRICS.ratioX,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: METRICS.followspacing,
  },
  avatar: {
    height: METRICS.avatarsmall,
    width: METRICS.avatarsmall,
    marginRight: METRICS.spacingSmall,
    borderRadius: METRICS.avatarsmall / 2,
  },
  usernameText: {
    fontFamily: 'Lato-Semibold',
    fontSize: METRICS.fontSizeNormal,
    color: COLORS.whiteColor,
  },
  followingButton: {
    borderWidth: 1,
    borderColor: COLORS.primaryColor,
    backgroundColor: COLORS.blackColor,
    height: METRICS.followbuttonheight,
    borderRadius: 20 * METRICS.ratioX,
    width: METRICS.followbuttonwidth,
  },
  followButton: {
    backgroundColor: COLORS.primaryColor,
    height: METRICS.followbuttonheight,
    borderRadius: 20 * METRICS.ratioX,
    width: METRICS.followbuttonwidth,
  },
  buttonText: {
    fontFamily: 'lato-bold',
    fontSize: METRICS.fontSizeNormal,
    color: COLORS.whiteColor,
  },
});

export default withNavigation(FacebookFriendsScreen);
