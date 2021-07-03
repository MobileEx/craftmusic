import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import { COLORS, METRICS } from '../../global';
import { fetchNotifications } from '../../store/actions';
import DisplayNotification from '../../components/DisplayNotification';

class NotificationsTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      this.onFocus();
    });
  }

  componentWillUnmount() {
    this.focusListener.remove();
  }

  onFocus = () => this.props.dispatch(fetchNotifications());

  render() {
    const { notifications, invitations } = this.props;
    let data = notifications;
    if (this.props.route.key === 'invite') {
      data = invitations;
    }
    return (
      <SafeAreaView style={styles.container}>
        <FlatList
          style={styles.container1}
          data={data}
          extraData={this.props}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            return <DisplayNotification notification={item} />;
          }}
        />
      </SafeAreaView>
    );
  }
}

function mapStateToProps(state) {
  const { notifications, invitations, user } = state;
  return { notifications, invitations, user };
}

export default connect(mapStateToProps)(withNavigation(NotificationsTab));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.blackColor,
  },
  container1: {
    paddingLeft: METRICS.spacingNormal,
    paddingRight: METRICS.spacingNormal,
  },
});
