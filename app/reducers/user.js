// @flow
import { HANDLE_LOADING, STORE_USERS, USER_NOTIFICATION, DECREMENT_PAGE, INCREMENT_PAGE, STORE_TOTAL_PAGE } from '../actions/user';

type actionType = {
  +type: string
};

const initialState = {
  isLoading: false,
  users: [],
  insertResponse: null,
  page: 1,
  totalPage: 1
};

export default function user(state: any = initialState, action: actionType) {
  switch (action.type) {
    case HANDLE_LOADING:
      return Object.assign({}, state, {
        isLoading: action.isLoading
      });
    case USER_NOTIFICATION:
      return Object.assign({}, state, {
        insertResponse: action.response.sucess
      });
    case STORE_USERS:
      return Object.assign({}, state, {
        users: action.users
      });
    case INCREMENT_PAGE:
      return Object.assign({}, state, {
        page: state.page + 1
      });
    case DECREMENT_PAGE:
      return Object.assign({}, state, {
        page: (state.page - 1) < 1 ? 1 : (state.page - 1)
      });
    case STORE_TOTAL_PAGE:
      return Object.assign({}, state, {
        totalPage: action.count
      });
    default:
      return state;
  }
}
