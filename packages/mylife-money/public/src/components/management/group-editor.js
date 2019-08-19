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

class EditorDialog extends React.Component {

  constructor(props, context) {
    super(props, context);

    const group = props && props.options && props.options.group;
    const rules = props && props.options && props.options.rules;

    this.state = {
      group,
      rules,
      selectedRule: (rules && rules.first() && rules.first().id) || null
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { group, rules } = nextProps.options;
    this.setState({
      group,
      rules,
      selectedRule: (rules && rules.first() && rules.first().id) || null
    });
  }

  addRule() {
    const { rules } = this.state;
    const newRule   = {
      id         : createId(),
      conditions : new immutable.Map(),
      name       : 'newRule'
    };

    this.setState({
      rules        : rules.set(newRule.id, newRule),
      selectedRule : newRule.id
    });
  }

  deleteRule() {
    const { rules, selectedRule } = this.state;
    this.setState({
      rules        : rules.delete(selectedRule),
      selectedRule : null
    });
  }

  updateRuleName(value) {
    const { rules, selectedRule } = this.state;
    this.setState({
      rules: rules.update(selectedRule, rule => ({ ...rule, name: value }))
    });
  }

  updateRuleConditions(conditions) {
    const { rules, selectedRule } = this.state;
    this.setState({
      rules: rules.update(selectedRule, rule => ({ ...rule, conditions }))
    });
  }

  render() {
    const { show, proceed } = this.props;
    const { group, rules, selectedRule } = this.state;
    const rule = rules.get(selectedRule);
    return (
      <mui.Dialog aria-labelledby='dialog-title' open={show} maxWidth='sm' fullWidth>
        <mui.DialogTitle id='dialog-title'>Editer le groupe</mui.DialogTitle>
        <mui.DialogContent dividers>
          <mui.TextField label='Nom du groupe' id='display' value={group.display} onChange={e => this.setState({ group: { ...group, display: e.target.value }})} />
          <fieldset>
            <legend>Règles</legend>
            <mui.Select label='Règle' id='selectedRule' value={selectedRule || ''} onChange={e => this.setState({ selectedRule : e.target.value || null })}>
              {rules.valueSeq().toArray().map(rule => (
                <mui.MenuItem key={rule.id} value={rule.id}>
                  {rule.name}
                </mui.MenuItem>
              ))}
            </mui.Select>
            <mui.Tooltip title='Ajouter une règle'>
              <mui.IconButton onClick={() => this.addRule()}>
                <icons.actions.New />
              </mui.IconButton>
            </mui.Tooltip>
            <mui.Tooltip title='Supprimer la règle'>
              <div>
                <mui.IconButton disabled={!rule} onClick={() => this.deleteRule()}>
                  <icons.actions.Delete />
                </mui.IconButton>
              </div>
            </mui.Tooltip>
            <mui.TextField label='Nom de la règle' id='ruleName' disabled={!rule} value={rule ? rule.name : ''} onChange={e => this.updateRuleName(e.target.value)} />

            <ConditionsEditor disabled={!rule} conditions={rule && rule.conditions} onConditionsChanged={conditions => this.updateRuleConditions(conditions)} />
          </fieldset>
        </mui.DialogContent>
        <mui.DialogActions>
          <mui.Button onClick={() => proceed({ result: 'ok', group, rules })} color='primary'>OK</mui.Button>
          <mui.Button onClick={() => proceed({ result: 'cancel' })}>Annuler</mui.Button>
        </mui.DialogActions>
      </mui.Dialog>
    );
  }
}

EditorDialog.propTypes = {
  show: PropTypes.bool,
  proceed: PropTypes.func,
  options: PropTypes.object
};

const edit = dialogs.create(EditorDialog);

export default async (group) => {
  group = JSON.parse(JSON.stringify(group));
  const res = await edit({ options: { group, rules: parseRules(group.rules) } });
  if(res.result !== 'ok') {
    return;
  }
  return { ...res.group , rules: serializeRules(res.rules) };
};

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
