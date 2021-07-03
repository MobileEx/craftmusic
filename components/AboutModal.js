import React from 'react';
import PropTypes from 'prop-types';
import { Modal, View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import { ScrollView } from 'react-native-gesture-handler';
import CustomIcon from './CustomIcon';
import { COLORS, METRICS } from '../global';
import { instagram1, facebook, snapchat, behance, twitter, linkedin, link } from '../global/Images';

const AboutModal = ({ onClose, status, onCloseRequest, userProfile, onWebsiteLink }) => {
  const arr = ['website', 'instagram', 'facebook', 'snapchat', 'linkedin', 'twitter', 'behance'];
  let linkSectionVisible = false;
  arr.forEach((item) => {
    if (userProfile[`${item}_url`] && userProfile[`${item}_url`] !== 'http://') {
      linkSectionVisible = true;
    }
  });
  return (
    <Modal
      animationType="fade"
      transparent
      modalDidClose={onClose}
      visible={status}
      onRequestClose={() => onCloseRequest(false)}
    >
      <View style={styles.wrapper}>
        <TouchableOpacity onPress={() => onClose()} style={styles.closeButton}>
          <CustomIcon
            name="close"
            size={METRICS.fontSizeHuge}
            style={[styles.iconStyle, { color: COLORS.whiteColor }]}
          />
        </TouchableOpacity>
        {userProfile.bio && (
          <>
            <Text style={styles.biotitle}>Bio</Text>
            <Text style={[styles.subLables, { marginRight: METRICS.marginHuge }]}>
              {userProfile.bio}
            </Text>
          </>
        )}

        {userProfile.location && (
          <>
            <Text style={styles.dmLables}>Location</Text>
            <Text style={[styles.subLables]}>{userProfile.location}</Text>
          </>
        )}
        {linkSectionVisible && (
          <>
            <Text style={styles.dmLables}>Links</Text>
            <View style={styles.socialWrapper}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {userProfile.instagram_url && userProfile.instagram_url !== 'http://' && (
                  <TouchableOpacity
                    style={styles.iconspacing}
                    onPress={() => onWebsiteLink(userProfile.instagram_url)}
                  >
                    <FastImage source={instagram1} style={styles.icon1} />
                  </TouchableOpacity>
                )}
                {userProfile.website_url && userProfile.website_url !== 'http://' && (
                  <TouchableOpacity
                    style={styles.iconspacing}
                    onPress={() => onWebsiteLink(userProfile.website_url)}
                  >
                    <FastImage source={link} style={styles.icons} />
                  </TouchableOpacity>
                )}
                {userProfile.facebook_url && userProfile.facebook_url !== 'http://' && (
                  <TouchableOpacity
                    style={styles.iconspacing}
                    onPress={() => onWebsiteLink(userProfile.facebook_url)}
                  >
                    <FastImage source={facebook} style={styles.icons} />
                  </TouchableOpacity>
                )}
                {userProfile.snapchat_url && userProfile.snapchat_url !== 'http://' && (
                  <TouchableOpacity
                    style={styles.iconspacing}
                    onPress={() => onWebsiteLink(userProfile.snapchat_url)}
                  >
                    <FastImage source={snapchat} style={styles.icons} />
                  </TouchableOpacity>
                )}
                {userProfile.linkedin_url && userProfile.linkedin_url !== 'http://' && (
                  <TouchableOpacity
                    style={styles.iconspacing}
                    onPress={() => onWebsiteLink(userProfile.instagram_url)}
                  >
                    <FastImage source={linkedin} style={styles.icons} />
                  </TouchableOpacity>
                )}
                {userProfile.twitter_url && userProfile.twitter_url !== 'http://' && (
                  <TouchableOpacity
                    style={styles.iconspacing}
                    onPress={() => onWebsiteLink(userProfile.twitter_url)}
                  >
                    <FastImage source={twitter} style={styles.icons} />
                  </TouchableOpacity>
                )}
                {userProfile.behance_url && userProfile.behance_url !== 'http://' && (
                  <TouchableOpacity
                    style={styles.iconspacing}
                    onPress={() => onWebsiteLink(userProfile.behance_url)}
                  >
                    <FastImage source={behance} style={styles.icons} />
                  </TouchableOpacity>
                )}
              </ScrollView>
            </View>
          </>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
  },
  closeButton: {
    marginTop: METRICS.spacingNormal,
    padding: METRICS.spacingBig,
  },
  iconStyle: {
    color: COLORS.primaryColor,
    marginLeft: METRICS.marginSmall,
  },
  biotitle: {
    color: COLORS.primaryColor,
    fontSize: METRICS.fontSizeBiggest,
    marginLeft: METRICS.marginHuge,
    marginTop: METRICS.marginBig,
    fontFamily: 'lato-bold',
  },
  dmLables: {
    color: COLORS.primaryColor,
    fontSize: METRICS.fontSizeBiggest,
    marginLeft: METRICS.marginHuge,
    marginTop: METRICS.marginHuge,
    fontFamily: 'lato-bold',
  },
  subLables: {
    color: COLORS.whiteColor,
    marginLeft: METRICS.marginHuge,
    marginTop: METRICS.marginNormal,
    fontSize: METRICS.fontSizeMedium,
    fontFamily: 'lato',
  },
  socialWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: METRICS.marginBig,
    marginLeft: METRICS.marginHuge,
  },
  icon1: {
    height: METRICS.avatarsmall,
    width: METRICS.avatarsmall,
  },
  icons: {
    height: METRICS.avatarsmall,
    width: METRICS.avatarsmall,
  },
  iconspacing: {
    marginRight: METRICS.marginBig,
  },
});

AboutModal.propTypes = {
  onClose: PropTypes.func,
  status: PropTypes.bool,
  onCloseRequest: PropTypes.func,
};

AboutModal.defaultProps = {
  onClose: () => {},
  status: false,
  onCloseRequest: () => {},
};

export default AboutModal;
