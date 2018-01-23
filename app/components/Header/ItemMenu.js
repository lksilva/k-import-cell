import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.css';

class ItemMenu extends Component {
  props: {
    handleOnChange: () => void,
    route: string,
    name: string,
    active: boolean
  };

  render() {
    const { route, active, name, handleOnChange } = this.props;
    return (
      <li onClick={handleOnChange} className={active ? `${styles.menuItem} ${styles.menuItemCurrent}` : styles.menuItem}>
        <Link className={styles.menuLink} to={route}>{name}</Link>
      </li>
    );
  }
}

export default ItemMenu;
