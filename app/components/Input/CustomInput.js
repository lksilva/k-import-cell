import React, { Component } from 'react';
import styles from './Input.css';
import { validateNumberInput } from '../../utils/helpers';

class CustomInput extends Component {
  render() {
    const field = this.props;
    return (
      <div className={styles.boxInput}>
        <label className={styles.labelInput}>{field.label}</label>
        {field.integerField ?
          <input {...field.input} type="text" onKeyPress={validateNumberInput} className={styles.wealthInput} placeholder={field.placeholder} /> :
          <input {...field.input} type={field.type} className={styles.wealthInput} placeholder={field.placeholder} />
        }
        {field.meta.touched && field.meta.error &&
          <span className={styles.errorInputText}>{field.meta.error}</span>}
      </div>
    );
  }
}

export default CustomInput;
