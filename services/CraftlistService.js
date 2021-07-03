import axios from 'axios';
import Env from '../helpers/environment';
import store from '../store/configureStore';

const headers = {
  Accept: 'application/json',
  ContentType: 'application/json',
};

function getRequestHeaders() {
  const state = store.getState();
  headers.Authorization = `Bearer ${state.user.token}`;
  return headers;
}

const CraftlistService = {
  addNewCraftlist() {
    return axios.post(
      `${Env.APIURL}/api/craftlist/addNewCraftlist`,
      {},
      {
        headers: getRequestHeaders(),
      }
    );
  },
  deleteCraftlist(id) {
    return axios.post(
      `${Env.APIURL}/api/craftlist/deleteCraftlist/${id}`,
      {},
      {
        headers: getRequestHeaders(),
      }
    );
  },
  saveImage(id, url, filename, filetype) {
    return axios.post(
      `${Env.APIURL}/api/craftlist/saveImage/${id}`,
      {
        url,
        filename,
        filetype,
      },
      {
        headers: getRequestHeaders(),
      }
    );
  },
  saveTitle(id, title) {
    return axios.post(
      `${Env.APIURL}/api/craftlist/saveTitle/${id}`,
      {
        title,
      },
      {
        headers: getRequestHeaders(),
      }
    );
  },
  saveDescription(id, description) {
    return axios.post(
      `${Env.APIURL}/api/craftlist/saveDescription/${id}`,
      {
        description,
      },
      {
        headers: getRequestHeaders(),
      }
    );
  },
  savePrivacy(id, privacy) {
    return axios.post(
      `${Env.APIURL}/api/craftlist/savePrivacy/${id}`,
      {
        privacy,
      },
      {
        headers: getRequestHeaders(),
      }
    );
  },
  getCraftlist(id) {
    return axios.post(
      `${Env.APIURL}/api/craftlist/getCraftlist/${id}`,
      {},
      {
        headers: getRequestHeaders(),
      }
    );
  },
  saveCraftlistOrder(list_id, craft_ids) {
    return axios.post(
      `${Env.APIURL}/api/craftlist/saveOrder/${list_id}`,
      {
        craft_ids: JSON.stringify(craft_ids),
      },
      {
        headers: getRequestHeaders(),
      }
    );
  },
  addCraftToList(list_id, craft_id) {
    return axios.post(
      `${Env.APIURL}/api/craftlist/addCraftToList/${list_id}`,
      {
        craft_id,
      },
      {
        headers: getRequestHeaders(),
      }
    );
  },
  deleteCraftFromList(list_id, craft_id) {
    return axios.post(
      `${Env.APIURL}/api/craftlist/deleteCraftFromList/${list_id}`,
      {
        craft_id,
      },
      {
        headers: getRequestHeaders(),
      }
    );
  },
  followCraftlist(list_id) {
    return axios.post(
      `${Env.APIURL}/api/profile/followCraftlist/${list_id}`,
      {},
      {
        headers: getRequestHeaders(),
      }
    );
  },
  unfollowCraftlist(list_id) {
    return axios.post(
      `${Env.APIURL}/api/profile/unfollowCraftlist/${list_id}`,
      {},
      {
        headers: getRequestHeaders(),
      }
    );
  },
  getFollowers(list_id) {
    return axios.post(
      `${Env.APIURL}/api/craftlist/getFollowers/${list_id}`,
      {},
      {
        headers: getRequestHeaders(),
      }
    );
  },
  getContributors(list_id) {
    return axios.post(
      `${Env.APIURL}/api/craftlist/getContributors/${list_id}`,
      {},
      {
        headers: getRequestHeaders(),
      }
    );
  },
};

export default CraftlistService;
