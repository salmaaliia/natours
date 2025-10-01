import axios from 'axios';
import { showAlert } from './alert';

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/login',
      data: {
        email,
        password,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully');
      window.setTimeout(() => {
        location.assign('/');
      }, 1000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/users/logout',
    });
    if (res.data.status === 'success') {
      window.setTimeout(() => {
        location.assign('/');
      }, 500);
      // if (window.location.pathname === '/me') {
      //   window.setTimeout(() => {
      //     location.assign('/');
      //   }, 500);
      // } else location.reload(true);
      //   location.reload(true);
    }
  } catch (err) {
    console.log(err);
    showAlert('error', 'Error logging out! Try again.');
  }
};

export const signup = async (userData) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/signup',
      data: userData,
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Account creted and Logged in successfully');
      window.setTimeout(() => {
        location.assign('/');
      }, 1000);
    }
  } catch (err) {
    console.error('SIGNUP ERROR:', err.response ? err.response.data : err);
    showAlert('error', err.response?.data?.message || 'Something went wrong!');
  }
};
