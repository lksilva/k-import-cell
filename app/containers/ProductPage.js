// @flow
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Product from '../components/Product/Product';
import * as ProductActions from '../actions/product';

function mapStateToProps(state) {
  return {
    isLoading: state.product.isLoading,
    products: state.product.products,
    page: state.product.page,
    totalPage: state.product.totalPage,
    insertResponse: state.product.insertResponse,
    messageNotification: state.product.messageNotification
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ProductActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Product);

