// @flow
import React, { Component } from 'react';
import styles from './User.css';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
  TableFooter,
} from 'material-ui/Table';
import Loader from '../Loader/Loader';
import Dialog from 'material-ui/Dialog';
import FlatButton from '../Button/FlatButton';
import EditUserForm from '../MutationUser/EdtirUserForm';
import { SubmissionError } from 'redux-form';
import Snackbar from 'material-ui/Snackbar';
import { ValidateUserForm } from '../../utils/helpers';

const TableExampleSimple = (props) => {
  const { users, handleEdit, previous, next, page, totalPage } = props;

  return (
    <Table allRowsSelected={false} selectable={false}>
      <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
        <TableRow>
          <TableHeaderColumn>ID</TableHeaderColumn>
          <TableHeaderColumn>Nome</TableHeaderColumn>
          <TableHeaderColumn>Permissão Total</TableHeaderColumn>
          <TableHeaderColumn>Editar</TableHeaderColumn>
        </TableRow>
      </TableHeader>
      <TableBody displayRowCheckbox={false}>
        {users.map((user, index) => (
          <TableRow className={styles.tableRow} key={user.id} style={{ background: index % 2 ? 'white' : 'rgba(245, 227, 155, 0.24)' }}>
            <TableRowColumn>{user.id}</TableRowColumn>
            <TableRowColumn>{user.name}</TableRowColumn>
            <TableRowColumn>{user.full_permission ? 'SIM' : 'NÃO'}</TableRowColumn>
            <TableRowColumn className={styles.editAction}>
              <div onClick={(e) => handleEdit(user)}>
                <svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                  <path d="M0 0h24v24H0z" fill="none" />
                </svg>
              </div>
            </TableRowColumn>

          </TableRow>
        ))}
      </TableBody>
      <TableFooter style={{ backgroundColor: '#3B3F42', display: 'flex', justifyContent: 'flex-end' }}>
        <FlatButton label="Anterior" handleClick={previous} disabled={page === 1} />
        <FlatButton label="Próximo" handleClick={next} disabled={page === totalPage} />
      </TableFooter>
    </Table>
  );
};

class User extends Component {
  props: {
    getAllUsers: (number) => void,
    incrementPage: () => void,
    decrementPage: () => void,
    updateUser: (any) => void,
    isLoading: boolean,
    users: any,
    page: number,
    totalPage: number,
    insertResponse: any
  }

  state: {
    user: any,
    open: boolean
  }

  state = {
    user: null,
    open: false,
    confirmOpen: false,
    rejectOpen: false,
  }

  componentWillMount() {
    this.fetchUser();
  }

  componentWillReceiveProps(nextProps: any) {
    const goFetching = nextProps.page !== this.props.page;
    if (goFetching) {
      this.props.getAllUsers(nextProps.page);
    }
    const displayMessage = nextProps.insertResponse !== this.props.insertResponse;
    if (displayMessage) {
      this.handleClose();
      if (nextProps.insertResponse === false) {
        console.log('Mostrar reject Open');
        this.setState({ rejectOpen: true });
      } else {
        console.log('Confirma Open');
        this.setState({ confirmOpen: true }, () => this.props.getAllUsers(nextProps.page));
      }
    }
  }

  handleEdit = (user: any) => {
    this.setState({ user, open: true });
  };

  previous = () => {
    this.props.decrementPage();
  }

  next = () => {
    this.props.incrementPage();
  }

  fetchUser = () => {
    this.props.getAllUsers(this.props.page);
  }

  handleClose = () => {
    this.setState({ open: false });
  };

  editUser = async (userEdited: any) => {
    const validateObj = await ValidateUserForm(userEdited);
    if (validateObj.hasError) {
      throw new SubmissionError(validateObj.errors);
    }
    const newUser = Object.assign({}, userEdited, { id: this.state.user.id });
    this.props.updateUser(newUser);
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
    const { isLoading, users, page, totalPage } = this.props;

    return (
      <div className={styles.userContainer}>
        {isLoading ?
          <Loader /> :
          <div>
            <TableExampleSimple users={users} handleEdit={(user) => this.handleEdit(user)} previous={this.previous} next={this.next} page={page} totalPage={totalPage} />
            <Dialog
              title="Editar Usuário"
              modal={false}
              open={this.state.open}
              onRequestClose={this.handleClose}
              autoScrollBodyContent
            >
              {this.state.user &&
                <EditUserForm onSubmit={this.editUser} user={this.state.user} />
              }
            </Dialog>
          </div>
        }
        <Snackbar
          open={this.state.confirmOpen}
          message="Usuário editado com sucesso!"
          autoHideDuration={4000}
          onRequestClose={this.handleRequestClose}
        />
        <Snackbar
          open={this.state.rejectOpen}
          message="Falha ao tentar editar usuário"
          autoHideDuration={4000}
          style={{ background: 'red' }}
          onRequestClose={this.handleRequestCloseReject}
        />
      </div>
    );
  }
}

export default User;
