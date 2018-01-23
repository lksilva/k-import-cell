// @flow
import React, { Component } from 'react';
import styles from './Loader.css';
import CircularProgress from 'material-ui/CircularProgress';

class Loader extends Component {
  render() {
    return (
      <div className={styles.userLoader}>
        <CircularProgress size={80} thickness={5} />
        <label>Carregando...</label>
      </div>
    );
  }
}

export default Loader;
