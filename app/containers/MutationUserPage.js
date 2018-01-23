// @flow
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import MutationUser from '../components/MutationUser/MutationUser';
import * as UserActions from '../actions/user';

function mapStateToProps(state) {
  const user = state.router.location.state ? state.router.location.state.editUser : null;
  return {
    insertResponse: state.user.insertResponse,
    isLoading: state.user.isLoading,
    userToEdit: user
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(UserActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MutationUser);
