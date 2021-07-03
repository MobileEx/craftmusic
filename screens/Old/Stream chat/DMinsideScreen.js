import React from 'react';
import { ScrollView, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import _ from 'lodash';
import { Header, CustomIcon, UserList, DirectMessage, DMPopup } from '../../../components';
import { COLORS, METRICS } from '../../../global';
import { messages } from '../../../global/Seeds';
import store from '../../../store/configureStore';
import { updatePrevState, updateTitle } from '../../../store/actions';

export default class DMinsideScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toggle: false,
    };
  }

  static navigationOptions = ({ navigation }) => {
    const onEdit = navigation.getParam('onEdit');
    return {
      headerStyle: {
        backgroundColor: COLORS.blackColor,
        borderBottomWidth: 0,
      },
      headerTitle: <Header title="Group Name" />,
      headerLeft: (
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <CustomIcon name="back" style={styles.backIcon} />
        </TouchableOpacity>
      ),
      headerRight: (
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            onEdit(true);
          }}
        >
          <CustomIcon name="three-dots-more-indicator" size={18} style={styles.backIcon} />
        </TouchableOpacity>
      ),
    };
  };

  componentDidMount() {
    // console.log('DM inside screen');
    this.props.navigation.setParams({ onEdit: this.onToggleModal });
  }

  onToggleModal = (toggle) => {
    this.setState({
      toggle,
    });
  };

  onMove = (screen) => {
    const state = store.getState();
    store.dispatch(updatePrevState(store.getState()));
    store.dispatch(updateTitle(screen));
    this.props.navigation.navigate(screen);
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.wrapper}>
          <UserList onMove={this.onMove} />
          <DirectMessage messages={messages} />
          <DMPopup
            title="Edit Group Info"
            status={this.state.toggle}
            onClose={this.onToggleModal}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  backIcon: {
    color: COLORS.whiteColor,
    fontSize: METRICS.fontSizeBig,
  },
  backButton: {
    marginLeft: 20 * METRICS.ratioX,
    marginRight: 20 * METRICS.ratioX,
  },
  rightText: {
    color: COLORS.whiteColor,
    fontSize: 20 * METRICS.ratioX,
  },
  container: {
    backgroundColor: COLORS.blackColor,
    minHeight: '100%',
  },
  wrapper: {
    paddingTop: 25 * METRICS.ratioX,
  },
});
