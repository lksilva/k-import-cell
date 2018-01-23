import crypto from 'crypto';

export function ValueOrNull(value) {
  if (!value) return null;
  const valueTrim = value.trim();
  if (valueTrim) return `${valueTrim}`;
  return null;
}

export function ValueOrZero(value) {
  if (!value || value < 0) return 0;
  return value;
}

export function ConverTo512(pass) {
  return crypto.createHash('sha512').update(pass, 'utf-8').digest('hex');
}

export function ConverToBRL(number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(number);
}

export function HasWhiteSpace(value) {
  return /\s/g.test(value);
}

export function validateNumberInput(event) {
  if (!(event.charCode >= 48 && event.charCode <= 57)) event.preventDefault();
}

export const Upper = value => value && value.toUpperCase();

export const ValidateUserForm = (values: any) => new Promise(resolve => {
  const errorMessage = 'Falha ao tentar inserir Usuário!';
  const errors = {};

  if (!values.login) {
    errors.login = 'É necessário preencher o campo de login';
  }
  if (values.login && HasWhiteSpace(values.login)) {
    errors.login = 'Não é permitido espaço no campo de login';
  }
  if (!values.password) {
    errors.password = 'É necessário preencher o campo de senha';
  }
  if (values.password && HasWhiteSpace(values.password)) {
    errors.password = 'Não é permitido espaço no campo de senha';
  }
  if (!values.name) {
    errors.name = 'É necessário preencher o campo de nome';
  }
  if (Object.keys(errors).length) {
    errors._error = errorMessage;
    resolve({ hasError: true, errors });
  } else {
    resolve({ hasError: false });
  }
});

export const ValidateNegativeForm = (values: any) => new Promise(resolve => {
  const errorMessage = 'Falha ao tentar inserir Prejuízo!';
  const errors = {};

  if (!values.description) {
    errors.description = 'É necessário preencher o campo de Descrição';
  }
  if (!values.value) {
    errors.value = 'É necessário preencher o campo de Valor';
  }
  if (Object.keys(errors).length) {
    errors._error = errorMessage;
    resolve({ hasError: true, errors });
  } else {
    resolve({ hasError: false });
  }
});

export function ConverDateToptBR(date) {
  const dateOptions = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
    timeZone: 'America/Fortaleza'
  };
  return new Intl.DateTimeFormat('pt-BR', dateOptions).format(date);
}

export function ConvertJustDateptBR(date) {
  return date.toLocaleString('pt-br').slice(0, 10);
}
