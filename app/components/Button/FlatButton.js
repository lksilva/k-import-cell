// @flow
import React, { Component } from 'react';
import styles from './FlatButton.css';

class FlatButton extends Component {
  props: {
    handleClick: () => void,
    label: string,
    disabled: boolean
  }

  render() {
    const { handleClick, label, disabled } = this.props;

    return (
      <button className={`${styles.button} ${styles.flatButton}`} onClick={handleClick} disabled={disabled}>
        { label }
      </button>
    );
  }
}

export default FlatButton;
