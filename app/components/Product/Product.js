// @flow
import React, { Component } from 'react';
import styles from './Product.css';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
  TableFooter,
} from 'material-ui/Table';
import Loader from '../Loader/Loader';
import Dialog from 'material-ui/Dialog';
import FlatButton from '../Button/FlatButton';
import EditProductForm from '../MutationProduct/EditProductForm';
import { SubmissionError } from 'redux-form';
import Snackbar from 'material-ui/Snackbar';
import { ConverToBRL } from '../../utils/helpers';
import SearchBar from 'material-ui-search-bar';
import Paper from 'material-ui/Paper';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import { FlatButton as MuiFlatButton } from 'material-ui';

const TableExampleSimple = (props) => {
  const { products, handleEdit, handleDelete, previous, next, page, totalPage } = props;

  return (
    <Table allRowsSelected={false} selectable={false}>
      <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
        <TableRow>
          <TableHeaderColumn>Descrição</TableHeaderColumn>
          <TableHeaderColumn>Nome</TableHeaderColumn>
          <TableHeaderColumn>Código de Barras</TableHeaderColumn>
          <TableHeaderColumn>Valor de Venda</TableHeaderColumn>
          <TableHeaderColumn>Valor de Compra</TableHeaderColumn>
          <TableHeaderColumn>Quantidade</TableHeaderColumn>
          <TableHeaderColumn>Editar</TableHeaderColumn>
          <TableHeaderColumn>Excluir</TableHeaderColumn>
        </TableRow>
      </TableHeader>
      <TableBody displayRowCheckbox={false}>
        {products.map((product, index) => (
          <TableRow className={styles.tableRow} key={product.id} style={{ background: index % 2 ? 'white' : 'rgba(245, 227, 155, 0.24)' }} >
            <TableRowColumn>{product.description}</TableRowColumn>
            <TableRowColumn>{product.name}</TableRowColumn>
            <TableRowColumn>{product.bar_code}</TableRowColumn>
            <TableRowColumn>{ConverToBRL(product.sale_value)}</TableRowColumn>
            <TableRowColumn>{ConverToBRL(product.purchase_price)}</TableRowColumn>
            <TableRowColumn>{product.amount}</TableRowColumn>
            <TableRowColumn className={styles.editAction}>
              <div onClick={(e) => handleEdit(product)}>
                <svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                  <path d="M0 0h24v24H0z" fill="none" />
                </svg>
              </div>
            </TableRowColumn>
            <TableRowColumn>
              <MuiFlatButton
                onClick={(e) => handleDelete(product)}
                icon={<ActionDelete />}
                style={{ padding: 2 }}
              />
            </TableRowColumn>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter style={{ backgroundColor: '#3B3F42', display: 'flex', justifyContent: 'flex-end' }}>
        <FlatButton label="Anterior" handleClick={previous} disabled={page === 1} />
        <FlatButton label="Próximo" handleClick={next} disabled={page === totalPage} />
      </TableFooter>
    </Table>
  );
};

class Product extends Component {
  props: {
    getAllProducts: (number) => void,
    incrementPage: () => void,
    decrementPage: () => void,
    updateProduct: (any) => void,
    fetchByName: (any) => void,
    deleteProduct: (any) => void,
    isLoading: boolean,
    products: any,
    page: number,
    totalPage: number,
    insertResponse: any,
    messageNotification: any
  }

  state: {
    product: any,
    open: boolean,
    productName: string
  }

  state = {
    product: null,
    open: false,
    confirmOpen: false,
    rejectOpen: false,
    productName: ''
  }

  componentWillMount() {
    this.fetchProduct();
  }

  componentWillReceiveProps(nextProps: any) {
    const goFetching = nextProps.page !== this.props.page;
    if (goFetching) {
      this.props.getAllProducts(nextProps.page);
    }
    const displayMessage = nextProps.insertResponse !== this.props.insertResponse;
    if (displayMessage) {
      this.handleClose();
      if (nextProps.insertResponse === false) {
        console.log('Mostrar reject Open');
        this.setState({ rejectOpen: true });
      } else {
        console.log('Confirma Open');
        this.setState({ confirmOpen: true }, () => this.props.getAllProducts(nextProps.page));
      }
    }
  }

  handleEdit = (product: any) => {
    this.setState({ product, open: true });
  };

  previous = () => {
    this.props.decrementPage();
  }

  next = () => {
    this.props.incrementPage();
  }

  fetchProduct = () => {
    this.props.getAllProducts(this.props.page);
  }

  handleClose = () => {
    this.setState({ open: false });
  };

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

  editProduct = async (productEdited: any) => {
    const validateObj = await this.validate(productEdited);
    if (validateObj.hasError) {
      throw new SubmissionError(validateObj.errors);
    }
    const newProduct = Object.assign({}, productEdited, { id: this.state.product.id });
    this.props.updateProduct(newProduct);
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

  searchProduct = () => {
    this.props.fetchByName(this.state.productName);
  }

  handleInputSearch = (name: string) => {
    this.setState({ productName: name });
  }

  handleDelete = (product: any) => {
    const resp = confirm(`Tem certeza que deseja deletar o produto ${product.name} ?`);
    if (resp) {
      this.props.deleteProduct(product.id);
    }
  }

  renderSearch = () => (
    <Paper zDepth={1} style={{ margin: 4 }}>
      <SearchBar
        hintText="Buscar produto"
        onChange={(value) => this.handleInputSearch(value)}
        onRequestSearch={() => this.searchProduct()}
        style={{
          margin: '0 auto',
          width: '100%'
        }}
        disabled={this.props.isLoading}
      />
    </Paper>
  )

  renderNoResults = () => (
    <h2 className={styles.labelWarn}>Nenhum resultado encontrado! </h2>
    )

  render() {
    const { isLoading, products, page, totalPage } = this.props;
    const messageNotification = this.props.messageNotification ? this.props.messageNotification : '';

    return (
      <div className={styles.containerProduct}>
        {this.renderSearch()}
        {isLoading ?
          <Loader /> :
          <div>
            {products.length ?
              <Paper zDepth={1} style={{ margin: 4 }}>
                <TableExampleSimple products={products} handleEdit={(product) => this.handleEdit(product)} handleDelete={(product) => this.handleDelete(product)} previous={this.previous} next={this.next} page={page} totalPage={totalPage} />
              </Paper> :
              this.renderNoResults()
            }
            <Dialog
              title="Editar Produto"
              modal={false}
              open={this.state.open}
              onRequestClose={this.handleClose}
              autoScrollBodyContent
            >
              {this.state.product &&
                <EditProductForm onSubmit={this.editProduct} product={this.state.product} />
              }
            </Dialog>
          </div>
        }
        <Snackbar
          open={this.state.confirmOpen}
          message={messageNotification}
          autoHideDuration={4000}
          onRequestClose={this.handleRequestClose}
        />
        <Snackbar
          open={this.state.rejectOpen}
          message={messageNotification}
          autoHideDuration={4000}
          style={{ background: 'red' }}
          onRequestClose={this.handleRequestCloseReject}
        />
      </div>
    );
  }
}

export default Product;
