import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, View, Image, Text, StyleSheet } from 'react-native';
import _ from 'lodash';
import { useDispatch } from 'react-redux';
import { METRICS, COLORS } from '../global';
import CustomIcon from './CustomIcon';
import { logoIcon } from '../assets/images';
import ProfileService from '../services/ProfileService';
import { updateTitle, updateOpenModalValue, updateCraftPlaying } from '../store/actions';
import store from '../store/configureStore';
import CraftStateService from '../services/CraftStateService';

const ScreenHeader = (props) => {
  const dispatch = useDispatch();
  const { pageTitle, navigation, saveChanges, backAction, only_show_list } = props;
  const storeState = store.getState();
  const { isPlaying } = store.getState();
  const handleGoBack = () => {
    if (pageTitle === 'Settings') {
      dispatch(updateTitle('Home'));
      navigation.navigate('Home');
    } else if (pageTitle === 'Follows') {
      const previous = _.clone(storeState.prevState);
      previous.crafts = storeState.playingCrafts;
      previous.curCraftId = storeState.curCraftId;
      previous.isPlaying = isPlaying;
      previous.play = storeState.play;
      CraftStateService.updateCraftState(previous);
      navigation.navigate(previous.title);
    } else if (
      pageTitle === 'Info' ||
      pageTitle === 'Music' ||
      pageTitle === 'Store' ||
      pageTitle === 'Cover Art/Video'
    ) {
      if (storeState.title === 'PlayingCraft') {
        dispatch(updateOpenModalValue(1));
        navigation.navigate(storeState.backScreen, {refresh : true});
        dispatch(updateCraftPlaying(true));
      } else {
        navigation.goBack();
      }
      if (backAction) backAction();
    } else if (pageTitle === 'Edit Craftlist') {
      if (storeState.title === 'Craft') {
        navigation.navigate('Craftlist');
      } else if (typeof store.getState().onBackCraftList === 'function') {
        navigation.navigate(storeState.backScreen);
      } else {
        CraftStateService.updateCraftState(storeState.prevState);
        navigation.navigate(storeState.backScreen);
      }
    } else if (pageTitle === 'Comments' || pageTitle === 'Derivatives') {
      props.onGoBack();
    } else if (pageTitle === 'Notifications') {
      ProfileService.checkReadNotifications()
        .then((res) => {
          dispatch({ type: 'UPDATE_NOTIFICATION_COUNT', notificationcount: 0 });
          dispatch(updateTitle('Home'));
          navigation.navigate('Home');
        })
        .catch((err) => {
          // console.log('checkReadNotifications error', err.response.data.error);
        });
    } else if (pageTitle === 'My Cart' && navigation.state.params) {
      const { screen = '' } = navigation.state.params;
      if (screen === 'HomeScreen') {
        dispatch(updateTitle('Home'));
        navigation.navigate('Home');
      }
    } else if (pageTitle === 'Collaborators') {
      navigation.goBack(); // made by dongdong
    } else if (pageTitle === 'Edit Profile') {
      if (storeState.backScreen === 'Settings') {
        navigation.goBack();
      } else {
        navigation.navigate(storeState.backScreen);
      }

      saveChanges(); // made by dongdong
    } else if (pageTitle == 'Saved Drafts') {
      navigation.goBack();
    } else if (pageTitle == 'SuperAdmin Access') {
      navigation.navigate('Settings');
    }
    else {
      if (storeState.backScreen === 'Settings') {
        navigation.goBack();
        return;
      }
      if (only_show_list === 1) {
        // made by dongdong
        const previous = _.clone(storeState.prevState);
        navigation.goBack();
      } else {
        const previous = _.clone(storeState.prevState);
        CraftStateService.updateCraftState(previous);
        navigation.navigate(previous.title);
        saveChanges();
        // navigation.goBack();
      }
    }
  };
  return (
    <View style={{ ...styles.container, ...props.style }}>
      {navigation ? (
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <CustomIcon
            name="back"
            size={METRICS.fontSizeBigger}
            style={{ color: COLORS.whiteColor }}
          />
        </TouchableOpacity>
      ) : null}
      <View style={styles.pageTitleContainer}>
        <Image source={logoIcon} style={styles.logoImage} />
        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.pageTitleText}>
          {pageTitle}
        </Text>
      </View>
    </View>
  );
};

ScreenHeader.propTypes = {
  pageTitle: PropTypes.string,
  saveChanges: PropTypes.func,
};

ScreenHeader.defaultProps = {
  pageTitle: 'Screen',
  saveChanges: () => {},
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: METRICS.rowHeightMedium,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.blackColor,
  },
  pageTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    width: METRICS.logosize,
    height: METRICS.logosize,
    resizeMode: 'contain',
    marginRight: METRICS.spacingTiny,
  },
  pageTitleText: {
    fontFamily: 'Lato-Semibold',
    fontSize: METRICS.fontSizeBig,
    color: COLORS.whiteColor,
    maxWidth: 0.7 * METRICS.screenWidth,
  },
  backButton: {
    position: 'absolute',
    left: -12 * METRICS.ratioX,
    top: 4 * METRICS.ratioX,
    padding: 10 * METRICS.ratioX,
    paddingRight: METRICS.spacingBig,
    zIndex: 101,
  },
});

export default ScreenHeader;
