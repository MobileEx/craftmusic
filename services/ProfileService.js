import axios from 'axios';
import moment from 'moment';
import uuid from 'react-native-uuid-generator';
import Upload from 'react-native-background-upload';
import Env from '../helpers/environment';
import store from '../store/configureStore';
import { S3Policy } from '../RNS3/S3Policy';

const headers = {
  Accept: 'application/json',
  ContentType: 'application/json',
};

const generateUUID = async () => {
  return uuid.getRandomUUID();
};

function getRequestHeaders() {
  const state = store.getState();
  headers.Authorization = `Bearer ${state.user.token}`;
  return headers;
}

const ProfileService = {
  notification_permission(notification_type, status) {
    return axios.post(
      `${Env.APIURL}/api/notification_permission`,
      {
        notification_type,
        status,
      },
      {
        headers: getRequestHeaders(),
      }
    );
  },
  // readmessages(){
  //   return axios.post(`${Env.APIURL}/api/readmessages`, {}, {
  //     headers: getRequestHeaders()
  //   });
  // },
  checkReadNotifications() {
    return axios.post(
      `${Env.APIURL}/api/readnotifications`,
      {},
      {
        headers: getRequestHeaders(),
      }
    );
  },
  getUserProfile(id) {
    if (!id) {
      const error = {
        response: {
          data: {
            error: 'Using of the wrong user id',
          },
        },
      };
      return Promise.reject(error);
    }
    return axios.post(
      `${Env.APIURL}/api/profile/getUserProfile/${id}`,
      {},
      {
        headers: getRequestHeaders(),
      }
    );
  },
  getUserInfo(key) {
    return axios.post(
      `${Env.APIURL}/api/profile/getUserInfo`,
      {
        key,
      },
      {
        headers: getRequestHeaders(),
      }
    );
  },
  resendSms(id) {
    return axios.post(
      `${Env.APIURL}/api/profile/resendSms`,
      {
        id,
      },
      {
        headers: getRequestHeaders(),
      }
    );
  },
  changeForgotPassword(id, password) {
    return axios.post(
      `${Env.APIURL}/api/profile/changeForgotPassword`,
      {
        id,
        password,
      },
      {
        headers: getRequestHeaders(),
      }
    );
  },
  getFollow(id) {
    return axios.post(
      `${Env.APIURL}/api/profile/getFollow/${id}`,
      {},
      {
        headers: getRequestHeaders(),
      }
    );
  },
  follow(targetId) {
    return axios.post(
      `${Env.APIURL}/api/profile/follow/${targetId}`,
      {},
      {
        headers: getRequestHeaders(),
      }
    );
  },
  unFollow(targetId) {
    return axios.post(
      `${Env.APIURL}/api/profile/unfollow/${targetId}`,
      {},
      {
        headers: getRequestHeaders(),
      }
    );
  },
  updateProfile(profile) {
    return axios.post(
      `${Env.APIURL}/api/profile/updateUserProfile`,
      {
        bio: profile.bio,
        location: profile.location,
        website_url: profile.website_url,
        instagram_url: profile.instagram_url,
        facebook_url: profile.facebook_url,
        twitter_url: profile.twitter_url,
        snapchat_url: profile.snapchat_url,
        behance_url: profile.behance_url,
        linkedin_url: profile.linkedin_url,
        avatar: profile.avatar,
        usertype: profile.usertype,
      },
      {
        headers: getRequestHeaders(),
      }
    );
  },

  updateProfileAvatar(avatar) {
    return axios.post(
      `${Env.APIURL}/api/profile/updateUserProfile`,
      {
        avatar,
      },
      {
        headers: getRequestHeaders(),
      }
    );
  },

  changeUsername(username) {
    const state = store.getState();
    return axios.post(
      `${Env.APIURL}/api/profile/changeUsername`,
      {
        username,
      },
      {
        headers: getRequestHeaders(),
      }
    );
  },
  changePassword(password, newPassword) {
    return axios.post(
      `${Env.APIURL}/api/profile/changePassword`,
      {
        cur_password: password,
        new_password: newPassword,
      },
      {
        headers: getRequestHeaders(),
      }
    );
  },
  changePhone(phone) {
    return axios.post(
      `${Env.APIURL}/api/profile/changePhone`,
      {
        phone,
      },
      {
        headers: getRequestHeaders(),
      }
    );
  },
  changeEmail(email) {
    return axios.post(
      `${Env.APIURL}/api/profile/changeEmail`,
      {
        email,
      },
      {
        headers: getRequestHeaders(),
      }
    );
  },
  requestVerify(username, fullname, knownas, idphoto) {
    return axios.post(
      `${Env.APIURL}/api/profile/requestVerify`,
      {
        username,
        fullname,
        knownas,
        idphoto,
      },
      {
        headers: getRequestHeaders(),
      }
    );
  },
  getVerifyRequest() {
    return axios.get(`${Env.APIURL}/api/verification-request`, {
      headers: getRequestHeaders(),
    });
  },
  removeVerifyRequest(verification_request_id) {
    return axios.delete(`${Env.APIURL}/api/verification-request/${verification_request_id}`, {
      headers: getRequestHeaders(),
    });
  },
  verifyUser(user_id) {
    return axios.patch(
      `${Env.APIURL}/api/user/${user_id}/verify`,
      {},
      {
        headers: getRequestHeaders(),
      }
    );
  },
  unVerifyUser(user_id) {
    return axios.patch(
      `${Env.APIURL}/api/user/${user_id}/unverify`,
      {},
      {
        headers: getRequestHeaders(),
      }
    );
  },
  banUser(user_id) {
    return axios.patch(
      `${Env.APIURL}/api/user/${user_id}/ban`,
      {},
      {
        headers: getRequestHeaders(),
      }
    );
  },
  unBanUser(user_id) {
    return axios.patch(
      `${Env.APIURL}/api/user/${user_id}/unban`,
      {},
      {
        headers: getRequestHeaders(),
      }
    );
  },
  deleteUser(user_id) {
    return axios.delete(`${Env.APIURL}/api/user/${user_id}`, {
      headers: getRequestHeaders(),
    });
  },
  getBlock() {
    return axios.post(
      `${Env.APIURL}/api/profile/getBlock`,
      {},
      {
        headers: getRequestHeaders(),
      }
    );
  },
  blockUser(blockId) {
    return axios.post(
      `${Env.APIURL}/api/profile/blockUser`,
      {
        block_id: blockId,
      },
      {
        headers: getRequestHeaders(),
      }
    );
  },
  unBlockUser(blockId) {
    return axios.post(
      `${Env.APIURL}/api/profile/unBlockUser`,
      {
        block_id: blockId,
      },
      {
        headers: getRequestHeaders(),
      }
    );
  },
  reportUser(content, target) {
    return axios.post(
      `${Env.APIURL}/api/report/reportUser/${target}`,
      {
        report_content: content,
      },
      {
        headers: getRequestHeaders(),
      }
    );
  },
  getUserReport() {
    return axios.post(
      `${Env.APIURL}/api/report/getUserReport`,
      {},
      {
        headers: getRequestHeaders(),
      }
    );
  },
  removeUserReport(report_id) {
    return axios.post(
      `${Env.APIURL}/api/report/removeUserReport`,
      {
        report_id,
      },
      {
        headers: getRequestHeaders(),
      }
    );
  },
  getSetting() {
    return axios.post(
      `${Env.APIURL}/api/profile/getSetting`,
      {},
      {
        headers: getRequestHeaders(),
      }
    );
  },

  getPushnotificationSetting() {
    return axios.post(
      `${Env.APIURL}/api/profile/getPushnotificationSetting`,
      {},
      {
        headers: getRequestHeaders(),
      }
    );
  },
  updateSetting(params) {
    return axios.post(
      `${Env.APIURL}/api/profile/updateSetting`,
      {
        explicit_content: params.explicitContent,
        remove_text: params.removeText,
        allow_dm: params.allowDm,
        allow_collab: params.allowCollab,
        allow_profile: params.allowProfile,
      },
      {
        headers: getRequestHeaders(),
      }
    );
  },
  async uploadAvatar(url, name, type) {
    const file = {
      uri: url,
      name,
      type,
    };

    const state = store.getState();
    const { id } = state.user;
    const uuidName = await generateUUID();
    const key = `avatars/${id}_${uuidName}`;

    console.log(file);

    return new Promise((resolve, reject) => {
      const options = {
        type: 'multipart',
        method: 'POST',
        headers: {
          'content-type': type, // server requires a content-type header
        },
        url: Env.S3URL,
        field: 'file',
        path: url,
        parameters: {
          ...S3Policy.generate({
            keyPrefix: 'avatars/',
            bucket: Env.bucket,
            region: Env.region,
            accessKey: Env.accessKey,
            secretKey: Env.secretKey,
            successActionStatus: 201,
            key,
            date: new Date(),
            contentType: type,
          }),
        },
      };

      // console.log({ options });

      Upload.startUpload(options)
        .then(async (uploadId) => {
          // console.log(`options:`, options);

          Upload.addListener('progress', uploadId, (data) => {
            // console.log(`Progress:`, data.progress);
          });
          Upload.addListener('error', uploadId, (data) => {
            // console.log(`Error: `, data.error);
            reject();
          });
          Upload.addListener('cancelled', uploadId, (data) => {
            // console.log(`Cancelled!`, data);
            reject();
          });
          Upload.addListener('completed', uploadId, (data) => {
            // data includes responseCode: number and responseBody: Object
            const body = {
              url: `/${key}`,
              filename: name,
              filetype: type.split('/')[0],
            };
            resolve(body);
          });
        })
        .catch((err) => {
          reject();
        });
    }).then((resp) => resp);
  },
  async uploadImage(url, name, type) {
    const file = {
      uri: url,
      name,
      type,
    };

    const uuidName = await generateUUID();
    const key = `pictures/${moment().format('MM_DD_YYYY')}/${uuidName}`;

    console.log(file);

    return new Promise((resolve, reject) => {
      const options = {
        type: 'multipart',
        method: 'POST',
        headers: {
          'content-type': 'multipart', // type, // server requires a content-type header
        },
        url: Env.S3URL,
        field: 'file',
        path: url,
        parameters: {
          ...S3Policy.generate({
            keyPrefix: 'pictures/',
            bucket: Env.bucket,
            region: Env.region,
            accessKey: Env.accessKey,
            secretKey: Env.secretKey,
            successActionStatus: 201,
            key,
            date: new Date(),
            contentType: type,
          }),
        },
      };

      // console.log({ options });

      Upload.startUpload(options)
        .then(async (uploadId) => {
          // console.log(`options:`, uploadId);

          Upload.addListener('progress', uploadId, (data) => {
            // console.log(`Progress:`, data.progress);
          });
          Upload.addListener('error', uploadId, (data) => {
            // console.log(`Error: `, data.error);
            reject();
          });
          Upload.addListener('cancelled', uploadId, (data) => {
            // console.log(`Cancelled!`, data);
            reject();
          });
          Upload.addListener('completed', uploadId, (data) => {
            // data includes responseCode: number and responseBody: Object
            const body = {
              url: `/${key}`,
              filename: name,
              filetype: type.split('/')[0],
            };
            resolve(body);
          });
        })
        .catch((err) => {
          reject();
        });
    }).then((resp) => resp);
  },
  getContactUsers(phones) {
    return axios.post(`${Env.APIURL}/api/profile/getContactUsers`, {
      phones,
    });
  },
  getMyCart() {
    return axios.post(
      `${Env.APIURL}/api/profile/getMyCart`,
      {},
      {
        headers: getRequestHeaders(),
      }
    );
  },
  getMyPurchase(user_id, store_option) {
    return axios.post(
      `${Env.APIURL}/api/profile/getMyPurchase`,
      {
        user_id,
        store_option,
      },
      {
        headers: getRequestHeaders(),
      }
    );
  },
  getMyWishlist(craft_id) {
    return axios.post(
      `${Env.APIURL}/api/profile/getMyWishlist`,
      {
        craft_id,
      },
      {
        headers: getRequestHeaders(),
      }
    );
  },
  getCraftFromWishlistById() {
    return axios.post(
      `${Env.APIURL}/api/profile/getCraftFromWishlistById`,
      {},
      {
        headers: getRequestHeaders(),
      }
    );
  },
  getContributedCraftlist(id, limit = 0) {
    return axios.post(
      `${Env.APIURL}/api/profile/getContributedCraftlist`,
      {
        id,
        limit,
      },
      {
        headers: getRequestHeaders(),
      }
    );
  },
  getFollowNumbers(id) {
    return axios.post(
      `${Env.APIURL}/api/profile/getFollowNumbers/${id}`,
      {},
      {
        headers: getRequestHeaders(),
      }
    );
  },
  setFeaturedUser(id) {
    return axios.post(
      `${Env.APIURL}/api/profile/setFeaturedUser/${id}`,
      {},
      {
        headers: getRequestHeaders(),
      }
    );
  },
  unsetFeaturedUser(id) {
    return axios.post(
      `${Env.APIURL}/api/profile/unsetFeaturedUser/${id}`,
      {},
      {
        headers: getRequestHeaders(),
      }
    );
  },
};

export default ProfileService;
