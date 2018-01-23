/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { Switch, Route } from 'react-router';
import App from './containers/App';
import HomePage from './containers/HomePage';
import CashBookPage from './containers/CashBookPage';
import SalesPage from './containers/SalePage';
import UserPage from './containers/UserPage';
import ProductPage from './containers/ProductPage';
import MutationProductPage from './containers/MutationProductPage';
import MutationUserPage from './containers/MutationUserPage';
import NegativeBookPage from './containers/NegativeBookPage';
import LoginPage from './containers/LoginPage';

export default () => (
  <App>
    <Switch>
      <Route path="/cashBook" component={CashBookPage} />
      <Route path="/sale" component={SalesPage} />
      <Route path="/user/mutation" component={MutationUserPage} />
      <Route path="/user" component={UserPage} />
      <Route path="/product/mutation" component={MutationProductPage} />
      <Route path="/product" component={ProductPage} />
      <Route path="/home" component={HomePage} />
      <Route path="/negativeBook" component={NegativeBookPage} />
      <Route path="/" component={LoginPage} />
    </Switch>
  </App>
);
