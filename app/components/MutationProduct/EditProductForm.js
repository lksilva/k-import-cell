// @flow
import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import OrangeButton from '../Button/OrangeButton';
import CustomInput from '../Input/CustomInput';
import styles from './MutationProduct.css';
import TextAreaInput from '../Input/TextAreaInput';
import { Upper } from '../../utils/helpers';

class EdtirProductForm extends Component {
  props: {
    change: (field: string, value: string) => void,
    handleSubmit: () => void,
    reset: () => void,
    submitting: boolean,
    error: any,
    pristine: any,
    product: any
  }

  componentWillMount() {
    const product = this.props.product;
    if (product) {
      this.props.change('description', product.description);
      this.props.change('name', product.name);
      this.props.change('bar_code', product.bar_code);
      this.props.change('sale_value', product.sale_value);
      this.props.change('purchase_price', product.purchase_price);
      this.props.change('amount', product.amount);
    }
  }


  render() {
    const { error, handleSubmit, pristine, reset, submitting } = this.props;
    return (
      <form className={styles.wraperMutationProduct} onSubmit={handleSubmit}>
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
          <Field name="amount" integerField component={CustomInput} label="QUANTIADE EM ESTOQUE" type="number" placeholder="0" />
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
  form: 'editProductForm',
})(EdtirProductForm);
