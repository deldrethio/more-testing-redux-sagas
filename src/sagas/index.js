import { take, select, call, put, fork } from 'redux-saga/effects';

import Api from '../services/fixtureApi';

import Actions from '../actions/creators';
import Types from '../actions/types';

import { getState } from '../reducers/selectors';

export function * watchFetchUser () {
  const { auth } = yield select(getState);

  yield put(Actions.startActivity());

  const response = yield call(Api.getUser, auth.auth_token);

  yield put(Actions.endActivity());

  if (response.ok) {
    yield put(Actions.receiveUser(response.data));
  } else {
    yield put(Actions.receiveErrors(response.data));
  }
}

export function * watchLogin () {
  while (true) {
    const { username, password } = yield take(Types.LOGIN);

    yield put(Actions.startActivity());

    const response = yield call(Api.login, username, password);

    yield put(Actions.endActivity());

    if (response.ok) {
      yield put(Actions.loginSuccess(response.data));

      yield fork(watchFetchUser);
    } else {
      yield put(Actions.loginFailure(response.data));
    }
  }
}
