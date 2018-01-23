// @flow
import { HANDLE_MENU } from '../actions/header';

export type itemsStateType = {
  +items: arrays
};

type actionType = {
  +type: string
};

const initialState = {
  items: [
    { id: 2, route: '/home', active: false, name: 'Inicial' },
    { id: 3, route: '/cashBook', active: false, name: 'Livro Caixa' },
    { id: 4, route: '/sale', active: false, name: 'Venda' },
    { id: 5, route: '/product', active: false, name: 'Estoque' },
    { id: 7, route: '/product/mutation', active: false, name: 'Cadastrar Produto' },
    { id: 8, route: '/user', active: false, name: 'Usuário' },
    { id: 9, route: '/user/mutation', active: false, name: 'Cadastrar Usuário' },
    { id: 10, route: '/negativeBook', active: false, name: 'Prejuizo' },
  ]
};

export default function header(state: items = initialState, action: actionType) {
  switch (action.type) {
    case HANDLE_MENU: {
      const itemsChanged = state.items.map(i => {
        let item = i;
        if (item.name === action.menu) {
          item.active = true;
        } else {
          item.active = false;
        }
        return item;
      });
      return Object.assign({}, state, {
        items: itemsChanged
      });
    }
    default:
      return state;
  }
}
