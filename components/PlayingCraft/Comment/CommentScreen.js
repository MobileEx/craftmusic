import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { withNavigation } from 'react-navigation';
import { ScreenHeader, Comment } from '../..';
import { COLORS, METRICS } from '../../../global';

class CommentsScreen extends React.Component {
  navbarHidden = true;

  static navigationOptions = {
    header: null,
  };

  render() {
    const { navigation, onGoBack } = this.props;

    return (
      <SafeAreaView style={styles.wrapper}>
        <ScreenHeader
          navigation={navigation}
          onGoBack={onGoBack}
          pageTitle="Comments"
          style={styles.headerstyle}
        />
        <Comment
          navigation={navigation}
          onGoProfile={this.props.onGoProfile}
          onBackProfile={this.props.onBackProfile}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  headerstyle: {
    paddingLeft: METRICS.spaceNormal,
    paddingRight: METRICS.spaceNormal,
    marginHorizontal: METRICS.spaceNormal,
  },
  wrapper: {
    backgroundColor: COLORS.blackColor,
    width: METRICS.screenWidth,
    height: METRICS.screenHeight,
  },
  container: {
    backgroundColor: COLORS.blackColor,
    paddingTop: METRICS.spacingNormal,
  },
  list: {
    paddingVertical: METRICS.spacingSmall,
    paddingHorizontal: METRICS.spacingTiny,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
  },
});

export default withNavigation(CommentsScreen);
