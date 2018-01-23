// @flow
import React, { Component } from 'react';
// import styles from './MutationUser.css';
import UserForm from './UserForm';
import { SubmissionError } from 'redux-form';
import Loader from '../Loader/Loader';
import Snackbar from 'material-ui/Snackbar';
import { ValidateUserForm } from '../../utils/helpers';

class MutationUser extends Component {
  props: {
    saveUser: () => void,
    isLoading: boolean,
    insertResponse: any,
    userToEdit: any
  }

  state = {
    confirmOpen: false,
    rejectOpen: false,
  };

  componentWillReceiveProps(nextProps: any) {
    const displayMessage = nextProps.insertResponse !== this.props.insertResponse;
    if (displayMessage) {
      if (nextProps.insertResponse === false) {
        this.setState({ rejectOpen: true });
      } else {
        this.setState({ confirmOpen: true });
      }
    }
  }

  saveUser = async (values: any) => {
    const validateObj = await ValidateUserForm(values);
    if (validateObj.hasError) {
      throw new SubmissionError(validateObj.errors);
    }
    this.props.saveUser(values);
  }

  handleRequestClose = () => {
    this.setState({
      confirmOpen: false,
    });
  };

  handleRequestCloseReject = () => {
    this.setState({
      rejectOpen: false
    });
  }

  render() {
    const { isLoading, userToEdit } = this.props;

    return (
      <div>
        {isLoading ?
          <Loader /> :
          <UserForm onSubmit={this.saveUser} user={userToEdit} />
        }
        <Snackbar
          open={this.state.confirmOpen}
          message="Usuário inserido com sucesso!"
          autoHideDuration={4000}
          onRequestClose={this.handleRequestClose}
        />
        <Snackbar
          open={this.state.rejectOpen}
          message="Falha ao tentar inserir usuário"
          autoHideDuration={4000}
          style={{ background: 'red' }}
          onRequestClose={this.handleRequestCloseReject}
        />
      </div>
    );
  }
}

export default MutationUser;
