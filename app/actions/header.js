// @flow
import { push } from 'react-router-redux';

export const HANDLE_MENU = 'HANDLE_MENU';

type actionType = {
  +type: string
};


export function handleClick(name) {
  return {
    menu: name,
    type: HANDLE_MENU
  };
}

export function goTo(route: any) {
  return async (dispatch: (action: actionType) => void) => {
    if (route) {
      dispatch(push(route));
    }
  };
}
