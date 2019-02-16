import { BaseModel } from './BaseModel';
import { observable } from 'mobx';
import { ERRORS } from '../../shared/constants/errors';

export class SequenceModel extends BaseModel {
  _id = '';
  name = '';
  content = '';
  isEnding = false;
  @observable options = [];

  constructor(metadata) {
    super();
    Object.assign(this, metadata);
  }

  checkErrors() {
    let errors = {};
    if (!this.name) {
      errors.name = ERRORS.fieldRequired;
    }
    if (!this.content) {
      errors.content = ERRORS.fieldRequired;
    }
    return errors;
  }

  static forApi(attribute) {
    return {
      name: attribute.name,
      content: attribute.content,
      isEnding: attribute.isEnding,
    };
  }

  static getTableColumns() {
    return [
      { name: 'Id', options: { display: 'excluded' } },
      { name: 'Name' },
      {
        name: '',
        options: { filter: false, sort: false },
      },
    ];
  }
}
