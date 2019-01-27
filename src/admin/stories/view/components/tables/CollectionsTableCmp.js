import React, { Component } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import * as PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import { CollectionModel } from '../../../domain/models/CollectionModel';
import classNames from 'classnames';
import { styles as tableStyles } from '../../../../../shared/components/table/TableCmp.css';
import { styles as collectionsTableStyles } from '../../../style/CollectionsTableCmp.css';
import { TableCell } from '../../../../../shared/components/table/TableCell';
import DeleteIcon from '@material-ui/icons/Delete';
import sharedClasses from '../../../../../shared/components/table/TableContainer.module.scss';
import IconButton from '@material-ui/core/IconButton';
import { withConfirmation } from '../../../../../shared/hoc/withConfirmation';
import EditCollection from '../actions/EditCollections';

const IconButtonHOC = withConfirmation(IconButton);

class CollectionsTableCmp extends Component {
  onChangeCollection = id => () => {
    this.props.onChangeCollection(id);
  };

  onDeleteCollection = id => () => {
    this.props.onDeleteCollection(id);
  };

  render() {
    const { classes } = this.props;
    const collections = [
      new CollectionModel({ name: 'Default' }),
      ...this.props.collections,
    ];

    return (
      <Paper className={classNames(classes.root, classes.collectionsTable)}>
        <Table className={classes.table}>
          <TableHead className={classes.header}>
            <TableRow className={classes.thead}>
              {CollectionModel.getTableColumns().map((column, i) =>
                <TableCell className={classes.cell} key={i}>
                  {column.label}
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {collections.map((row, index) =>
              <TableRow
                className={classNames(classes.row, sharedClasses.row)}
                key={row._id}
                hover={true}
              >
                <TableCell className={classes.cell}>
                  <span
                    className={classes.clickableText}
                    onClick={this.onChangeCollection(row._id)}
                  >
                    {row.name}
                  </span>
                  {index > 0 && <div className={sharedClasses.actionsContainer}>
                    <EditCollection collection={row}/>
                    <IconButtonHOC
                      title="Delete confirmation"
                      description="Are you sure you want to delete this collection?"
                      onClick={this.onDeleteCollection(row._id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButtonHOC>
                  </div>}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    );
  }
}

CollectionsTableCmp.propTypes = {
  classes: PropTypes.object,
  collections: PropTypes.arrayOf(PropTypes.shape(CollectionModel)),
  onChangeCollection: PropTypes.func.isRequired,
  onDeleteCollection: PropTypes.func.isRequired,
};

export default withStyles(theme => ({
  ...tableStyles(theme),
  ...collectionsTableStyles(theme),
}))(CollectionsTableCmp);
