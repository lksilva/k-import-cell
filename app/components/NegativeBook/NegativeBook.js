// @flow
import React, { Component } from 'react';
import styles from './NegativeBook.css';
import { ConverToBRL, ConvertJustDateptBR } from '../../utils/helpers';
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
import Dialog from 'material-ui/Dialog';
import DatePicker from 'material-ui/DatePicker';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import { SubmissionError } from 'redux-form';
import { ValidateNegativeForm } from '../../utils/helpers';
import EditNegativeForm from './EdtirNegativeForm';
import NegativeForm from '../NegativeBook/NegativeForm';
import Snackbar from 'material-ui/Snackbar';

const DateTimeFormat = global.Intl.DateTimeFormat;

const formatDate = date => Intl.DateTimeFormat('PT-BR').format(date);

const TableExampleSimple = (props) => {
  const { negatives, handleEdit } = props;

  return (
    <Table allRowsSelected={false} selectable={false}>
      <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
        <TableRow>
          <TableHeaderColumn>Descrição</TableHeaderColumn>
          <TableHeaderColumn>Valor</TableHeaderColumn>
          <TableHeaderColumn>Data</TableHeaderColumn>
          <TableHeaderColumn>Editar</TableHeaderColumn>
        </TableRow>
      </TableHeader>
      <TableBody displayRowCheckbox={false}>
        {negatives.map((negative, index) => (
          <TableRow className={styles.tableRow} key={negative.id} style={{ background: index % 2 ? 'white' : 'rgba(245, 227, 155, 0.24)' }} >
            <TableRowColumn>{negative.description}</TableRowColumn>
            <TableRowColumn>{ConverToBRL(negative.value)}</TableRowColumn>
            <TableRowColumn>{ConvertJustDateptBR(negative.date_of_insert)}</TableRowColumn>
            <TableRowColumn className={styles.editAction}>
              <div onClick={(e) => handleEdit(negative)}>
                <svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                  <path d="M0 0h24v24H0z" fill="none" />
                </svg>
              </div>
            </TableRowColumn>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter adjustForCheckbox={false}>
        <TableRow colSpan="1">
          <TableRowColumn style={{ textAlign: 'right' }}>Total: {ConverToBRL(negatives.map(item => item.value).reduce((total, amount) => total + amount))}
          </TableRowColumn>
        </TableRow>
      </TableFooter>
    </Table>
  );
};

class NegativeBook extends Component {
  props: {
    getNegativesByPeriod: (start: any, end: any) => void,
    updateNegative: (negative: any) => void,
    saveNegative: (negative: any) => void,
    negatives: any,
    isLoading: boolean,
    insertResponse: any
  }

  state: {
    startDate: any,
    endDate: any,
    negative: any,
    open: any,
    confirmOpen: any,
    rejectOpen: any
  }

  state = {
    startDate: null,
    endDate: null,
    negative: null,
    open: false,
    confirmOpen: false,
    rejectOpen: false
  }

  componentWillMount() {
    this.getNegativesToday();
  }

  componentWillReceiveProps(nextProps: any) {
    const displayMessage = nextProps.insertResponse !== this.props.insertResponse;
    if (displayMessage) {
      this.handleClose();
      if (nextProps.insertResponse === false) {
        console.log('Mostrar reject Open');
        this.setState({ rejectOpen: true });
      } else {
        console.log('Confirma Open');
        this.setState({ confirmOpen: true }, () => this.getNegativesToday());
      }
    }
  }

  getNegativesToday = () => {
    const start = this.getISODateStart();
    const end = this.getISODateEnd();

    this.props.getNegativesByPeriod(start, end);
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

  filterNegatives = () => {
    console.log('Initial Date', this.state.startDate);
    console.log('End Date', this.state.endDate);
    this.props.getNegativesByPeriod(this.state.startDate, this.state.endDate);
  }

  handleEdit = (negative: any) => {
    this.setState({ negative, open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  editNegative = async (negativeEdited: any) => {
    const validateObj = await ValidateNegativeForm(negativeEdited);
    if (validateObj.hasError) {
      throw new SubmissionError(validateObj.errors);
    }
    const newNegative = Object.assign({}, negativeEdited, { id: this.state.negative.id });
    this.props.updateNegative(newNegative);
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

  saveNegative = async (values: any) => {
    const validateObj = await ValidateNegativeForm(values);
    if (validateObj.hasError) {
      throw new SubmissionError(validateObj.errors);
    }
    this.props.saveNegative(values);
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
      <FlatButton label="Buscar" onClick={this.filterNegatives} disabled={!this.state.startDate || !this.state.endDate} />
    </Paper>
  )

  renderFormNegativeBook = () => (
    <Paper zDepth={1} style={{ margin: 4 }}>
      <NegativeForm onSubmit={this.saveNegative} />
    </Paper>
  )

  render() {
    const { negatives, isLoading, userAuth } = this.props;

    return (
      <div className={styles.containerNegativeBook}>
        {!!userAuth && userAuth.full_permission ? this.renderSearchByPeriod() : null}
        {!!userAuth && userAuth.full_permission ? this.renderFormNegativeBook() : null}
        {isLoading ?
          <Loader /> :
          <div>
            {!!negatives && negatives.length ?
              <div>
                <TableExampleSimple negatives={negatives} handleEdit={(negative) => this.handleEdit(negative)} />
                <Dialog
                  title="Editar Prejuizo"
                  modal={false}
                  open={this.state.open}
                  onRequestClose={this.handleClose}
                  autoScrollBodyContent
                >
                  {this.state.negative &&
                    <EditNegativeForm onSubmit={this.editNegative} negative={this.state.negative} />
                  }
                </Dialog>
              </div> :
              this.renderNoResults()
            }
          </div>}
        <Snackbar
          open={this.state.confirmOpen}
          message="Ação realizada com sucesso!"
          autoHideDuration={4000}
          onRequestClose={this.handleRequestClose}
        />
        <Snackbar
          open={this.state.rejectOpen}
          message="Falha ao tentar realizar ação"
          autoHideDuration={4000}
          style={{ background: 'red' }}
          onRequestClose={this.handleRequestCloseReject}
        />
      </div>
    );
  }
}

export default NegativeBook;
