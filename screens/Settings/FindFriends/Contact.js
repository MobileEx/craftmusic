import React from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import { withNavigation } from 'react-navigation';
import Contacts from 'react-native-contacts';
import { connect } from 'react-redux';
import { BaseScreen, ScreenHeader, SearchInput } from '../../../components';
import { METRICS, STYLES, COLORS } from '../../../global';
import ProfileService from '../../../services/ProfileService';
import { user } from '../../../global/Images';

class ContactScreen extends BaseScreen {
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
    Contacts.getAll((err, contacts) => {
      if (err) {
        throw err;
      }
      const phones = [];
      for (let i = 0; i < contacts.length; i++) {
        for (let j = 0; j < contacts[i].phoneNumbers.length; j++) {
          phones.push(contacts[i].phoneNumbers[j].number.replace(/[-+()\s]/g, ''));
        }
      }
      ProfileService.getContactUsers(phones)
        .then((res) => {
          this.showContactData(res.data);
        })
        .catch((err) => {
          // console.log(err.response.data.error);
        });
    });
  }

  showContactData = (contacts) => {
    ProfileService.getFollow(this.props.user.id)
      .then((res) => {
        const followingUsers = res.data.followings;
        const statusFlags = [];
        for (let i = 0; i < contacts.length; i++) {
          statusFlags.push(false);
          for (let j = 0; j < followingUsers.length; j++) {
            if (followingUsers[j].id == contacts[i].id) {
              statusFlags[i] = true;
              break;
            }
          }
        }
        // console.log(statusFlags);
        this.setState({
          contactUsers: contacts,
          statusFlags,
        });
      })
      .catch((err) => {
        // console.log(err.response.data.error);
      });
  };

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
          <ScreenHeader navigation={navigation} pageTitle="Contacts" />
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
                      style={{ ...styles.followingButton, ...STYLES.centerAlign }}
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

export default connect(mapStateToProps)(withNavigation(ContactScreen));
