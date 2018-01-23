// @flow
import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import OrangeButton from '../Button/OrangeButton';
import CustomInput from '../Input/CustomInput';
import TextAreaInput from '../Input/TextAreaInput';
import styles from '../MutationUser/MutationUser.css';
import { Upper } from '../../utils/helpers';

class ProductForm extends Component {
  props: {
    change: (field: string, value: string) => void,
    handleSubmit: () => void,
    reset: () => void,
    submitting: boolean,
    error: any,
    pristine: any,
    user: any
  }

  render() {
    const { error, handleSubmit, pristine, reset, submitting } = this.props;
    return (
      <form className={styles.wraperMutationUser} onSubmit={handleSubmit}>
        <header className={styles.formHeader}><h1>Cadastrar Produto</h1></header>

        <aside className={styles.asideLeft}>
          <h4>Informações do Produto</h4>
          <Field name="description" component={TextAreaInput} placeholder="Informe a descrição do Produto" label="DESCRIÇÃO" normalize={Upper} />
          <Field name="name" component={CustomInput} placeholder="Informe o Nome do Produto" label="NOME" normalize={Upper} />
          <Field name="bar_code" component={CustomInput} placeholder="Código de barras do produto" label="CÓDIGO DE BARRAS" normalize={Upper} />
        </aside>

        <aside className={styles.asideRight}>
          <h4>Informações da Venda</h4>
          <Field name="sale_value" component={CustomInput} label="VALOR DE VENDA" type="number" placeholder="0" />
          <Field name="purchase_price" component={CustomInput} label="VALOR DE COMPRA" type="number" placeholder="0" />
          <Field name="amount" component={CustomInput} label="QUANTIADE EM ESTOQUE" type="number" placeholder="0" />
        </aside>

        <footer>
          <OrangeButton label="Limpar" handleClick={reset} disabled={pristine || submitting} />
          <OrangeButton label="Salvar" handleClick={handleSubmit} disabled={pristine || submitting} />
        </footer>
      </form>
    );
  }
}

export default reduxForm({
  form: 'productForm',
})(ProductForm);
