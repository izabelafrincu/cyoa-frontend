import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

import { ERRORS } from '../constants/errors';
import withDisabledBtn from './withDisabledBtn';
import { storyViewStorePropTypes } from '../../admin/story-view/stores/StoryViewStore';

/**
 * This HOC will wrap a component and set the 'disabled' property of it to true/false
 * based either on the 'currentStory' property of the 'storyViewStore' or an override
 * property called 'storyPublished'
 * @param WrappedCmp
 * @returns {DisabledComponent}
 */
export default function withDisabledStoryPublished (WrappedCmp) {
  const WithDisabledBtnWrappedCmp = withDisabledBtn(WrappedCmp);

  @inject('storyViewStore')
  @observer
  class DisabledComponent extends Component {
    isStoryPublished = () => {
      const {
        storyPublished,
        storyViewStore: { currentStory: story },
      } = this.props;
      return storyPublished !== undefined
        ? storyPublished
        : story ? story.published: false;
    };

    render() {
      return (
        <WithDisabledBtnWrappedCmp
          reason={ERRORS.cannotPerformActionWhileStoryPublished}
          condition={this.isStoryPublished()}
          {...this.props}
        />
      );
    }
  }

  DisabledComponent.propTypes = {
    storyPublished: PropTypes.bool,
    storyViewStore: storyViewStorePropTypes,
  };


  return DisabledComponent;
}
