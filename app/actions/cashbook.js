// @flow
import configdb from '../config.db';
import mysql from 'mysql';

type actionType = {
  +type: string
};

export const HANDLE_LOADING = 'HANDLE_LOADING';
export const STORE_ALL_SALES = 'STORE_ALL_SALES';

export function handleLogin(isLoading: boolean) {
  return {
    isLoading,
    type: HANDLE_LOADING
  };
}

export function storeSales(sales: any) {
  return {
    sales,
    type: STORE_ALL_SALES
  };
}

export function getSalesByPeriod(start: any, end: any) {
  return async (dispatch: (action: actionType) => void) => {
    dispatch(handleLogin(true));
    const { rows } = await fetchSalesByPeriod(start, end);
    dispatch(storeSales(rows));
    dispatch(handleLogin(false));
  };
}

function fetchSalesByPeriod(start: any, end: any) {
  return new Promise((resolve) => {
    const sql = mysql.format('SELECT sale.id, product.name as product_name, sale_date, type_payment, product_amount, value, product.purchase_price as purchase FROM sale INNER JOIN product ON product.id = sale.product_id WHERE sale.sale_date BETWEEN ? AND ? ORDER BY sale.sale_date', [start, end]);

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
