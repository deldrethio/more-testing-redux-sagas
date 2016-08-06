import test from 'ava';
import { take, select, put, call, fork } from 'redux-saga/effects';

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
