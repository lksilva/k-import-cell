// @flow
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import CashBook from '../components/CashBook/CashBook';
import * as CashBookActions from '../actions/cashbook';

function mapStateToProps(state) {
  return {
    isLoading: state.cashbook.isLoading,
    sales: state.cashbook.sales,
    userAuth: state.login.user
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(CashBookActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CashBook);

