import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import User from '../components/User/User';
import * as UserActions from '../actions/user';

function mapStateToProps(state) {
  return {
    isLoading: state.user.isLoading,
    users: state.user.users,
    page: state.user.page,
    totalPage: state.user.totalPage,
    insertResponse: state.user.insertResponse
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(UserActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(User);

