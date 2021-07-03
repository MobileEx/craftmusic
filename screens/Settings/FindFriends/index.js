import React from 'react';
import { ScrollView, View, Text, StyleSheet, Platform } from 'react-native';
import FastImage from 'react-native-fast-image';
import { withNavigation } from 'react-navigation';
import Share from 'react-native-share';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Contacts from 'react-native-contacts';
import { BaseScreen, ScreenHeader, NavListItem, CustomIcon } from '../../../components';
import { METRICS, STYLES, COLORS } from '../../../global';
import { facebookIcon } from '../../../assets/images';

const FacebookLink = () => (
  <View style={styles.linkCustomContent}>
    <FastImage source={facebookIcon} style={styles.navListImage} />
    <Text style={STYLES.normalText}>Facebook</Text>
  </View>
);
const ContactsLink = () => (
  <View style={styles.linkCustomContent}>
    <CustomIcon name="user-5" size={30.5 * METRICS.ratioX} style={styles.navListIcon} />
    <Text style={STYLES.normalText}>Contacts</Text>
  </View>
);
class FindFriends extends BaseScreen {
  navbarHidden = true;

  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      contacts: null,
    };
  }

  componentDidMount() {
    /*
    Contacts.getAll((err, contacts) => {
      if (err) {
        throw err;
      }
      console.log(contacts);
      // contacts returned
    });
    */
    if (Platform.OS === 'ios') {
      // console.log('started');

      Contacts.getAll((err, contacts) => {
        if (err === 'denied') {
          console.warn('Permission to access contacts was denied');
        } else {
          // console.log(contacts);
          // this.setState({ contacts });
        }
      });
    }
  }

  updateSetting = (fieldName, value) => {
    this.setState((preState) => {
      const newState = preState;
      newState[fieldName] = value;
      return newState;
    });
  };

  handleInvite = async () => {
    Share.open({
      title: 'Craft Music app',
      message: 'Download the Craft Music app!',
      url: 'https://craftmusicapp.com',
      subject: 'Craft Music app',
    });
  };

  renderScreen() {
    const { navigation } = this.props;

    return (
      <ScrollView contentContainerStyle={styles.container}>
        <ScreenHeader navigation={navigation} pageTitle="Find Friends" />
        <View style={styles.list}>
          <NavListItem
            leftContent={<FacebookLink />}
            moveTo="FacebookFriends"
            navigation={navigation}
          />
        </View>
        <View style={styles.list}>
          <NavListItem
            leftContent={<ContactsLink />}
            moveTo="ContactFriends"
            navigation={navigation}
          />
        </View>
        <View style={styles.buttonWrapper}>
          <TouchableOpacity style={styles.inviteButton} onPress={this.handleInvite}>
            <Text style={STYLES.buttonText}>Invite Friends</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: METRICS.spaceNormal,
    paddingRight: METRICS.spaceNormal,
  },
  linkCustomContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navListIcon: {
    color: COLORS.whiteColor,
    marginRight: METRICS.spacingBig,
  },
  navListImage: {
    width: 32.5 * METRICS.ratioX,
    height: 32.5 * METRICS.ratioX,
    color: COLORS.whiteColor,
    marginRight: METRICS.spacingBig,
  },
  buttonWrapper: {
    paddingVertical: METRICS.spacingBig,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  inviteButton: {
    backgroundColor: COLORS.primaryColor,
    height: METRICS.rowHeightSmall,
    borderRadius: METRICS.rowHeightSmall / 2,
    paddingHorizontal: METRICS.spacingNormal,
    flexDirection: 'row',
    alignItems: 'center',
  },
  list: {
    paddingVertical: METRICS.spacingSmall,
  },
});

export default withNavigation(FindFriends);
