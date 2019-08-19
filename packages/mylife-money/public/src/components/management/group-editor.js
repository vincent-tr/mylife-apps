import { React, useState, PropTypes, mui, immutable, dialogs } from 'mylife-tools-ui';
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

const ConditionEditor = ({ disabled, onAddCondition }) => {
  const [field, setField] = useState(null);
  const [operator, setOperator] = useState(null);
  const [value, setValue] = useState(null);

  const onAdd = () => {
    const condition = {
      id       : createId(),
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
      <mui.Select label='Champ' id='conditionField' disabled={disabled} value={field || ''} onChange={e => setField(e.target.value || null)}>
        {Object.keys(fields).map(field => (
          <mui.MenuItem key={field} value={field}>
            {fields[field].display}
          </mui.MenuItem>
        ))}
      </mui.Select>
      <mui.Select label='Operateur' id='conditionOperator' disabled={disabled} value={operator || ''} onChange={e => setOperator(e.target.value || null)} >
        {Object.keys(operators).map(operator => (
          <mui.MenuItem key={operator} value={operator}>
            {operators[operator].display}
          </mui.MenuItem>
        ))}
      </mui.Select>
      <mui.TextField label='Valeur' id='conditionValue' disabled={disabled} value={value || ''} onChange={e => setValue(e.target.value)} />
      <mui.Tooltip title='Ajouter une condition'>
        <div>
          <mui.IconButton disabled={disabled || !field || !operator || !value} onClick={onAdd}>
            <icons.actions.New />
          </mui.IconButton>
        </div>
      </mui.Tooltip>
    </React.Fragment>
  );
};

ConditionEditor.propTypes = {
  disabled: PropTypes.bool,
  onAddCondition: PropTypes.func.isRequired
};

const ConditionsEditor = ({ disabled, conditions, onConditionsChanged }) => {
  const deleteCondition = condition => onConditionsChanged(conditions.delete(condition.id));
  const addCondition = condition => onConditionsChanged(conditions.set(condition.id, condition));

  return (
    <fieldset>
      <legend>Conditions</legend>
      <mui.List>
        {conditions && conditions.valueSeq().toArray().map(condition => (
          <mui.ListItem key={condition.id}>
            <mui.ListItemText primary={displayCondition(condition)} />
            <mui.ListItemSecondaryAction>
              <mui.Tooltip title='Supprimer la condition'>
                <mui.IconButton onClick={() => deleteCondition(condition)}>
                  <icons.actions.Delete />
                </mui.IconButton>
              </mui.Tooltip>
            </mui.ListItemSecondaryAction>
          </mui.ListItem>
        ))}
      </mui.List>

      <ConditionEditor disabled={disabled} onAddCondition={addCondition} />

    </fieldset>
  );
};

ConditionsEditor.propTypes = {
  disabled: PropTypes.bool,
  conditions: PropTypes.object,
  onConditionsChanged: PropTypes.func.isRequired
};

const RulesEditor = ({ rules, onRulesChanged }) => {

  const [selectedRule, setSelectedRule] = useState(firstRuleId(rules));
  const rule = rules.get(selectedRule);

  const addRule = () => {
    const rule   = {
      id         : createId(),
      conditions : new immutable.Map(),
      name       : 'newRule'
    };

    onRulesChanged(rules.set(rule.id, rule));
    setSelectedRule(rule.id);
  };

  const deleteRule = () => {
    const newRules = rules.delete(selectedRule);
    onRulesChanged(newRules);
    setSelectedRule(firstRuleId(newRules));
  };

  const updateRule = (prop, value) => {
    onRulesChanged(rules.update(rule.id, rule => ({ ...rule, [prop]: value })));
  };

  return (
    <fieldset>
      <legend>Règles</legend>
      <mui.Select label='Règle' id='selectedRule' value={selectedRule || ''} onChange={e => setSelectedRule(e.target.value || null)}>
        {rules.valueSeq().toArray().map(rule => (
          <mui.MenuItem key={rule.id} value={rule.id}>
            {rule.name}
          </mui.MenuItem>
        ))}
      </mui.Select>
      <mui.Tooltip title='Ajouter une règle'>
        <mui.IconButton onClick={addRule}>
          <icons.actions.New />
        </mui.IconButton>
      </mui.Tooltip>
      <mui.Tooltip title='Supprimer la règle'>
        <div>
          <mui.IconButton disabled={!rule} onClick={deleteRule}>
            <icons.actions.Delete />
          </mui.IconButton>
        </div>
      </mui.Tooltip>
      <mui.TextField label='Nom de la règle' id='ruleName' disabled={!rule} value={rule ? rule.name : ''} onChange={e => updateRule('name', e.target.value)} />

      <ConditionsEditor disabled={!rule} conditions={rule && rule.conditions} onConditionsChanged={conditions => updateRule('conditions', conditions)} />
    </fieldset>
  );
};

RulesEditor.propTypes = {
  rules: PropTypes.object.isRequired,
  onRulesChanged: PropTypes.func.isRequired
};

const EditorDialog = ({ options, show, proceed }) => {
  const [group, setGroup] = useState(options.group);
  const [rules, setRules] = useState(options.rules);

  return (
    <mui.Dialog aria-labelledby='dialog-title' open={show} maxWidth='sm' fullWidth>
      <mui.DialogTitle id='dialog-title'>Editer le groupe</mui.DialogTitle>
      <mui.DialogContent dividers>
        <mui.TextField label='Nom du groupe' id='display' value={group.display} onChange={e => setGroup({ ...group, display: e.target.value })} />

        <RulesEditor rules={rules} onRulesChanged={rules => setRules(rules)}/>

      </mui.DialogContent>
      <mui.DialogActions>
        <mui.Button onClick={() => proceed({ result: 'ok', group, rules })} color='primary'>OK</mui.Button>
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
  const res = await edit({ options: { group, rules: parseRules(group.rules) } });
  if(res.result !== 'ok') {
    return;
  }
  return { ...res.group , rules: serializeRules(res.rules) };
};

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function parseRules(raw) {
  if(!raw) {
    return new immutable.Map();
  }

  return new immutable.Map(raw.map(rawRule => {
    const id = createId();
    return [ id, {
      ... rawRule,
      id,
      conditions : parseConditions(rawRule.conditions)
    }];
  }));
}

function parseConditions(raw) {
  if(!raw) {
    return new immutable.Map();
  }

  return new immutable.Map(raw.map(rawCondition => {
    const id = createId();
    return [ id, {
      id,
      ... rawCondition
    }];
  }));
}

function serializeRules(map) {
  return map.valueSeq().toArray().map((rule) => {
    const { id, conditions, ...others } = rule;
    void id;
    return { conditions : serializeConditions(conditions), ...others };
  });
}

function serializeConditions(map) {
  return map.valueSeq().toArray().map(cond => {
    const { id, ...others } = cond;
    void id;
    return { ...others };
  });
}

function displayCondition(condition) {

  const field = fields[condition.field].display;
  const operator = operators[condition.operator].display;

  return `${field} ${operator} ${condition.value}`;
}

function createId() {
  return Math.random().toString(36).substr(2, 9);
}

function firstRuleId(rules) {
  const firstRule = rules.first();
  return firstRule ? firstRule.id : null;
}
