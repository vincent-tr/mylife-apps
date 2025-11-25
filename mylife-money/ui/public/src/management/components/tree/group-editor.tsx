import ExpandMore from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { dialogs } from 'mylife-tools-ui';
import icons from '../../../common/icons';

type FIXME_any = any;

const operators = {
  $eq: { display: 'Egal à' },
  $gt: { display: 'Inférieur à' },
  $gte: { display: 'Inférieur ou égal à' },
  $lt: { display: 'Supérieur à' },
  $lte: { display: 'Supérieur ou égal à' },
  $regex: { display: '(Expression régulière)' },
  $contains: { display: 'Contient' },
};

const fields = {
  amount: { display: 'Montant', format: (val) => parseInt(val, 10) },
  label: { display: 'Description', format: (val) => val },
  note: { display: 'Note', format: (val) => val },
};

const Container = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
});

const SelectField = styled(Select)(({ theme }) => ({
  marginLeft: theme.spacing(1),
}));

const TextInputField = styled(TextField)(({ theme }) => ({
  marginLeft: theme.spacing(1),
}));

const ConditionEditor = ({ onAddCondition }) => {
  const [field, setField] = useState(null);
  const [operator, setOperator] = useState(null);
  const [value, setValue] = useState(null);

  const onAdd = () => {
    const condition = {
      field: field,
      operator: operator,
      value: fields[field].format(value),
    };

    onAddCondition(condition);

    setField(null);
    setOperator(null);
    setValue(null);
  };

  return (
    <Container>
      <SelectField value={field || ''} onChange={(e) => setField(e.target.value || null)}>
        {Object.keys(fields).map((field) => (
          <MenuItem key={field} value={field}>
            {fields[field].display}
          </MenuItem>
        ))}
      </SelectField>
      <SelectField value={operator || ''} onChange={(e) => setOperator(e.target.value || null)}>
        {Object.keys(operators).map((operator) => (
          <MenuItem key={operator} value={operator}>
            {operators[operator].display}
          </MenuItem>
        ))}
      </SelectField>
      <TextInputField value={value || ''} onChange={(e) => setValue(e.target.value)} />
      <Tooltip title="Ajouter une condition">
        <div>
          <IconButton disabled={!field || !operator || !value} onClick={onAdd}>
            <icons.actions.New />
          </IconButton>
        </div>
      </Tooltip>
    </Container>
  );
};

ConditionEditor.propTypes = {
  onAddCondition: PropTypes.func.isRequired,
};

const ConditionsEditor = ({ conditions, onConditionsChanged }) => {
  const deleteCondition = (index) => onConditionsChanged(arrayDelete(conditions, index));
  const addCondition = (condition) => onConditionsChanged([...conditions, condition]);

  return (
    <Card>
      <CardContent>
        <Typography color="textSecondary" gutterBottom>
          Conditions
        </Typography>
        <List>
          {conditions.map((condition, index) => (
            <ListItem key={index}>
              <ListItemText primary={displayCondition(condition)} />
              <ListItemSecondaryAction>
                <Tooltip title="Supprimer la condition">
                  <IconButton onClick={() => deleteCondition(index)}>
                    <icons.actions.Delete />
                  </IconButton>
                </Tooltip>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>

        <ConditionEditor onAddCondition={addCondition} />
      </CardContent>
    </Card>
  );
};

ConditionsEditor.propTypes = {
  conditions: PropTypes.array.isRequired,
  onConditionsChanged: PropTypes.func.isRequired,
};

const RuleRow = ({ rule, onRuleChanged, onDeleteRule }) => {
  const updateRule = (prop, value) => onRuleChanged({ ...rule, [prop]: value });

  return (
    <TableRow>
      <TableCell>
        <Tooltip title="Supprimer la règle">
          <div>
            <IconButton onClick={onDeleteRule}>
              <icons.actions.Delete />
            </IconButton>
          </div>
        </Tooltip>
      </TableCell>
      <TableCell>
        <TextField label="Nom de la règle" value={rule.name || ''} onChange={(e) => updateRule('name', e.target.value)} />
      </TableCell>
      <TableCell>
        <ConditionsEditor conditions={rule.conditions} onConditionsChanged={(conditions) => updateRule('conditions', conditions)} />
      </TableCell>
    </TableRow>
  );
};

RuleRow.propTypes = {
  rule: PropTypes.object.isRequired,
  onRuleChanged: PropTypes.func.isRequired,
  onDeleteRule: PropTypes.func.isRequired,
};

const RulesEditor = ({ rules, onRulesChanged }) => {
  const addRule = () => {
    const rule = {
      conditions: [],
      name: 'Nouvelle règle',
    };

    onRulesChanged([...rules, rule]);
  };

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Typography>{`Règles (${rules.length})`}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Tooltip title="Ajouter une règle">
                  <IconButton onClick={addRule}>
                    <icons.actions.New />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rules.map((rule, index) => {
              const deleteRule = () => onRulesChanged(arrayDelete(rules, index));
              const changeRule = (rule) => onRulesChanged(arrayUpdate(rules, index, rule));

              return <RuleRow key={index} rule={rule} onRuleChanged={changeRule} onDeleteRule={deleteRule} />;
            })}
          </TableBody>
        </Table>
      </AccordionDetails>
    </Accordion>
  );
};

RulesEditor.propTypes = {
  rules: PropTypes.array.isRequired,
  onRulesChanged: PropTypes.func.isRequired,
};

const EditorDialog = ({ options, show, proceed }) => {
  const [group, setGroup] = useState(options.group);
  const updateGroup = (name, value) => setGroup({ ...group, [name]: value });

  return (
    <Dialog aria-labelledby="dialog-title" open={show} maxWidth="lg" fullWidth>
      <DialogTitle id="dialog-title">Editer le groupe</DialogTitle>
      <DialogContent dividers>
        <TextField label="Nom du groupe" id="display" value={group.display} onChange={(e) => updateGroup('display', e.target.value)} />

        {/* TODO: move */}

        <RulesEditor rules={group.rules} onRulesChanged={(rules) => updateGroup('rules', rules)} />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => proceed({ result: 'ok', group })} color="primary">
          OK
        </Button>
        <Button onClick={() => proceed({ result: 'cancel' })}>Annuler</Button>
      </DialogActions>
    </Dialog>
  );
};

EditorDialog.propTypes = {
  options: PropTypes.object.isRequired,
  show: PropTypes.bool.isRequired,
  proceed: PropTypes.func.isRequired,
};

const edit = dialogs.create(EditorDialog);

export default async (group) => {
  group = clone(group);
  const res = (await edit({ options: { group } })) as FIXME_any;
  if (res.result !== 'ok') {
    return;
  }

  return cleanGroup(res.group);
};

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function arrayUpdate(array, index, newItem) {
  return [...array.slice(0, index), newItem, ...array.slice(index + 1)];
}

function arrayDelete(array, index) {
  return [...array.slice(0, index), ...array.slice(index + 1)];
}

function displayCondition(condition) {
  const field = fields[condition.field].display;
  const operator = operators[condition.operator].display;

  return `${field} ${operator} ${condition.value}`;
}

function cleanGroup(group) {
  return { ...group, rules: group.rules.filter((rule) => rule.conditions.length) };
}
