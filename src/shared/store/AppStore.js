import * as PropTypes from 'prop-types';
import { action, computed, observable } from 'mobx';
import { UserModel } from '../../infrastructure/models/UserModel';

const makeRandomId = function () {
  return Math.random().toString().substring(2);
};

class AppStore {
  @observable HeaderCmp;
  @observable user;
  @observable onlineStatus;
  localId = '';

  constructor () {
    const user = localStorage.getItem('user');
    if (user) {
      this.user = JSON.parse(user);
    } else {
      this.localId = localStorage.getItem('localId');
      if (!this.localId) {
        this.localId = makeRandomId();
        localStorage.setItem('localId', this.localId);
      }
    }
  }

  @action setUser(user) {
    this.user = user;
  }

  @action loadHeader(cmp) {
    this.HeaderCmp = cmp;
  }

  @action unloadHeader() {
    this.HeaderCmp = null;
  }

  @action setOnlineStatus(status) {
    this.onlineStatus = status;
  }

  @computed get isLoggedIn() {
    return !!this.user;
  }

  getUserId() {
    return this.isLoggedIn
      ? this.user._id
      : this.localId;
  }
}

export const appStorePropTypes = PropTypes.shape({
  user: PropTypes.instanceOf(UserModel),

  setUser: PropTypes.func,
  getUserId: PropTypes.func,

  loadHeader: PropTypes.func,
  unloadHeader: PropTypes.func,

  setOnlineStatus: PropTypes.func,

  isLoggedIn: PropTypes.bool,
});

export const appStore = new AppStore();
