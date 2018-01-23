import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Home from '../components/Home/Home';
import * as HeaderActions from '../actions/header';

function mapStateToProps(state) {
  return {
    items: state.header.items,
    userAuth: state.login.user
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(HeaderActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);

