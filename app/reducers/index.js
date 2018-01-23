// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import counter from './counter';
import header from './header';
import login from './login';
import user from './user';
import product from './product';
import sale from './sale';
import cashbook from './cashbook';
import negativebook from './negativebook';

import { reducer as reduxFormReducer } from 'redux-form';

const rootReducer = combineReducers({
  counter,
  header,
  router,
  login,
  user,
  product,
  sale,
  cashbook,
  negativebook,
  form: reduxFormReducer,
});

export default rootReducer;
