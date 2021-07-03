import { createStackNavigator } from 'react-navigation';
import {
  MainScreen,
  EditProfileScreen,
  ChangeEmailScreen,
  ChangePasswordScreen,
  RequestVerificationScreen,
  BlockedAccountsScreen,
  FindFriendsScreen,
  PaymentsScreen,
  MyCartScreen,
  MyPurchasesScreen,
  MyWishListScreen,
  FacebookFriendsScreen,
  ContactScreen,
} from '../screens/Settings';

const SettingsNavigator = createStackNavigator({
  Main: {
    screen: MainScreen,
    navigationOptions: {
      header: null,
    },
  },
  EditProfile: {
    screen: EditProfileScreen,
    navigationOptions: {
      header: null,
    },
  },
  ChangePassword: {
    screen: ChangePasswordScreen,
    navigationOptions: {
      header: null,
    },
  },
  ChangeEmail: {
    screen: ChangeEmailScreen,
    navigationOptions: {
      header: null,
    },
  },
  RequestVerfication: {
    screen: RequestVerificationScreen,
    navigationOptions: {
      header: null,
    },
  },
  BlockedAccounts: {
    screen: BlockedAccountsScreen,
    navigationOptions: {
      header: null,
    },
  },
  FindFriends: {
    screen: FindFriendsScreen,
    navigationOptions: {
      header: null,
    },
  },
  FacebookFriends: {
    screen: FacebookFriendsScreen,
    navigationOptions: {
      header: null,
    },
  },
  ContactFriends: {
    screen: ContactScreen,
    navigationOptions: {
      header: null,
    },
  },
  Payments: {
    screen: PaymentsScreen,
    navigationOptions: {
      header: null,
    },
  },
  MyCart: {
    screen: MyCartScreen,
    navigationOptions: {
      header: null,
    },
  },
  MyPurchases: {
    screen: MyPurchasesScreen,
    navigationOptions: {
      header: null,
    },
  },
  MyWishList: {
    screen: MyWishListScreen,
    navigationOptions: {
      header: null,
    },
  },
});

export default SettingsNavigator;
