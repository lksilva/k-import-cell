// @flow
import React, { Component } from 'react';
import styles from './Sale.css';
import stylesCustomInput from '../Input/Input.css';
import AutoComplete from 'material-ui/AutoComplete';
import Paper from 'material-ui/Paper';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import { validateNumberInput, ConverToBRL } from '../../utils/helpers';
import Loader from '../Loader/Loader';
import OrangeButton from '../Button/OrangeButton';
import SelectField from 'material-ui/SelectField';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import { FlatButton as MuiFlatButton } from 'material-ui';
import Snackbar from 'material-ui/Snackbar';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
  TableFooter,
} from 'material-ui/Table';

const TableExampleSimple = (props) => {
  const { sales, handleDelete, saveSale } = props;

  return (
    <div>
      <Table allRowsSelected={false} selectable={false}>
        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
          <TableRow>
            <TableHeaderColumn>Quantidade</TableHeaderColumn>
            <TableHeaderColumn>Produto</TableHeaderColumn>
            <TableHeaderColumn>Subtotal</TableHeaderColumn>
            <TableHeaderColumn>Excluir</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false}>
          {sales.map((sale, index) => (
            <TableRow className={styles.tableRow} key={sale.id} style={{ background: index % 2 ? 'white' : 'rgba(245, 227, 155, 0.24)' }} >
              <TableRowColumn>{sale.product_amount}</TableRowColumn>
              <TableRowColumn>{sale.productName}</TableRowColumn>
              <TableRowColumn>{ConverToBRL(sale.value)}</TableRowColumn>
              <TableRowColumn>
                <MuiFlatButton
                  onClick={(e) => handleDelete(sale)}
                  icon={<ActionDelete />}
                  style={{ padding: 2 }}
                />
              </TableRowColumn>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow colSpan="2">
            <TableRowColumn>Valor total da venda</TableRowColumn>
            <TableRowColumn>{ConverToBRL(sales.map(item => item.value).reduce((total, amount) => total + amount))}
            </TableRowColumn>
          </TableRow>
        </TableFooter>
      </Table>
      <div className={styles.finishButton}>
        <OrangeButton label="Finalizar Venda" handleClick={saveSale} />
      </div>
    </div>
  );
};

class Sale extends Component {
  props: {
    getProducts: () => void,
    saveSales: (any) => void,
    insertResponse: any,
    isLoading: any,
    products: any
  }
  state: {
    dataSource: any,
    currentProduct: any,
    totalPerProduct: number,
    amountInput: number,
    discountInput: number,
    sales: any,
    discountType: string,
    paymentType: string,
    rejectOpen: boolean,
    confirmOpen: boolean
  }
  state = {
    dataSource: [],
    currentProduct: null,
    discountType: 'percent',
    paymentType: 'money',
    totalPerProduct: 0,
    amountInput: 1,
    discountInput: '',
    sales: [],
    rejectOpen: false,
    confirmOpen: false
  }

  componentWillMount() {
    this.props.getProducts();
  }

  componentWillReceiveProps(nextProps: any) {
    const displayMessage = nextProps.insertResponse !== this.props.insertResponse;
    if (displayMessage) {
      if (nextProps.insertResponse === false) {
        this.setState({ rejectOpen: true });
      } else {
        this.setState({ confirmOpen: true, sales: [] }, () => this.props.getProducts());
      }
    }
  }

  handleUpdateInput = (value: string) => {
    const filterSource = this.props.products.filter(item => item.name.includes(value)).map(prod => prod.name);
    this.setState({ dataSource: filterSource });
  };

  getProduct = (productName: string) => this.props.products.filter(item => item.name === productName)

  selectedProduct = (value: any) => {
    const product = this.getProduct(value);
    if (product.length) this.setState({ currentProduct: product[0] }, () => this.setSaleValue());
    else this.setState({ currentProduct: null });
  }

  disCountChange = (event: any, index: any, value: any) => this.setState({ discountType: value }, () => this.setSaleValue());

  paymentTypeChange = (event: any, index: any, value: any) => this.setState({ paymentType: value });

  handleInputChange = (event: any) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    }, () => this.setSaleValue());
  }

  setSaleValue = () => {
    if (this.state.currentProduct) {
      this.setState({ totalPerProduct: this.calculateValue(this.state.amountInput, this.state.discountInput, this.state.discountType, this.state.currentProduct.sale_value) });
    }
  }

  calculateValue = (amount: any, discount: any, discountType: string, productValue: any) => {
    const rawValue = amount * productValue;
    if (discount) {
      if (discountType === 'percent') {
        const discountPer = ((productValue * discount) / 100).toFixed(2);
        return rawValue - discountPer;
      } else if (discountType === 'money') {
        return rawValue - discount;
      }
    }
    return rawValue;
  }

  getISODate = () => {
    const now = new Date().toLocaleString('pt-BR', { hour12: false }).split(" ");
    const [day, month, year] = now[0].split('/');
    const hour = now[1];
    return `${year.replace(',', '')}-${month}-${day} ${hour}`;
  }

  addSale = () => {
    const sale = Object.assign({},
      {
        id: this.state.sales.length + 1,
        productName: this.state.currentProduct.name,
        product_id: this.state.currentProduct.id,
        sale_date: this.getISODate(),
        type_payment: this.state.paymentType,
        product_amount: this.state.amountInput,
        value: this.state.totalPerProduct
      });
    console.log('Adicionar Venda', sale);
    this.setState({ sales: this.state.sales.concat(sale) }, () => this.resetState());
  }

  resetState = () => {
    this.setState({
      dataSource: [],
      currentProduct: null,
      discountType: 'percent',
      paymentType: 'money',
      totalPerProduct: 0,
      amountInput: 1,
      discountInput: '',
    });
  }

  handleDelete = (sale: any) => {
    this.setState({ sales: this.state.sales.filter(item => item.id !== sale.id) });
  }

  saveSale = () => {
    this.props.saveSales(this.state.sales);
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

  renderBoxProduct = () => (
    <div className={styles.boxProduct}>
      <h5>{this.state.currentProduct.name}</h5>
      <div className={styles.boxInfoProduct}>
        <label>Quantidade em Estoque</label>
        <b>{this.state.currentProduct.amount}</b>
      </div>
      <div className={styles.boxInfoProduct}>
        <label>Valor do produto</label>
        <b>{ConverToBRL(this.state.currentProduct.sale_value)}</b>
      </div>
    </div>
  )

  renderInputProduct = () => (
    <div className={styles.boxProductInput}>
      <div className={stylesCustomInput.boxInput}>
        <label className={stylesCustomInput.labelInput}>Quantidade</label>
        <input value={this.state.amountInput} onChange={this.handleInputChange} className={stylesCustomInput.wealthInput} name="amountInput" onKeyPress={validateNumberInput} placeholder="Quantidade" />
      </div>
      <div className={stylesCustomInput.boxInput}>
        <label className={stylesCustomInput.labelInput}>Desconto</label>
        <input value={this.state.discountInput} onChange={this.handleInputChange} className={stylesCustomInput.wealthInput} name="discountInput" type="number" placeholder="Desconto" />
      </div>
      <div className={styles.typeMount}>
        <DropDownMenu value={this.state.discountType} onChange={this.disCountChange}>
          <MenuItem value={'percent'} primaryText={<i className="fa fa-percent" aria-hidden="true" />} />
          <MenuItem value={'money'} primaryText={<i className="fa fa-money" aria-hidden="true" />} />
        </DropDownMenu>
      </div>
      <div className={styles.typePayment}>
        <SelectField floatingLabelText="Pagamento" value={this.state.paymentType} onChange={this.paymentTypeChange}>
          <MenuItem value={'money'} primaryText={<i className="fa fa-money">Dinheiro</i>} />
          <MenuItem value={'card'} primaryText={<i className="fa fa-credit-card">Cartão</i>} />
        </SelectField>
      </div>
      <div className={styles.infoSale}>
        <label>Total: </label>
        <b>{ConverToBRL(this.state.totalPerProduct)}</b>
      </div>
      <div className={`${styles.OrangeButtonContainer} ${!this.state.currentProduct || !this.state.amountInput || this.state.amountInput < 1 || this.state.amountInput > this.state.currentProduct.amount ? styles.saleDisabledComponent : ''}`}>
        <OrangeButton label="Adicionar" handleClick={this.addSale} />
      </div>
    </div>
  )

  render() {
    const { isLoading } = this.props;

    return (
      <div className={styles.containerSale}>
        <h1>Cadastrar Venda</h1>
        {isLoading ?
          <Loader /> :
          <div className={styles.wrapperSale}>
            <Paper zDepth={1} style={{ marginRight: '3px', minHeight: '517px' }}>
              <aside>
                <AutoComplete
                  floatingLabelText="Nome do produto"
                  dataSource={this.state.dataSource}
                  onUpdateInput={this.handleUpdateInput}
                  onNewRequest={this.selectedProduct}
                  fullWidth
                />
                {this.state.currentProduct !== null && this.renderBoxProduct()}
                {this.state.currentProduct !== null && this.renderInputProduct()}
              </aside>
            </Paper>
            <Paper>
              <aside>
                {!!this.state.sales.length && <TableExampleSimple sales={this.state.sales} handleDelete={(sale) => this.handleDelete(sale)} saveSale={this.saveSale} />}
              </aside>
            </Paper>
          </div>
        }
        <Snackbar
          open={this.state.confirmOpen}
          message={'Venda realizada com sucesso!'}
          autoHideDuration={4000}
          onRequestClose={this.handleRequestClose}
        />
        <Snackbar
          open={this.state.rejectOpen}
          message={'Falha ao tentar realizar a venda'}
          autoHideDuration={4000}
          style={{ background: 'red' }}
          onRequestClose={this.handleRequestCloseReject}
        />
      </div>
    );
  }
}

export default Sale;
