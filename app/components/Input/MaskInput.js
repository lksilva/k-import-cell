// @flow
import React, { Component } from 'react';
import styles from './Input.css';
import InputMask from 'react-input-mask';

class CustomInput extends Component {
  render() {
    const field = this.props;
    return (
      <div className={styles.boxInput}>
        <label className={styles.labelInput}>{field.label}</label>
        <InputMask mask={field.mask} {...field.input} className={styles.wealthInput} placeholder={field.placeholder} />
        {field.meta.touched && field.meta.error &&
          <span className={styles.errorInputText}>{field.meta.error}</span>}
      </div>
    );
  }
}

export default CustomInput;
