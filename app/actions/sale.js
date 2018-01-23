// @flow
import configdb from '../config.db';
import mysql from 'mysql';

type actionType = {
  +type: string
};

export const HANDLE_LOADING = 'HANDLE_LOADING';
export const STORE_ALL_PRODUCTS_SALE = 'STORE_ALl_PRODUCTS_SALE';
export const SALE_NOTIFICATION = 'SALE_NOTIFICATION';

export function handleLogin(isLoading: boolean) {
  return {
    isLoading,
    type: HANDLE_LOADING
  };
}

export function storeProducts(products: any) {
  return {
    products,
    type: STORE_ALL_PRODUCTS_SALE
  };
}

export function saleNotification(response: any) {
  return {
    response,
    type: SALE_NOTIFICATION
  };
}

export function saveSales(sales: any) {
  return async (dispatch: (action: actionType) => void) => {
    dispatch(saleNotification({ sucess: null }));
    dispatch(handleLogin(true));
    const response = await saveSalesDB(sales);
    dispatch(handleLogin(false));
    dispatch(saleNotification(response));
  };
}

export function saveSalesDB(sales: any) {
  return new Promise((resolve) => {
    const sql = 'INSERT INTO sale (product_id, sale_date, type_payment, product_amount, value) VALUES ?';

    const recordsSale = sales.map(item => [item.product_id, item.sale_date, item.type_payment === 'money' ? 'DINHEIRO' : 'CARTÃO', item.product_amount, item.value]);

    const connection = mysql.createConnection(configdb);

    connection.query(sql, [recordsSale], (err, result) => {
      if (err) {
        console.error(err);
        resolve({ sucess: false });
      } else {
        const recordsUpdate = sales.map(item => [item.product_id, item.product_amount, item.product_id]);

        let queries = '';

        recordsUpdate.forEach(function (item) {
          queries += mysql.format('UPDATE product dest, (SELECT amount FROM product where id=?) src SET dest.amount = ( src.amount - ?) where dest.id=?;', item);
        });

        connection.query(queries, (err2, result2) => {
          if (err2) {
            console.error(err2);
            resolve({ sucess: false });
          } else {
            console.log('Sale complet', result2.insertId);
            resolve({ sucess: true });
          }
          connection.end(() => {
            console.log('Connection closed');
          });
        });
      }
    });
  });
}

export function getProducts() {
  return async (dispatch: (action: actionType) => void) => {
    dispatch(handleLogin(true));
    const { rows } = await fetchProducts();
    dispatch(storeProducts(rows));
    dispatch(handleLogin(false));
  };
}

function fetchProducts() {
  return new Promise((resolve) => {
    const sql = 'SELECT id, name, sale_value, purchase_price, amount FROM product';

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
