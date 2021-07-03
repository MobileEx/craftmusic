import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import store from '../store/configureStore';
import Env from '../helpers/environment';
/*
let token = '';
AsyncStorage.getItem('@craft_token').then(res => {
  token = res;
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  axios.defaults.headers.common['ContentType'] = 'application/json';
  axios.defaults.headers.common['Accept'] = 'application/json';
});
*/
// const state = store.getState();
// console.log('user token:', state.user.token);

// axios.defaults.headers.common['Authorization'] = `Bearer ${state.user.token}`;
// axios.defaults.headers.common['ContentType'] = 'application/json';
// axios.defaults.headers.common['Accept'] = 'application/json';

const headers = {
  Accept: 'application/json',
  ContentType: 'application/json',
};

function getRequestHeaders() {
  const state = store.getState();
  headers.Authorization = `Bearer ${state.user.token}`;
  return headers;
}

const PaymentService = {
  addSellerAccount(userId, email) {
    return axios.post(
      `${Env.APIURL}/api/payment/addSellerAccount`,
      {
        user_id: userId,
        account_email: email,
      },
      {
        headers: getRequestHeaders(),
      }
    );
  },
  addBuyerAccount(userId, email) {
    return axios.post(
      `${Env.APIURL}/api/payment/addBuyerAccount`,
      {
        user_id: userId,
        account_email: email,
      },
      {
        headers: getRequestHeaders(),
      }
    );
  },
  deleteSellerAccount(userId) {
    return axios.post(
      `${Env.APIURL}/api/payment/deleteSellerAccount`,
      {
        user_id: userId,
      },
      {
        headers: getRequestHeaders(),
      }
    );
  },
  deleteBuyerAccount(userId) {
    return axios.post(
      `${Env.APIURL}/api/payment/deleteBuyerAccount`,
      {
        user_id: userId,
      },
      {
        headers: getRequestHeaders(),
      }
    );
  },
  getPaymentAccount(userId) {
    return axios.post(
      `${Env.APIURL}/api/payment/getPaymentAccount`,
      {
        user_id: userId,
      },
      {
        headers: getRequestHeaders(),
      }
    );
  },
  getTransactionHistory(userId) {
    return axios.post(
      `${Env.APIURL}/api/payment/getTransactionHistory`,
      {
        user_id: userId,
      },
      {
        headers: getRequestHeaders(),
      }
    );
  },
  addTransactionHistory(buyerId, sellerId, item, amount) {
    return axios.post(
      `${Env.APIURL}/api/payment/addTransactionHistory`,
      {
        buyer_id: buyerId,
        seller_id: sellerId,
        item,
        amount,
      },
      {
        headers: getRequestHeaders(),
      }
    );
  },
  sendMoney(sender_id, receiver_id, amount, type) {
    return axios.post(
      `${Env.APIURL}/api/payment/sendMoney`,
      {
        sender_id,
        receiver_id,
        amount,
        type,
      },
      {
        headers: getRequestHeaders(),
      }
    );
  },

  sendEmail(id) {
    return axios.post(
      `${Env.APIURL}/api/playingCraft/sendEmail`,
      {
        craft_item_id: id,
      },
      {
        headers: getRequestHeaders(),
      }
    );
  },

  buyCart(items) {
    return axios.post(
      `${Env.APIURL}/api/payment/buyCart`,
      {
        items,
      },
      {
        headers: getRequestHeaders(),
      }
    );
  },
};

export default PaymentService;
