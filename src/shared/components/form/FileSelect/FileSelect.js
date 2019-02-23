import React from 'react';
import Button from '@material-ui/core/Button';
import * as PropTypes from 'prop-types';
import styles from './FileSelect.module.scss';
import Snackbar from '../../snackbar/Snackbar';
import { ERRORS } from '../../../constants/errors';

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

class FileSelect extends React.Component {
  state = {
    file: '',
    base64Img: this.props.initialPreview || '',

    // snackbar
    open: false,
    variant: 'success',
    message: '',
  };

  isImg = file => /^image/.test(file.type);

  checkFile = file => {
    if (file.size <= 10e5) return;

    this.onChangeState({
      open: true,
      variant: 'error',
      message: ERRORS.fileTooLarge,
    })();
    throw ERRORS.fileTooLarge;
  };

  onFileUploaded = async ev => {
    const file = ev.target.files[0];

    if (!file) return;
    this.checkFile(file);

    const base64 = await getBase64(file);
    this.props.onFileUploaded(base64);

    if (this.isImg(file)) {
      this.onChangeState({ base64Img: base64 })();
    }

    this.onChangeState({ file })();
  };

  onChangeState = (metadata) => {
    return () => this.setState(metadata);
  };

  render() {
    const { className } = this.props;
    const label = this.state.file.name || this.props.label;

    return (
      <div className={styles.container}>
        <input
          className={styles.uploadInput}
          onChange={this.onFileUploaded}
          accept="image/*"
          id="contained-button-file"
          type="file"
        />
        <label htmlFor="contained-button-file">
          <Button
            className={className}
            variant="contained"
            component="span"
          >
            {label || 'Upload'}
          </Button>
        </label>
        <div>
          <img
            className={styles.preview}
            src={this.state.base64Img}
            alt=""
          />
        </div>

        <Snackbar
          open={this.state.open}
          onClose={this.onChangeState({ open: false })}
          message={this.state.message}
          variant={this.state.variant}
        />
      </div>
    );
  }
}

FileSelect.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
  initialPreview: PropTypes.string,
  onFileUploaded: PropTypes.func.isRequired,
};

export default FileSelect;
