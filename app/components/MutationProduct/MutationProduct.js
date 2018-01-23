// @flow
import React, { Component } from 'react';
import ProductForm from './ProductForm';
import { SubmissionError } from 'redux-form';
import Loader from '../Loader/Loader';
import Snackbar from 'material-ui/Snackbar';

class MutationProduct extends Component {
  props: {
    saveProduct: () => void,
    isLoading: boolean,
    insertResponse: any,
    productToEdit: any
  }

  state = {
    confirmOpen: false,
    rejectOpen: false,
  };

  componentWillReceiveProps(nextProps: any) {
    const displayMessage = nextProps.insertResponse !== this.props.insertResponse;
    if (displayMessage) {
      if (nextProps.insertResponse === false) {
        this.setState({ rejectOpen: true });
      } else {
        this.setState({ confirmOpen: true });
      }
    }
  }

  validate = (values: any) => new Promise(resolve => {
    const errorMessage = 'Falha ao tentar inserir Produto!';
    const errors = {};

    if (!values.description) {
      errors.description = 'É necessário preencher o campo de descrição';
    }
    if (values.description && values.description.length > 254) {
      errors.description = 'Numéro máximo de caracteres é 255';
    }
    if (!values.name) {
      errors.name = 'É necessário preencher o campo de nome';
    }
    if (values.name && values.name.length > 254) {
      errors.name = 'Numéro máximo de caracteres é 255';
    }
    if (!values.sale_value || values.sale_value < 0) {
      errors.sale_value = 'É necessário preencher este campo com um valor válido';
    }
    if (!values.purchase_price || values.purchase_price < 0) {
      errors.purchase_price = 'É necessário preencher este campo com um valor válido';
    }
    if (!values.amount || values.amount < 0) {
      errors.amount = 'É necessário preencher este campo com um valor válido';
    }
    if (Object.keys(errors).length) {
      errors._error = errorMessage;
      resolve({ hasError: true, errors });
    } else {
      resolve({ hasError: false });
    }
  })

  saveProduct = async (values: any) => {
    const validateObj = await this.validate(values);
    if (validateObj.hasError) {
      throw new SubmissionError(validateObj.errors);
    }
    this.props.saveProduct(values);
  }

  handleRequestClose = () => {
    this.setState({
      confirmOpen: false,
    });
  };

  handleRequestCloseReject = () => {
    this.setState({
      rejectOpen: false
    });
  }

  render() {
    const { isLoading, productToEdit } = this.props;

    return (
      <div>
        {isLoading ?
          <Loader /> :
          <ProductForm onSubmit={this.saveProduct} user={productToEdit} />
      }
        <Snackbar
          open={this.state.confirmOpen}
          message="Produto inserido com sucesso!"
          autoHideDuration={4000}
          onRequestClose={this.handleRequestClose}
        />
        <Snackbar
          open={this.state.rejectOpen}
          message="Falha ao tentar inserir produto!"
          autoHideDuration={4000}
          style={{ background: 'red' }}
          onRequestClose={this.handleRequestCloseReject}
        />
      </div>
    );
  }
}

export default MutationProduct;
