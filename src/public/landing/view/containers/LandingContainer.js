import React, { Component, Fragment } from 'react';
import LandingCmp from '../components/landing/LandingCmp';
import { publicStoryService } from '../../../../infrastructure/services/StoryService';
import { inject, observer } from 'mobx-react';
import { publicStoryStorePropTypes } from '../../stores/PublicStoryStore';
import Breadcrumb from '../../../../shared/components/breadcrumb/Breadcrumb';
import { appStorePropTypes } from '../../../../shared/store/AppStore';
import FiltersContainer from './FiltersContainer';

@inject('publicStoryStore', 'appStore')
@observer
class LandingContainer extends Component {
  getStories = async filters => {
    const stories = await publicStoryService.list(filters);
    this.props.publicStoryStore.setStories(stories);
  };

  componentDidMount () {
    this.getStories();
    this.props.appStore.loadHeader(FiltersContainer);
  }

  componentWillUnmount () {
    this.props.appStore.unloadHeader(FiltersContainer);
  }

  render() {
    const { publicStoryStore: { stories } } = this.props;
    return (
      <Fragment>
        <Breadcrumb/>
        <LandingCmp
          stories={stories}
        />
      </Fragment>
    );
  }
}

LandingContainer.propTypes = {
  publicStoryStore: publicStoryStorePropTypes,
  appStore: appStorePropTypes,
};

export default LandingContainer;
