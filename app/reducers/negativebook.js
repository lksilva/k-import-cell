// @flow
import { HANDLE_LOADING, STORE_ALL_NEGATIVES, NEGATIVE_NOTIFICATION } from '../actions/negativebook';

type actionType = {
  +type: string
};

const initialState = {
  isLoading: false,
  insertResponse: null,
  negatives: []
};

export default function negativebook(state: any = initialState, action: actionType) {
  switch (action.type) {
    case HANDLE_LOADING:
      return Object.assign({}, state, {
        isLoading: action.isLoading 
      });
      case NEGATIVE_NOTIFICATION:
      return Object.assign({}, state, {
        insertResponse: action.response.sucess
      });
    case STORE_ALL_NEGATIVES:
      return Object.assign({}, state, {
        negatives: action.negatives
      });
    default:
      return state;
  }
}
