// @flow
import React, { Component } from 'react';
import styles from './Login.css';
import LoginForm from './LoginForm.js';
import Snackbar from 'material-ui/Snackbar';

class Login extends Component {
  submit: () => void;

  props: {
    submitLogin: () => void,
    insertResponse: any
  }

  state: {
    submit: () => void
  }

  state = {
    open: false,
    rejectOpen: false,
  }

  componentWillReceiveProps(nextProps: any) {
    const displayMessage = nextProps.insertResponse !== this.props.insertResponse;
    if (displayMessage) {
      if (nextProps.insertResponse === false) {
        this.setState({ rejectOpen: true });
      }
    }
  }

  submit = (values: any) => {
    this.props.submitLogin(values);
  }

  handleRequestCloseReject = () => {
    this.setState({
      rejectOpen: false
    });
  }

  render() {
    return (
      <div className={styles.loginWrapper}>
        <div className={styles.loginContainer}>
          <LoginForm onSubmit={this.submit} />
          <Snackbar
            open={this.state.rejectOpen}
            message={'Login ou senha inválidos'}
            autoHideDuration={4000}
            style={{ background: 'red' }}
            onRequestClose={this.handleRequestCloseReject}
          />
        </div>
      </div>
    );
  }
}

export default Login;
