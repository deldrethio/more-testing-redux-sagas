import test from 'ava';
import { take, select, put, call, fork } from 'redux-saga/effects';
import createSagaMiddleware from 'redux-saga';
import configureStore from 'redux-mock-store';

import {
  watchLogin,
  fetchUser
} from '../../src/sagas';
import Actions from '../../src/actions/creators';
import Types from '../../src/actions/types';

import Api from '../../src/services/fixtureApi';

import { getState } from '../../src/reducers/selectors';

const stepper = (fn) => (mock) => fn.next(mock).value;

test('the watch login saga', t => {
  const step = stepper(watchLogin());
  const mock = {
    username: 'test',
    password: 'test_pass'
  };

  const mockResponse = {
    ok: true,
    data: {
      auth_token: '1234'
    }
  };

  t.deepEqual(
    step(),
    take(Types.LOGIN)
  );

  t.deepEqual(
    step(mock),
    put(Actions.startActivity())
  );

  t.deepEqual(
    step(),
    call(Api.login, mock.username, mock.password)
  );

  t.deepEqual(
    step(mockResponse),
    put(Actions.endActivity())
  );

  t.deepEqual(
    step(),
    put(Actions.loginSuccess(mockResponse.data))
  );

  t.deepEqual(
    step(),
    fork(fetchUser)
  );

  const userStep = stepper(fetchUser());
  const mockGetUserReponse = {
    ok: true,
    data: {
      name: 'Rick Deckard',
      address: 'Earth'
    }
  };

  t.deepEqual(
    userStep(),
    select(getState)
  );

  t.deepEqual(
    userStep(getState()),
    put(Actions.startActivity())
  );

  t.deepEqual(
    userStep(),
    call(Api.getUser, getState().auth.auth_token)
  );

  t.deepEqual(
    userStep(mockGetUserReponse),
    put(Actions.endActivity())
  );

  t.deepEqual(
    userStep(),
    put(Actions.receiveUser(mockGetUserReponse.data))
  );

  // The watchFetchUser saga does not iterate
  t.is(
    userStep(),
    undefined
  );

  // For good measure, lets see if the prefork watchLogin saga is where we expect
  t.deepEqual(
    step(),
    take(Types.LOGIN)
  );
});


test('mock store, watch login saga', t => {
  const sagaMiddleware = createSagaMiddleware();
  const store = configureStore([sagaMiddleware])();
  sagaMiddleware.run(watchLogin);

  const mockData = { username: '1234', password: '4321' };
  const mockLogin = Api.login(mockData.username, mockData.password);
  const mockGetUser = Api.getUser(mockLogin.data.auth_token);

  const expectedActions = [
    { type: Types.LOGIN, ...mockData },
    { type: Types.START_NETWORK },
    { type: Types.END_NETWORK },
    { type: Types.LOGIN_SUCCESS, data: mockLogin.data },
    { type: Types.START_NETWORK },
    { type: Types.END_NETWORK },
    { type: Types.RECEIVE_USER, data: mockGetUser.data }
  ];

  store.dispatch(Actions.login(mockData.username, mockData.password));

  t.deepEqual(
    store.getActions(),
    expectedActions
  );
});
