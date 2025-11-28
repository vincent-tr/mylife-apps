import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DebouncedTextField } from 'mylife-tools';
import Markdown from '../../../common/components/markdown';
import { getAccount, getGroupStack } from '../../../reference/selectors';
import { closeDetail, operationSetNoteDetail, operationMoveDetail, selectGroup, getOperationDetail } from '../../store';
import AmountValue from './amount-value';
import GroupBreadcrumbs from './group-breadcrumbs';
import Row from './row';
import Title from './title';

type FIXME_any = any;

const useConnect = () => {
  const dispatch = useDispatch<FIXME_any>();
  return {
    ...useSelector((state) => {
      const operation = getOperationDetail(state) as FIXME_any;
      return {
        operation,
        account: getAccount(state, operation.account) as FIXME_any,
        groupStack: getGroupStack(state, operation.group),
      };
    }),
    ...useMemo(
      () => ({
        close: () => dispatch(closeDetail()),
        onOpenGroup: (id: string) => dispatch(selectGroup(id)),
        onSetNote: (note: string) => dispatch(operationSetNoteDetail(note)),
        onMove: (id: string) => dispatch(operationMoveDetail(id)),
      }),
      [dispatch]
    ),
  };
};

const Container = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
}));

const Grid = styled('div')({
  display: 'flex',
  flexDirection: 'column',
});

export interface DetailContainerProps {
  className?: string;
}

export default function DetailContainer({ className }: DetailContainerProps) {
  const { operation, account, groupStack, close, onOpenGroup, onSetNote, onMove } = useConnect();

  return (
    <Container className={className}>
      <Title onClose={close} />

      <Grid>
        <Row label="Compte">
          <Typography>{account.display}</Typography>
        </Row>

        <Row label="Groupe">
          <GroupBreadcrumbs groupStack={groupStack} onMove={onMove} onOpenGroup={onOpenGroup} />
        </Row>

        <Row label="Montant">
          <AmountValue value={operation.amount} />
        </Row>

        <Row label="Date">
          <Typography>{new Date(operation.date).toLocaleDateString('fr-FR')}</Typography>
        </Row>

        <Row label="Libellé">
          <Typography>{operation.label}</Typography>
        </Row>

        <Row label="Notes">
          <NoteEditor value={operation.note} onChange={onSetNote} />
        </Row>
      </Grid>
    </Container>
  );
}

const NoteContainer = styled(Paper)({
  height: 450, // must match min/maxRows of TextField
  display: 'flex',
  flexDirection: 'column',
});

const NoteView = styled(Markdown)({
  flex: 1,
  overflowY: 'auto',
});

interface NoteEditorProps {
  value: string;
  onChange: (newValue: string) => void;
}

function NoteEditor({ value, onChange }: NoteEditorProps) {
  type TabValues = 'view' | 'update';

  const [tabValue, setTabValue] = React.useState<TabValues>('view');

  const handleChange = (event: React.ChangeEvent, newValue: TabValues) => {
    setTabValue(newValue);
  };

  return (
    <NoteContainer square>
      <Tabs value={tabValue} indicatorColor="primary" textColor="primary" onChange={handleChange}>
        <Tab label="Visualiser" value={'view' as TabValues} />
        <Tab label="Modifier" value={'update' as TabValues} />
      </Tabs>

      {tabValue === 'view' && <NoteView value={value} />}

      {tabValue === 'update' && <DebouncedTextField variant="outlined" value={value} onChange={onChange} fullWidth multiline minRows={19} maxRows={19} />}
    </NoteContainer>
  );
}
