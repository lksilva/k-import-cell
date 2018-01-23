// @flow
import React from 'react';
import { Field, reduxForm } from 'redux-form';
import styles from './Login.css';

const LoginForm = props => {
  const { handleSubmit, pristine, reset, submitting } = props;

  return (
    <form className={styles.login} onSubmit={handleSubmit}>
      <fieldset>
        <legend className={styles.legend}>Entrar</legend>
        <div className={styles.input}>
          <Field
            id={styles.inputLogin}
            name="login"
            component="input"
            type="text"
            placeholder="Login"
          />
          <span id={styles.userIconInput}><i className="fa fa-user" /></span>
        </div>
        <div className={styles.input}>
          <Field
            id={styles.inputPassword}
            name="password"
            component="input"
            type="password"
            placeholder="Senha"
          />
          <span id={styles.passwordIconInput}><i className="fa fa-lock" /></span>
        </div>
        <button className={styles.submit} type="submit" disabled={pristine || submitting}>
          <i className="fa fa-long-arrow-right" />
        </button>
      </fieldset>
    </form>
  );
};

export default reduxForm({
  form: 'loginForm',
})(LoginForm);
