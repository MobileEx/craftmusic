import { createStackNavigator, createAppContainer, createSwitchNavigator } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import SettingsNavigator from './SettingsNavigator';
import PlayingCraftNavigator from './PlayingCraftNavigator';
import DemoPlayerScreen from '../screens/DemoPlayerScreen';

import SigninScreen from '../screens/SigninScreen';
import SignupScreen from '../screens/SignupScreen';
import SplashScreen from '../screens/SplashScreen';
import SplashVideo from '../screens/SplashVideo';
import Forgot1 from '../screens/Forgot1';
import Forgot2 from '../screens/Forgot2';

const AuthStack = createStackNavigator({
  SplashSuper: SplashVideo,
  Splash: SplashScreen,
  Signin: SigninScreen,
  Signup: SignupScreen,
  Forgot1,
  Forgot2,
});

const AuthStackAfterLogout = createStackNavigator({
  Splash: SplashScreen,
  Signin: SigninScreen,
  Signup: SignupScreen,
  Forgot1,
  Forgot2,
});

const DemoStack = createStackNavigator({
  Demo: DemoPlayerScreen,
});

export default createAppContainer(
  createSwitchNavigator(
    {
      // You could add another route here for authentication.
      // Read more at https://reactnavigation.org/docs/en/auth-flow.html
      // Auth: AuthStack,
      Main: MainTabNavigator,
      Auth: AuthStack,
      AuthLogout: AuthStackAfterLogout,
      Settings: SettingsNavigator,
      //PlayingCraft: PlayingCraftNavigator,
      PlayerDemo: DemoStack,
    },
    {
      initialRouteName: 'Auth',
      initialRouteKey: 'Auth',
      backBehavior: 'none',
    }
  )
);
