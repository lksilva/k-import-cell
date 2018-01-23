// @flow
import { HANDLE_LOADING, STORE_PRODUCTS, PRODUCT_NOTIFICATION, RESET_PAGE, DECREMENT_PAGE, INCREMENT_PAGE, STORE_TOTAL_PAGE } from '../actions/product';

type actionType = {
  +type: string
};

const initialState = {
  isLoading: false,
  products: [],
  insertResponse: null,
  page: 1,
  totalPage: 1,
  messageNotification: ''
};

export default function user(state: any = initialState, action: actionType) {
  switch (action.type) {
    case HANDLE_LOADING:
      return Object.assign({}, state, {
        isLoading: action.isLoading
      });
    case PRODUCT_NOTIFICATION:
      return Object.assign({}, state, {
        insertResponse: action.response.sucess,
        messageNotification: action.response.messageNotification
      });
    case STORE_PRODUCTS:
      return Object.assign({}, state, {
        products: action.products
      });
    case INCREMENT_PAGE:
      return Object.assign({}, state, {
        page: state.page + 1
      });
    case DECREMENT_PAGE:
      return Object.assign({}, state, {
        page: (state.page - 1) < 1 ? 1 : (state.page - 1)
      });
    case RESET_PAGE:
      return Object.assign({}, state, {
        page: 1,
        totalPage: 1
      });
    case STORE_TOTAL_PAGE:
      return Object.assign({}, state, {
        totalPage: action.count
      });
    default:
      return state;
  }
}
