import { createTypes } from 'reduxsauce';

export default createTypes(`
  LOGIN
  LOGIN_SUCCESS
  LOGIN_FAILURE

  START_NETWORK
  END_NETWORK

  FETCH_USER
  RECEIVE_USER
  RECEIVE_ERRORS
`);
