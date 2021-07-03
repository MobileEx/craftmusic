import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import _ from 'lodash';
import CustomIcon from '../CustomIcon';
import { social_share } from '../../global/Seeds';
import { METRICS, COLORS } from '../../global';

class SocialShareTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hideStatus: false,
      privateStatus: false,
    };
  }

  onSocialShare = (index) => {
    switch (index) {
      case 0:
        this.props.addCraftlist();
        break;
      case 1:
        // Copy link
        this.props.onClickCopy();
        break;
      case 2:
        // More click
        this.props.onClickMore();
        break;
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Share</Text>
        <View style={styles.wrapper}>
          {_.map(social_share, (item, index) => {
            return (
              <TouchableOpacity
                style={styles.row}
                onPress={() => this.onSocialShare(index)}
                key={index}
              >
                <FastImage source={item.image} style={styles.image} />
                <Text style={styles.name}>{item.text}</Text>
                <CustomIcon name="right" style={styles.icon} />
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    color: COLORS.primaryColor,
    fontFamily: 'lato-bold',
    fontSize: METRICS.fontSizeMedium,
    textAlign: 'center',
    marginBottom: METRICS.spacingHuge,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: METRICS.spacingGiant,
  },
  image: {
    width: 26 * METRICS.ratioX,
    height: 26 * METRICS.ratioX,
    marginHorizontal: METRICS.spacingBig,
  },
  name: {
    color: COLORS.whiteColor,
    fontSize: METRICS.fontSizelarge,
    flex: 1,
    fontFamily: 'lato',
  },
  icon: {
    color: COLORS.whiteColor,
    fontSize: METRICS.fontSizelarge,
    paddingHorizontal: METRICS.spacingBig,
  },
});

export default SocialShareTab;
