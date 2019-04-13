const onHoverChange = theme => ({
  color: theme.palette.primary.main,
  cursor: 'pointer',
});

export const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowY: 'auto',
    overflowX: 'hidden',
  },
  clickableText: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    '&:hover': onHoverChange(theme),
  },
  actionsContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});
