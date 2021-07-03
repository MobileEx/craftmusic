import React, { useContext } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { NavigationContext, NavigationActions } from 'react-navigation';
import moment from 'moment';
import {
  updateCollaborationRequest,
  cancelCollaborationRequest,
  updateNotification,
  updateCraftPlaying,
  setPlayingCrafts,
  updateTitle,
  updateCurCraftId,
  updatePrevState,
  updateOpenComments,
  updateIsPlaying,
} from '../store/actions';
import PlayingCraftService from '../services/PlayingCraftService';
import ActionsItem from './ActionsItem';
import environment from '../helpers/environment';
import store from '../store/configureStore';

// class RenderNotification extends React.Component {
const RenderNotification = ({ notification }) => {
  const navigation = useContext(NavigationContext);
  const dispatch = useDispatch();
  const { notifiable, sender = {}, recipient = {} } = notification;
  const type = notification.type || notification.notification_type;
  let actionRenderType = 'button';
  let message;
  let callback;
  let status = true;
  let onPress;
  const user = useSelector((state) => state.user);
  const timeAgo = moment(moment.utc(notification.created_at).local()).fromNow();
  let image;
  let followingStatus;
  if (notification.objectData) {
    followingStatus = notification.objectData.followingStatus === 1;
    image =
      type !== 'followUser'
        ? notification.objectData.thumbnail_url || notification.objectData.image
        : null;
  }
  const data = {
    sender,
    recipient,
    notification,
    timeAgo,
    navigation,
    dispatch,
    image,
    followingStatus,
  };
  switch (type) {
    case 'craftLike':
      actionRenderType = 'craft';
      onPress = () => {
        PlayingCraftService.getCraft(notification.object_id)
          .then((res) => {
            console.log(notification.object_id);
            dispatch(setPlayingCrafts([res.data]));
            dispatch(updateCurCraftId(0));
            dispatch(updatePrevState(store.getState()));
            dispatch(updateIsPlaying(true));
            dispatch(updateCraftPlaying(true));
          })
          .catch((err) => {
            console.log('getCraft error', err.response.data.error);
          });
      };
      return DisplayPushNotification(data, actionRenderType, onPress);
    case 'craftComment':
    case 'commentLike':
    case 'commentReply':
      actionRenderType = 'comment';
      onPress = () => {
        PlayingCraftService.getCraft(notification.object_id)
          .then((res) => {
            dispatch(setPlayingCrafts([res.data]));
            dispatch(updateCurCraftId(0));
            dispatch(updatePrevState(store.getState()));
            dispatch(updateIsPlaying(true));
            dispatch(updateCraftPlaying(true));
            dispatch(updateOpenComments(true));

            // this.updateTitle('PlayingCraft')
            //
            // const navigationAction = NavigationActions.navigate({
            //   routeName: 'PlayingCraft',
            //   action: NavigationActions.navigate({
            //     routeName: 'PlayingCraft',
            //     params: { tab: 2 },
            //   }),
            // });
            // navigation.dispatch(navigationAction);
          })
          .catch((err) => {
            console.log('getCraft error', err.response.data.error);
          });
      };
      return DisplayPushNotification(data, actionRenderType, onPress, () => {});
    case 'addCraftToList':
    case 'followCraftList':
      actionRenderType = 'craftList';
      return DisplayPushNotification(
        data,
        actionRenderType,
        () => {},
        () => {}
      );
    case 'followUser':
      actionRenderType = 'button';
      return DisplayPushNotification(
        data,
        actionRenderType,
        () => {},
        () => {}
      );
    case 'addCraftToPurchase':
      actionRenderType = 'craft';
      return DisplayPushNotification(
        data,
        actionRenderType,
        () => {},
        () => {}
      );
    case 'PayTip':
      actionRenderType = 'message';
      return DisplayPushNotification(
        data,
        actionRenderType,
        () => {},
        () => {}
      );
  }

  if (notifiable) {
    switch (type) {
      case 'App\\Notifications\\CollaborationRequested':
        actionRenderType = 'confirmation';
        message = `${notifiable.sender.username} invited you to collaborate on #${notifiable.studio_id}. `;
        username = notifiable.sender.username;
        avatar =
          notifiable.recipient.avatar?.search('http') >= 0
            ? notifiable.recipient.avatar
            : environment.S3URL + notifiable.recipient.avatar;
        if (user.id === notifiable.sender.id) {
          actionRenderType = 'cancel';
          message = `You invited ${notifiable.recipient.username} to collaborate on #${notifiable.studio_id}. `;
          username = null;
        } else {
          avatar =
            notifiable.recipient.avatar?.search('http') >= 0
              ? notifiable.recipient.avatar
              : environment.S3URL + notifiable.recipient.avatar;
        }
        status = !(notifiable.status === 'requested');
        if (notifiable.status === 'accepted') {
          actionRenderType = 'navigation';
          onPress = () => {
            // go to studio
            // console.log('accepted collab request Onpress');
            const navigationAction = NavigationActions.navigate({
              routeName: 'Studio',
              action: NavigationActions.navigate({
                routeName: 'Studio',
                params: { id: notifiable.studio_id, craftId: notifiable.craft_id },
              }),
            });
            navigation.dispatch(navigationAction);
          };
        } else if (notifiable.status === 'sender_cancel') {
          actionRenderType = 'message';
          if (user.id === notifiable.sender.id) {
            message = `Invitation to ${notifiable.recipient.username} `;
          } else {
            message += `Your invitation `;
          }
          message += `to collaborate on #${notifiable.studio_id} was canceled.`;
        } else if (notifiable.status === 'rejected') {
          actionRenderType = 'message';
          if (user.id === notifiable.sender.id) {
            message = `${notifiable.recipient.username} has rejected your invitation `;
          } else {
            message += `You have rejected the invitation `;
          }
          message += `to collaborate on #${notifiable.studio_id}`;
        }

        callback = (callbackAction) => {
          if (callbackAction === 'confirm') {
            // console.log('calling confirm callback');
            // dispatch collab confirmation action api request
            dispatch(
              updateCollaborationRequest(notification.notifiable.id, { status: 'accepted' })
            ).then(() => {
              // confirmation successful update notification
              const updateData = {
                notifiable: {
                  ...notification.notifiable,
                  status: 'accepted',
                },
              };
              dispatch(updateNotification(notification.id, updateData));
            });
          } else if (callbackAction === 'cancel') {
            let cancelType = 'rejected';
            if (user.id === notifiable.sender.id) {
              cancelType = 'sender_cancel';
              dispatch(
                cancelCollaborationRequest(notification.notifiable.id, { status: cancelType })
              );
            }
            dispatch(
              updateCollaborationRequest(notification.notifiable.id, { status: cancelType })
            ).then(() => {
              const updateData = {
                notifiable: {
                  ...notification.notifiable,
                  status: cancelType,
                },
              };
              dispatch(updateNotification(notification.id, updateData));
            });
          }
        };
        return (
          <ActionsItem
            type={actionRenderType}
            senderName={notifiable.sender.username}
            senderId={notifiable.sender.id}
            senderAvatar={notifiable.sender.avatar}
            receiverName={notifiable.recipient.username}
            receiverId={notifiable.recipient.id}
            recipientAvatar={notifiable.recipient.avatar}
            description={message}
            status={status}
            callback={callback}
            onPress={onPress}
            time={timeAgo}
            navigation={navigation}
            dispatch={dispatch}
            followingStatus={followingStatus}
          />
        );
      default:
        return null;
    }
  } else {
    return null;
  }
};

