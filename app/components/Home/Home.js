// @flow
import React, { Component } from 'react';
import styles from './Home.css';
import Hive from '../Hive/Hive.js';

class Home extends Component {
  props: {
    handleClick: () => void,
    userAuth: any,
    goTo: () => void
  }

  handleOnChange = (menu: string, route: string) => {
    this.props.handleClick(menu);
    this.props.goTo(route);
  }

  renderFull = () => (
    <div className={styles.containerHome}>
      <Hive font="fa-balance-scale" label="Estoque" handleOnChange={() => this.handleOnChange('Estoque', '/product')} />
      <Hive font="fa-shopping-cart" label="Venda" handleOnChange={() => this.handleOnChange('Venda', '/sale')} />
      <Hive font="fa-mobile" label="Produto" handleOnChange={() => this.handleOnChange('Produto', '/product/mutation')} />
      <Hive font="fa-users" label="Usuário" handleOnChange={() => this.handleOnChange('Usuário', '/user')} />
      <Hive font="fa-line-chart" label="Caixa" handleOnChange={() => this.handleOnChange('Livro Caixa', '/cashBook')} />
    </div>
  )

  renderShort = () => (
    <div className={styles.containerHome}>
      <Hive font="fa-balance-scale" label="Estoque" handleOnChange={() => this.handleOnChange('Estoque', '/product')} />
      <Hive font="fa-shopping-cart" label="Venda" handleOnChange={() => this.handleOnChange('Venda', '/sale')} />
    </div>
  )

  render() {
    const { userAuth } = this.props;

    return (
      <div>
        {!!userAuth && userAuth.full_permission ? this.renderFull() : this.renderShort()}
      </div>

    );
  }
}

export default Home;
