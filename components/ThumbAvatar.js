import React from 'react';
import { TouchableHighlight, StyleSheet, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { METRICS } from '../global';

class ThumbAvatar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { imageSource } = this.props;

    return (
      <View>
        <TouchableHighlight
          style={styles.container}
          onPress={this.props.onCraft}
          onLongPress={this.props.onLongPress}
          delayLongPress={500}
        >
          <FastImage source={imageSource} style={styles.cardImageStyle} />
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardImageStyle: {
    width: METRICS.avatarbig,
    height: METRICS.avatarbig,
    resizeMode: 'cover',
    borderRadius: METRICS.avatarbig,
  },
  closeButton: {
    position: 'absolute',
    top: 50 * METRICS.ratioX,
    right: 15 * METRICS.ratioX,
    zIndex: 101,
  },
});

export default ThumbAvatar;
