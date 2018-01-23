// @flow
import configdb from '../config.db';
import mysql from 'mysql';
import { ValueOrNull } from '../utils/helpers';

type actionType = {
  +type: string
};

export const HANDLE_LOADING = 'HANDLE_LOADING';
export const STORE_ALL_NEGATIVES = 'STORE_ALL_NEGATIVES';
export const NEGATIVE_NOTIFICATION = 'NEGATIVE_NOTIFICATION';

export function handleLogin(isLoading: boolean) {
  return {
    isLoading,
    type: HANDLE_LOADING
  };
}

export function storeNegatives(negatives: any) {
  return {
    negatives,
    type: STORE_ALL_NEGATIVES
  };
}

export function negativeNotification(response: any) {
  return {
    response,
    type: NEGATIVE_NOTIFICATION
  };
}

export function saveNegative(negative: any) {
  return async (dispatch: (action: actionType) => void) => {
    dispatch(negativeNotification({ sucess: null }));
    dispatch(handleLogin(true));
    const response = await saveNegativeDB(negative);
    dispatch(handleLogin(false));
    dispatch(negativeNotification(response));
  };
}

export function updateNegative(negative: any) {
  return async (dispatch: (action: actionType) => void) => {
    dispatch(negativeNotification({ sucess: null }));
    dispatch(handleLogin(true));
    const response = await updateNegativeDB(negative);
    dispatch(handleLogin(false));
    dispatch(negativeNotification(response));
  };
}

export function getNegativesByPeriod(start: any, end: any) {
  return async (dispatch: (action: actionType) => void) => {
    dispatch(handleLogin(true));
    const { rows } = await fetchNegativesByPeriod(start, end);
    dispatch(storeNegatives(rows));
    dispatch(handleLogin(false));
  };
}

function saveNegativeDB(negative: any) {
  return new Promise((resolve) => {
    const dateNow = new Date().toISOString().replace(/T.*/, '');
    const values = [ValueOrNull(negative.description), ValueOrNull(negative.value), dateNow];
    const sql = 'INSERT INTO negative_values (description, value, date_of_insert) VALUES(?, ?, ?)';

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

function updateNegativeDB(negative: any) {
  return new Promise((resolve) => {
    const properties = Object.keys(negative);
    const toUpdate = properties.filter(item => negative[item] && item !== 'id');
    console.log('Campos para atualizar', toUpdate);
    const queryParams = toUpdate.map(item => `${item} = ?`).toString();
    const sql = `UPDATE negative_values SET ${queryParams} WHERE id = ${negative.id}`;
    const values = toUpdate.map(propertie => ValueOrNull(negative[propertie]));

    const connection = mysql.createConnection(configdb);

    connection.query(sql, values, (err, result) => {
      if (err) {
        console.error(err);
        resolve({ sucess: false });
      } else {
        console.log('Editando Negative', result);
        resolve({ sucess: true });
      }
    });

    connection.end(() => {
      console.log('Connection closed');
    });
  });
}

function fetchNegativesByPeriod(start: any, end: any) {
  return new Promise((resolve) => {
    const sql = mysql.format('SELECT id, description, value, date_of_insert FROM negative_values WHERE date_of_insert BETWEEN ? and ?', [start, end]);

    const connection = mysql.createConnection(configdb);

    connection.query(sql, (error, results) => {
      if (error || !results.length) {
        resolve({ rows: 0 });
      } else {
        resolve({ rows: results });
      }
    });

    connection.end(() => {
      console.log('Connection closed');
    });
  });
}
