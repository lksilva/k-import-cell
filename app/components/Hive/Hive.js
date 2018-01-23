// @flow
import React, { Component } from 'react';
import styles from './Hive.css';

class Hive extends Component {
  props: {
    font: string,
    label: string,
    handleOnChange: () => void
  }
  render() {
    const { font, label, handleOnChange } = this.props;

    return (
      <div className={styles.containerHive} onClick={handleOnChange}>
        <i className={`fa ${font} ${styles.homePageIcon}`} aria-hidden="true" />
        <label className={styles.labelHomePage}> {label} </label>
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" viewBox="0 0 212 242" width="206" height="231"><defs><path d="M106.06 6.24L3.13 63.94L3.13 179.36L106.06 237.06L209 179.36L209 63.94L106.06 6.24Z" id="aitoqLNAG" /></defs><g><g><g><g><use xlinkHref="#aitoqLNAG" opacity="1" fillOpacity="0" stroke="#9db2bf" strokeWidth="6" strokeOpacity="1" /></g></g></g></g></svg>
      </div>
    );
  }
}

export default Hive;
