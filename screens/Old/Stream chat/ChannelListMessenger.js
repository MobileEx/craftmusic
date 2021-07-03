import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { SwipeListView } from 'react-native-swipe-list-view';
import _ from 'lodash';
import { ChannelPreview } from './ChannelPreview';
import ChannelPreviewMessenger from './ChannelPreviewMessenger';
import { COLORS, METRICS } from '../global/index';

import store from '../../../store/configureStore';

import { updateTitle, updatePrevState } from '../../store/actions';

// console.log('show the val of channel preview:', ChannelPreview);
// console.log('show the val of channel preview messenger!:', ChannelPreviewMessenger);

// import { withChatContext } from '../context/index';

// import { LoadingIndicator } from './LoadingIndicator';
// import { LoadingErrorIndicator } from './LoadingErrorIndicator';
// import { EmptyStateIndicator } from './EmptyStateIndicator';

/**
 * ChannelListMessenger - UI component for list of channels, allowing you to select the channel you want to open
 *
 * @example ./docs/ChannelListMessenger.md
 */
// const ChannelListMessenger = withChatContext(
class ChannelListMessenger extends React.Component {
  static propTypes = {
    /** Channels can be either an array of channels or a promise which resolves to an array of channels */
    channels: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.objectOf({
        then: PropTypes.func,
      }),
      PropTypes.object,
    ]).isRequired,
    /** UI Component to display individual channel item in list.
     * Defaults to [ChannelPreviewMessenger](https://getstream.github.io/stream-chat-react-native/#channelpreviewmessenger) */
    Preview: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
    /** The loading indicator to use. Default: [LoadingIndicator](https://getstream.github.io/stream-chat-react-native/#loadingindicator) */
    LoadingIndicator: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
    /** The indicator to use when there is error in fetching channels. Default: [LoadingErrorIndicator](https://getstream.github.io/stream-chat-react-native/#loadingerrorindicator) */
    LoadingErrorIndicator: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
    /** The indicator to use when channel list is empty. Default: [EmptyStateIndicator](https://getstream.github.io/stream-chat-react-native/#emptystateindicator) */
    EmptyStateIndicator: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
    /** Loads next page of channels in channels object, which is present here as prop */
    loadNextPage: PropTypes.func,
    /**
     * For flatlist
     * @see See loeadMoreThreshold [doc](https://facebook.github.io/react-native/docs/flatlist#onendreachedthreshold)
     * */
    loadMoreThreshold: PropTypes.number,
    /** If there is error in querying channels */
    error: PropTypes.bool,
    /** If channels are being queries. LoadingIndicator will be displayed if true */
    loadingChannels: PropTypes.bool,
  };

  static defaultProps = {
    Preview: ChannelPreviewMessenger,
    // LoadingIndicator,
    // LoadingErrorIndicator,
    // EmptyStateIndicator,
    // https://github.com/facebook/react-native/blob/a7a7970e543959e9db5281914d5f132beb01db8d/Libraries/Lists/VirtualizedList.js#L466
    loadMoreThreshold: 2,
  };

  state = store.getState();

  renderLoading = () => {
    const Indicator = this.props.LoadingIndicator;
    return <Indicator listType="channel" />;
  };

  renderLoadingError = () => {
    const Indicator = this.props.LoadingErrorIndicator;
    return <Indicator listType="channel" />;
  };

  renderEmptyState = () => {
    const Indicator = this.props.EmptyStateIndicator;
    return <Indicator listType="channel" />;
  };

  renderChannels = () => (
    <SwipeListView
      data={this.props.channels}
      onEndReached={this.props.loadNextPage}
      onEndReachedThreshold={this.props.loadMoreThreshold}
      ListEmptyComponent={this.renderEmptyState}
      renderItem={({ item: channel }) => (
        <ChannelPreview
          {...this.props}
          key={channel.cid}
          channel={channel}
          Preview={this.props.Preview}
        />
        // <SwipeItem {...this.props} />
        // <Text style={{ color: 'white' }}>wowdude</Text>
      )}
      renderHiddenItem={() => (
        <View style={styles.buttonWrapper}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              store.dispatch(updatePrevState(store.getState()));
              store.dispatch(updateTitle('DMinside'));
              this.props.navigation.navigate('DMinside');
            }}
          >
            <Text style={styles.textButton}>Archive</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.activeButton]}>
            <Text style={styles.textButton}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
      rightOpenValue={-250}
      leftOpenValue={0}
      keyExtractor={(item) => item.cid}
    />
  );

  render() {
    // console.log('THIS IS CHANNELIST MESSENGER show props', this.props);
    if (this.props.error) {
      return this.renderLoadingError();
    }
    if (this.props.loadingChannels) {
      return this.renderLoading();
    }
    return this.renderChannels();
  }
}
// );

export { ChannelListMessenger };

const styles = StyleSheet.create({
  backIcon: {
    color: COLORS.whiteColor,
    fontSize: METRICS.fontSizeBig,
  },
  backButton: {
    marginLeft: 20,
    marginRight: 20,
  },
  leftIcon: {
    color: COLORS.whiteColor,
    fontSize: METRICS.fontSizeHuge,
  },
  container: {
    backgroundColor: COLORS.blackColor,
    minHeight: '100%',
  },
  searchWrapper: {
    flexDirection: 'row',
    paddingRight: METRICS.marginNormal,
    marginTop: METRICS.spacingBig,
  },
  searchItem: {
    flex: 14,
  },
  searchIconWrapper: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  searchIcon: {
    color: COLORS.whiteColor,
    fontSize: METRICS.fontSizeHuge,
  },
  buttonWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  button: {
    borderColor: COLORS.whiteColor,
    borderWidth: 1,
    width: 108,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeButton: {
    backgroundColor: COLORS.primaryColor,
    borderColor: COLORS.primaryColor,
  },
  textButton: {
    color: COLORS.whiteColor,
    fontSize: METRICS.fontSizeBig,
  },
  list: {
    marginTop: METRICS.spacingNormal,
  },
  filterWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: METRICS.spacingNormal,
  },
  filterText: {
    color: COLORS.whiteColor,
    fontSize: METRICS.fontSizeMedium,
  },
  filterIcon: {
    color: COLORS.whiteColor,
    fontSize: METRICS.fontSizeBig,
    borderWidth: 1,
    borderColor: COLORS.whiteColor,
    width: 18,
    height: 18,
    borderRadius: 9,
  },
});
