import { createStackNavigator } from 'react-navigation';
import SectionList from './SectionList';

const SectionListNavigator = createStackNavigator(
  {
    Main: { screen: SectionList },
  },
  { headerMode: 'none' }
);

export default SectionListNavigator;
