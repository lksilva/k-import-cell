import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Header from '../components/Header/Header';
import * as HeaderActions from '../actions/header';
import * as LoginActions from '../actions/login';

function mapStateToProps(state) {
  return {
    items: state.header.items,
    userAuth: state.login.user
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, HeaderActions, LoginActions), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);

