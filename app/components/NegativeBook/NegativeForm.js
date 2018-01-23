// @flow
import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import OrangeButton from '../Button/OrangeButton';
import CustomInput from '../Input/CustomInput';
import styles from './NegativeBook.css';
import { Upper } from '../../utils/helpers';

class NegativeForm extends Component {
  props: {
    change: (field: string, value: string) => void,
    handleSubmit: () => void,
    reset: () => void,
    submitting: boolean,
    error: any,
    pristine: any,
    negative: any
  }

  render() {
    const { error, handleSubmit, pristine, reset, submitting } = this.props;
    return (
      <form className={styles.wraperNegativeForm} onSubmit={handleSubmit}>
        <Field name="description" component={CustomInput} placeholder="Descrição" label="Descrição" normalize={Upper}/>
        <Field name="value" component={CustomInput} placeholder="Valor" label="Valor" type="number"  />
        <footer>
          <OrangeButton label="Salvar" handleClick={handleSubmit} disabled={pristine || submitting} />
        </footer>
      </form>
    );
  }
}

export default reduxForm({
  form: 'negativeForm',
})(NegativeForm);
