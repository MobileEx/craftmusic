import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  Easing,
  TouchableHighlight,
  SafeAreaView,
  Keyboard,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { useDispatch, useSelector } from 'react-redux';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CustomIcon from './CustomIcon';
import RowAction from './RowAction';
import DisplayUserRow from './DisplayUserRow';
import ProfileService from '../services/ProfileService';
import ModalWrapper2 from './ModalWrapper2';
import { COLORS, METRICS, STYLES } from '../global';
import { usergroup } from '../global/Images';
import UserSearch from './UserSearch';
import cropper from '../helpers/cropper';
import {
  createChatGroup,
  getAllChatGroups,
  updateChatGroup,
  leaveChatGroup,
  makeChatAdmin,
} from '../store/actions';
import ConfirmModal from './ConfirmModal';
import Env from '../helpers/environment';

const DMPopup = ({
  status,
  onClose,
  channel,
  edit,
  isAdmin,
  deleteChannel,
  navigation,
  filterGroup,
}) => {
  const user = useSelector((state) => state.user);
  const [groupName, changeGroupName] = React.useState(null);
  const [groupId, changeGroupId] = React.useState(null);
  const [chatMembers, changeChatMembers] = React.useState([]);
  const searchUserResult = useSelector((state) => state.searchUserResult);
  const [pendingAdd, changePendingAdd] = React.useState([]);
  const [pendingRemove, changePendingRemove] = React.useState([]);
  const [groupImage, setgroupImage] = useState(usergroup);
  const [groupIcon, setgroupIcon] = useState(null);
  const [groupNameError, setGroupNameError] = useState('');
  const [noMemberError, setNoMemberError] = useState('');
  const [aboveTwo, setAboveTwo] = useState(false);
  const [deleteModalStatus, toggleDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState('New Admin User');
  const [isTransferring, setIsTransferring] = useState(false);
  const [candidate, changeCandidate] = useState(null);

  const animatedHeight = new Animated.Value(0);
  const animatedSearchBoxHeight = new Animated.Value(298.66 * 2 * METRICS.ratioY);

  const dispatch = useDispatch();

  const animatedBox = async () => {
    await Animated.timing(animatedHeight, {
      toValue: 280.66 * METRICS.ratioY,
      easing: Easing.in,
      duration: 500,
    }).start();
  };

  const _animatedBox = async () => {
    await Animated.sequence([
      Animated.timing(animatedHeight, {
        toValue: (298.66 / 2) * METRICS.ratioY,
        easing: Easing.in,
        duration: 500,
      }).start(),
      Animated.timing(animatedHeight, {
        toValue: 0,
        easing: Easing.in,
        delay: 500,
        duration: 500,
      }).start(),
    ]);
  };

  const animatedSearchBox = async () => {
    await Animated.timing(animatedSearchBoxHeight, {
      toValue: 298.66 * METRICS.ratioY,
      easing: Easing.in,
      duration: 500,
    }).start();
  };

  const _animatedSearchBox = async () => {
    await Animated.sequence([
      Animated.timing(animatedSearchBoxHeight, {
        toValue: 298.66 * METRICS.ratioY,
        easing: Easing.in,
        duration: 500,
      }).start(),
      Animated.timing(animatedSearchBoxHeight, {
        toValue: 597 * METRICS.ratioY,
        easing: Easing.in,
        delay: 500,
        duration: 500,
      }).start(),
    ]);
  };

  const title =
    channel && isAdmin
      ? 'Edit Group'
      : channel && !isAdmin
      ? 'Group Info'
      : chatMembers.length > 1
      ? 'Create Group'
      : 'New Message';
  const animatedStyle = { height: animatedHeight };
  const animatedSearchStyle = { height: animatedSearchBoxHeight };

  React.useEffect(() => {
    if (edit) {
      return;
    }

    if (chatMembers.length > 2) {
      setAboveTwo(true);
    } else if (chatMembers.length === 2 && aboveTwo === false) {
      Keyboard.dismiss();
      animatedBox();
      animatedSearchBox();
    } else if (chatMembers.length < 2) {
      _animatedBox();
      _animatedSearchBox();
    }

    if (chatMembers.length) {
      setNoMemberError('');
    }
    if (chatMembers.length <= 2) {
      setAboveTwo(false);
    }
  }, [chatMembers]);
  React.useEffect(() => {
    // load channel data or reset all data for fresh form
    if (channel) {
      changeGroupName(channel.data.group_details.name);
      changeGroupId(channel.data.group_details.id);
      setgroupIcon(channel.data.group_details.image);
      const members = JSON.parse(channel.data.group_details.users);
      changeChatMembers(members);
    } else {
      changeGroupName(null);
      changeChatMembers([]);
    }
    // if model open or closes, clear pending changes, if channel changes clear pending changes
    changePendingAdd([]);
    changePendingRemove([]);
  }, [channel, status]);

  const createChannel = async () => {
    // validate user input fields / required
    if (!groupName && chatMembers.length > 1) {
      await setGroupNameError('A group name must be provided.');
      showMessage({
        message: groupNameError !== '' ? groupNameError : 'A group name must be provided.',
        type: 'default',
      });
      if (!chatMembers.length) {
        await setNoMemberError('Please Search and Select User to  Chat');
        showMessage({
          message: noMemberError !== '' ? noMemberError : 'Please Search and Select User to  Chat',
          type: 'default',
        });
        return;
      }
      return;
    }

    if (!chatMembers.length) {
      await setNoMemberError('Please Search and Select User to  Chat');
      showMessage({
        message: noMemberError !== '' ? noMemberError : 'Please Search and Select User to  Chat',
        type: 'default',
      });
      return;
    }

    // Create Channel
    const userList = chatMembers.length
      ? [
          {
            member: false,
            username: user.username,
            avatar: user.avatar,
            key: user.id,
          },
          ...chatMembers,
        ]
      : [
          {
            member: false,
            username: user.username,
            avatar: user.avatar,
            key: user.id,
          },
        ];

    const usersid = chatMembers.length
      ? [user.id, ...chatMembers.map((chatMember) => chatMember.key)]
      : [user.id];
    const isPersonal = chatMembers.length === 1;
    const biIds = isPersonal ? [...chatMembers.map((chatMember) => chatMember.key), user.id] : null;

    const newChannel = {
      name: groupName,
      user_list: userList,
      usersid,
      image: groupIcon,
      isPersonal,
      bi_ids: biIds,
    };
    if (!newChannel.name && newChannel.isPersonal) {
      const res = await dispatch(createChatGroup(newChannel));

      const modifier = res.group_details ? res : { group_details: { ...res } };
      const userId = [...chatMembers.map((chatMember) => chatMember.key)][0];
      const channelData = {
        userId,
        chatUser: { ...user },
        channel: { data: { ...modifier } },
        chatId: modifier.group_details.id,
        user: {
          ...user,
        },
      };
      navigation.navigate('Channel', channelData);
      await dispatch(getAllChatGroups());
      filterGroup();
      onClose();
      setgroupImage(usergroup);
      setgroupIcon(null);
    } else if (newChannel.name && !newChannel.isPersonal) {
      const res = await dispatch(createChatGroup(newChannel));
      await dispatch(getAllChatGroups());
      onClose();
      setgroupImage(usergroup);
      setgroupIcon(null);
    }
  };

  const editChannel = async () => {
    const editedChannel = {
      group_id: groupId,
      name: groupName,
      user_list: chatMembers.length
        ? [...chatMembers]
        : [
            {
              member: false,
              username: user.username,
              key: user.id,
              avatar: user.avatar,
            },
          ],
      usersid: chatMembers.length
        ? [...chatMembers.map((chatMember) => chatMember.key)]
        : [user.id],
      image: groupIcon,
      isPersonal: false,
    };

    await dispatch(updateChatGroup(editedChannel));
    const res = await dispatch(getAllChatGroups());
    filterGroup(res.groups);

    onClose();
    setgroupImage(usergroup);
    setgroupIcon(null);

    // add & remove members
    if (pendingRemove.length > 0) {
      await channel.removeMembers(pendingRemove);
    }
    if (pendingAdd.length > 0) {
      await channel.addMembers(pendingAdd);
    }

    // clear pending
    changePendingRemove([]);
    changePendingAdd([]);
  };

  const leaveChannel = async () => {
    const editedChannel = {
      group_id: groupId,
      user_list: chatMembers.filter((member) => member.key !== user.id),
    };
    const res = await dispatch(leaveChatGroup(editedChannel));
    await dispatch(getAllChatGroups());
    toggleDeleteModal(false);
    onClose();
    setgroupImage(usergroup);
    setgroupIcon(null);
    return Promise.resolve(res);
  };

  const makeAdmin = async ({ group_id, new_admin_id }) => {
    const data = {
      group_id,
      new_admin_id,
    };
    const res = await dispatch(makeChatAdmin(data));
    await dispatch(getAllChatGroups());
    toggleDeleteModal(false);
    onClose();
    setgroupImage(usergroup);
    setgroupIcon(null);
    return Promise.resolve(res);
  };

  const changeGroupImage = async () => {
    cropper('square').then((image) => {
      console.log('image', image);
      ProfileService.uploadImage(image.path, image.filename, image.mime)
        .then((res) => {
          console.log('res', res);
          setgroupIcon(`${Env.S3URL}${res.url}`);
        })
        .catch((err) => {
          console.log(err.response.data.error);
        });
    });
  };

  const submitChannelForm = () => {
    if (channel) {
      editChannel();
    } else {
      createChannel();
    }
  };

  const formatResults = () => {
    const currentMembers = chatMembers;
    const mappedUserResults = [];
    const currentMembersFormatted = [];

    for (const currentMember of currentMembers) {
      const currentMemberKey = currentMember.key;

      const payload = {
        member: true,
        username: currentMember.username,
        key: currentMemberKey,
        avatar: currentMember.avatar,
      };
      currentMembersFormatted.push(payload);
    }
    for (const userResult of searchUserResult) {
      const payload = {
        member: false,
        username: userResult.username,
        key: userResult.id,
        avatar: userResult.avatar,
      };

      if (currentMembers.map((m) => m.key).includes(userResult.id)) {
        continue;
      }
      mappedUserResults.push(payload);
    }

    // add current chat members to top
    return [
      ...currentMembersFormatted.filter((member) => member.key !== user.id),
      ...mappedUserResults.filter((member) => member.key !== user.id),
    ];
  };

  const formatCandidates = () => {
    const currentMembers = chatMembers;
    const mappedUserResults = [];
    const currentMembersFormatted = [];

    for (const currentMember of currentMembers) {
      const currentMemberKey = currentMember.key;
      const payload = {
        member: true,
        username: currentMember.username,
        key: currentMemberKey,
        avatar: currentMember.avatar,
      };
      currentMembersFormatted.push(payload);
    }
    return [...currentMembersFormatted.filter((member) => member.key !== user.id)];
  };

  const rowActionHandler = (item) => {
    changePendingAdd(
      pendingAdd.filter((usr) => {
        return usr.id !== item.id;
      })
    );
    changePendingRemove(
      pendingRemove.filter((usr) => {
        return usr.id !== item.id;
      })
    );

    let members = [];
    if (item.member) {
      members = chatMembers.filter((cMember) => {
        return cMember.key !== item.key;
      });
      changePendingRemove([item, ...pendingRemove]);
    } else {
      members = [...chatMembers];
      members.push(item);
      changePendingAdd([item, ...pendingAdd]);
    }
    changeChatMembers(members);
  };

  const candidateActionHandler = (item) => {
    // if already selected then remove
    if (candidate && candidate.key === item.key) {
      changeCandidate(null);
    }
    changeCandidate(item);
    setSelectedUser(item.username);
    toggleDeleteModal(true);
  };

  const renderItem = ({ item }) => {
    let iconColor = COLORS.primaryColor;
    let iconName;
    if (item.member) {
      if (isTransferring) {
        iconName = candidate && candidate.key === item.key ? 'cancel-button' : 'plus1';
      } else {
        iconName = 'check-sign';
      }
    } else {
      iconName = isTransferring && candidate === item ? 'cancel-button' : 'empty';
      iconColor = COLORS.greygreyColor;
    }

    return (
      <RowAction
        item={item}
        display={<DisplayUserRow user={item} />}
        callback={isTransferring ? candidateActionHandler : rowActionHandler}
        action={
          isAdmin || !channel ? (
            <CustomIcon name={iconName} size={METRICS.fontSizeHuge} color={iconColor} />
          ) : null
        }
      />
    );
  };

  return (
    <SafeAreaView>
      <ModalWrapper2 title={title} status={status} onClose={() => onClose(false)}>
        {isAdmin && (
          <View style={{ marginBottom: METRICS.spacingNormal }}>
            <TouchableOpacity
              style={{ ...styles.blueButton, ...STYLES.centerAlign }}
              onPress={submitChannelForm}
            >
              <Text style={styles.buttonText}>
                {channel ? 'Update Group' : chatMembers.length > 1 ? 'Create Group' : 'Chat'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {!channel && !isAdmin && chatMembers.length ? (
          <View style={{ marginBottom: METRICS.spacingNormal }}>
            <TouchableOpacity
              style={{ ...styles.blueButton, ...STYLES.centerAlign }}
              onPress={submitChannelForm}
            >
              <Text style={styles.buttonText}>
                {!channel && !isAdmin ? (chatMembers.length > 1 ? 'Create Group' : 'Chat') : null}
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
          enableAutomaticScroll
          contentContainerStyle={{ flexGrow: 1 }}
        >
          {edit ? (
            <>
              <View>
                <View style={styles.row}>
                  <View style={styles.rightWrapper}>
                    <CustomIcon
                      name={isAdmin ? 'edit2' : 'info'}
                      style={isAdmin ? styles.pencil : styles.icon}
                    />
                  </View>
                  <View style={styles.leftWrapper}>
                    <Text style={styles.label}>Group Name</Text>
                    <View style={styles.inputWrapper}>
                      <TextInput
                        keyboardAppearance="dark"
                        maxLength={30}
                        selectionColor={COLORS.primaryColor}
                        style={styles.input}
                        placeholder="Group Name"
                        placeholderTextColor={COLORS.inActive}
                        value={groupName}
                        onChangeText={(text) => changeGroupName(text)}
                        onFocus={() => setGroupNameError('')}
                        editable={!!isAdmin}
                      />
                    </View>
                  </View>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <View style={styles.rightWrapper}>
                    <CustomIcon
                      name={isAdmin ? 'edit2' : 'info'}
                      style={isAdmin ? styles.pencil : styles.icon}
                    />
                  </View>
                  <Text style={styles.label}>Group Image</Text>
                </View>
                <View style={[styles.row, styles.groupImageWrapper]}>
                  {isAdmin ? (
                    <TouchableOpacity onPress={changeGroupImage}>
                      <FastImage source={{ uri: groupIcon }} style={styles.groupImage} />
                    </TouchableOpacity>
                  ) : (
                    <View>
                      <FastImage source={{ uri: groupIcon }} style={styles.groupImage} />
                    </View>
                  )}
                </View>
                {channel && (
                  <>
                    <View style={[styles.row, styles.rowCenter]}>
                      <View style={styles.rightWrapper}>
                        <CustomIcon
                          name={isTransferring ? 'search' : 'remove-user'}
                          style={styles.icon}
                        />
                      </View>
                      <TouchableOpacity
                        onPress={() => {
                          isAdmin ? setIsTransferring(!isTransferring) : toggleDeleteModal(true);
                        }}
                      >
                        <View style={styles.leftWrapper}>
                          <Text style={styles.label}>
                            {isTransferring
                              ? 'Modify Group Users'
                              : isAdmin
                              ? 'Transfer Ownership'
                              : 'Leave Group'}
                          </Text>
                          <Text style={styles.description}>
                            {isTransferring
                              ? 'Tap to Search and Add/Remove Users'
                              : isAdmin
                              ? 'Tap to Transfer Ownership'
                              : 'Tap to leave the group'}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>

                    {isAdmin ? (
                      <View style={[styles.row, styles.rowCenter]}>
                        <View style={styles.rightWrapper}>
                          <CustomIcon name="delete1" style={styles.icon} />
                        </View>
                        <TouchableHighlight
                          style={styles.leftWrapper}
                          onPress={() => {
                            deleteChannel();
                            onClose();
                            setgroupImage(usergroup);
                            setgroupIcon(null);
                          }}
                        >
                          <View>
                            <Text style={styles.label}>Delete Group</Text>
                            <Text style={styles.description}>Tap to delete the group</Text>
                          </View>
                        </TouchableHighlight>
                      </View>
                    ) : null}
                  </>
                )}
                <View style={{ flexDirection: 'row' }}>
                  <View style={styles.rightWrapper}>
                    <CustomIcon name="friend" style={styles.icon} />
                  </View>
                  <View style={styles.leftWrapper}>
                    <Text style={styles.label}>Group Members - {chatMembers.length}</Text>
                  </View>
                </View>
              </View>
              <View>
                <View style={styles.userSearchWrap}>
                  <View>
                    <UserSearch
                      formatResults={isTransferring ? formatCandidates : formatResults}
                      renderItem={renderItem}
                      noMemberError={noMemberError}
                      setNoMemberError={setNoMemberError}
                      showInput={!!isAdmin}
                      onFocused={() => {
                        _animatedBox();
                        _animatedSearchBox();
                      }}
                      onBlured={() => {
                        if (chatMembers.length > 1) {
                          animatedBox();
                          animatedSearchBox();
                        }
                      }}
                    />
                  </View>
                </View>
              </View>
            </>
          ) : (
            <>
              <Animated.View style={animatedStyle}>
                <View style={styles.row}>
                  <View style={styles.rightWrapper}>
                    <CustomIcon name="edit2" style={styles.icon} />
                  </View>
                  <View style={styles.leftWrapper}>
                    <Text style={styles.label}>Group Name</Text>
                    <View style={styles.inputWrapper}>
                      <TextInput
                        keyboardAppearance="dark"
                        maxLength={30}
                        selectionColor={COLORS.primaryColor}
                        style={styles.input}
                        placeholder="Group Name"
                        placeholderTextColor={COLORS.inActive}
                        value={groupName}
                        onChangeText={(text) => changeGroupName(text)}
                        onFocus={() => setGroupNameError('')}
                      />
                    </View>
                  </View>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <View style={styles.rightWrapper}>
                    <TouchableOpacity onPress={changeGroupImage}>
                      <CustomIcon name="edit2" style={styles.icon} />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.label}>Group Image</Text>
                </View>
                <View style={[styles.row, styles.groupImageWrapper]}>
                  <TouchableOpacity onPress={changeGroupImage}>
                    <FastImage source={groupImage} style={styles.groupImage} />
                  </TouchableOpacity>
                </View>
                {/* {channel && (
          <>
            <View style={[styles.row, styles.rowCenter]}>
              <View style={styles.rightWrapper}>
                <CustomIcon name="delete1" style={styles.icon} />
              </View>
              <TouchableHighlight
                style={styles.leftWrapper}
                onPress={() => {
                  channel.delete();
                onClose();   setgroupImage(usergroup); setgroupIcon(null); 
                }}
              >
                <View>
                  <Text style={styles.label}>Delete Group</Text>
                  <Text style={styles.description}>Tap to delete the group</Text>
                </View>
              </TouchableHighlight>
            </View>
              </>
              )} */}
                <View style={{ flexDirection: 'row' }}>
                  <View style={styles.rightWrapper}>
                    <CustomIcon name="friend" style={styles.icon} />
                  </View>
                  <View style={styles.leftWrapper}>
                    <Text style={styles.label}>Group Members - {chatMembers.length}</Text>
                  </View>
                </View>
              </Animated.View>
              <Animated.View style={animatedSearchStyle}>
                <View style={styles.userSearchWrap}>
                  <Animated.View style={animatedSearchStyle}>
                    <UserSearch
                      formatResults={formatResults}
                      renderItem={renderItem}
                      noMemberError={noMemberError}
                      setNoMemberError={setNoMemberError}
                      showInput={!isAdmin && !channel}
                      onFocused={() => {
                        _animatedBox();
                        _animatedSearchBox();
                      }}
                      onBlured={() => {
                        if (chatMembers.length > 1) {
                          animatedBox();
                          animatedSearchBox();
                        }
                      }}
                    />
                  </Animated.View>
                </View>
              </Animated.View>
            </>
          )}
        </KeyboardAwareScrollView>
        <FlashMessage titleStyle={styles.flashStyle} />
        <ConfirmModal
          visible={deleteModalStatus}
          onCloseRequest={() => toggleDeleteModal(false)}
          onCancel={() => toggleDeleteModal(false)}
          onConfirm={() => {
            isAdmin
              ? makeAdmin({
                  group_id: groupId,
                  new_admin_id: candidate.key,
                }).then((res) => {
                  console.log('res', res);
                  if (res) {
                    navigation.navigate('DM');
                  }
                })
              : leaveChannel().then((res) => {
                  if (res.status) navigation.navigate('DM');
                });
          }}
          title={isAdmin ? 'Transfer Ownership' : 'Leave Group'}
          message={
            isAdmin
              ? `Do you want to transfer ownership to ${selectedUser} ?`
              : 'Do you want to leave this group?'
          }
        />
      </ModalWrapper2>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  flashStyle: {
    fontFamily: 'lato',
    fontSize: METRICS.fontSizeNormal,
  },
  userSearchWrap: {
    maxHeight: METRICS.userSearchModalHeight,
  },
  blueButton: {
    backgroundColor: COLORS.primaryColor,
    height: METRICS.sendbuttonheight,
    borderRadius: 20 * METRICS.ratioX,
    width: 1.2 * METRICS.followbuttonwidth,
    alignSelf: 'center',
  },
  buttonText: {
    fontFamily: 'lato-bold',
    fontSize: METRICS.fontSizeNormal,
    color: COLORS.whiteColor,
  },
  row: {
    flexDirection: 'row',
    marginBottom: METRICS.spacingBig,
  },
  pencil: {
    color: COLORS.whiteColor,
    fontSize: METRICS.fontSizeBig,
  },
  icon: {
    color: COLORS.whiteColor,
    fontSize: METRICS.fontSizeBigger,
  },
  label: {
    color: COLORS.whiteColor,
    fontSize: METRICS.fontSizeBig,
    fontFamily: 'lato',
  },
  inputWrapper: {
    borderWidth: 1 * METRICS.ratioX,
    borderColor: COLORS.darkbtnGrey,
    marginTop: METRICS.spacingSmall,
    width: '100%',
    paddingTop: METRICS.spacingSmall,
    paddingBottom: METRICS.spacingSmall,
    paddingLeft: METRICS.spacingNormal,
    paddingRight: METRICS.spacingNormal,
    position: 'relative',
  },
  input: {
    color: COLORS.whiteColor,
    fontSize: METRICS.fontSizeNormal,
    fontFamily: 'lato',
    width: '100%',
  },
  rightWrapper: {
    width: 45 * METRICS.ratioX,
  },
  leftWrapper: {
    flex: 1,
  },
  groupImageWrapper: {
    marginTop: METRICS.spacingBig,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  groupImage: {
    width: METRICS.avatarbig,
    height: METRICS.avatarbig,
    borderRadius: METRICS.avatarbig,
  },
  description: {
    fontSize: METRICS.fontSizeLight,
    fontFamily: 'lato',
    color: COLORS.nameDM,
    paddingTop: METRICS.spacingTiny,
  },
  rowCenter: {
    alignItems: 'center',
  },
  addIcon: {
    fontSize: METRICS.fontSizeHuge,
    color: COLORS.whiteColor,
  },
  leftWrapperBetween: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
});

DMPopup.propTypes = {
  status: PropTypes.bool,
  onClose: PropTypes.func,
};

DMPopup.defaultProps = {
  status: false,
  onClose: () => {},
};

export default DMPopup;
