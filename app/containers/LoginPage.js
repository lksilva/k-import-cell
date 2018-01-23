// @flow
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Login from '../components/Login/Login';
import * as LoginActions from '../actions/login';

function mapStateToProps(state) {
  return {
    insertResponse: state.login.insertResponse
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(LoginActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);

