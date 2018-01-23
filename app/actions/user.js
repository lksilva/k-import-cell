// @flow
import configdb from '../config.db';
import mysql from 'mysql';
import { ValueOrNull, ConverTo512 } from '../utils/helpers';

type actionType = {
  +type: string
};

export const HANDLE_LOADING = 'HANDLE_LOADING';
export const STORE_USERS = 'STORE_USERS';
export const USER_NOTIFICATION = 'USER_NOTIFICATION';
export const INCREMENT_PAGE = 'INCREMENT_PAGE';
export const DECREMENT_PAGE = 'DECREMENT_PAGE';
export const STORE_TOTAL_PAGE = 'STORE_TOTAL_PAGE';

export function handleLogin(isLoading: boolean) {
  return {
    isLoading,
    type: HANDLE_LOADING
  };
}

export function storeUsers(users: any) {
  return {
    users,
    type: STORE_USERS
  };
}

export function storeTotalPage(count: number) {
  return {
    count,
    type: STORE_TOTAL_PAGE
  };
}

export function userNotification(response: any) {
  return {
    response,
    type: USER_NOTIFICATION
  };
}

export function incrementPage() {
  return {
    type: INCREMENT_PAGE
  };
}

export function decrementPage() {
  return {
    type: DECREMENT_PAGE
  };
}

export function updateUser(user: any) {
  return async (dispatch: (action: actionType) => void) => {
    dispatch(userNotification({ sucess: null }));
    dispatch(handleLogin(true));
    const response = await updateUserDB(user);
    dispatch(handleLogin(false));
    dispatch(userNotification(response));
  };
}

export function saveUser(user: any) {
  return async (dispatch: (action: actionType) => void) => {
    dispatch(userNotification({ sucess: null }));
    dispatch(handleLogin(true));
    const response = await saveUserDB(user);
    dispatch(handleLogin(false));
    dispatch(userNotification(response));
  };
}

export function getAllUsers(page: number) {
  return async (dispatch: (action: actionType) => void) => {
    dispatch(handleLogin(true));
    const { rows, count } = await fetchUsers(page);
    dispatch(storeUsers(rows));
    dispatch(storeTotalPage(count));
    dispatch(handleLogin(false));
  };
}

function updateUserDB(user: any) {
  return new Promise((resolve) => {
    const properties = Object.keys(user);
    const toUpdate = properties.filter(item => user[item] && item !== 'id');
    console.log('Campos para atualizar', toUpdate);
    const queryParams = toUpdate.map(item => `${item} = ?`).toString();
    const sql = `UPDATE users SET ${queryParams} WHERE id = ${user.id}`;
    const values = toUpdate.map(propertie => {
      if (propertie === 'password' || propertie === 'full_permission' || propertie === 'date_of_birth') {
        if (propertie === 'password') {
          return ConverTo512(user[propertie]);
        } if (propertie === 'full_permission') {
          return user[propertie] ? 1 : 0;
        } if (propertie === 'date_of_birth') {
          return user[propertie] ? new Date(user[propertie]).toISOString().replace(/T.*/, '') : null;
        }
      }
      return ValueOrNull(user[propertie]);
    });

    const connection = mysql.createConnection(configdb);

    connection.query(sql, values, (err, result) => {
      if (err) {
        console.error(err);
        resolve({ sucess: false });
      } else {
        console.log('Editando user', result);
        resolve({ sucess: true });
      }
    });

    connection.end(() => {
      console.log('Connection closed');
    });
  });
}

function saveUserDB(user: any) {
  return new Promise((resolve) => {
    const dateBirth = user.date_of_birth ? new Date(user.date_of_birth).toISOString().replace(/T.*/, '') : null;
    const values = [ValueOrNull(user.login), ConverTo512(user.password), ValueOrNull(user.name),
      ValueOrNull(user.adress), ValueOrNull(user.city), ValueOrNull(user.cep),
      ValueOrNull(user.country), user.full_permission ? 1 : 0, dateBirth];
    const sql = 'INSERT INTO users (login, password, name, adress, city, cep, country, full_permission, date_of_birth) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)';

    const connection = mysql.createConnection(configdb);

    connection.query(sql, values, (err, result) => {
      if (err) {
        console.error(err);
        resolve({ sucess: false });
      } else {
        console.log('Inserido user', result.insertId);
        resolve({ sucess: true });
      }
    });

    connection.end(() => {
      console.log('Connection closed');
    });
  });
}

function fetchUsers(page: number) {
  return new Promise((resolve) => {
    const offset = (page - 1) * 20;
    const limit = 20;

    const sql = `SELECT  id , login, name, adress, city, cep, country, full_permission, date_of_birth FROM users LIMIT ${offset}, ${limit}`;
    const sqlCount = 'SELECT count(id) FROM users';

    const connection = mysql.createConnection(configdb);

    connection.query(`${sql}; ${sqlCount}`, (error, results) => {
      if (error || !results[0].length) {
        resolve({ rows: 0, count: 0 });
      } else {
        const delimiter = parseInt(results[1][0]['count(id)'] / limit);
        const countPage = results[1][0]['count(id)'] % limit === 0 ? delimiter : delimiter + 1;
        resolve({ rows: results[0], count: countPage });
      }
    });

    connection.end(() => {
      console.log('Connection closed');
    });
  });
}
