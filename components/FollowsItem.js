import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import PropTypes from 'prop-types';
import { METRICS, COLORS, STYLES } from '../global';

class FollowsItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: null,
    };
  }

  componentDidMount() {
    this.setState({
      status: this.props.status,
    });
  }

  changeStatus = () => {
    this.setState({
      status: !this.state.status,
    });
    this.props.onFollow(this.props.index);
  };

  render() {
    const { item, message, index } = this.props;
    return (
      <View style={styles.item} key={index}>
        <View style={STYLES.horizontalAlign}>
          <FastImage source={item.avatar ? { uri: item.avatar } : null} style={styles.img} />
          <Text style={styles.nameLabel}>{item.username}</Text>
          {message && <Text style={styles.content}>{item.message}</Text>}
        </View>
        {(this.state.status ? this.state.status : this.props.status) ? (
          <TouchableOpacity
            style={{ ...styles.followingButton, ...STYLES.centerAlign }}
            onPress={this.changeStatus}
          >
            <Text style={styles.buttonText}>Following</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={{ ...styles.followButton, ...STYLES.centerAlign }}
            onPress={this.changeStatus}
          >
            <Text style={styles.buttonText}>Follow</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    height: 55 * METRICS.ratioX,
    marginLeft: METRICS.marginNormal,
    marginRight: METRICS.marginNormal,
    alignItems: 'center',
    paddingVertical: METRICS.followspacing,
    justifyContent: 'space-between',
  },
  nameLabel: {
    fontFamily: 'Lato-Semibold',
    fontSize: METRICS.fontSizeNormal,
    color: COLORS.whiteColor,
  },
  img: {
    height: METRICS.avatarsmall,
    width: METRICS.avatarsmall,
    borderRadius: 20 * METRICS.ratioX,
  },
  content: {
    fontSize: METRICS.fontSizeNormal,
    marginLeft: METRICS.marginNormal,
    marginTop: METRICS.spacingTiny,
    color: COLORS.nameDM,
  },
  contentWrapper: {
    flexDirection: 'column',
    flex: 1,
  },
  button: {
    width: METRICS.followbuttonwidth,
    height: METRICS.followbuttonheight,
    color: COLORS.whiteColor,
  },
  followingButton: {
    borderWidth: 1,
    borderColor: COLORS.primaryColor,
    backgroundColor: COLORS.blackColor,
    height: METRICS.followbuttonheight,
    borderRadius: 20 * METRICS.ratioX,
    width: METRICS.followbuttonwidth,
  },
  followButton: {
    backgroundColor: COLORS.primaryColor,
    height: METRICS.followbuttonheight,
    borderRadius: 20 * METRICS.ratioX,
    width: METRICS.followbuttonwidth,
  },
  buttonText: {
    fontFamily: 'lato-bold',
    fontSize: METRICS.fontSizeNormal,
    color: COLORS.whiteColor,
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
