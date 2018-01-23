// @flow
import { HANDLE_LOADING, STORE_ALL_SALES } from '../actions/cashbook';

type actionType = {
  +type: string
};

const initialState = {
  isLoading: false,
  sales: []
};

export default function sale(state: any = initialState, action: actionType) {
  switch (action.type) {
    case HANDLE_LOADING:
      return Object.assign({}, state, {
        isLoading: action.isLoading
      });
    case STORE_ALL_SALES:
      return Object.assign({}, state, {
        sales: action.sales
      });
    default:
      return state;
  }
}
