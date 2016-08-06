import Types from './types';

const login = (username, password) => ({
  type: Types.LOGIN,
  username,
  password
});

const loginSuccess = (data) => ({
  type: Types.LOGIN_SUCCESS,
  data
});

const loginFailure = (error) => ({
  type: Types.LOGIN_FAILURE,
  error
});

const startActivity = () => ({
  type: Types.START_NETWORK
});

const endActivity = () => ({
  type: Types.END_NETWORK
});

const getUser = (authToken) => ({
  type: Types.FETCH_USER,
  authToken
});

const receiveUser = (data) => ({
  type: Types.RECEIVE_USER,
  data
});

const receiveErrors = (errors) => ({
  type: Types.RECEIVE_ERRORS,
  errors
});

export default {
  login,
  loginSuccess,
  loginFailure,
  startActivity,
  endActivity,
  getUser,
  receiveUser,
  receiveErrors
};
