// @flow
import React, { Component } from 'react';
import styles from './FlatButton.css';
import filledcss from './FilledButton.css';

class FlatButton extends Component {
  props: {
    handleClick: () => void
  }

  render() {
    const { handleClick, label } = this.props;

    return (
      <button className={`${styles.button} ${filledcss.filledButton}`} onClick={handleClick}>
        {label}
      </button>
    );
  }
}

export default FlatButton;
