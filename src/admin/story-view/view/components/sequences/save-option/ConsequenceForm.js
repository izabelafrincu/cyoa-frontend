import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { Field } from 'formik';
import { withStyles, IconButton, TextField, Tooltip } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import { arrayHasError } from '../../../../../../shared/components/form/helpers';
import Select from '../../../../../../shared/components/form/Select/Select';
import { AttributeModel } from '../../../../../../infrastructure/models/AttributeModel';

import { styles } from './SaveOption.css';

class ConsequenceForm extends Component {
  getAttributes = () => {
    return this.props.attributes.map(a => {
      return { _id: a.name, name: a.name };
    });
  };

  onRemoveConsequence = () => {
    this.props.onRemoveConsequence(this.props.index);
  };

  renderAttributeField = ({ field }) => {
    const { formik, classes, index } = this.props;
    return (
      <Select
        formikField={field}
        className={classes.consequenceAttribute}
        label="Attribute"
        fullWidth
        items={this.getAttributes()}
        {...arrayHasError(formik, 'consequences', 'attribute', index)}
      />
    );
  };

  renderConsequenceField = ({ field }) => {
    const { formik, classes, index } = this.props;
    return (
      <TextField
        {...field}
        className={classes.consequenceChangeValue}
        label="Change value"
        type="number"
        fullWidth
        value={formik.values.consequences[index].changeValue}
        {...arrayHasError(formik, 'consequences', 'changeValue', index)}
      />
    );
  };

  render() {
    const { index, classes } = this.props;

    return (
      <div className={classes.consequenceRow}>
        <Field
          name={`consequences.${index}.attribute`}
          required
          render={this.renderAttributeField}
        />
        <Field
          name={`consequences.${index}.changeValue`}
          required
          render={this.renderConsequenceField}
        />
        <Tooltip title="Remove consequence">
          <div className={classes.consequenceRemoveBtn}>
            <IconButton
              onClick={this.onRemoveConsequence}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </div>
        </Tooltip>
      </div>
    );
  }
}

ConsequenceForm.propTypes = {
  classes: PropTypes.object.isRequired,
  formik: PropTypes.object.isRequired,
  attributes: PropTypes.arrayOf(PropTypes.instanceOf(AttributeModel)).isRequired,
  index: PropTypes.number.isRequired,
  onRemoveConsequence: PropTypes.func.isRequired,
};

export default withStyles(styles)(ConsequenceForm);
