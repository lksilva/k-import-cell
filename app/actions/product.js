// @flow
import configdb from '../config.db';
import mysql from 'mysql';
import { ValueOrNull, ValueOrZero } from '../utils/helpers';

type actionType = {
  +type: string
};

export const HANDLE_LOADING = 'HANDLE_LOADING';
export const STORE_PRODUCTS = 'STORE_PRODUCTS';
export const PRODUCT_NOTIFICATION = 'PRODUCT_NOTIFICATION';
export const INCREMENT_PAGE = 'INCREMENT_PAGE';
export const DECREMENT_PAGE = 'DECREMENT_PAGE';
export const STORE_TOTAL_PAGE = 'STORE_TOTAL_PAGE';
export const RESET_PAGE = 'RESET_PAGE';

export function handleLogin(isLoading: boolean) {
  return {
    isLoading,
    type: HANDLE_LOADING
  };
}

export function storeProducts(products: any) {
  return {
    products,
    type: STORE_PRODUCTS
  };
}

export function storeTotalPage(count: number) {
  return {
    count,
    type: STORE_TOTAL_PAGE
  };
}

export function productNotification(response: any) {
  return {
    response,
    type: PRODUCT_NOTIFICATION
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

export function resetPage() {
  return {
    type: RESET_PAGE
  };
}

export function updateProduct(product: any) {
  return async (dispatch: (action: actionType) => void) => {
    dispatch(productNotification({ sucess: null }));
    dispatch(handleLogin(true));
    const response = await updateProductDB(product);
    dispatch(handleLogin(false));
    dispatch(productNotification(response));
  };
}

export function fetchByName(productName: any) {
  return async (dispatch: (action: actionType) => void) => {
    if (productName) {
      dispatch(handleLogin(true));
      const { rows } = await fetchProductsByName(productName);
      dispatch(resetPage());
      dispatch(storeProducts(rows));
      dispatch(handleLogin(false));
    } else {
      // Faz a chamada da página inicial
      dispatch(getAllProducts(1));
    }
  };
}

export function deleteProduct(productId: any) {
  return async (dispatch: (action: actionType) => void) => {
    dispatch(productNotification({ sucess: null }));
    dispatch(handleLogin(true));
    const response = await deleteProductDB(productId);
    dispatch(handleLogin(false));
    dispatch(productNotification(response));
  };
}

export function saveProduct(product: any) {
  return async (dispatch: (action: actionType) => void) => {
    dispatch(productNotification({ sucess: null }));
    dispatch(handleLogin(true));
    const response = await saveProductDB(product);
    dispatch(handleLogin(false));
    dispatch(productNotification(response));
  };
}

export function getAllProducts(page: number) {
  return async (dispatch: (action: actionType) => void) => {
    dispatch(handleLogin(true));
    const { rows, count } = await fetchProducts(page);
    dispatch(storeProducts(rows));
    dispatch(storeTotalPage(count));
    dispatch(handleLogin(false));
  };
}

function updateProductDB(product: any) {
  return new Promise((resolve) => {
    const properties = Object.keys(product);
    const toUpdate = properties.filter(item => product[item] && item !== 'id');
    console.log('Campos para atualizar', toUpdate);
    const queryParams = toUpdate.map(item => `${item} = ?`).toString();
    const sql = `UPDATE product SET ${queryParams} WHERE id = ${product.id}`;
    const values = toUpdate.map(propertie => {
      if (propertie === 'description' || propertie === 'name' || propertie === 'bar_code') {
        return ValueOrNull(product[propertie]);
      }
      return ValueOrZero(product[propertie]);
    });

    const connection = mysql.createConnection(configdb);

    connection.query(sql, values, (err, result) => {
      if (err) {
        console.error(err);
        resolve({ sucess: false, messageNotification: 'Falha ao tentar atualizar Produto' });
      } else {
        console.log('Editando product', result);
        resolve({ sucess: true, messageNotification: 'Produto Atualizado com sucesso' });
      }
    });

    connection.end(() => {
      console.log('Connection closed');
    });
  });
}

function saveProductDB(product: any) {
  return new Promise((resolve) => {
    const values = [ValueOrNull(product.description), ValueOrNull(product.name),
    ValueOrNull(product.bar_code), ValueOrZero(product.sale_value),
    ValueOrZero(product.purchase_price), ValueOrZero(product.amount)];
    const sql = 'INSERT INTO product (description, name, bar_code, sale_value, purchase_price, amount) VALUES(?, ?, ?, ?, ?, ?)';

    const connection = mysql.createConnection(configdb);

    connection.query(sql, values, (err, result) => {
      if (err) {
        console.error(err);
        resolve({ sucess: false, messageNotification: 'Falha ao tentar inserir Produto' });
      } else {
        console.log('Inserido product', result.insertId);
        resolve({ sucess: true, messageNotification: 'Produto inserido com sucesso' });
      }
    });

    connection.end(() => {
      console.log('Connection closed');
    });
  });
}

function deleteProductDB(id: any) {
  return new Promise((resolve) => {
    const sql = `DELETE FROM product WHERE id = ${id}`;

    const connection = mysql.createConnection(configdb);

    connection.query(sql, (err, result) => {
      if (err) {
        console.error(err);
        resolve({ sucess: false, messageNotification: 'Falha ao tentar deletar produto' });
      } else {
        console.log('Removido produto', result);
        resolve({ sucess: true, messageNotification: 'Produto deletado com sucesso' });
      }
    });

    connection.end(() => {
      console.log('Connection closed');
    });
  });
}

function fetchProductsByName(name: string) {
  return new Promise((resolve) => {
    const sql = `SELECT id, description, name, bar_code, sale_value, purchase_price, amount FROM product WHERE name LIKE '%${name}%'`;

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

function fetchProducts(page: number) {
  return new Promise((resolve) => {
    const offset = (page - 1) * 20;
    const limit = 20;

    const sql = `SELECT id, description, name, bar_code, sale_value, purchase_price, amount FROM product LIMIT ${offset}, ${limit}`;
    const sqlCount = 'SELECT count(id) FROM product';

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
