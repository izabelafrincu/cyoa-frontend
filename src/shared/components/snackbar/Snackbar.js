import React from 'react';
import * as ReactDOM from 'react-dom';
import * as PropTypes from 'prop-types';
import classNames from 'classnames';
import {
  withStyles,
  IconButton,
  Snackbar as MuiSnackbar,
  SnackbarContent,
} from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import WarningIcon from '@material-ui/icons/Warning';
import CloseIcon from '@material-ui/icons/Close';

import { BaseModel } from '../../../infrastructure/models/BaseModel';
import { SNACKBAR_AUTOHIDE_DURATION } from '../../constants/global';

import { styles } from './Snackbar.css';

export const SnackbarEnum = {
  Variants: {
    Success: 'success',
    Warning: 'warning',
    Error: 'error',
    Info: 'info',
  },
  Verticals: {
    Top: 'top',
    Bottom: 'bottom',
  },
  Horizontals: {
    Center: 'center',
    Left: 'left',
    Right: 'right',
  },
};

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
};

class Snackbar extends React.Component {
  static defaultProps = {
    autoHideDuration: SNACKBAR_AUTOHIDE_DURATION,
  };

  state = {
    // snackbar
    open: false,
    variant: SnackbarEnum.Variants.Success,
    message: '',
    vertical: SnackbarEnum.Verticals.Top,
    horizontal: SnackbarEnum.Horizontals.Center,
  };

  executeAndShowSnackbar = async (foo, args, options) => {
    try {
      const result = await foo(...args);
      this.showSnackbar(options);
      return result;
    } catch (e) {
      this.setState({
        open: true,
        variant: SnackbarEnum.Variants.Error,
        message: BaseModel.handleError(e),
      });
      throw e;
    }
  };

  showSnackbar = options => {
    this.setState({
      open: true,
      ...options,
    });
  };

  onCloseSnackbar = (e, reason) => {
    if (reason === 'clickaway') return;
    this.setState({ open: false });
  };

  render() {
    const { classes, autoHideDuration } = this.props;
    const {
      message,
      open,
      variant,
      vertical,
      horizontal,
    } = this.state;

    const Icon = variantIcon[variant];

    return ReactDOM.createPortal(
      <MuiSnackbar
        key={message}
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        onClose={this.onCloseSnackbar}
        autoHideDuration={autoHideDuration}
      >
        <SnackbarContent
          aria-describedby="client-snackbar"
          classes={{
            root: classes[variant],
            message: classes.snackbarMessageContent,
          }}
          message={
            <span id="client-snackbar" className={classes.message}>
              <Icon className={classNames(classes.icon, classes.iconVariant)} />
              {message}
            </span>
          }
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              className={classes.close}
              onClick={this.onCloseSnackbar}
            >
              <CloseIcon className={classes.icon} />
            </IconButton>,
          ]}
        />
      </MuiSnackbar>,
      document.body
    );
  }
}

Snackbar.propTypes = {
  classes: PropTypes.object,
  autoHideDuration: PropTypes.number,
};

export default withStyles(styles)(Snackbar);
