import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { Button } from '@material-ui/core';

import { storyService } from '../../../../../infrastructure/services/StoryService';
import { StoryModel } from '../../../../../infrastructure/models/StoryModel';
import { storyViewStorePropTypes } from '../../../stores/StoryViewStore';
import Snackbar, { SnackbarEnum } from '../../../../../shared/components/snackbar/Snackbar';
import { withModal } from '../../../../../shared/hoc/withModal';
import { BACKEND_ERRORS } from '../../../../../shared/constants/errors';

import styles from './GeneralTab.module.scss';

const HOCButton = withModal(Button);

@inject('storyViewStore')
@observer
class PublishBtn extends Component {
  state = { errors: [] };
  snackbarRef = React.createRef();

  onCheckIfCanPublish = async () => {
    const { story } = this.props;
    try {
      await storyService.checkIfCanPublish(story._id);
      return true;
    } catch (e) {
      this.setState({ errors: Object.keys(e) });
      return false;
    }
  };

  onChangePublishState = (published, message) => async () => {
    const { story, onPublishStateChanged } = this.props;

    const dbStory = await this.snackbarRef.current.executeAndShowSnackbar(
      storyService.publish,
      [story._id, published ],
      { variant: SnackbarEnum.Variants.Success, message }
    );
    await onPublishStateChanged(dbStory);
  };

  renderErrors = () => {
    const { errors } = this.state;

    if (!errors.length) return null;

    return (
      <>
        <span className={styles.publishBtnErrors}>Encountered the following errors:</span>
        <ul className={styles.publishBtnErrors}>
          {errors.map((err, i) => {
            return <li key={i}>{BACKEND_ERRORS[err]}</li>;
          })}
        </ul>
      </>
    );
  };

  renderPublishDescription = () => {
    return (
      <>
        <span>Please note the following:</span>
        <ul>
          <li>If the player should be able to lose the story, at least one important attribute is needed</li>
          <li>You need to have marked one sequence as a starting sequence</li>
          <li>You need at least one sequence marked as ending sequence </li>
        </ul>
        {this.renderErrors()}
      </>
    );
  };

  renderPublishButton = () => {
    return (
      <HOCButton
        title="Publish this story?"
        description={this.renderPublishDescription()}
        innerProps={{
          variant: 'contained',
          color: 'primary',
        }}
        onClick={this.onChangePublishState(true, 'Story has been published!')}
        onPreCondition={this.onCheckIfCanPublish}
      >
        Publish
      </HOCButton>
    );
  };

  renderUnpublishDescription = () => {
    return (
      <>
        <span>Please note the following:</span>
        <ul>
          <li>The story will not be accessible to anyone, even if they have the link to it</li>
          <li>Any players associated to the story will be deleted</li>
        </ul>
      </>
    );
  };

  renderUnpublishButton = () => {
    return (
      <HOCButton
        title="Unpublish this story?"
        description={this.renderUnpublishDescription()}
        innerProps={{
          variant: 'contained',
          color: 'secondary',
        }}
        onClick={this.onChangePublishState(false, 'Story has been unpublished!')}
      >
        Unpublish
      </HOCButton>
    );
  };

  render() {
    const { story } = this.props;

    return (
      <>
        {story.published ? this.renderUnpublishButton() : this.renderPublishButton()}
        <Snackbar innerRef={this.snackbarRef}/>
      </>
    );
  }
}

PublishBtn.propTypes = {
  story: PropTypes.shape(StoryModel).isRequired,
  onPublishStateChanged: PropTypes.func.isRequired,

  storyViewStore: storyViewStorePropTypes,
};

export default PublishBtn;
