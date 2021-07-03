import axios from 'axios';
import Upload from 'react-native-background-upload';
import moment from 'moment';
import uuid from 'react-native-uuid-generator';
import Env from '../helpers/environment';
import store from '../store/configureStore';
import { S3Policy } from '../RNS3/S3Policy';

const headers = {
  Accept: 'application/json',
  ContentType: 'application/json',
};

function getRequestHeaders() {
  const state = store.getState();
  headers.Authorization = `Bearer ${state.user.token}`;
  return headers;
}

const generateUUID = async () => {
  return uuid.getRandomUUID();
};

const PlayingCraftService = {
  updateDeviceToken(device_token) {
    return axios.post(
      `${Env.APIURL}/api/profile/updateDeviceToken`,
      {
        device_token,
      },
      {
        headers: getRequestHeaders(),
      }
    );
  },
  getAllCrafts() {
    return axios.post(
      `${Env.APIURL}/api/playingCraft/getAllCrafts`,
      {},
      {
        headers: getRequestHeaders(),
      }
    );
  },
  deleteCraft(id) {
    return axios.post(
      `${Env.APIURL}/api/playingCraft/deleteCraft/${id}`,
      {},
      {
        headers: getRequestHeaders(),
      }
    );
  },

  clearCrafts() {
    // console.log('clear craft api', `${Env.APIURL}/api/playingCraft/clearEmptyCrafts`);
    return axios.post(
      `${Env.APIURL}/api/playingCraft/clearEmptyCrafts`,
      {},
      {
        headers: getRequestHeaders(),
      }
    );
  },

  addCraftToCart(item_id) {
    return axios.post(
      `${Env.APIURL}/api/playingCraft/addCraftToCart/${item_id}`,
      {},
      {
        headers: getRequestHeaders(),
      }
    );
  },
  removeCraftFromCart(item_id) {
    return axios.post(
      `${Env.APIURL}/api/playingCraft/removeCraftFromCart/${item_id}`,
      {},
      {
        headers: getRequestHeaders(),
      }
    );
  },

  addCraftToPurchase(item_id) {
    const resp = axios.post(
      `${Env.APIURL}/api/playingCraft/addCraftToPurchase/${item_id}`,
      {},
      {
        headers: getRequestHeaders(),
      }
    );
    // console.log(resp);
    return resp;
  },
  addCraftToWishlist(item_id) {
    return axios.post(
      `${Env.APIURL}/api/playingCraft/addCraftToWishlist/${item_id}`,
      {},
      {
        headers: getRequestHeaders(),
      }
    );
  },
  removeCraftFromWishlist(item_id) {
    return axios.post(
      `${Env.APIURL}/api/playingCraft/removeCraftFromWishlist/${item_id}`,
      {},
      {
        headers: getRequestHeaders(),
      }
    );
  },
  addComment(craft_id, comment_body, photo, mentioned_users) {
    return axios.post(
      `${Env.APIURL}/api/playingCraft/addComment/${craft_id}`,
      {
        comment_body,
        attach_url: photo,
        mentioned_users,
      },
      {
        headers: getRequestHeaders(),
      }
    );
  },
  replyComment(craft_id, comment_body, comment_id, photo, mentioned_users) {
    return axios.post(
      `${Env.APIURL}/api/playingCraft/replyComment/${craft_id}`,
      {
        comment_body,
        comment_id,
        attach_url: photo,
        mentioned_users,
      },
      {
        headers: getRequestHeaders(),
      }
    );
  },
  getCommentsReply(comment_id) {
    return axios.post(
      `${Env.APIURL}/api/playingCraft/getCommentsReply/${comment_id}`,
      {},
      {
        headers: getRequestHeaders(),
      }
    );
  },
  getComments(craft_id) {
    return axios.post(
      `${Env.APIURL}/api/playingCraft/getComments/${craft_id}`,
      {},
      {
        headers: getRequestHeaders(),
      }
    );
  },
  deleteComment(comment_id) {
    return axios.post(
      `${Env.APIURL}/api/playingCraft/deleteComment/${comment_id}`,
      {},
      {
        headers: getRequestHeaders(),
      }
    );
  },
  reportComment(comment_id) {
    return axios.post(
      `${Env.APIURL}/api/playingCraft/reportComment`,
      {
        // report_content: report_content,
        comment_id,
      },
      {
        headers: getRequestHeaders(),
      }
    );
  },
  reportCraft(report_content, craft_id) {
    return axios.post(
      `${Env.APIURL}/api/playingCraft/reportCraft`,
      {
        report_content,
        craft_id,
      },
      {
        headers: getRequestHeaders(),
      }
    );
  },
  getCommentReport() {
    return axios.post(
      `${Env.APIURL}/api/report/getCommentReport`,
      {},
      {
        headers: getRequestHeaders(),
      }
    );
  },
  getCraftReport() {
    return axios.post(
      `${Env.APIURL}/api/report/getCraftReport`,
      {},
      {
        headers: getRequestHeaders(),
      }
    );
  },
  removeCommentReport(report_id) {
    return axios.post(
      `${Env.APIURL}/api/report/removeCommentReport`,
      {
        report_id,
      },
      {
        headers: getRequestHeaders(),
      }
    );
  },
  removeCraftReport(report_id) {
    return axios.post(
      `${Env.APIURL}/api/report/removeCraftReport`,
      {
        report_id,
      },
      {
        headers: getRequestHeaders(),
      }
    );
  },
  getCraft(craft_id) {
    return axios.post(
      `${Env.APIURL}/api/playingCraft/getCraft/${craft_id}`,
      {},
      {
        headers: getRequestHeaders(),
      }
    );
  },
  getFiles(craft_id) {
    return axios.get(`${Env.APIURL}/api/playingCraft/${craft_id}/file`, {
      headers: getRequestHeaders(),
    });
  },
  deleteFile(craft_id, file_id) {
    return axios.delete(`${Env.APIURL}/api/playingCraft/${craft_id}/file/${file_id}`, {
      headers: getRequestHeaders(),
    });
  },
  joinStudioCraft(studio_id, craft_id) {
    console.log(
      'join studio',
      `${Env.APIURL}/api/studio-craft-join`,
      studio_id,
      craft_id,
      getRequestHeaders()
    );
    return axios.post(
      `${Env.APIURL}/api/studio-craft-join`,
      {
        studio_id,
        craft_id,
      },
      {
        headers: getRequestHeaders(),
      }
    );
  },

  setTitle(craft_id, title) {
    return axios.post(
      `${Env.APIURL}/api/playingCraft/setTitle/${craft_id}`,
      {
        craft_id,
        title,
      },
      {
        headers: getRequestHeaders(),
      }
    );
  },
  setHashTags(craft_id, hashTags) {
    return axios.post(
      `${Env.APIURL}/api/playingCraft/setHashTags/${craft_id}`,
      {
        hashTags: JSON.stringify(hashTags),
      },
      {
        headers: getRequestHeaders(),
      }
    );
  },
  setDescription(craft_id, description) {
    return axios.post(
      `${Env.APIURL}/api/playingCraft/setDescription/${craft_id}`,
      {
        description,
      },
      {
        headers: getRequestHeaders(),
      }
    );
  },
  setProductionDescription(craft_id, description) {
    return axios.post(
      `${Env.APIURL}/api/playingCraft/setProductionDescription/${craft_id}`,
      {
        description,
      },
      {
        headers: getRequestHeaders(),
      }
    );
  },
  setArtCategories(craft_id, categories) {
    return axios.post(
      `${Env.APIURL}/api/playingCraft/setArtCategories/${craft_id}`,
      {
        categories: JSON.stringify(categories),
      },
      {
        headers: getRequestHeaders(),
      }
    );
  },
  setMusicCategories(craft_id, categories) {
    return axios.post(
      `${Env.APIURL}/api/playingCraft/setMusicCategories/${craft_id}`,
      {
        categories: JSON.stringify(categories),
      },
      {
        headers: getRequestHeaders(),
      }
    );
  },
  setLyrics(craft_id, lyrics) {
    return axios.post(
      `${Env.APIURL}/api/playingCraft/setLyrics/${craft_id}`,
      {
        lyrics,
      },
      {
        headers: getRequestHeaders(),
      }
    );
  },
  addNewCraft(type = '1') {
    return axios.post(
      `${Env.APIURL}/api/playingCraft/addNewCraft`,
      {
        type,
      },
      {
        headers: getRequestHeaders(),
      }
    );
  },
  async uploadFile(url, type, name, craftId, onProgress, mainFile, uploadingArt) {
    const file = {
      // `uri` can also be a file system path (i.e. file://)
      uri: url,
      name,
      type,
    };

    console.log('file', file);

    const uuidName = await generateUUID();
    const key = `uploads/${moment().format('MM_DD_YYYY')}/${uuidName}`;

    console.log('file', key);

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
            keyPrefix: 'uploads/',
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

      let canReport = true;

      Upload.startUpload(options)
        .then(async (uploadId) => {
          // console.log(`options: ${options}`);

          if (typeof onProgress === 'function') {
            onProgress({
              id: uploadId,
              progress: 0,
            });
          }

          Upload.addListener('progress', uploadId, (data) => {
            console.log(`Progress: ${data.progress}%`);

            if (typeof onProgress === 'function' && canReport === true) {
              canReport = false;
              onProgress({
                id: uploadId,
                progress: data.progress,
              });
              setTimeout(() => (canReport = true), 500);
            }
          });
          Upload.addListener('error', uploadId, (data) => {
            console.log(`Error: ${data.error}`);
            reject();
          });
          Upload.addListener('cancelled', uploadId, (data) => {
            console.log(`Cancelled!`, data);
            reject();
          });

          Upload.addListener('completed', uploadId, (data) => {
            // data includes responseCode: number and responseBody: Object
            if (typeof onProgress === 'function') {
              onProgress({
                id: uploadId,
                progress: 100,
              });
            }

            console.log('data', data);
            const body = {
              files: [
                {
                  url: key,
                  filename: name,
                  filetype: type.split('/')[0],
                },
              ],
            };

            console.log(body);

            axios
              .post(`${Env.APIURL}/api/playingCraft/${craftId}/file`, body, {
                headers: getRequestHeaders(),
              })
              .then((result) =>
                resolve({
                  ...result,
                  mainFile,
                  uploadingArt,
                })
              );
          });
        })
        .catch((err) => {
          reject(err);
        });
    }).then((resp) => resp);
  },
  setCraftMedia(craft_id, filetype, url, filename, orientation) {
    return axios.post(
      `${Env.APIURL}/api/playingCraft/setCraftMedia/${craft_id}`,
      {
        type: filetype,
        filetype,
        url,
        filename,
        orientation,
      },
      {
        headers: getRequestHeaders(),
      }
    );
  },
  setCraftMediaPurchase(craft_id, purchase_id, type) {
    return axios.post(
      `${Env.APIURL}/api/playingCraft/${craft_id}/setCraftMedia/purchase/${purchase_id}`,
      {
        type,
      },
      {
        headers: getRequestHeaders(),
      }
    );
  },
  setCraftThumbnail(craft_id, url) {
    return axios.post(
      `${Env.APIURL}/api/playingCraft/setCraftThumbnail/${craft_id}`,
      {
        url,
        name,
      },
      {
        headers: getRequestHeaders(),
      }
    );
  },
  setStoreType(craft_id, type) {
    return axios.post(
      `${Env.APIURL}/api/playingCraft/setStoreType/${craft_id}`,
      {
        type,
      },
      {
        headers: getRequestHeaders(),
      }
    );
  },
  addCraftItem(
    craft_id,
    store_option,
    purchase_option,
    price,
    in_app_file,
    files_for_export,
    quantity,
    royalty,
    non_transformative_royalty,
    adversting,
    number_of_ads_allowed
  ) {
    console.log({
      store_option,
      purchase_option,
      price,
      quantity,
      royalty,
      non_transformative_royalty,
      adversting,
      number_of_ads_allowed,
      in_app_file,
      files_for_export,
    });

    const result = axios.post(
      `${Env.APIURL}/api/playingCraft/addCraftItem/${craft_id}`,
      {
        store_option,
        purchase_option,
        price,
        quantity,
        royalty,
        non_transformative_royalty,
        adversting,
        number_of_ads_allowed,
        in_app_file,
        files_for_export,
      },
      {
        headers: getRequestHeaders(),
      }
    );
    console.log(result);
    return result;
  },
  editCraftItem(craft_item_id, purchase_option, in_app_file, files_for_export, field, value) {
    console.log({
      purchase_option,
      in_app_file,
      files_for_export,
      field,
      value,
    });

    const result = axios.post(
      `${Env.APIURL}/api/playingCraft/editCraftItem/${craft_item_id}`,
      {
        purchase_option,
        in_app_file,
        files_for_export,
        field,
        value,
      },
      {
        headers: getRequestHeaders(),
      }
    );
    console.log(result);
    return result;
  },
  setWebsiteLink(craft_id, link) {
    return axios.post(
      `${Env.APIURL}/api/playingCraft/setWebsiteLink/`,
      {
        craft_id,
        link,
      },
      {
        headers: getRequestHeaders(),
      }
    );
  },
  browseLink(id) {
    return axios.post(
      `${Env.APIURL}/api/playingCraft/browseLink/${id}`,
      {},
      {
        headers: getRequestHeaders(),
      }
    );
  },
  cloneCraft(id) {
    return axios.post(
      `${Env.APIURL}/api/playingCraft/cloneCraft/${id}`,
      {},
      {
        headers: getRequestHeaders(),
      }
    );
  },
  replaceCraft(id, new_id) {
    return axios.post(
      `${Env.APIURL}/api/playingCraft/replaceCraft`,
      {
        id,
        new_id,
      },
      {
        headers: getRequestHeaders(),
      }
    );
  },
  publishCraft(id, is_public) {
    return axios.post(
      `${Env.APIURL}/api/playingCraft/publishCraft/${id}`,
      {
        is_public,
      },
      {
        headers: getRequestHeaders(),
      }
    );
  },
  likeCraft(id) {
    return axios.post(
      `${Env.APIURL}/api/profile/likeCraft/${id}`,
      {},
      {
        headers: getRequestHeaders(),
      }
    );
  },
  unlikeCraft(id) {
    return axios.post(
      `${Env.APIURL}/api/profile/unlikeCraft/${id}`,
      {},
      {
        headers: getRequestHeaders(),
      }
    );
  },
  getCraftLikes(id) {
    return axios.post(
      `${Env.APIURL}/api/playingCraft/getCraftLikes/${id}`,
      {},
      {
        headers: getRequestHeaders(),
      }
    );
  },
  likeComment(id) {
    // console.log('id', id);
    return axios.post(
      `${Env.APIURL}/api/profile/likeComment/${id}`,
      {},
      {
        headers: getRequestHeaders(),
      }
    );
  },
  unlikeComment(id) {
    return axios.post(
      `${Env.APIURL}/api/profile/unlikeComment/${id}`,
      {},
      {
        headers: getRequestHeaders(),
      }
    );
  },
  setFeaturedCraft(id) {
    return axios.post(
      `${Env.APIURL}/api/playingCraft/setFeaturedCraft/${id}`,
      {},
      {
        headers: getRequestHeaders(),
      }
    );
  },
  unsetFeaturedCraft(id) {
    return axios.post(
      `${Env.APIURL}/api/playingCraft/unsetFeaturedCraft/${id}`,
      {},
      {
        headers: getRequestHeaders(),
      }
    );
  },
  createContestCraft(id, title, description) {
    return axios.post(
      `${Env.APIURL}/api/playingCraft/createContestCraft/${id}`,
      {
        title,
        description,
      },
      {
        headers: getRequestHeaders(),
      }
    );
  },
  getSpotlightData(limit = 0) {
    return axios.post(
      `${Env.APIURL}/api/playingCraft/getSpotlightData`,
      { limit },
      {
        headers: getRequestHeaders(),
      }
    );
  },
  getUserCraft(id, limit = 0) {
    return axios.post(
      `${Env.APIURL}/api/playingCraft/getUserCraft/${id}`,
      {
        limit,
      },
      {
        headers: getRequestHeaders(),
      }
    );
  },
  getUserStore(id, limit = 0) {
    return axios.post(
      `${Env.APIURL}/api/playingCraft/getUserStore/${id}`,
      {
        limit,
      },
      {
        headers: getRequestHeaders(),
      }
    );
  },
  addCraftPlay(id) {
    return axios.post(
      `${Env.APIURL}/api/playingCraft/addCraftPlay/${id}`,
      {},
      {
        headers: getRequestHeaders(),
      }
    );
  },
  setStoreOwner(id, userid) {
    return axios.post(
      `${Env.APIURL}/api/playingCraft/setStoreOwner/${id}`,
      {
        userid,
      },
      {
        headers: getRequestHeaders(),
      }
    );
  },
  getGenre() {
    return axios.post(
      `${Env.APIURL}/api/playingCraft/getGenre`,
      {},
      {
        headers: getRequestHeaders(),
      }
    );
  },
  makePrivate(id) {
    return axios.patch(
      `${Env.APIURL}/api/playingCraft/makePrivate/${id}`,
      {},
      {
        headers: getRequestHeaders(),
      }
    );
  },
  makePublic(id) {
    return axios.patch(
      `${Env.APIURL}/api/playingCraft/makePublic/${id}`,
      {},
      {
        headers: getRequestHeaders(),
      }
    );
  },
  makeHidden(id) {
    return axios.patch(
      `${Env.APIURL}/api/playingCraft/makeHidden/${id}`,
      {},
      {
        headers: getRequestHeaders(),
      }
    );
  },
  makeVisible(id) {
    return axios.patch(
      `${Env.APIURL}/api/playingCraft/makeVisible/${id}`,
      {},
      {
        headers: getRequestHeaders(),
      }
    );
  },
};

export default PlayingCraftService;
