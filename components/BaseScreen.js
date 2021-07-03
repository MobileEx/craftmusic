import React, { Component } from 'react';
import { View, SafeAreaView, StyleSheet, StatusBar } from 'react-native';
import { COLORS } from '../global';

const NavBar = () => <View />;
const Footer = () => <View />;

class BaseScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        {!this.navbarHidden && (
          <NavBar
            style={{ ...this.navbarStyle }}
            onClickLogo={this.handleClickLogo}
            onClickRightNavItem={this.handleClickRightNavItem}
          />
        )}
        <View style={styles.content}>{this.renderScreen()}</View>
        {!this.footerHidden && <Footer />}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.blackColor,
  },
  content: {
    flex: 1,
  },
});

export default BaseScreen;
