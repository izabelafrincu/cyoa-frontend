import React, { Component } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import * as PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import { styles as storiesTableStyles } from '../../../style/StoriesTableCmp.css';
import { styles as tableStyles } from '../../../style/TableCmp.css';
import { StoryModel } from '../../../domain/models/StoryModel';
import classNames from 'classnames';
import { TableCell } from './TableCell';

class StoriesTableCmp extends Component {
  render() {
    const { classes } = this.props;

    return (
      <Paper className={classNames(classes.root, classes.storiesTable)}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              {StoryModel.getTableColumns().map((column, i) =>
                <TableCell key={i}>{column.label}</TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {this.props.stories.map(row =>
              <TableRow className={classes.row} key={row._id}>
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="right">{row.tags.join(', ')}</TableCell>
                <TableCell align="right">{row.createdAt}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    );
  }
}

StoriesTableCmp.propTypes = {
  classes: PropTypes.object,
  stories: PropTypes.arrayOf(PropTypes.shape(StoryModel)),
};

export default withStyles(theme => ({
  ...tableStyles(theme),
  ...storiesTableStyles(theme),
}))(StoriesTableCmp);