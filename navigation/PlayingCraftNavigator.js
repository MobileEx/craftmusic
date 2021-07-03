import { createStackNavigator } from 'react-navigation';
import PlayingCraft from '../screens/PlayingCraftScreen';
import Derivatives from '../screens/Derivatives';
import CommentsScreen from '../components/PlayingCraft/Comment/CommentScreen';

const PlayingCraftNavigator = createStackNavigator(
  {
    PlayingCraft: {
      screen: PlayingCraft,
      navigationOptions: {
        header: null,
      },
    },
    // Derivatives: {
    //   screen: Derivatives,
    //   navigationOptions: {
    //     header: null,
    //   },
    // },
    // CommentsScreen: {
    //   screen: CommentsScreen,
    //   navigationOptions: {
    //     header: null,
    //   },
    // },
  },
  {
    initialRouteKey: 'CommentsScreen',
    initialRouteName: 'CommentsScreen',
  }
);

export default PlayingCraftNavigator;