const DisplayPushNotification = (data = {}, actionRenderType = {}, onPress = {}, callback = {}) => {
  return (
    <ActionsItem
      type={actionRenderType}
      senderName={data.sender.username}
      senderId={data.sender.id}
      senderAvatar={data.sender.avatar}
      receiverName={data.recipient.username}
      receiverId={data.recipient.id}
      recipientAvatar={data.recipient.avatar}
      description={data.notification.message}
      status={data.notification.status === 1}
      time={data.timeAgo}
      navigation={data.navigation}
      dispatch={data.dispatch}
      image={data.image}
      followingStatus={data.followingStatus}
      onPress={onPress}
      callback={callback}
    />
  );
};

function mapDispatchToProps(dispatch) {
  return {
    setPlayingCrafts: (data) => dispatch(setPlayingCrafts(data)),
    updateCurCraftId: (data) => dispatch(updateCurCraftId(data)),
    updatePrevState: (data) => dispatch(updatePrevState(data)),
    updateCraftPlaying: (data) => dispatch(updateCraftPlaying(data)),
    updateOpenComments: (data) => dispatch(updateOpenComments(data)),
    updateTitle: (data) => dispatch(updateTitle(data)),
    updateIsPlaying: (data) => dispatch(updateIsPlaying(data)),
  };
}

function mapStateToProps(state) {
  return {
    craftPlaying: state.craftPlaying,
    prevState: state.prevState,
    playingCrafts: state.playingCrafts,
    profileUserId: state.profileUserId,
    backScreen: state.backScreen,
    editingCraftId: state.editingCraftId,
    title: state.title,
    curCraftId: state.curCraftId,
    openComments: state.openComments,
    miniPlay: state.miniPlay,
    deepAlert: state.deepAlert,
    craftlistId: state.craftlistId,
    backupCraft: state.backupCraft,
    seekOnBack: state.seekOnBack,
    currentTime: state.currentTime,
    followId: state.followId,
    storeState: state.storeState,
    addMusicMethod: state.addMusicMethod,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(RenderNotification);
