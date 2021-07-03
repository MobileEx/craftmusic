import React from 'react';
import { SafeAreaView, StyleSheet, Text, ScrollView } from 'react-native';
import Header from '../../components/Header';
import ContentTile from '../../components/ContentTile';

class HomeScreen extends React.Component {
  static navigationOptions = {
    header: <Header />,
  };

  render() {
    const tiles = [];
    for (let i = 0; i < 2; i++) {
      let tileStyle = {};
      if (i > 0) {
        tileStyle = { marginTop: 8 };
      }
      tiles.push(<ContentTile key={i} {...tileStyle} />);
    }
    return (
      <ScrollView style={styles.container}>
        {tiles}
        <Text style={styles.instructions}>Welcome to craft music</Text>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    flexDirection: 'column',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  welcome: {
    flex: 1,
    fontSize: 20,
    textAlign: 'left',
    backgroundColor: 'green',
  },
  instructions: {
    color: 'blue',
  },
});

export default HomeScreen;
