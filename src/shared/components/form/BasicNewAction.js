import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { IconButton, Tooltip } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

class BasicNewAction extends Component {
  state = {
    modalOpen: false,
  };

  onShowModal = async () => {
    const { onModalOpen } = this.props;
    onModalOpen && await onModalOpen();
    this.setState({ modalOpen: true });
  };

  onHideModal = () => {
    this.setState({ modalOpen: false });
  };

  render() {
    const {
      className,
      tooltip, innerProps,
      modalComponent: ModalComponent,
    } = this.props;
    const { modalOpen } = this.state;
    return (
      <>
        <Tooltip title={tooltip}>
          <IconButton
            className={className}
            onClick={this.onShowModal}
          >
            <AddIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <ModalComponent
          open={modalOpen}
          onClose={this.onHideModal}
          {...(innerProps || {})}
        />
      </>
    );
  }
}

BasicNewAction.propTypes = {
  className: PropTypes.string,
  tooltip: PropTypes.string.isRequired,
  modalComponent: PropTypes.object.isRequired,
  innerProps: PropTypes.object,
  onModalOpen: PropTypes.func,
  onModalClose: PropTypes.func,
};

export default BasicNewAction;
