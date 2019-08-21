import { React, useState, PropTypes, mui, dialogs } from 'mylife-tools-ui';
import icons from '../icons';

const operators = {
  $eq       : { display : 'Egal à' },
  $gt       : { display : 'Inférieur à' },
  $gte      : { display : 'Inférieur ou égal à' },
  $lt       : { display : 'Supérieur à' },
  $lte      : { display : 'Supérieur ou égal à' },
  $regex    : { display : '(Expression régulière)' },
  $contains : { display : 'Contient' }
};

const fields = {
  amount : { display : 'Montant',     format : val => parseInt(val, 10) },
  label  : { display : 'Description', format : val => val },
  note   : { display : 'Note',        format : val => val }
};

const ConditionEditor = ({ onAddCondition }) => {
  const [field, setField] = useState(null);
  const [operator, setOperator] = useState(null);
  const [value, setValue] = useState(null);

  const onAdd = () => {
    const condition = {
      field    : field,
      operator : operator,
      value    : fields[field].format(value)
    };

    onAddCondition(condition);

    setField(null);
    setOperator(null);
    setValue(null);
  };

  return (
    <React.Fragment>
      <mui.Select label='Champ' id='conditionField' value={field || ''} onChange={e => setField(e.target.value || null)}>
        {Object.keys(fields).map(field => (
          <mui.MenuItem key={field} value={field}>
            {fields[field].display}
          </mui.MenuItem>
        ))}
      </mui.Select>
      <mui.Select label='Operateur' id='conditionOperator' value={operator || ''} onChange={e => setOperator(e.target.value || null)} >
        {Object.keys(operators).map(operator => (
          <mui.MenuItem key={operator} value={operator}>
            {operators[operator].display}
          </mui.MenuItem>
        ))}
      </mui.Select>
      <mui.TextField label='Valeur' id='conditionValue' value={value || ''} onChange={e => setValue(e.target.value)} />
      <mui.Tooltip title='Ajouter une condition'>
        <div>
          <mui.IconButton disabled={!field || !operator || !value} onClick={onAdd}>
            <icons.actions.New />
          </mui.IconButton>
        </div>
      </mui.Tooltip>
    </React.Fragment>
  );
};

ConditionEditor.propTypes = {
  onAddCondition: PropTypes.func.isRequired
};

const ConditionsEditor = ({ conditions, onConditionsChanged }) => {
  const deleteCondition = index => onConditionsChanged(arrayDelete(conditions, index));
  const addCondition = condition => onConditionsChanged([...conditions, condition]);

  return (
    <fieldset>
      <legend>Conditions</legend>
      <mui.List>
        {conditions.map((condition, index) => (
          <mui.ListItem key={index}>
            <mui.ListItemText primary={displayCondition(condition)} />
            <mui.ListItemSecondaryAction>
              <mui.Tooltip title='Supprimer la condition'>
                <mui.IconButton onClick={() => deleteCondition(index)}>
                  <icons.actions.Delete />
                </mui.IconButton>
              </mui.Tooltip>
            </mui.ListItemSecondaryAction>
          </mui.ListItem>
        ))}
      </mui.List>

      <ConditionEditor onAddCondition={addCondition} />

    </fieldset>
  );
};

ConditionsEditor.propTypes = {
  conditions: PropTypes.array.isRequired,
  onConditionsChanged: PropTypes.func.isRequired
};

const RuleRow = ({ rule, onRuleChanged, onDeleteRule }) => {
  const updateRule = (prop, value) => onRuleChanged({ ...rule, [prop]: value });

  return (
    <mui.TableRow>
      <mui.TableCell>
        <mui.Tooltip title='Supprimer la règle'>
          <div>
            <mui.IconButton onClick={onDeleteRule}>
              <icons.actions.Delete />
            </mui.IconButton>
          </div>
        </mui.Tooltip>
      </mui.TableCell>
      <mui.TableCell>
        <mui.TextField label='Nom de la règle' value={rule.name || ''} onChange={e => updateRule('name', e.target.value)} />
      </mui.TableCell>
      <mui.TableCell>
        <ConditionsEditor conditions={rule.conditions} onConditionsChanged={conditions => updateRule('conditions', conditions)} />
      </mui.TableCell>
    </mui.TableRow>
  );
};

RuleRow.propTypes = {
  rule: PropTypes.object.isRequired,
  onRuleChanged: PropTypes.func.isRequired,
  onDeleteRule: PropTypes.func.isRequired,
};

const EditorDialog = ({ options, show, proceed }) => {
  const [group, setGroup] = useState(options.group);
  const updateGroup = (name, value) => setGroup({ ...group, [name]: value });

  const addRule = () => {
    const rule   = {
      conditions : [],
      name       : 'Nouvelle règle'
    };

    updateGroup('rules', [...group.rules, rule]);
  };

  return (
    <mui.Dialog aria-labelledby='dialog-title' open={show} maxWidth='lg' fullWidth>
      <mui.DialogTitle id='dialog-title'>Editer le groupe</mui.DialogTitle>
      <mui.DialogContent dividers>
        <mui.TextField label='Nom du groupe' id='display' value={group.display} onChange={e => updateGroup('display', e.target.value)} />

        <mui.Table>
          <mui.TableHead>
            <mui.TableRow>
              <mui.TableCell>Règles</mui.TableCell>
              <mui.TableCell>
                <mui.Tooltip title='Ajouter une règle'>
                  <mui.IconButton onClick={addRule}>
                    <icons.actions.New />
                  </mui.IconButton>
                </mui.Tooltip>
              </mui.TableCell>
            </mui.TableRow>
          </mui.TableHead>
          <mui.TableBody>
            {group.rules.map((rule, index) => {
              const deleteRule = () => updateGroup('rules', arrayDelete(group.rules, index));
              const changeRule = (rule) => updateGroup('rules', arrayUpdate(group.rules, index, rule));

              return (
                <RuleRow key={index} rule={rule} onRuleChanged={changeRule} onDeleteRule={deleteRule} />
              );
            })}
          </mui.TableBody>
        </mui.Table>

      </mui.DialogContent>
      <mui.DialogActions>
        <mui.Button onClick={() => proceed({ result: 'ok', group })} color='primary'>OK</mui.Button>
        <mui.Button onClick={() => proceed({ result: 'cancel' })}>Annuler</mui.Button>
      </mui.DialogActions>
    </mui.Dialog>
  );
};

EditorDialog.propTypes = {
  options: PropTypes.object.isRequired,
  show: PropTypes.bool.isRequired,
  proceed: PropTypes.func.isRequired
};

const edit = dialogs.create(EditorDialog);

export default async (group) => {
  group = clone(group);
  const res = await edit({ options: { group } });
  if(res.result !== 'ok') {
    return;
  }
  return res.group;
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
