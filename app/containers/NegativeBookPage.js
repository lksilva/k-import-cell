// @flow
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import NegativeBook from '../components/NegativeBook/NegativeBook';
import * as NegativeBookActions from '../actions/negativebook';

function mapStateToProps(state) {
  return {
    isLoading: state.negativebook.isLoading,
    negatives: state.negativebook.negatives,
    insertResponse: state.negativebook.insertResponse,
    userAuth: state.login.user
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(NegativeBookActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(NegativeBook);

