// @flow
import { VALIDATED_LOGIN, STORE_USER, LOGIN_NOTIFICATION } from '../actions/login';

type actionType = {
  +type: string
};

const initialState = {
  isAuth: false,
  user: null,
  insertResponse: null,
};

export default function login(state: any = initialState, action: actionType) {
  switch (action.type) {
    case VALIDATED_LOGIN:
      return Object.assign({}, state, {
        isAuth: action.authenticated
      });
    case STORE_USER:
      return Object.assign({}, state, {
        user: action.user
      });
    case LOGIN_NOTIFICATION:
      return Object.assign({}, state, {
        insertResponse: action.response.sucess
      });
    default:
      return state;
  }
}
