import { React, PropTypes, mui, immutable, dialogs } from 'mylife-tools-ui';
import icons from '../icons';

let idCounter = 0;

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
  amount : { display : 'Montant',     valueFormatter : val => parseInt(val, 10) },
  label  : { display : 'Description', valueFormatter : val => val },
  note   : { display : 'Note',        valueFormatter : val => val }
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

  componentWillReceiveProps(nextProps) {
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
      id         : ++idCounter,
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

  updateRuleConditions(updater) {
    const { rules, selectedRule } = this.state;
    this.setState({
      rules: rules.update(selectedRule, rule => ({ ...rule, conditions: updater(rule.conditions) }))
    });
  }

  deleteCondition(condition) {
    this.updateRuleConditions((conditions) => conditions.delete(condition));
  }

  addCondition() {
    const { conditionField, conditionOperator, conditionValue } = this.state;
    const condition = {
      id       : ++idCounter,
      field    : conditionField,
      operator : conditionOperator,
      value    : fields[conditionField].valueFormatter(conditionValue)
    };
    this.setState({
      conditionField    : null,
      conditionOperator : null,
      conditionValue    : null
    });
    this.updateRuleConditions((conditions) => conditions.set(condition.id, condition));
  }

  render() {
    const { show, proceed, cancel } = this.props;
    const { group, rules, selectedRule, conditionField, conditionOperator, conditionValue } = this.state;
    const rule = rules.get(selectedRule);
    return (
      <mui.Dialog aria-labelledby='dialog-title' open={show}>
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
            <mui.IconButton tooltip='Ajouter une règle' onClick={() => this.addRule()}>
              <icons.actions.New />
            </mui.IconButton>
            <mui.IconButton tooltip='Supprimer la règle' disabled={!rule} onClick={() => this.deleteRule()}>
              <icons.actions.Delete />
            </mui.IconButton>
            <mui.TextField label='Nom de la règle' id='ruleName' disabled={!rule} value={rule ? rule.name : ''} onChange={e => this.updateRuleName(e.target.value)} />
            <fieldset>
              <legend>Conditions</legend>
              <mui.List>
                {rule && rule.conditions.valueSeq().toArray().map(condition => (
                  <mui.ListItem key={condition.id}>
                    <mui.ListItemText primary={displayCondition(condition)} />
                    <mui.ListItemSecondaryAction>
                      <mui.IconButton onClick={() => this.deleteCondition(condition.id)}>
                        <icons.actions.Delete />
                      </mui.IconButton>
                    </mui.ListItemSecondaryAction>
                  </mui.ListItem>
                ))}
              </mui.List>
              <mui.Select label='Champ' id='conditionField' disabled={!rule} value={conditionField || ''} onChange={e => this.setState({ conditionField: e.target.value || null })}>
                {Object.keys(fields).map(field => (
                  <mui.MenuItem key={field} value={field}>
                    {fields[field].display}
                  </mui.MenuItem>
                ))}
              </mui.Select>
              <mui.Select label='Operateur' id='conditionOperator' disabled={!rule} value={conditionOperator || ''} onChange={e => this.setState({ conditionOperator: e.target.value || null })} >
                {Object.keys(operators).map(operator => (
                  <mui.MenuItem key={operator} value={operator}>
                    {operators[operator].display}
                  </mui.MenuItem>
                ))}
              </mui.Select>
              <mui.TextField label='Valeur' id='conditionValue' disabled={!rule} value={conditionValue || ''} onChange={e => this.setState({ conditionValue: e.target.value })} />
              <mui.IconButton tooltip='Ajouter une condition' disabled={!rule || !conditionField || !conditionOperator || !conditionValue} onClick={() => this.addCondition()}>
                <icons.actions.New />
              </mui.IconButton>
            </fieldset>
          </fieldset>
        </mui.DialogContent>
        <mui.DialogActions>
          <mui.Button onClick={() => proceed({ group, rules })} color='primary'>OK</mui.Button>
          <mui.Button onClick={() => cancel()}>Annuler</mui.Button>
        </mui.DialogActions>
      </mui.Dialog>
    );
  }
}

EditorDialog.propTypes = {
  show: PropTypes.bool,
  proceed: PropTypes.func,
  cancel: PropTypes.func,
  options: PropTypes.object
};

const edit = dialogs.create(EditorDialog);

export default (group, done) => {
  group = JSON.parse(JSON.stringify(group));
  edit({ options: { group, rules: parseRules(group.rules) } }).then(
    ({ group, rules }) => (done(null, { ...group , rules: serializeRules(rules)})),
    () => {});
};

function parseRules(raw) {
  if(!raw) {
    return new immutable.Map();
  }

  return new immutable.Map(raw.map(rawRule => {
    const id = ++idCounter;
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
    const id = ++idCounter;
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
