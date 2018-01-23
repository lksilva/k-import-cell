// @flow
import { push } from 'react-router-redux';
import crypto from 'crypto';
import configdb from '../config.db';
import mysql from 'mysql';

type actionType = {
  +type: string
};

export const VALIDATED_LOGIN = 'VALIDATED_LOGIN';
export const STORE_USER = 'STORE_USER';
export const LOGIN_NOTIFICATION = 'LOGIN_NOTIFICATION';

export function validatedLogin(authenticated: boolean) {
  return {
    authenticated,
    type: VALIDATED_LOGIN
  };
}

export function storeUser(user: any) {
  return {
    user,
    type: STORE_USER
  };
}

export function loginNotification(response: any) {
  return {
    response,
    type: LOGIN_NOTIFICATION
  };
}

export function submitLogin(credentials: any) {
  return async (dispatch: (action: actionType) => void) => {
    dispatch(loginNotification({ sucess: null }));
    if (credentials) {
      const payloadLogin = await validateLogin(credentials);

      dispatch(validatedLogin(payloadLogin.isValid));
      dispatch(loginNotification({ sucess: payloadLogin.isValid }));
      dispatch(storeUser(payloadLogin.user));

      if (payloadLogin.isValid) {
        dispatch(push('/home'));
      }
    } else {
      dispatch(loginNotification({ sucess: false }));
      dispatch(validatedLogin(false));
    }
  };
}

export function submitLogout() {
  return (dispatch: (action: actionType) => void) => {
    dispatch(push('/'));
    dispatch(validatedLogin(false));
    dispatch(storeUser(null));
  };
}

function validateLogin(credentials: object) {
  return new Promise((resolve) => {
    const toSha512 = converTo512(credentials.password);
    const sql = `SELECT id, name, full_permission FROM users WHERE login = '${credentials.login}' and password = '${toSha512}'`;

    const connection = mysql.createConnection(configdb);

    connection.query(sql, (error, results) => {
      if (error || !results.length) {
        resolve({ user: null, isValid: false });
      }
      resolve({ user: results[0], isValid: true });
    });

    connection.end(() => {
      console.log('Connection closed');
    });
  });
}

function converTo512(pass) {
  return crypto.createHash('sha512').update(pass, 'utf-8').digest('hex');
}
