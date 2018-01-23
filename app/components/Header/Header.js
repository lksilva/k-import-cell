import React, { Component } from 'react';
import styles from './Header.css';
import ItemMenu from './ItemMenu';
import FlatButton from '../Button/FlatButton';

class Header extends Component<any, any> {
  props: {
    handleClick: () => void,
    submitLogout: () => void,
    userAuth: any,
    items: array
  };

  handleOnChange = (menu: string) => {
    this.props.handleClick(menu);
  }

  logout = () => {
    this.props.submitLogout();
  }

  render() {
    const { userAuth } = this.props;
    let items;
    if (!!userAuth && !userAuth.full_permission) {
      items = this.props.items.filter(item => item.id === 3 || item.id === 4);
    } else {
      items = this.props.items;
    }

    return (
      <nav className={styles.menu}>
        <ul className={styles.menuList}>
          {items.map(item => <ItemMenu key={item.id} route={item.route} active={item.active} name={item.name} handleOnChange={() => this.handleOnChange(item.name)} />)}
          <FlatButton label="Sair" handleClick={this.logout} disabled={false} />
        </ul>
      </nav>
    );
  }
}

export default Header;
