import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import { styles as tableStyles } from '../../../../../../shared/components/table/TableCmp.css';
import TableCmp from '../../../../../../shared/components/table/TableCmp';
import { optionService } from '../../../../../../infrastructure/services/OptionService';
import { OptionModel } from '../../../../../../infrastructure/models/OptionModel';
import { inject, observer } from 'mobx-react';
import { storyViewStorePropTypes } from '../../../../stores/StoryViewStore';
import BasicNewAction from '../../../../../../shared/components/form/BasicNewAction';
import SaveOptionModal from '../save-option/SaveOptionModal';
import BasicEditAction from '../../../../../../shared/components/form/BasicEditAction';
import DeleteRow from '../../../../../../shared/components/table/actions/DeleteRow';
import { renderOptionTableTitle } from './OptionTableTitle';
import { SequenceModel } from '../../../../../../infrastructure/models/SequenceModel';

@inject('storyViewStore')
@observer
class OptionTableCmp extends Component {
  getConsequences(option) {
    return option.consequences
      .filter(c => c.attribute)
      .map((attr, i) =>
        <div key={i}>
          <b>{attr.attribute}</b>&nbsp;:&nbsp;<b>{attr.changeValue}</b>
        </div>
      );
  }

  getOptions = async () => {
    const { sequence: { _id: id } } = this.props;
    const params = { ':sequence': id };
    optionService.setNextRouteParams(params);
    const options = await optionService.list();
    this.props.storyViewStore.setOptionsToSequence(id, options);
  };

  onDeleteOption = id => () => {
    this.props.onDeleteOption(this.props.sequence._id, id);
  };

  getActions = row => {
    // The options property is marked as an observable and that's
    // why React complains when it sees the boxed version of its value.
    // To get around that, we need to unbox it and create a new model.
    // toJS is imported from mobx
    // const unboxedRow = new OptionModel(toJS(row));

    // Or we can just not render the actions until the observable gets unboxed
    // automatically.
    if (!(row instanceof OptionModel)) return '';

    const { classes, sequence: { _id: seqId } } = this.props;

    return (
      <div key={row._id} className={classes.actionsContainer}>
        <BasicEditAction
          resourceName="option"
          resource={row}
          modalComponent={SaveOptionModal}
          innerProps={{ sequenceId: seqId }}
        />
        <DeleteRow
          title="Delete confirmation"
          description="Are you sure you want to delete this attribute?"
          onClick={this.onDeleteOption(row._id)}
        />
      </div>
    );
  };

  componentDidMount () {
    this.getOptions();
  }

  render() {
    const { sequence } = this.props;
    const columns = OptionModel.getTableColumns();

    const data = sequence.options.map(o => {
      return [
        o.action,
        o.nextSeq.name,
        this.getConsequences(o),
        this.getActions(o),
      ];
    });

    const tableOptions = {
      search: false,
      textLabels: {
        body: {
          noMatch: 'No options available',
        },
      },
      customToolbar: () => {
        return (
          <BasicNewAction
            tooltip="New option"
            modalComponent={SaveOptionModal}
            innerProps={{ sequenceId: sequence._id }}
          />
        );
      },
    };

    return (
      <TableCmp
        title={renderOptionTableTitle()}
        columns={columns}
        data={data}
        options={tableOptions}
      />
    );
  }
}

OptionTableCmp.propTypes = {
  classes: PropTypes.object,
  sequence: PropTypes.instanceOf(SequenceModel).isRequired,
  onDeleteOption: PropTypes.func.isRequired,

  storyViewStore: storyViewStorePropTypes,
};

export default withStyles(theme => ({
  ...tableStyles(theme),
}))(OptionTableCmp);
