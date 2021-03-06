import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { Field, Form } from 'formik';
import { withStyles, TextField } from '@material-ui/core';

import { hasError } from '../form/helpers';

import { styles } from './Authentication.css';

class RegisterForm extends Component {
  renderFirstNameField = ({ field }) => {
    const { formik } = this.props;
    return (
      <TextField
        {...field}
        label="First name"
        fullWidth
        value={formik.values.firstName}
        {...hasError(formik, 'firstName')}
      />
    );
  };

  renderLastNameField = ({ field }) => {
    const { formik } = this.props;
    return (
      <TextField
        {...field}
        label="Last name"
        fullWidth
        value={formik.values.lastName}
        {...hasError(formik, 'lastName')}
      />
    );
  };

  renderEmailField = ({ field }) => {
    const { formik } = this.props;
    return (
      <TextField
        {...field}
        label="Email (will be used for verification)"
        fullWidth
        value={formik.values.email}
        {...hasError(formik, 'email')}
      />
    );
  };

  renderPasswordField = ({ field }) => {
    const { formik } = this.props;
    return (
      <TextField
        {...field}
        type="password"
        label="Password"
        fullWidth
        value={formik.values.password}
        {...hasError(formik, 'password')}
      />
    );
  };

  renderRepeatPasswordField = ({ field }) => {
    const { formik } = this.props;
    return (
      <TextField
        {...field}
        type="password"
        label="Repeat password"
        fullWidth
        value={formik.values.repeatPassword}
        {...hasError(formik, 'repeatPassword')}
      />
    );
  };

  render() {
    return (
      <Form noValidate>
        <Field
          name="firstName"
          required
          render={this.renderFirstNameField}
        />
        <Field
          name="lastName"
          required
          render={this.renderLastNameField}
        />
        <Field
          name="email"
          required
          render={this.renderEmailField}
        />
        <Field
          name="password"
          required
          render={this.renderPasswordField}
        />
        <Field
          name="repeatPassword"
          required
          render={this.renderRepeatPasswordField}
        />
      </Form>
    );
  }
}

RegisterForm.propTypes = {
  classes: PropTypes.object.isRequired,
  formik: PropTypes.object.isRequired,
};

export default withStyles(styles)(RegisterForm);
