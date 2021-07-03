import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, Image } from 'react-native';
import styled from 'styled-components/native';
import truncate from 'lodash/truncate';
import Button from './Button';
import { METRICS, COLORS } from '../global';
import { storeImg } from '../global/Images';

const Container = styled.TouchableHighlight``;
const Details = styled.View``;
const DetailsTop = styled.View`
  color: white;
`;
const Title = styled.Text`
  color: white;
`;

class SwipeItem extends React.PureComponent {
  static propTypes = {
    /** @see See [Chat Context](https://getstream.github.io/stream-chat-react-native/#chatcontext) */
    setActiveChannel: PropTypes.func,
    /** @see See [Chat Context](https://getstream.github.io/stream-chat-react-native/#chatcontext) */
    channel: PropTypes.object,
    /** Latest message (object) on channel */
    latestMessage: PropTypes.object,
    /** Number of unread messages on channel */
    unread: PropTypes.number,
  };

  onSelectChannel = () => {
    this.props.setActiveChannel(this.props.channel);
  };

  renderAvatar = (otherMembers) => {
    const { channel } = this.props;

    if (channel) {
      if (channel.data.image) {
        return <Image source={{ uri: channel.data.image }} style={styles.img} />;
      }
      return <Image source={storeImg} style={styles.img} />;

      // return <Avatar image={channel.data.image} size={40} />;
    }

    if (otherMembers.length === 1) {
      return <Image source={{ uri: otherMembers[0].user.image }} style={styles.img} />;
    }
    return <Image source={require('../assets/images/user.png')} style={styles.img} />;

    // return <Avatar image={otherMembers[0].user.image} size={40} />;

    // return <Image source={channel.data.image} style={styles.img} />;
    // return <Avatar size={40} />;
  };

  render() {
    const { channel } = this.props;
    let { name } = channel.data;
    let otherMembers = [];
    if (!name) {
      const members = Object.values(channel.state.members);
      otherMembers = members.filter((member) => member.user.id !== this.props.client.userID);
      name = otherMembers
        .map((member) => member.user.name || member.user.id || 'Unnamed User')
        .join(', ');
    }

    return (
      <Container onPress={this.onSelectChannel}>
        <View style={styles.item}>
          {/* <Details>
            <DetailsTop>
              <Title ellipsizeMode="tail" numberOfLines={1}>
                {name}
              </Title>
              <Date>{this.props.latestMessage.created_at}</Date> 
            </DetailsTop>
             <Message
            unread={this.props.unread > 0}
            style={{
              color: this.props.unread > 0 ? 'black' : '#767676',
              fontSize: 13,
              fontWeight: this.props.unread > 0 ? 'bold' : 'normal',
            }}
          >
            {!this.props.latestMessage
              ? 'Nothing yet...'
              : truncate(this.props.latestMessage.text.replace(/\n/g, ' '), 14)}
          </Message> 
          </Details> */}
          {/* <Text style={{ color: 'white' }}>Must test lol</Text> */}
          {this.renderAvatar(otherMembers)}
          {/* <Image source={this.props.item.avatar} style={styles.img} /> */}
          <View style={styles.contentWrapper}>
            <Text style={styles.nameLabel}>{name}</Text>
            <Text style={styles.content}>
              {!this.props.latestMessage
                ? 'Nothing yet...'
                : truncate(this.props.latestMessage.text.replace(/\n/g, ' '), 14)}
            </Text>
          </View>

          {this.props.children || (
            <Button
              style={styles.button}
              title="Following"
              fontSize={METRICS.fontSizeNormal}
              status={1}
            />
          )}
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    height: 60,
    paddingLeft: METRICS.marginNormal,
    paddingRight: METRICS.marginNormal,
    alignItems: 'center',
    backgroundColor: COLORS.blackColor,
  },
  nameLabel: {
    fontSize: METRICS.fontSizeNormal,
    marginLeft: METRICS.marginNormal,
    color: COLORS.whiteColor,
  },
  img: {
    height: 40,
    width: 40,
    borderRadius: 20,
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
  swipe: {
    backgroundColor: 'transparent',
  },
  button: {
    width: 120,
    height: 30,
    color: COLORS.whiteColor,
  },
});

SwipeItem.propTypes = {
  message: PropTypes.bool,
};

SwipeItem.defaultProps = {
  message: false,
};

export default SwipeItem;
