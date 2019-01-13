import React, { Component } from 'react';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import LandingRoute from '../../../landing/view/LandingRoute';
import { withDefaultLayout } from '../../hoc/DefaultLayout';
import AdminRoute from '../../../admin/AdminRoute';
import { inject, observer } from 'mobx-react';
import { appStorePropTypes } from '../../store/AppStore';
import withAuth from '../../hoc/AuthRoute';
import { tagService } from '../../domain/services/TagService';
import { TagModel } from '../../domain/models/TagModel';

@inject('appStore')
@observer
class IndexRoute extends Component {
  async getTags() {
    const tags = await tagService.list();
    this.props.appStore.setTags(tags.map(t => new TagModel(t)));
  }

  componentDidMount () {
    this.getTags();
  }

  render() {
    return (
      <Switch>
        <Route exact path='/' component={LandingRoute} />
        <Route path='/admin' component={withAuth(AdminRoute)} />
        <Redirect to='/' />
      </Switch>
    );
  }
}

IndexRoute.propTypes = {
  appStore: appStorePropTypes,
};

export default withRouter(withDefaultLayout(IndexRoute));
