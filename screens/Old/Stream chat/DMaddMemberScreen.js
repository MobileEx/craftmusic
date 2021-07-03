import React from 'react';
import {
  ScrollView,
  View,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import _ from 'lodash';
import { Header, CustomIcon, SearchItem, FollowsItem, Button } from '../../../components';
import { COLORS, METRICS } from '../../../global';
import store from '../../../store/configureStore';
import { updatePrevState, updateTitle } from '../../../store/actions';

export default class DMaddMemberScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerStyle: {
        backgroundColor: COLORS.blackColor,
        borderBottomWidth: 0,
      },
      headerTitle: <Header title="Add People to Chat" />,
      headerLeft: (
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <CustomIcon name="back" style={styles.backIcon} />
        </TouchableOpacity>
      ),
    };
  };

  renderSelected = (status) => {
    if (status === 1) {
      return (
        <View style={styles.checkWrapper}>
          <CustomIcon name="check" style={styles.checkIcon} />
        </View>
      );
    }
    return <></>;
  };

  render() {
    const state = store.getState();
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.wrapper}>
          <SearchItem placeholder="Search People" />
          <View style={styles.list}>
            <FlatList
              data={users}
              keyExtractor={(item) => item.index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity>
                  <FollowsItem item={item}>{this.renderSelected(item.status)}</FollowsItem>
                </TouchableOpacity>
              )}
            />
          </View>

          <View style={styles.buttonWrapper}>
            <Button
              onClick={() => {
                store.dispatch(updatePrevState(store.getState()));
                store.dispatch(updateTitle('DMinside'));
                this.props.navigation.navigate('DMinside');
              }}
              title="Invite"
              style={styles.button}
            />
          </View>
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
    marginLeft: 20,
  },
  wrapper: {
    backgroundColor: COLORS.blackColor,
    minHeight: '100%',
    paddingTop: METRICS.marginBig,
  },
  list: {
    marginTop: 15,
    height: 'auto',
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.blackColor,
  },
  checkWrapper: {
    backgroundColor: COLORS.primaryColor,
    width: 26,
    height: 26,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
  },
  checkIcon: {
    color: '#431717',
    fontSize: 17,
  },
  buttonWrapper: {
    marginTop: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: 113,
    height: 30,
    borderColor: COLORS.primaryColor,
  },
});
