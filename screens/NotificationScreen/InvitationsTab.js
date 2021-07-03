import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { TouchableOpacity, FlatList } from 'react-native-gesture-handler';
import { connect } from 'react-redux';
import { ActionsItem } from '../../components';
import { COLORS, METRICS } from '../../global';

class InvitationsTab extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <FlatList
          style={styles.container1}
          data={invites}
          keyExtractor={(item) => item.index}
          renderItem={({ item }) => (
            <TouchableOpacity>
              <ActionsItem
                name={item.name}
                description={item.description}
                avatar={item.avatar}
                time={item.time}
                type={item.type}
                image={item.rightImage}
              />
            </TouchableOpacity>
          )}
        />
      </SafeAreaView>
    );
  }
}

function mapStateToProps(state) {
  const { invites } = state;
  return { invites };
}

export default connect(mapStateToProps)(InvitationsTab);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.blackColor,
  },
  container1: {
    paddingLeft: METRICS.spaceNormal,
    paddingRight: METRICS.spaceNormal,
  },
});
