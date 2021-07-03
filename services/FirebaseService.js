import firebase from 'react-native-firebase';

class FirebaseService {
  get ref() {
    return firebase.database().ref('groups');
  }

  presence = (userId) => {
    const amOnline = firebase.database().ref('.info/connected');
    const userRef = firebase.database().ref(`online/${userId}`);

    amOnline.on('value', (snapshot) => {
      if (snapshot.val()) {
        userRef.onDisconnect().remove();
        userRef.set(true);
      }
    });
  };

  offline = (userId) => {
    const userRef = firebase.database().ref(`online/${userId}`);
    userRef.remove();
  };

  createGroup = (channel) => {
    const { id, usersids, admin, name, is_personal, image } = channel.group_details;
    const chatId = id;
    const members = JSON.parse(usersids);
    const count = members.map((m) => ({ [m]: 0 }));

    const metaRef = this.ref.child(`${chatId}/meta`);

    metaRef.set({
      members,
      admin,
      name: is_personal ? null : name,
      visibleTo: members,
      image,
      lastmessage: 'Nothing yet',
      unreads: count,
    });
  };

  deleteGroup = (id) => this.ref.child(`${id}`).remove();

  updateGroup = (newChannel) => {
    const { id, usersids, admin, name, is_personal } = newChannel.group_details;
    const chatId = id;
    const members = JSON.parse(usersids);

    this.ref.child(`${chatId}/meta`).set({
      members,
      admin,
      name: is_personal ? null : name,
      visibleTo: members,
    });
  };

  makeAdmin = ({ group_id, new_admin_id }) => {
    this.ref.child(`${group_id}/meta/`).child('admin').set(new_admin_id);
  };

  hideChannel = (groupId, userId) => {
    const visibleRef = this.ref.child(`${groupId}/meta/`).child('visibleTo');
    const messageRef = this.ref.child(`${groupId}/messages/`);

    messageRef.once('value', (snapshot) => {
      snapshot.forEach((snap) => {
        const messageForRef = snap.child('messageFor').ref;
        messageForRef.once('value', (mSnapshot) => {
          mSnapshot.forEach((mSnap) => {
            if (mSnap.val() === userId) {
              mSnap.ref.remove();
            }
          });
        });
      });
    });

    visibleRef.once('value', (snapshot) => {
      snapshot.forEach((snap) => {
        if (snap.val() === userId) {
          snap.ref.remove();
        }
      });
    });
  };

  filterGroups = (groups, userId) => {
    return new Promise(async (resolve, reject) => {
      let currentGroups = [];
      try {
        await groups.forEach(async (group) => {
          const groupId = group.group_details.id;

          const visibleRef = this.ref.child(`${groupId}/meta/visibleTo`);

          await visibleRef.once('value', (snapshot) => {
            snapshot.forEach((snap) => {
              if (snap.val() === userId) {
                currentGroups = [...groups.filter((g) => g.group_details.id === groupId)];
              }
            });
          });
        });

        const dispatchGroups = [...currentGroups];
        return resolve([...dispatchGroups]);
      } catch (error) {
        // console.log(error);
        reject(error);
      }
    });
  };

  uploadFile = async () => {};
}

const firebaseService = new FirebaseService();

export default firebaseService;
