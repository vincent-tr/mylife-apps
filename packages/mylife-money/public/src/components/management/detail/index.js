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

const useStyles = makeStyles(theme => ({
  container: {
    padding: theme.spacing(2),
  },
  groupContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  breadcrumbs: {
    flex: '1 1 auto',
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  grid: {
    display: 'flex',
    flexDirection: 'column'
  },
  row: {
    height: 64,
    display: 'flex',
    alignItems: 'center',
  },
  label: {
    width: 100
  },
  content: {
  }
}));

const Row = ({ label, children }) => {
  const classes = useStyles();
  return (
    <div className={classes.row}>
      <mui.Typography className={classes.label}>
        {label}
      </mui.Typography>

      <div className={classes.content}>
        {children}
      </div>
    </div>
  );
};

const DetailContainer = ({ className }) => {
  const classes = useStyles();
  const { operation, account, groupStack, close, onOpenGroup, onSetNote, onMove } = useConnect();

  return (
    <mui.Paper className={clsx(classes.container, className)}>
      <mui.Typography variant='h6' className={classes.title}>{'Detail de l\'opération'}</mui.Typography>
      <mui.Button onClick={close}>Back</mui.Button>

      <div className={classes.grid}>
        <Row label='Montant'>
          <mui.Typography>
            {operation.amount}
          </mui.Typography>
        </Row>

        <Row label='Date'>
          <mui.Typography>
            {new Date(operation.date).toLocaleDateString('fr-FR')}
          </mui.Typography>
        </Row>

        <Row label='Libellé'>
          <mui.Typography>
            {operation.label}
          </mui.Typography>
        </Row>

        <Row label='Notes'>
          <DebouncedTextField value={operation.note} onChange={onSetNote} fullWidth />
        </Row>

        <Row label='Groupe'>
          <div className={classes.groupContainer}>
            <mui.Tooltip title={'Déplacer l\'opération'}>
              <div>
                <GroupSelectorButton onSelect={onMove}>
                  <icons.actions.Move />
                </GroupSelectorButton>
              </div>
            </mui.Tooltip>

            <mui.Breadcrumbs aria-label='breadcrumb' className={classes.breadcrumbs}>
              {groupStack.map(group => {
                const handleClick = e => {
                  e.preventDefault();
                  onOpenGroup(group._id);
                };

                return (
                  <mui.Link key={group._id} color='textPrimary' href='#' onClick={handleClick}>
                    {group.display}
                  </mui.Link>
                );
              })}
            </mui.Breadcrumbs>
          </div>
        </Row>

        <Row label='Compte'>
          <mui.Typography>
            {account.display}
          </mui.Typography>
        </Row>
      </div>
    </mui.Paper>
  );
};

DetailContainer.propTypes = {
  className: PropTypes.string
};

export default DetailContainer;
