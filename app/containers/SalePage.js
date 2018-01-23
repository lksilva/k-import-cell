// @flow
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Sale from '../components/Sale/Sale';
import * as SaleActions from '../actions/sale';

function mapStateToProps(state) {
  return {
    isLoading: state.sale.isLoading,
    products: state.sale.products,
    insertResponse: state.sale.insertResponse,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(SaleActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Sale);

