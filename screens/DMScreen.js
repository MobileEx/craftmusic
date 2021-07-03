import React from 'react';
import { View, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, Text } from 'react-native';
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';
import { connect } from 'react-redux';
import { Card } from 'react-native-elements';
import firebase from 'react-native-firebase';
import moment from 'moment';
import FastImage from 'react-native-fast-image';
import { DMHeader, CustomIcon, SearchItem, TimeLine, DMPopup } from '../components';
import { COLORS, METRICS, STYLES } from '../global';
import { getAllChatGroups, deleteChatGroup, updateTitle, updatePrevState } from '../store/actions';
import ProfileService from '../services/ProfileService';
import firebaseService from '../services/FirebaseService';
import abbr from '../utils/moment_abbr';
import store from '../store/configureStore';

class DMScreens extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentOpen: -1,
      modalStatus: false,
      editChannel: null,
      dataSource: [],
      onlineUsers: [],
      messages: [],
      groupsData: [],
      currentGroups: [],
      hiddenGroups: [],
      unread: [],
      unreadCount: [],
      searchedGroups: [],
      searchMode: false,
      matched: null,
      blockingList: [],
      blocksList: [],
      isLoading: true,
    };
    this.references = {};
  }

  async componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('didFocus', () => {});
    this.props.navigation.setParams({
      togglePopup: this.togglePopup,
    });
    this.props.getAllChatGroups().then((res) => {
      this.filterGroup(res);
    });
    this.on();
    abbr();
    await this.getOnlineUser();
    this.getDMCount();
    this.checkBlocklist();
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerStyle: {
        backgroundColor: COLORS.blackColor,
        paddingVertical: METRICS.spacingNormal,
        marginTop: METRICS.spacingSmall,
        borderBottomWidth: 0,
      },
      headerTitle: <DMHeader title="Direct Messages" />,
      headerLeft: (
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            navigation.goBack(null);
          }}
        >
          <CustomIcon name="back" style={styles.backIcon} />
        </TouchableOpacity>
      ),
      headerRight: (
        <TouchableOpacity style={styles.smsButton} onPress={navigation.getParam('togglePopup')}>
          <CustomIcon name="sms" style={styles.leftIcon} />
        </TouchableOpacity>
      ),
    };
  };

  componentWillUnmount() {
    this.unsubscribe.remove();
  }

  on = async () => {
    this.ref.once('value', () => {
      this.props.getAllChatGroups().then((res) => {
        this.filterGroup(res);
      });
    });
    this.ref.on('value', () => {
      this.props.getAllChatGroups().then((res) => {
        this.filterGroup(res);
      });
    });
    this.ref.on('child_changed', () => {
      this.props.getAllChatGroups().then((res) => {
        this.filterGroup(res);
      });
    });
  };

  filterGroup = async (res) => {
    const { groups = [] } = res;
    const Current = [];

    if (groups.length === 0) {
      this.setState({ isLoading: false });
    }
    groups.forEach((group) => {
      const groupId = group.group_details.id;
      const visibleRef = this.ref.child(`${groupId}/meta/visibleTo`);
      visibleRef.on('value', (snapshot) => {
        snapshot.forEach((snap) => {
          if (snap.val() === this.props.user.id) {
            Current.push(group);
          }
        });
        this.setState({
          isLoading: false,
          currentGroups: Current,
        });
      });
    });

    this.setState({
      dataSource: this.state.currentGroups,
    });
  };

  changeSearchText(text) {
    this.setState({ SearchText: text }, () => {
      if (!this.state.SearchText.trim().length) {
        this.setState({ dataSource: this.state.currentGroups, searchMode: false, matched: null });
      }

      if (this.state.SearchText.trim().length) {
        this.setState({ searchMode: true });
      }
      const Current = [];

      this.props.groups.forEach((group) => {
        const groupId = group.group_details.id;
        const visibleRef = this.ref.child(`${groupId}/meta/visibleTo`);
        const messagesRef = this.ref.child(`${groupId}/messages`);
        visibleRef.on('value', (vSnapshot) => {
          const vVal = vSnapshot.val();

          const isVisible = vVal && Array.isArray(vVal) && vVal.includes(this.props.user.id);
          // : Object.values(vVal).indexOf(this.props.user.id) > -1;
          if (isVisible) {
            messagesRef.on('value', (msgSnapShot) => {
              if (msgSnapShot.exists()) {
                msgSnapShot.forEach((msg) => {
                  msg.ref.child('text').on('value', (textSnapShot) => {
                    const messageText = textSnapShot.val();
                    if (messageText) {
                      if (messageText.trim().length && text.trim().length) {
                        const lowerText = messageText.toLowerCase();
                        const query = this.state.SearchText.trim().toLowerCase();
                        if (lowerText.search(query) > -1) {
                          group.matched = messageText;
                          Current.push(group);
                          this.setState((state) => {
                            state.searchedGroups = Current;
                            return state;
                          });
                        }
                      }
                    }
                  });
                });
              }
            });
          }
        });
      });

      const searchSet = new Set(this.state.searchedGroups);
      const uniqueSearches = Array.from(searchSet);
      return this.setState({
        dataSource: !this.state.SearchText.trim().length
          ? this.state.currentGroups
          : uniqueSearches,
      });
    });
  }

  getOnlineUser = async () => {
    const userRef = firebase.database().ref('online');

    await userRef.on('value', (snapshot) => {
      if (snapshot.val() === false) {
        return;
      }
      if (Array.isArray(snapshot.val())) {
        this.setState({ onlineUsers: snapshot.val() });
      } else {
        this.setState({ onlineUsers: [snapshot.val()] });
      }
    });
  };

  get ref() {
    return firebase.database().ref(`groups`);
  }

  togglePopup = () => {
    this.setState((state) => {
      const stateUpdate = { modalStatus: !state.modalStatus };
      if (state.modalStatus && state.editChannel) {
        stateUpdate.editChannel = null;
      }
      return stateUpdate;
    });
  };

  countUnread = () => {
    const currentUser = this.props.user;
    this.ref.on('value', (snapshot) => {
      snapshot.forEach((groupSnap) => {
        groupSnap.ref
          .orderByChild('status')
          .equalTo('unread')
          .on('value', (messageSnap) => {
            let messages = [];
            messageSnap.forEach((message) => {
              messages = [...messages, message.val()];
            });

            this.setState((state) => ({
              ...state,
              unread: [
                ...state.unread,
                {
                  key: groupSnap.key,
                  unreadCount: [...messages].filter((m) => m.senderId !== currentUser.id).length,
                  messages: [...messages].filter((m) => m.senderId !== currentUser.id),
                },
              ],
            }));
          });
      });
    });
  };

  getDMCount() {
    this.props.getAllChatGroups().then(() => {
      this.props.groups.forEach((group) => {
        const groupId = group.group_details.id;
        const messagesRef = this.ref.child(`${groupId}/messages`);
        const unreadsRef = this.ref.child(`${groupId}/meta/unreads`).ref;

        const unreadArray = [];
        unreadsRef.on('value', (urSnapshot) => {
          const count = urSnapshot.val();
          if (count) {
            // console.log('count', count);
          }
        });
        messagesRef.on('value', (snapshot) => {
          snapshot.forEach((message) => {
            (async () => {
              const readByRef = message.child('readBy').ref;
              const messageForRef = message.child('messageFor').ref;

              let readByVal = [];
              let messageForVal = [];

              readByVal = await readByRef.once('value', (rSnapShot) => rSnapShot.val());
              messageForVal = await messageForRef.once('value', (mfSnapShot) => mfSnapShot.val());

              if (messageForVal.val()) {
                if (
                  Array.isArray(messageForVal.val()) &&
                  messageForVal.val().includes(this.props.user.id)
                ) {
                  if (readByVal.val() && !readByVal.val().includes(this.props.user.id)) {
                    unreadArray.push(groupId);
                    this.setState((state) => {
                      state.unreadCount = unreadArray;
                      return state;
                    });
                    this.setState({
                      dmcount: this.state.dmcount + 1,
                    });
                    group.ur += 1;
                  }
                } else if (!Array.isArray(messageForVal.val())) {
                  if (Object.values(messageForVal.val()).indexOf(this.props.user.id) > -1) {
                    unreadArray.push(groupId);
                    group.ur += 1;
                    this.setState((state) => {
                      state.unreadCount = unreadArray;
                      return state;
                    });
                  }
                }
              }
            })();
          });
        });
      });
    });
  }

  renderItem = (item, rowMap) => {
    const { matched } = item;
    const usersOnline =
      this.state.onlineUsers.length && this.state.onlineUsers.length === 1
        ? this.state.onlineUsers
        : this.state.onlineUsers.length > 1 &&
          this.state.onlineUsers.map((t, i) => ({
            key: i,
            value: t,
          }));
    const checkOnline =
      usersOnline && usersOnline.length === 1
        ? Object.keys(usersOnline[0])
            .map((k) => Number(k))
            .filter((k) => this.state.blockingList.indexOf(k) === -1)
            .filter((k) => this.state.blocksList.indexOf(k) === -1)
        : usersOnline &&
          usersOnline.length > 1 &&
          usersOnline
            .filter((obj) => obj.value === true)
            .map((obj) => obj.key)
            .filter((k) => this.state.blockingList.indexOf(k) === -1)
            .filter((k) => this.state.blocksList.indexOf(k) === -1);

    const isIndividual = item.group_details.is_personal;
    const parsedUsers = JSON.parse(item.group_details.users);
    const currentUser = this.props.user;
    let someCount = 0;

    const { unreadCount } = this.state;

    someCount = unreadCount.filter((g) => g === item.group_details.id).length;

    const groupName = item.group_details.name
      ? item.group_details.name
      : parsedUsers.filter((user) => user.key !== currentUser.id)[0].username;

    const diffUser = parsedUsers.filter((user) => user.key !== currentUser.id)[0];
    let chatUserImage = diffUser.avatar;

    async () => {
      if (isIndividual) {
        const response = await ProfileService.getUserProfile(diffUser.key).then((res) => {
          return res.data;
        });
        chatUserImage = response.avatar ? response.avatar : null;
      }
    };

    return (
      <Card containerStyle={styles.cardstyle}>
        <TouchableOpacity
          style={{ backgroundColor: '#000' }}
          onPress={() => {
            this.props.updatePrevState(store.getState());
            this.props.updateTitle('channel');

            const sr =
              this.state.searchMode && this.state.SearchText.trim().length
                ? this.state.SearchText
                : null;
            this.props.navigation.navigate('Channel', {
              channel: {
                data: { ...item },
              },
              chatUser: isIndividual ? { ...diffUser } : null,
              chatId: item.group_details.id,
              user: {
                ...this.props.user,
              },
              sr,
            });
          }}
        >
          <View style={STYLES.horizontalAlign}>
            {item.group_details.image == null || item.group_details.image === 'null' ? (
              chatUserImage ? (
                <>
                  {checkOnline.length && checkOnline.includes(diffUser.key) && (
                    <CustomIcon
                      name="circle"
                      size={METRICS.fontSizeNormal}
                      color={COLORS.primaryColor}
                      style={styles.onlinecircle}
                    />
                  )}
                  <FastImage
                    style={styles.avatar}
                    source={{
                      uri: chatUserImage,
                    }}
                  />
                </>
              ) : isIndividual && !chatUserImage ? (
                <>
                  {checkOnline.length && checkOnline.includes(diffUser.key) ? (
                    <CustomIcon
                      name="circle"
                      size={METRICS.fontSizeNormal}
                      color={COLORS.primaryColor}
                      style={styles.onlinecircle}
                    />
                  ) : null}
                  <FastImage
                    style={styles.avatar}
                    rounded
                    size="medium"
                    source={require('../assets/images/user.png')}
                  />
                </>
              ) : (
                <FastImage
                  style={styles.avatar}
                  source={require('../assets/images/usergroup.png')}
                />
              )
            ) : (
              <FastImage style={styles.avatar} source={{ uri: item.group_details.image }} />
            )}
            <View
              style={{
                marginLeft: METRICS.spacingBig,
                flex: 0.7,
              }}
            >
              <Text style={styles.nametext}>{groupName}</Text>
              <Text style={styles.messagetext} ellipsizeMode="tail" numberOfLines={1}>
                {this.state.searchMode ? (
                  matched ? (
                    <Text style={styles.searchtext}>
                      {matched.length > 10
                        ? `${matched.split('').splice(0, 20).join('')} ...`
                        : matched}
                    </Text>
                  ) : (
                    'Searching'
                  )
                ) : item.group_details.last_message ? (
                  item.group_details.last_message
                ) : (
                  'Nothing Yet'
                )}
              </Text>
            </View>
            {!this.state.searchMode && (
              <View
                style={{
                  flexDirection: 'column',
                  flex: 0.3,
                  paddingLeft: METRICS.spacingBig,
                }}
              >
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 0.75 * METRICS.spacingTiny,
                  }}
                >
                  <Text style={styles.timetext}>
                    {moment(moment.utc(item.group_details.updated_at).local()).fromNow()}
                  </Text>
                </View>
                <View style={styles.countview}>
                  <Text adjustsFontSizeToFit numberOfLines={1} style={styles.countnumber}>
                    {someCount}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </Card>
    );
  };

  renderSelected = (text, number) => {
    return <TimeLine text={text} number={number.toString()} />;
  };

  // deleteChannel = async (channel) => {
  //   // channel.delete();

  //   // / TODO
  //   /* Delete Group with redux */

  //   const groupId = channel.data ? channel.data.group_id : channel.group_id;

  //   await this.props.deleteChatGroup(groupId);

  //   await this.props.getAllChatGroups().then((res) => {
  //     this.setState({
  //       currentGroups: this.props.groups,
  //     });
  //   });
  // };

  hideChannel = async (channel) => {
    const groupId = channel.group_details.id;
    const userId = this.props.user.id;
    this.setState((state) => {
      state.currentGroups = state.currentGroups.filter(
        (group) => group.group_details.id !== groupId
      );
      return state;
    });
    firebaseService.hideChannel(groupId, userId);
  };

  editChannel = (channel) => {
    this.setState({ modalStatus: true, editChannel: channel });
  };

  checkBlocklist = async () => {
    // for individual
    this.props.groups.forEach((channel) => {
      const { group_details = {} } = channel;
      const isPersonal = group_details.is_personal;
      if (isPersonal) {
        const parsedUsers = JSON.parse(channel.group_details.users);
        const chatUser = parsedUsers.filter(
          (parsedUser) => parsedUser.key !== this.props.user.id
        )[0];
        ProfileService.getBlock().then((res) => {
          const {
            data: { blockings = [], blocks = [] },
          } = res;
          this.setState((state) => ({
            ...state,
            blockingList: [
              ...state.blockingList,
              ...blockings.filter((user) => user.id === chatUser.key).map((user) => user.id),
            ],
            blocksList: [
              ...state.blocksList,
              ...blocks.filter((user) => user.id === chatUser.key).map((user) => user.id),
            ],
          }));
        });
      }
      // if Its  a group
      // ProfileService.getBlock().then((res) => {
      //   const {
      //     data: { blockings = [], blocks = [] },
      //   } = res;
      //   console.log('res grp', res);
      //   const { groupMembers } = this.state;
      //   this.setState({
      //     blockingList: blockings
      //       .filter((user) => groupMembers.includes(user.id))
      //       .map((user) => user.id),
      //     blocksList: blocks
      //       .filter((user) => groupMembers.includes(user.id))
      //       .map((user) => user.id),
      //   });
      // });
    });
  };

  render() {
    const { currentGroups = [], editChannel, dataSource, searchMode, isLoading } = this.state;
    const { modalStatus } = this.state;
    const { user } = this.props;
    const isAdmin = editChannel && editChannel.data.group_details.admin === user.id;
    return (
      <View style={{ backgroundColor: COLORS.blackColor }}>
        <DMPopup
          status={modalStatus}
          onClose={this.togglePopup}
          channel={this.state.editChannel}
          edit={!!this.state.editChannel}
          deleteChannel={() => this.deleteChannel(this.state.editChannel)}
          isAdmin={isAdmin}
          navigation={this.props.navigation}
          filterGroup={this.filterGroup}
        />
        <SafeAreaView style={styles.container}>
          <View style={styles.searchWrapper}>
            <View style={styles.searchItem}>
              <SearchItem
                onchangeText={(text) => {
                  this.changeSearchText(text);
                }}
                onFocus={() => {
                  this.setState({
                    searchMode: true,
                  });
                }}
                placeholder="Search Messages"
                value={this.state.SearchText}
              />
            </View>
          </View>
          <ScrollView contentContainerStyle={{ flex: 1 }}>
            {dataSource.length || this.state.currentGroups || isLoading ? (
              // <SwipeListView
              //   data={
              //     this.state.dataSource.sort((a, b) => {
              //       // Turn your strings into dates, and then subtract them
              //       // to get a value that is either negative, positive, or zero.
              //       return (
              //         new Date(b.group_details.updated_at) - new Date(a.group_details.updated_at)
              //       );
              //     }) || []
              //   }
              //   extraData={this.state}
              //   renderItem={({ item }, rowMap) => {
              //     return this.renderItem(item, rowMap);
              //   }}
              //   ListEmptyComponent={() => <Text style={styles.searchtext}>Loading</Text>}
              //   keyExtractor={(item) => item.id.toString()}
              //   showsVerticalScrollIndicator={false}
              //   renderHiddenItem={(data, rowMap) => {
              //     const group = data.item;
              //     const isPersonal = group.group_details.is_personal;
              //     return (
              //       this.state.searchMode === false && (
              //         <View style={styles.buttonWrapper}>
              //           {!isPersonal && (
              //             <TouchableOpacity
              //               style={[styles.button, styles.activeButton]}
              //               onPress={() => {
              //                 rowMap[data.item.id].closeRow();
              //                 if (!group.group_details.is_personal) {
              //                   this.editChannel({ data: group });
              //                 }
              //               }}
              //             >
              //               <Text style={styles.textButton}>Edit</Text>
              //             </TouchableOpacity>
              //           )}
              //           <TouchableOpacity
              //             style={[styles.button, styles.deleteButton]}
              //             onPress={() => {
              //               rowMap[data.item.id].closeRow();
              //               this.hideChannel(group);
              //             }}
              //           >
              //             <Text style={styles.textButton}>Delete</Text>
              //           </TouchableOpacity>
              //         </View>
              //       )
              //     );
              //   }}
              //   rightOpenValue={-230 * METRICS.ratioX}
              //   leftOpenValue={0}
              // />
              this.state.dataSource
                .sort((a, b) => {
                  // Turn your strings into dates, and then subtract them
                  // to get a value that is either negative, positive, or zero.
                  return (
                    new Date(b.group_details.updated_at) - new Date(a.group_details.updated_at)
                  );
                })
                .map((group, index) => {
                  const { id } = group.group_details;
                  const { matched } = group;

                  const usersOnline =
                    this.state.onlineUsers.length && this.state.onlineUsers.length === 1
                      ? this.state.onlineUsers
                      : this.state.onlineUsers.length > 1 &&
                        this.state.onlineUsers.map((t, i) => ({
                          key: i,
                          value: t,
                        }));
                  const checkOnline =
                    usersOnline && usersOnline.length === 1
                      ? Object.keys(usersOnline[0])
                          .map((k) => Number(k))
                          .filter((k) => this.state.blockingList.indexOf(k) === -1)
                          .filter((k) => this.state.blocksList.indexOf(k) === -1)
                      : usersOnline &&
                        usersOnline.length > 1 &&
                        usersOnline
                          .filter((obj) => obj.value === true)
                          .map((obj) => obj.key)
                          .filter((k) => this.state.blockingList.indexOf(k) === -1)
                          .filter((k) => this.state.blocksList.indexOf(k) === -1);

                  const isIndividual = group.group_details.is_personal;
                  const parsedUsers = JSON.parse(group.group_details.users);
                  const currentUser = this.props.user;
                  let someCount = 0;

                  const { unreadCount } = this.state;

                  someCount = unreadCount.filter((g) => g === group.group_details.id).length;

                  const groupName = group.group_details.name
                    ? group.group_details.name
                    : parsedUsers.filter((usr) => usr.key !== currentUser.id)[0].username;

                  const diffUser = parsedUsers.filter((usr) => usr.key !== currentUser.id)[0];
                  let chatUserImage = diffUser.avatar;

                  // eslint-disable-next-line no-unused-expressions
                  (async () => {
                    if (isIndividual) {
                      const response = await ProfileService.getUserProfile(diffUser.key).then(
                        (res) => {
                          return res.data;
                        }
                      );
                      chatUserImage = response.avatar ? response.avatar : null;
                    }
                  })();
                  const swipeValue = isIndividual ? -112 * METRICS.ratioX : -230 * METRICS.ratioX;
                  // eslint-disable-next-line no-unused-expressions

                  return (
                    <SwipeRow
                      disableRightSwipe
                      key={String(id)}
                      rightOpenValue={swipeValue}
                      recalculateHiddenLayout={false}
                      // eslint-disable-next-line no-return-assign
                      ref={(row) => (this.references[id] = row)}
                      swipeGestureBegan={() => {
                        if (
                          this.state.currentOpen != -1 &&
                          this.references[this.state.currentOpen] != undefined
                        ) {
                          this.references[this.state.currentOpen].closeRow();
                        }
                        this.setState({ currentOpen: id });
                      }}
                    >
                      {this.state.searchMode === false && (
                        <View style={styles.buttonWrapper}>
                          {!isIndividual && (
                            <TouchableOpacity
                              style={[styles.button, styles.activeButton]}
                              onPress={() => {
                                // rowMap[data.item.id].closeRow();
                                if (!group.group_details.is_personal) {
                                  this.editChannel({ data: group });
                                }
                              }}
                            >
                              <Text style={styles.textButton}>Edit</Text>
                            </TouchableOpacity>
                          )}
                          <TouchableOpacity
                            style={[styles.button, styles.deleteButton]}
                            onPress={() => {
                              // rowMap[data.item.id].closeRow();
                              this.hideChannel(group);
                            }}
                          >
                            <Text style={styles.textButton}>Delete</Text>
                          </TouchableOpacity>
                        </View>
                      )}
                      <Card containerStyle={styles.cardstyle}>
                        <TouchableOpacity
                          style={{ backgroundColor: '#000' }}
                          onPress={() => {
                            this.props.updatePrevState(store.getState());
                            this.props.updateTitle('channel');

                            const sr =
                              this.state.searchMode && this.state.SearchText.trim().length
                                ? this.state.SearchText
                                : null;
                            this.props.navigation.navigate('Channel', {
                              channel: {
                                data: { ...group },
                              },
                              chatUser: isIndividual ? { ...diffUser } : null,
                              chatId: group.group_details.id,
                              user: {
                                ...this.props.user,
                              },
                              sr,
                            });
                          }}
                        >
                          <View style={STYLES.horizontalAlign}>
                            {group.group_details.image == null ||
                            group.group_details.image === 'null' ? (
                              chatUserImage ? (
                                <>
                                  {checkOnline.length && checkOnline.includes(diffUser.key) && (
                                    <CustomIcon
                                      name="circle"
                                      size={METRICS.fontSizeNormal}
                                      color={COLORS.primaryColor}
                                      style={styles.onlinecircle}
                                    />
                                  )}
                                  <FastImage
                                    style={styles.avatar}
                                    source={{
                                      uri: chatUserImage,
                                    }}
                                  />
                                </>
                              ) : isIndividual && !chatUserImage ? (
                                <>
                                  {checkOnline.length && checkOnline.includes(diffUser.key) ? (
                                    <CustomIcon
                                      name="circle"
                                      size={METRICS.fontSizeNormal}
                                      color={COLORS.primaryColor}
                                      style={styles.onlinecircle}
                                    />
                                  ) : null}
                                  <FastImage
                                    style={styles.avatar}
                                    rounded
                                    size="medium"
                                    source={require('../assets/images/user.png')}
                                  />
                                </>
                              ) : (
                                <FastImage
                                  style={styles.avatar}
                                  source={require('../assets/images/usergroup.png')}
                                />
                              )
                            ) : (
                              <FastImage
                                style={styles.avatar}
                                source={{ uri: group.group_details.image }}
                              />
                            )}
                            <View
                              style={{
                                marginLeft: METRICS.spacingBig,
                                flex: 0.7,
                              }}
                            >
                              <Text style={styles.nametext}>{groupName}</Text>
                              <Text
                                style={styles.messagetext}
                                ellipsizeMode="tail"
                                numberOfLines={1}
                              >
                                {this.state.searchMode ? (
                                  matched ? (
                                    <Text style={styles.searchtext}>
                                      {matched.length > 10
                                        ? `${matched.split('').splice(0, 20).join('')} ...`
                                        : matched}
                                    </Text>
                                  ) : (
                                    'Searching'
                                  )
                                ) : group.group_details.last_message ? (
                                  group.group_details.last_message
                                ) : (
                                  'Nothing Yet'
                                )}
                              </Text>
                            </View>
                            {!this.state.searchMode && (
                              <View
                                style={{
                                  flexDirection: 'column',
                                  flex: 0.3,
                                  paddingLeft: METRICS.spacingBig,
                                }}
                              >
                                <View
                                  style={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginBottom: 0.75 * METRICS.spacingTiny,
                                  }}
                                >
                                  <Text style={styles.timetext}>
                                    {moment(
                                      moment.utc(group.group_details.updated_at).local()
                                    ).fromNow()}
                                  </Text>
                                </View>
                                <View style={styles.countview}>
                                  <Text
                                    adjustsFontSizeToFit
                                    numberOfLines={1}
                                    style={styles.countnumber}
                                  >
                                    {someCount}
                                  </Text>
                                </View>
                              </View>
                            )}
                          </View>
                        </TouchableOpacity>
                      </Card>
                    </SwipeRow>
                  );
                })
            ) : (
              <View
                style={{
                  justifyContent: 'center',
                  flex: 1,
                  alignItems: 'center',
                }}
              >
                <Text style={styles.emptytext}>No Groups To Show At the Moment</Text>
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }
}

function mapStateToProps(state) {
  const { user, chatClient, groups, craftState } = state;
  return { user, chatClient, groups: groups.groups, craftState };
}

export default connect(mapStateToProps, {
  getAllChatGroups,
  deleteChatGroup,
  updatePrevState,
  updateTitle,
})(DMScreens);

const styles = StyleSheet.create({
  backIcon: {
    color: COLORS.whiteColor,
    fontSize: METRICS.fontSizeBigger,
  },
  backButton: {
    position: 'absolute',
    left: METRICS.spacingSmall,
    padding: 14 * METRICS.ratioX,
    paddingRight: METRICS.spacingHuge,
    zIndex: 101,
  },
  smsButton: {
    position: 'absolute',
    right: METRICS.spacingSmall,
    padding: 14 * METRICS.ratioX,
    paddingLeft: METRICS.spacingHuge,
    zIndex: 101,
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
    paddingHorizontal: METRICS.marginSmall,
    marginTop: METRICS.marginTiny,
    marginBottom: METRICS.marginTiny,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  searchItem: {
    flex: 10,
    height: 40 * METRICS.ratioX,
    marginBottom: METRICS.spacingSmall,
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
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  button: {
    borderColor: COLORS.whiteColor,
    borderWidth: 1,
    width: 110 * METRICS.ratioX,
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  activeButton: {
    backgroundColor: COLORS.blackColor,
    borderColor: COLORS.whiteColor,
  },
  textButton: {
    color: COLORS.whiteColor,
    fontSize: METRICS.fontSizeBig,
    fontFamily: 'lato',
  },
  deleteButton: {
    backgroundColor: COLORS.primaryColor,
    borderColor: COLORS.primaryColor,
  },
  avatar: {
    width: METRICS.avatar,
    height: METRICS.avatar,
    borderRadius: METRICS.avatar,
  },
  emptytext: {
    fontFamily: 'lato',
    fontSize: METRICS.fontSizeNormal,
    color: COLORS.whiteColor,
  },
  nametext: {
    fontFamily: 'lato-semibold',
    fontSize: METRICS.fontSizeNormal,
    color: COLORS.whiteColor,
  },
  messagetext: {
    fontFamily: 'lato',
    fontSize: METRICS.fontSizeNormal,
    color: COLORS.greygreyColor,
    paddingTop: 0.75 * METRICS.spacingTiny,
  },
  countnumber: {
    flexDirection: 'row',
    justifyContent: 'center',
    textAlign: 'center',
    alignSelf: 'center',
    fontSize: METRICS.fontSizeOK,
    fontFamily: 'lato',
    color: COLORS.primaryColor,
    position: 'absolute',
    width: '90%',
  },
  timetext: {
    color: COLORS.greygreyColor,
    fontSize: METRICS.fontSizeOK,
    fontFamily: 'lato',
  },
  countview: {
    width: 27 * METRICS.ratioX,
    height: 27 * METRICS.ratioX,
    padding: 2 * METRICS.ratioX,
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    borderColor: COLORS.primaryColor,
    borderWidth: 1.2 * METRICS.ratioX,
    borderRadius: 25 * METRICS.ratioX,
  },
  cardstyle: {
    margin: 0,
    marginLeft: METRICS.spacingNormal,
    marginRight: -METRICS.spacingSmall,
    padding: 8 * METRICS.ratioX,
    borderColor: COLORS.blackColor,
    backgroundColor: COLORS.blackColor,
  },
  onlinecircle: {
    position: 'absolute',
    left: METRICS.marginHuge,
    bottom: 0,
    zIndex: 1,
  },
  searchtext: {
    color: COLORS.primaryColor,
    fontSize: METRICS.fontSizeNormal,
    fontFamily: 'lato',
  },
});
