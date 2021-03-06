import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import { Formik } from 'formik';
import { inject } from 'mobx-react';

import { StoryModel } from '../../../../../../infrastructure/models/StoryModel';
import { DialogTitle } from '../../../../../../shared/components/dialog/Title';
import { DialogContent } from '../../../../../../shared/components/dialog/Content';
import { DialogActions } from '../../../../../../shared/components/dialog/Actions';
import Snackbar, { SnackbarEnum } from '../../../../../../shared/components/snackbar/Snackbar';
import SaveStoryForm from './SaveStoryForm';
import { storyStorePropTypes } from '../../../../stores/StoryStore';
import { storyService } from '../../../../../../infrastructure/services/StoryService';
import BasicFormActions from '../../../../../../shared/components/form/BasicFormActions';
import { TagModel } from '../../../../../../infrastructure/models/TagModel';
import { Dialog } from '../../../../../../shared/components/dialog/Dialog';

import { styles } from './SaveStory.css';
import { dialogDefaultCss } from '../../../../../../shared/components/dialog/Dialog.css';

@inject('storyStore')
class SaveStoryModal extends Component {
  snackbarRef = React.createRef();

  renderTitle() {
    return this.props.story ? 'Edit story' : 'Create story';
  }

  saveStory = async values => {
    return await this.snackbarRef.current.executeAndShowSnackbar(
      storyService.save,
      [StoryModel.forApi(values)],
      {
        variant: SnackbarEnum.Variants.Success,
        message: 'Story saved!',
      },
    );
  };

  updateStory = async values => {
    const { storyStore } = this.props;
    const story = await this.snackbarRef.current.executeAndShowSnackbar(
      storyService.update,
      [values._id, StoryModel.forApi(values)],
      {
        variant: SnackbarEnum.Variants.Success,
        message: 'Story updated!',
      },
    );
    storyStore.updateStory(values._id, story);
    return story;
  };

  getInitialValues = () => {
    const { story, storyStore: { selectedCollection: fromCollection } } = this.props;
    return story || new StoryModel({ fromCollection });
  };

  onClose = (resetForm) => () => {
    resetForm(this.getInitialValues());
    this.props.onClose();
  };

  onSubmit = async (values, { setSubmitting, resetForm }) => {
    const { onSuccess } = this.props;

    values.tagsName = TagModel.get()
      .filter(
        tt => values.tags.find(t => tt._id === t)
      )
      .map(tt => tt.name);
    try {
      const story = values._id
        ? await this.updateStory(values)
        : await this.saveStory(values);
      onSuccess && await onSuccess(story);
      this.onClose(resetForm)();
    } finally {
      setSubmitting(false);
    }
  };

  validate = values => {
    const model = new StoryModel(values);
    return model.checkErrors();
  };

  renderForm = formik => {
    const { classes, storyStore, open } = this.props;
    return (
      <Dialog
        open={open}
        onClose={this.onClose(formik.resetForm)}
        classes={{ paper: classes.dialogSize }}
      >
        <DialogTitle
          onClose={this.onClose(formik.resetForm)}
        >
          {this.renderTitle()}
        </DialogTitle>
        <DialogContent>
          <SaveStoryForm
            formik={formik}
            onClose={this.onClose(formik.resetForm)}
            collections={storyStore.collections}
          />
        </DialogContent>
        <DialogActions>
          <BasicFormActions
            formik={formik}
            onClose={this.onClose(formik.resetForm)}
          />
        </DialogActions>
      </Dialog>
    );
  };

  render() {
    return (
      <>
        <Formik
          enableReinitialize={true}
          initialValues={this.getInitialValues()}
          validateOnChange={false}
          onSubmit={this.onSubmit}
          validate={this.validate}
        >
          {this.renderForm}
        </Formik>
        <Snackbar innerRef={this.snackbarRef}/>
      </>
    );
  }
}

SaveStoryModal.propTypes = {
  classes: PropTypes.object,
  story: PropTypes.instanceOf(StoryModel),
  open: PropTypes.bool.isRequired,
  onSuccess: PropTypes.func,
  onClose: PropTypes.func.isRequired,
  storyStore: storyStorePropTypes,
};

export default withStyles(theme => ({
  ...styles(theme),
  ...dialogDefaultCss(theme),
}))(SaveStoryModal);
