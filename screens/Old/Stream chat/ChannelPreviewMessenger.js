import React, { PureComponent } from 'react';
import truncate from 'lodash/truncate';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import { METRICS } from '../global';

// import Avatar from './Avatar';

const Container = styled.TouchableOpacity`
  display: flex;
  flex-direction: row;
  padding: 10px;
`;
const Date = styled.Text`
  color: #767676;
  font-size: 11;
  text-align: right;
`;
const Message = styled.Text`
  font-size: 13;
`;

const Details = styled.View`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding-left: 10px;
`;

const DetailsTop = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const Title = styled.Text`
  font-weight: bold;
  font-size: 14;
  flex: 1;
`;

class ChannelPreviewMessenger extends PureComponent {
  channelPreviewButton = React.createRef();

  static themePath = 'channelPreview';

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
    // console.log('pressing select channel');
    this.props.setActiveChannel(this.props.channel);
  };

  componentDidMount() {
    // console.log('ChannelPreviewMessenger is mounted');
  }

  renderAvatar = (otherMembers) => {
    const { channel } = this.props;
    if (channel.data.image) return <Avatar image={channel.data.image} size={METRICS.avatarsmall} />;

    if (otherMembers.length === 1)
      return <Avatar image={otherMembers[0].user.image} size={METRICS.avatarsmall} />;

    return <Avatar size={METRICS.avatarsmall} />;
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
        {/* {this.renderAvatar(otherMembers)} */}
        <Details>
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
              fontSize: METRICS.fontSizeNormal,
              fontFamily: 'lato',
              fontWeight: this.props.unread > 0 ? 'bold' : 'normal',
            }}
          >
            {!this.props.latestMessage
              ? 'Nothing yet...'
              : truncate(this.props.latestMessage.text.replace(/\n/g, ''), 14)}
          </Message>
        </Details>
      </Container>
    );
  }
}

export default ChannelPreviewMessenger;
