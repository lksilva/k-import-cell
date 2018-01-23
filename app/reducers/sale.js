// @flow
import { HANDLE_LOADING, STORE_ALL_PRODUCTS_SALE, SALE_NOTIFICATION } from '../actions/sale';

type actionType = {
  +type: string
};

const initialState = {
  isLoading: false,
  products: [],
  insertResponse: null,
};

export default function sale(state: any = initialState, action: actionType) {
  switch (action.type) {
    case HANDLE_LOADING:
      return Object.assign({}, state, {
        isLoading: action.isLoading
      });
    case STORE_ALL_PRODUCTS_SALE:
      return Object.assign({}, state, {
        products: action.products
      });
    case SALE_NOTIFICATION:
      return Object.assign({}, state, {
        insertResponse: action.response.sucess
      });
    default:
      return state;
  }
}
