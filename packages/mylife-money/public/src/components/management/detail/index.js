'use strict';

import { React, mui, useMemo, useSelector, useDispatch, PropTypes, clsx, DebouncedTextField } from 'mylife-tools-ui';
import { closeDetail, operationSetNoteDetail, operationMoveDetail, selectGroup } from '../../../actions/management';
import { getOperationDetail } from '../../../selectors/management';
import { getAccount, getGroupStack } from '../../../selectors/reference';

import Title from './title';
import Row from './row';
import GroupBreadcrumbs from './group-breadcrumbs';
import AmountValue from './amount-value';

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
  grid: {
    display: 'flex',
    flexDirection: 'column'
  },
}));

const DetailContainer = ({ className }) => {
  const classes = useStyles();
  const { operation, account, groupStack, close, onOpenGroup, onSetNote, onMove } = useConnect();

  return (
    <mui.Paper className={clsx(classes.container, className)}>
      <Title onClose={close} />

      <div className={classes.grid}>
        <Row label='Montant'>
          <AmountValue value={operation.amount} />
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
          <GroupBreadcrumbs groupStack={groupStack} onMove={onMove} onOpenGroup={onOpenGroup} />
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
