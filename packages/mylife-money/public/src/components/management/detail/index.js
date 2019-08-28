'use strict';

import { React, mui, useMemo, useSelector, useDispatch, PropTypes, clsx, DebouncedTextField } from 'mylife-tools-ui';
import icons from '../../icons';
import { closeDetail, operationSetNoteDetail, operationMoveDetail, selectGroup } from '../../../actions/management';
import { getOperationDetail } from '../../../selectors/management';
import { getAccount, getGroupStack } from '../../../selectors/reference';
import GroupSelectorButton from '../../common/group-selector-button';

const { makeStyles } = mui;

const useConnect = () => {
  const dispatch = useDispatch();
  return {
    ...useSelector(state => {
      const operation = getOperationDetail(state);
      return {
        operation,
        account: getAccount(state, operation),
        groupStack: getGroupStack(state, operation)
      };
    }),
    ...useMemo(() => ({
      close: () => dispatch(closeDetail()),
      onOpenGroup: (id) => dispatch(selectGroup(id)),
      onSetNote: (note) => dispatch(operationSetNoteDetail(note)),
      onMove: (id) => dispatch(operationMoveDetail(id)),
    }), [dispatch])
  };
};

const useStyles = makeStyles({
  container: {
  }
});

const DetailContainer = ({ className }) => {
  const classes = useStyles();
  const { operation, account, groupStack, close, onOpenGroup, onSetNote, onMove } = useConnect();

  return (
    <mui.Paper className={clsx(classes.container, className)}>
      <mui.Typography variant='h6' className={classes.title}>{'Detail de l\'opération'}</mui.Typography>
      <mui.Button onClick={close}>Back</mui.Button>
      <mui.Tooltip title='Déplacer'>
        <div>
          <GroupSelectorButton onSelect={onMove}>
            <icons.actions.Move />
          </GroupSelectorButton>
        </div>
      </mui.Tooltip>
      <mui.Grid container spacing={2}>
        <mui.Grid item xs={4}>Montant</mui.Grid>
        <mui.Grid item xs={8}>{operation.amount}</mui.Grid>
        <mui.Grid item xs={4}>Date</mui.Grid>
        <mui.Grid item xs={8}>{new Date(operation.date).toLocaleDateString('fr-FR')}</mui.Grid>
        <mui.Grid item xs={4}>Libellé</mui.Grid>
        <mui.Grid item xs={8}>{operation.label}</mui.Grid>
        <mui.Grid item xs={4}>Notes</mui.Grid>
        <mui.Grid item xs={8}><DebouncedTextField value={operation.note} onChange={onSetNote} /></mui.Grid>
        <mui.Grid item xs={4}>Groupe</mui.Grid>
        <mui.Grid item xs={8}>
          <mui.Breadcrumbs aria-label='breadcrumb'>
            {groupStack.map(group => {
              const handleClick = e => {
                e.preventDefault();
                onOpenGroup(group._id);
              };

              return (
                <mui.Link key={group._id} color="inherit" href='#' onClick={handleClick}>
                  {group.display}
                </mui.Link>
              );
            })}
          </mui.Breadcrumbs>
        </mui.Grid>
        <mui.Grid item xs={4}>Compte</mui.Grid>
        <mui.Grid item xs={8}>{account.display}</mui.Grid>
      </mui.Grid>
    </mui.Paper>
  );
};

DetailContainer.propTypes = {
  className: PropTypes.string
};

export default DetailContainer;
