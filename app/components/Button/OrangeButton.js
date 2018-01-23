// @flow
import React, { Component } from 'react';
import styles from './OrangeButton.css';

class OrangeButton extends Component {
  props: {
    handleClick: () => void,
    label: string
  }

  render() {
    const { handleClick, label } = this.props;

    return (
      <div className={styles.orangeButton} onClick={handleClick}>
        { label }
      </div>
    );
  }
}

export default OrangeButton;
