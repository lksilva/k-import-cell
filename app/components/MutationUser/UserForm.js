// @flow
import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import OrangeButton from '../Button/OrangeButton';
import CustomInput from '../Input/CustomInput';
import MaskInput from '../Input/MaskInput';
import styles from './MutationUser.css';
import Checkbox from 'material-ui/Checkbox';
import DatePicker from 'material-ui/DatePicker';

const checkBoxStyle = {
  checkbox: {
    marginTop: 37,
  },
  label: {
    textTransform: 'uppercase',
    fontWeight: 700
  },
  datePicker: {
    marginTop: 45
  }
};

const DateTimeFormat = global.Intl.DateTimeFormat;

const formatDate = date => Intl.DateTimeFormat('PT-BR').format(date);

const renderCheckbox = ({ input, label }) => (
  <Checkbox
    style={checkBoxStyle.checkbox}
    labelStyle={checkBoxStyle.label}
    label={label}
    checked={!!input.value}
    onCheck={input.onChange}
  />
);

const renderDatePicker = ({ input, label }) => (
  <DatePicker
    hintText={label}
    style={{ marginTop: '45px' }}
    DateTimeFormat={DateTimeFormat}
    formatDate={formatDate}
    floatingLabelText={label}
    okLabel="OK"
    cancelLabel="Cancelar"
    locale="pt-br"
    onChange={(event, value) => input.onChange(value)}
  />
);

class UserForm extends Component {
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
        <header className={styles.formHeader}><h1>Cadastrar Usuário</h1></header>

        <aside className={styles.asideLeft}>
          <Field name="login" component={CustomInput} placeholder="Login" label="Login" />
          <Field name="password" component={CustomInput} placeholder="Senha" label="Senha" />
          <Field name="name" component={CustomInput} placeholder="Nome" label="Nome" />
          <Field name="adress" component={CustomInput} placeholder="Endereço" label="Endereço" />
          <Field name="city" component={CustomInput} placeholder="Cidade" label="Cidade" />
        </aside>

        <aside className={styles.asideRight}>
          <Field name="cep" component={MaskInput} mask="99999-9999" placeholder="CEP" label="Cep" />
          <Field name="country" component={CustomInput} placeholder="País" label="País" />
          <Field name="full_permission" component={renderCheckbox} label="Permissão Total" />
          <Field name="date_of_birth" component={renderDatePicker} label="Data de nascimento" />
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
  form: 'userForm',
})(UserForm);
