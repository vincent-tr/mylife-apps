import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useSelector, useDispatch } from 'react-redux';
import { DebouncedTextField } from 'mylife-tools-ui';
import { closeDetail, operationSetNoteDetail, operationMoveDetail, selectGroup } from '../../actions';
import { getOperationDetail } from '../../selectors';
import { getAccount, getGroupStack } from '../../../reference/selectors';

import Title from './title';
import Row from './row';
import GroupBreadcrumbs from './group-breadcrumbs';
import AmountValue from './amount-value';
import Markdown from '../../../common/components/markdown';
import { Paper, Typography, Tabs, Tab, makeStyles } from '@mui/material';

type FIXME_any = any;

const useConnect = () => {
  const dispatch = useDispatch<FIXME_any>();
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
      onOpenGroup: (id: string) => dispatch(selectGroup(id)),
      onSetNote: (note: string) => dispatch(operationSetNoteDetail(note)),
      onMove: (id: string) => dispatch(operationMoveDetail(id)),
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

interface DetailContainerProps {
  className?: string;
}

const DetailContainer: React.FC<DetailContainerProps> = ({ className }) => {
  const classes = useStyles();
  const { operation, account, groupStack, close, onOpenGroup, onSetNote, onMove } = useConnect();

  return (
    <Paper className={clsx(classes.container, className)}>
      <Title onClose={close} />

      <div className={classes.grid}>
        <Row label='Compte'>
          <Typography>
            {account.display}
          </Typography>
        </Row>

        <Row label='Groupe'>
          <GroupBreadcrumbs groupStack={groupStack} onMove={onMove} onOpenGroup={onOpenGroup} />
        </Row>

        <Row label='Montant'>
          <AmountValue value={operation.amount} />
        </Row>

        <Row label='Date'>
          <Typography>
            {new Date(operation.date).toLocaleDateString('fr-FR')}
          </Typography>
        </Row>

        <Row label='Libellé'>
          <Typography>
            {operation.label}
          </Typography>
        </Row>

        <Row label='Notes'>
          <NoteEditor value={operation.note} onChange={onSetNote} />
        </Row>
      </div>
    </Paper>
  );
};

export default DetailContainer;


const useNoteEditorStyles = makeStyles(theme => ({
  container: {
    height: 450, // must match min/maxRows of TextField
    display: 'flex',
    flexDirection: 'column',
  },
  view: {
    flex: 1,
    overflowY: 'auto',
  },
}));

const NoteEditor: React.FunctionComponent<{ value:string; onChange: (newValue: string) => void; }> = ({ value, onChange}) => {
  const classes = useNoteEditorStyles();
  type TabValues = 'view' | 'update';

  const [tabValue, setTabValue] = React.useState<TabValues>('view');

  const handleChange = (event: React.ChangeEvent, newValue: TabValues) => {
    setTabValue(newValue);
  };

  return (
    <Paper square className={classes.container}>
      <Tabs value={tabValue} indicatorColor="primary" textColor="primary" onChange={handleChange}>
        <Tab label="Visualiser" value={'view' as TabValues} />
        <Tab label="Modifier" value={'update' as TabValues} />
      </Tabs>

      {tabValue === 'view' && (
        <Markdown className={classes.view} value={value} />
      )}

      {tabValue === 'update' && (
        <DebouncedTextField variant='outlined' value={value} onChange={onChange} fullWidth multiline minRows={19} maxRows={19}/>
      )}
    </Paper>
  );
};


