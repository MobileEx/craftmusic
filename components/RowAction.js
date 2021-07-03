import React from 'react';
import { View, StyleSheet, TouchableHighlight } from 'react-native';
import PropTypes from 'prop-types';
import { METRICS } from '../global';

class FollowsItem extends React.Component {
  // export default ({ item, message, children, status, onFollow, index }) => {
  constructor(props) {
    super(props);
    this.state = {
      status: null,
    };
  }

  componentDidMount() {}

  actionHandler = () => {
    const { callback, item } = this.props;
    if (callback) callback(item);
  };

  render() {
    const { display, action } = this.props;
    return (
      <View style={styles.item}>
        {display}
        <TouchableHighlight onPress={this.actionHandler}>
          <View>{action}</View>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    marginLeft: METRICS.marginNormal,
    marginRight: METRICS.marginNormal,
    alignItems: 'center',
    paddingVertical: METRICS.followspacing,
    justifyContent: 'space-between',
  },
});

FollowsItem.propTypes = {
  onClose: PropTypes.func,
  status: PropTypes.bool,
  onCloseRequest: PropTypes.func,
};

FollowsItem.defaultProps = {
  onClose: () => {},
  status: false,
  onCloseRequest: () => {},
};

export default FollowsItem;
