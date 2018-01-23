// @flow
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import MutationProduct from '../components/MutationProduct/MutationProduct';
import * as ProductActions from '../actions/product';

function mapStateToProps(state) {
  const product = state.router.location.state ? state.router.location.state.editProduct : null;
  return {
    insertResponse: state.product.insertResponse,
    isLoading: state.product.isLoading,
    productToEdit: product
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ProductActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MutationProduct);
