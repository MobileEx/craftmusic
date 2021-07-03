/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { Dimensions, Linking , AppState} from 'react-native';
import AppNavigator from './navigation/AppNavigator';
import NavigationService from './navigation/NavigationService';
import store from './store/configureStore';
import {
  updateDimensions,
  checkSavedAuth,
  updateBackScreen,
  updateCraftPlaying,
  updateProfileUserId,
  updateEditingCraftId,
  updateTitle,
  updateCurCraftId,
  updatePrevState,
  updateIsPlaying,
} from './store/actions';
import { StudioProvider } from './services/StudioService';
import PlayingCraftService from './services/PlayingCraftService';
import { AudioPlayer } from './libs/rnsuperpowered';

Dimensions.addEventListener('change', (e) => {
  store.dispatch(updateDimensions(e.window));
});
store.dispatch(updateDimensions(Dimensions.get('window')));

// check storage auth token
store.dispatch(checkSavedAuth());

type Props = {};
console.disableYellowBox = true;
export default class App extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      profileId: null,
      craftId: null,
      opened: null,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    AudioPlayer.loadFile('');
    Linking.addEventListener('url', this.handleOpenURL);
  }

  componentWillUnmount() {
    Linking.removeEventListener('url', this.handleOpenURL);
  }
  handleOpenURL = (event) => {
    const route = event.url.replace(/.*?:\/\//g, '');
    const id = route.match(/\/([^\/]+)\/?$/)[1];
    const routeName = route.split('/')[0];

    if (routeName === 'profile') {
      this.setState({
        profileId: id,
      });
    } else if (routeName === 'craft') {
      this.setState({ craftId: id });
    }

    const state = store.getState();
    if (!state.craftState) {
      store.dispatch(updatePrevState({}));
      store.dispatch(updateProfileUserId(state.user.id));
      store.dispatch(updateIsPlaying(-1));
      store.dispatch(updateBackScreen('Home'));
      store.dispatch(updateTitle('Home'));
    } else {
      this.setState({ opened: true });
    }

    const { profileId, craftId } = this.state;

    //made by dongdong
    global.show_link = 'true'
    //

    if (profileId) {
      store.dispatch(updateProfileUserId(profileId));
      store.dispatch(updateTitle('Profile'));
      store.dispatch(updateCraftPlaying(false));
      NavigationService.navigate('Profile'); 
    }

    if (craftId) {
      store.dispatch(updateIsPlaying(1));
      store.dispatch(updateEditingCraftId(craftId));
      store.dispatch(updateCurCraftId(0));
      store.dispatch(updateTitle('PlayingCraft'));

      PlayingCraftService.getCraft(craftId)
        .then((res) => {
          store.dispatch({
            type: 'UPDATE_PLAYING_CRAFT',
            data: [res.data],
          });
          this.setState({ crafts: [res.data] });
          store.dispatch(updateCraftPlaying(true));
        })
        .catch((err) => {
          // store.dispatch(updateDeeplinkAlert('Craft does not exist.'));
        });

     NavigationService.navigate('Home');
    }
  };

  render() {
    const prefix = 'craftmusicapp://';
    return (
      <Provider store={store}>
        <StudioProvider>
          <AppNavigator
            ref={(navigatorRef) => {
              NavigationService.setTopLevelNavigator(navigatorRef);
            }}
            uriPrefix={prefix}
          />
        </StudioProvider>
      </Provider>
    );
  }
}
