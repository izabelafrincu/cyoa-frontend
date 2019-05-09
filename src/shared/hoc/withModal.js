import React, { Component } from 'react';
import ConfirmationModal from '../components/confirmation/ConfirmationModal';
import { withStyles } from '@material-ui/core';
import { styles } from '../components/layout/Styles.css';
import * as PropTypes from 'prop-types';

export function withModal(InnerComponent, Modal = ConfirmationModal) {
  class Confirmation extends Component {
    state = {
      isOpen: false,
    };

    onAccept = (e) => {
      this.onHideModal(e);
      this.props.onClick();
    };

    onShowModal = (e) => {
      e.stopPropagation();
      this.setState({ isOpen: true });
    };

    onHideModal = (e) => {
      e.stopPropagation();
      this.setState({ isOpen: false });
    };

    render() {
      const { innerProps, children, title, description } = this.props;
      const { isOpen } = this.state;

      return (
        <>
          <InnerComponent
            onClick={this.onShowModal}
            {...innerProps}
          >
            {children}
          </InnerComponent>
          <Modal
            title={title}
            description={description}
            open={isOpen}
            onClose={this.onHideModal}
            onAccept={this.onAccept}/>
        </>
      );
    }
  }

  Confirmation.propTypes = {
    classes: PropTypes.object,
    title: PropTypes.oneOfType([
      PropTypes.string, PropTypes.func, PropTypes.object,
    ]).isRequired,
    description: PropTypes.oneOfType([
      PropTypes.string, PropTypes.func, PropTypes.object,
    ]).isRequired,
    onClick: PropTypes.func,
    innerProps: PropTypes.object,
  };

  return withStyles(styles)(Confirmation);
}
