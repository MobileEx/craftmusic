import React from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import { withNavigation } from 'react-navigation';
import { BaseScreen, ScreenHeader, SearchInput, CustomIcon } from '../../../components';
import { METRICS, STYLES, COLORS } from '../../../global';
import ProfileService from '../../../services/ProfileService';
import { user } from '../../../global/Images';

class SettingsMainScreen extends BaseScreen {
  navbarHidden = true;

  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      nameFilterText: '',
      blockUsers: [],
      userId: 1,
      statusFlags: [],
    };
  }

  componentDidMount() {
    const { statusFlags } = this.state;
    ProfileService.getBlock()
      .then((res) => {
        const blockUsers = [];
        for (let i = 0; i < res.data.blocks.length; i++) {
          statusFlags.push(true);
          blockUsers.push(res.data.blocks[i]);
        }
        this.setState({ blockUsers });
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

  block = (id) => {
    const { statusFlags, blockUsers } = this.state;
    if (statusFlags[id]) {
      ProfileService.unBlockUser(blockUsers[id].id).then((res) => {});
    } else {
      ProfileService.blockUser(blockUsers[id].id).then((res) => {});
    }
    const tmp = statusFlags;
    tmp[id] = !tmp[id];
    this.setState({ statusFlags: tmp });
  };

  showUsertypeIcon(types, verified) {
    return (
      <>
        {types.map((item, index) => {
          return (
            <View key={index}>
              {item.id === 1 && (
                <CustomIcon name="brush" size={METRICS.fontSizeSmall} style={styles.iconStyle} />
              )}
              {item.id === 2 && (
                <CustomIcon name="music" size={METRICS.fontSizeSmall} style={styles.iconStyle} />
              )}
              {item.id === 3 && (
                <CustomIcon name="briefcase" size={METRICS.fontSmall} style={styles.iconStyle} />
              )}
              {item.id === 4 && (
                <CustomIcon name="heart" size={METRICS.fontSizeSmall} style={styles.iconStyle} />
              )}
            </View>
          );
        })}
        {verified && (
          <CustomIcon
            name="mark-as-favorite-star"
            size={METRICS.fontSizeSmall}
            style={[styles.iconStyle, { color: COLORS.starColor }]}
          />
        )}
      </>
    );
  }

  renderScreen() {
    const { navigation } = this.props;
    const { nameFilterText, blockUsers, statusFlags } = this.state;

    return (
      <SafeAreaView style={styles.contain}>
        <View style={{ paddingHorizontal: METRICS.spacingNormal }}>
          <ScreenHeader navigation={navigation} pageTitle="Blocked" />
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
            {blockUsers
              .filter((item) => item.username.toLowerCase().includes(nameFilterText.toLowerCase()))
              .map((userItem, index) => (
                <View style={styles.userItem} key={index}>
                  <View style={STYLES.horizontalAlign}>
                    <FastImage
                      source={userItem.avatar ? { uri: userItem.avatar } : user}
                      style={styles.avatar}
                    />
                    <Text numberOfLines={1} ellipsizeMode="tail" style={styles.usernameText}>
                      {userItem.username}
                    </Text>
                    {userItem.types && this.showUsertypeIcon(userItem.types, userItem.verified_at)}
                  </View>
                  {statusFlags[index] ? (
                    <TouchableOpacity
                      style={{ ...styles.unblockButton, ...STYLES.centerAlign }}
                      onPress={this.block.bind(this, index)}
                    >
                      <Text style={styles.buttonText}>Unblock</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={{ ...styles.blockButton, ...STYLES.centerAlign }}
                      onPress={this.block.bind(this, index)}
                    >
                      <Text style={styles.buttonText}>Block</Text>
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
    overflow: 'hidden',
    maxWidth: 0.33 * METRICS.screenWidth,
  },
  blockButton: {
    borderWidth: 1,
    borderColor: COLORS.primaryColor,
    backgroundColor: COLORS.blackColor,
    height: METRICS.followbuttonheight,
    borderRadius: 20 * METRICS.ratioX,
    width: METRICS.followbuttonwidth,
  },
  unblockButton: {
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
  iconStyle: {
    color: COLORS.primaryColor,
    paddingRight: METRICS.marginTiny,
  },
});

export default withNavigation(SettingsMainScreen);
