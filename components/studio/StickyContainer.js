import React from 'react';
import { connect } from 'react-redux';
import { Animated, View } from 'react-native';

class StickyContainer extends React.Component {
  render() {
    const animate = {
      transform: [
        {
          translateX: this.props.scrollx,
        },
      ],
    };
    let styles = [];
    styles = styles.concat(this.props.style, animate);
    return (
      <Animated.View style={styles} pointerEvents="none">
        {this.props.children}
      </Animated.View>
    );
  }
}

function mapStateToProps(state) {
  const { dimensions } = state;
  return { width: dimensions.width };
}

export default connect(mapStateToProps)(StickyContainer);
