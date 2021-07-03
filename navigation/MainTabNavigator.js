import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import HomeScreen from '../screens/HomeScreen';
import TabBar from '../components/TabBar';
import StudioScreen from '../screens/StudioScreen';

import ProfileScreen from '../screens/ProfileScreen';
import FollowsScreen from '../screens/FollowsScreen';
import StoreMainScreen from '../screens/StoreMainScreen';
import StoreCategoryScreen from '../screens/StoreCategoryScreen';
import DMScreen from '../screens/DMScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import StudioSplashScreen from '../screens/StudioSplash';
import SavedDraftsScreen from '../screens/SavedDrafts';
import CoverArtVideoScreen from '../screens/EditDetails/CoverArtVideoScreen';
import MusicScreen from '../screens/EditDetails/Music';
import InfoScreen from '../screens/EditDetails/Info';
import StoreScreen from '../screens/EditDetails/Store';

import ChannelScreen from '../screens/ChannelScreen';
import SearchScreen from '../screens/SearchScreen';
import SpotlightScreen from '../screens/SpotlightScreen';

import CraftInsideScreen from '../screens/CraftInsideScreen';
import CraftListScreen from '../screens/CraftListScreen';
import CraftlistFollowsScreen from '../screens/CraftlistFollowsScreen';
import CraftListSortScreen from '../screens/CraftListSortScreen';
import AddContributorScreen from '../screens/AddContributorScreen';

import PlayingCraftScreen from '../screens/PlayingCraftScreen';
import AddCollaboratorScreen from '../screens/AddCollaboratorScreen';
import Derivatives from '../screens/Derivatives';
import SuperAdminScreen from '../screens/SuperAdminScreen';
import CreateContestScreen from '../screens/CreateContestScreen';

import SeeAllCraftlists from '../screens/SeeAllCraftlists';
import SeeAllCrafts from '../screens/SeeAllCrafts';
import SpotlightCraft from '../screens/SpotlightCraft';
import HashedCraftsScreen from '../screens/HashedCraftsScreen';

import BanScreen from '../screens/BanScreen';
import VerifyScreen from '../screens/VerifyScreen';
import ReportsScreen from '../screens/ReportsScreen';
import UserReportsTab from '../screens/ReportsTabs/UserReportsTab';
import CraftReportsTab from '../screens/ReportsTabs/CraftReportsTab';
import CommentReportsTab from '../screens/ReportsTabs/CommentReportsTab';
import VerifyTabs from '../screens/VerifyTabs/RequestsTab';
import SearchVerify from '../screens/VerifyTabs/SearchVerifyTab';
import { MyPurchasesScreen } from '../screens/Settings';

const HomeStack = createStackNavigator(
  {
    Home: HomeScreen,
  },
  {
    initialRouteName: 'Home',
    initialRouteKey: 'Home',
  }
);

const StudioStack = createStackNavigator({
  StudioSplash: { screen: StudioSplashScreen },
  Studio: { screen: StudioScreen },
  SavedDrafts: { screen: SavedDraftsScreen },
  CoverArtVideo: { screen: CoverArtVideoScreen },
  AddCollaborator: { screen: AddCollaboratorScreen },
  Music: { screen: MusicScreen },
  Info: { screen: InfoScreen },
  Store: { screen: StoreScreen },
  AddPurchases: {
    screen: MyPurchasesScreen,
    navigationOptions: {
      header: null,
    },
  },
});

const DMStack = createStackNavigator({
  DM: DMScreen,
  Channel: {
    screen: ChannelScreen,
  },
});

const NotificationStack = createStackNavigator({
  Notifications: NotificationsScreen,
});

const ProfileStack = createStackNavigator(
  {
    Profile: ProfileScreen,
    Follows: FollowsScreen,
    StoreMain: StoreMainScreen,
    StoreCategory: StoreCategoryScreen,
    SeeAllCraftlists,
    SeeAllCrafts,
  },
  { headerMode: 'screen', initialRouteName: 'Profile', initialRouteKey: 'Profile' }
);

DMStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  const { routeName } = navigation.state.routes[navigation.state.index];
  if (routeName === 'Channel') {
    tabBarVisible = false;
  }
  return { tabBarVisible };
};

const SearchStack = createStackNavigator({
  Search: SearchScreen,
  HashedCrafts: HashedCraftsScreen,
});

const PlayingCraftStack = createStackNavigator({
  PlayingCraft: PlayingCraftScreen,
  Derivatives,
});

const CraftStack = createStackNavigator({
  Craft: CraftInsideScreen,
  Craftlist: CraftListScreen,
  CraftlistFollows: CraftlistFollowsScreen,
  ContributorStack: AddContributorScreen,
  CraftlistSort: CraftListSortScreen,
});

CraftStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = false;
  const { routeName } = navigation.state.routes[navigation.state.index];
  if (routeName === 'Craftlist') {
    tabBarVisible = true;
  }
  return { tabBarVisible };
};

const SpotlightStack = createStackNavigator({
  Spotlight: SpotlightScreen,
  SeeAllFeatured: SpotlightCraft,
  AdminScreen: SuperAdminScreen,
  ContestScreen: CreateContestScreen,
  Reports: ReportsScreen,
  UserReports: UserReportsTab,
  CraftReports: CraftReportsTab,
  CommentReports: CommentReportsTab,
  Verify: VerifyScreen,
  VerifyTabs,
  SearchVerify,
  Ban: BanScreen,
});

StudioStack.navigationOptions = {
  tabBarVisible: false,
};

export default createBottomTabNavigator(
  {
    Home: { screen: HomeStack },
    Studio: { screen: StudioStack },
    Profile: { screen: ProfileStack },
    DM: { screen: DMStack },
    Craft: { screen: CraftStack },
    Search: { screen: SearchStack },
    Spotlight: { screen: SpotlightStack },
    Notifications: { screen: NotificationStack },
    // PlayingCraft: { screen: PlayingCraftStack },
    // LinksStack,
  },
  {
    tabBarComponent: TabBar,
    initialRouteName: 'Studio',
    backBehavior: 'history',
    navigationOptions: ({ navigation }) => ({
      tabBarOnPress: (scene, jumpToIndex) => {
        // console.log('onPress:', scene.route);
        jumpToIndex(scene.index);
      },
    }),
  }
);
