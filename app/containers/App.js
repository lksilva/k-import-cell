// @flow
import React, { Component } from 'react';
import type { Children } from 'react';
import { connect } from 'react-redux';
import HeaderPage from './HeaderPage';
import LoginPage from './LoginPage';

const mapStateToProps = (state) => ({
  isAuth: state.login.isAuth,
});

const renderLoginFlow = (children) => <div> <LoginPage /> {children} </div>;

const renderNormalFlow = (children) => (
  <div className="container">
    <HeaderPage />
    {children}
  </div>
);

class App extends Component {
  props: {
    children: Children,
    isAuth: any
  };

  render() {
    const { isAuth, children } = this.props;
    return (
      isAuth ?
        renderNormalFlow(children) :
        renderLoginFlow()
    );
  }
}


export default connect(mapStateToProps)(App);
