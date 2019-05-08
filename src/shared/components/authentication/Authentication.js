import React, { Component, Fragment } from 'react';
import * as PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Exit from '@material-ui/icons/ExitToAppRounded';
import { styles } from './Authentication.css';
import Button from '@material-ui/core/Button';
import AuthenticationModal from './AuthenticationModal';
import { inject, observer } from 'mobx-react';
import { appStorePropTypes } from '../../store/AppStore';
import { withRouter } from 'react-router-dom';
import Snackbar from '../snackbar/Snackbar';
import { Tooltip } from '@material-ui/core';
import classNames from 'classnames';

@inject('appStore')
@observer
class Authentication extends Component {
  state = {
    modalOpen: false,
  };
  snackbarRef = React.createRef();

  onChangeState = (metadata) => () => {
    this.setState(metadata);
  };

  onHandleLogout = (history) => () => {
    this.props.appStore.setUser(null);
    this.snackbarRef.current.showSnackbar({
      variant: 'success',
      message: 'Goodbye!',
    });
    localStorage.removeItem('jwt');
    history.replace('/');
  };

  onAuthSuccessful = () => {
    const { onAuthSuccessful } = this.props;
    this.snackbarRef.current.showSnackbar({
      variant: 'success',
      message: 'Welcome!',
    });
    onAuthSuccessful && onAuthSuccessful();
  };

  renderLogin = () => {
    const { classes } = this.props;
    return (
      <>
        <Button
          onClick={this.onChangeState({ modalOpen: true })}
          color="inherit"
        >
          Login
        </Button>
        <div className={classes.mainAuthArea}/>
      </>
    );
  };

  renderLogout = () => {
    const { classes, appStore } = this.props;
    const Logout = withRouter(({ history }) => (
      <>
        <div className={classNames(classes.mainAuthArea, classes.userEmail)}>
          {appStore.user.email}
        </div>
        <Tooltip title="Logout">
          <Button
            onClick={this.onHandleLogout(history)}
            color="inherit"
          >
            <Exit />
          </Button>
        </Tooltip>
      </>
    ));
    return <Logout />;
  };

  render() {
    const { appStore } = this.props;
    const { modalOpen } = this.state;

    return (
      <Fragment>
        {appStore.isLoggedIn
          ? this.renderLogout(this.props)
          : this.renderLogin(this.props)
        }
        <AuthenticationModal
          open={modalOpen}
          onSuccess={this.onAuthSuccessful}
          onClose={this.onChangeState({ modalOpen: false })}
        />
        <Snackbar innerRef={this.snackbarRef}/>
      </Fragment>
    );
  }
}

Authentication.propTypes = {
  classes: PropTypes.object.isRequired,
  onAuthSuccessful: PropTypes.func,
  appStore: appStorePropTypes,
};

export default withStyles(styles)(Authentication);
