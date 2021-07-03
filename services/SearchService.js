import axios from 'axios';
import store from '../store/configureStore';
import Env from '../helpers/environment';

const headers = {
  Accept: 'application/json',
  ContentType: 'application/json',
};

function getRequestHeaders() {
  const state = store.getState();
  headers.Authorization = `Bearer ${state.user.token}`;
  return headers;
}

const SearchService = {
  search(keyword, user, craft, craftlist, is_hash = false, show_banned_users = false) {
    return axios.post(
      `${Env.APIURL}/api/search/search`,
      {
        keyword,
        user,
        craft,
        craftlist,
        is_hash,
        show_banned_users,
      },
      {
        headers: getRequestHeaders(),
      }
    );
  },

  getUserByUsername(username) {
    return axios.post(
      `${Env.APIURL}/api/search/getUserByUsername`,
      {
        username,
      },
      {
        headers: getRequestHeaders(),
      }
    );
  },

  getUserSuggestions(searchTerm) {
    return axios.post(
      `${Env.APIURL}/api/search/getUserSuggestions`,
      {
        searchTerm,
      },
      {
        headers: getRequestHeaders(),
      }
    );
  },

  trendingHashTags() {
    return axios.post(
      `${Env.APIURL}/api/search/trendingHashtags`,
      {},
      {
        headers: getRequestHeaders(),
      }
    );
  },

  only_show_lists(keyword) {
    return axios.post(
      `${Env.APIURL}/api/search/hashtags`,
      {
        keyword,
      },
      {
        headers: getRequestHeaders(),
      }
    );
  },
};

export default SearchService;
