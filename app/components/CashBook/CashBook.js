// @flow
import React, { Component } from 'react';
import styles from './CashBook.css';
// import ActionDelete from 'material-ui/svg-icons/action/delete';
// import { FlatButton as MuiFlatButton } from 'material-ui';
import { ConverToBRL, ConverDateToptBR } from '../../utils/helpers';
import Loader from '../Loader/Loader';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
  TableFooter,
} from 'material-ui/Table';
import DatePicker from 'material-ui/DatePicker';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';

const DateTimeFormat = global.Intl.DateTimeFormat;

const formatDate = date => Intl.DateTimeFormat('PT-BR').format(date);

const TableExampleSimple = (props) => {
  const { sales, fullPermission } = props;

  return (
    <Table allRowsSelected={false} selectable={false}>
      <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
        <TableRow>
          <TableHeaderColumn>Produto</TableHeaderColumn>
          <TableHeaderColumn>Data</TableHeaderColumn>
          <TableHeaderColumn>Tipo de Pagamento</TableHeaderColumn>
          <TableHeaderColumn>Quantidade</TableHeaderColumn>
          <TableHeaderColumn>Venda</TableHeaderColumn>
          {fullPermission && <TableHeaderColumn>Compra</TableHeaderColumn>}
          {fullPermission && <TableHeaderColumn>Lucro</TableHeaderColumn>}
        </TableRow>
      </TableHeader>
      <TableBody displayRowCheckbox={false}>
        {sales.map((sale, index) => (
          <TableRow className={styles.tableRow} key={sale.id} style={{ background: index % 2 ? 'white' : 'rgba(245, 227, 155, 0.24)' }} >
            <TableRowColumn>{sale.product_name}</TableRowColumn>
            <TableRowColumn>{ConverDateToptBR(sale.sale_date)}</TableRowColumn>
            <TableRowColumn>{sale.type_payment}</TableRowColumn>
            <TableRowColumn>{sale.product_amount}</TableRowColumn>
            <TableRowColumn>{ConverToBRL(sale.value)}</TableRowColumn>
            {fullPermission && <TableRowColumn>{ConverToBRL(sale.purchase * sale.product_amount)}</TableRowColumn>}
            {fullPermission && <TableRowColumn>{ConverToBRL(sale.value - (sale.purchase * sale.product_amount))}</TableRowColumn>}
          </TableRow>
        ))}
      </TableBody>
      <TableFooter adjustForCheckbox={false}>
        <TableRow colSpan="1">
          <TableRowColumn style={{ textAlign: 'right' }}>Total vendido: {ConverToBRL(sales.map(item => item.value).reduce((total, amount) => total + amount))}
          </TableRowColumn>
          {fullPermission && <TableRowColumn style={{ textAlign: 'right' }}>Total de lucro: {ConverToBRL(sales.map(item => (item.value - (item.purchase * item.product_amount))).reduce((total, amount) => total + amount))}
          </TableRowColumn>}
        </TableRow>
      </TableFooter>
    </Table>
  );
};

class CashBook extends Component {
  props: {
    getSalesByPeriod: (start: any, end: any) => void,
    sales: any,
    isLoading: boolean
  }

  state: {
    startDate: any,
    endDate: any
  }

  state = {
    startDate: null,
    endDate: null
  }

  componentWillMount() {
    this.getSaleToday();
  }

  getSaleToday = () => {
    const start = this.getISODateStart();
    const end = this.getISODateEnd();

    this.props.getSalesByPeriod(start, end);
  }

  getISODateStart = () => {
    const now = new Date().toLocaleString('pt-BR', { hour12: false }).split(' ');
    const [day, month, year] = now[0].split('/');
    const hour = '00:00:00';
    return `${year.replace(',', '')}-${month}-${day} ${hour}`;
  }

  getISODateEnd = () => {
    const now = new Date().toLocaleString('pt-BR', { hour12: false }).split(' ');
    const [day, month, year] = now[0].split('/');
    const hour = '23:59:59';
    return `${year.replace(',', '')}-${month}-${day} ${hour}`;
  }

  renderNoResults = () => (
    <h2 className={styles.labelWarn}>Nenhum resultado encontrado! </h2>
  )

  handleDPChange = (name: any, date: any) => {
    const d = date.toLocaleString('pt-BR', { hour12: false }).split(' ');
    const [day, month, year] = d[0].split('/');
    const hour = name === 'startDate' ? '00:00:00' : '23:59:59';
    this.setState({ [name]: `${year.replace(',', '')}-${month}-${day} ${hour}` });
  }

  filterSales = () => {
    console.log('Initial Date', this.state.startDate);
    console.log('End Date', this.state.endDate);
    this.props.getSalesByPeriod(this.state.startDate, this.state.endDate);
  }

  renderSearchByPeriod = () => (
    <Paper zDepth={1} style={{ margin: 4, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', alignItems: 'center' }}>
      <DatePicker
        hintText={'Data inicial'}
        style={{ maxWidth: 256 }}
        DateTimeFormat={DateTimeFormat}
        formatDate={formatDate}
        floatingLabelText={'Data inicial'}
        okLabel="OK"
        cancelLabel="Cancelar"
        locale="pt-br"
        onChange={(event, value) => this.handleDPChange('startDate', value)}
      />
      <DatePicker
        hintText={'Data final'}
        DateTimeFormat={DateTimeFormat}
        formatDate={formatDate}
        style={{ maxWidth: 256 }}
        floatingLabelText={'Data final'}
        okLabel="OK"
        cancelLabel="Cancelar"
        locale="pt-br"
        onChange={(event, value) => this.handleDPChange('endDate', value)}
      />
      <FlatButton label="Buscar" onClick={this.filterSales} disabled={!this.state.startDate || !this.state.endDate} />
    </Paper>
  )

  render() {
    const { sales, isLoading, userAuth } = this.props;

    return (
      <div className={styles.containerCashbook}>
        {!!userAuth && userAuth.full_permission ? this.renderSearchByPeriod() : null}
        {isLoading ?
          <Loader /> :
          <div>
            {sales.length ?
              <TableExampleSimple sales={sales} fullPermission={userAuth.full_permission} /> :
              this.renderNoResults()
            }
          </div>}
      </div>
    );
  }
}

export default CashBook;
