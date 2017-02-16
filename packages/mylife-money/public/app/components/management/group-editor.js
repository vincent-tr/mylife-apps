import React from 'react';
import * as mui from 'material-ui';
import Immutable from 'immutable';
import { confirmable, createConfirmation } from 'react-confirm';
import base from '../base/index';
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
  label  : { display : 'Description', valueFormatter : val => val }
};

function parseRules(raw) {
  if(!raw) {
    return Immutable.Map();
  }

  return Immutable.Map(raw.map(rawRule => {
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
    return Immutable.Map();
  }

  return Immutable.Map(raw.map(rawCondition => {
    const id = ++idCounter;
    return [ id, {
      id,
      ... rawCondition
    }];
  }));
}

function serializeRules(map) {
  return map.toArray().map((rule) => {
    const { id, conditions, ...others } = rule;
    void id;
    return { conditions : serializeConditions(conditions), ...others };
  });
}

function serializeConditions(map) {
  return map.toArray().map(cond => {
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

class EditorDialog extends React.Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      group: props && props.options && props.options.group,
      rules: props && props.options && props.options.rules,
      selectedRule: null
    };
  }

  componentWillReceiveProps(nextProps) {
    const { group, rules } = nextProps.options;
    this.setState({
      group,
      rules,
      selectedRule: null
    });
  }

  addRule() {
    const { rules } = this.state;
    const newRule   = {
      id         : ++idCounter,
      conditions : Immutable.Map(),
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
    const { show, proceed, /*dismiss,*/ cancel, /*confirmation, options*/ } = this.props;
    const { group, rules, selectedRule, conditionField, conditionOperator, conditionValue } = this.state;
    const rule = rules.get(selectedRule);
    return (
      <base.Theme>
        <mui.Dialog
          title="Editer le groupe"
          actions={<div>
                    <mui.FlatButton
                      label="OK"
                      onTouchTap={() => proceed({ group, rules })} />
                    <mui.FlatButton
                      label="Annuler"
                      onTouchTap={() => cancel()} />
                  </div>}
          modal={true}
          open={show}
          autoScrollBodyContent={true}>
          <div>
            <mui.TextField
              floatingLabelText="Nom du groupe"
              id="display"
              value={group.display}
              onChange={(event) => this.setState({ group: { ...group, display: event.target.value }})}
            />
            <fieldset>
              <legend>Règles</legend>
                <mui.SelectField
                  floatingLabelText="Règle"
                  id="selectedRule"
                  value={selectedRule}
                  onChange={(event, index, value) => this.setState({ selectedRule : value })}>
                    {rules.toArray().map(rule => (<mui.MenuItem key={rule.id} value={rule.id} primaryText={rule.name} />))}
                </mui.SelectField>
                <mui.IconButton tooltip="Ajouter une règle"
                                onClick={() => this.addRule()}>
                  <icons.actions.New />
                </mui.IconButton>
                <mui.IconButton tooltip="Supprimer la règle"
                                disabled={!rule}
                                onClick={() => this.deleteRule()}>
                  <icons.actions.Delete />
                </mui.IconButton>
                <mui.TextField
                  floatingLabelText="Nom de la règle"
                  id="ruleName"
                  disabled={!rule}
                  value={rule ? rule.name : ''}
                  onChange={(event) => this.updateRuleName(event.target.value)}
                />
              <fieldset>
                <legend>Conditions</legend>
                <mui.List>
                {rule && rule.conditions.toArray().map(condition => (
                  <mui.ListItem key={condition.id}
                                primaryText={displayCondition(condition)}
                                rightIconButton={
                                  <mui.IconButton onClick={() => this.deleteCondition(condition.id)}>
                                    <icons.actions.Delete />
                                  </mui.IconButton>
                                }
                />))}
                </mui.List>
                <mui.SelectField
                  floatingLabelText="Champ"
                  id="conditionField"
                  disabled={!rule}
                  value={conditionField}
                  onChange={(event, index, value) => this.setState({ conditionField: value })} >
                    {Object.keys(fields).map(field => (<mui.MenuItem key={field} value={field} primaryText={fields[field].display} />))}
                </mui.SelectField>
                <mui.SelectField
                  floatingLabelText="Operateur"
                  id="conditionOperator"
                  disabled={!rule}
                  value={conditionOperator}
                  onChange={(event, index, value) => this.setState({ conditionOperator: value })} >
                    {Object.keys(operators).map(operator => (<mui.MenuItem key={operator} value={operator} primaryText={operators[operator].display} />))}
                </mui.SelectField>
                <mui.TextField
                  floatingLabelText="Valeur"
                  id="conditionValue"
                  disabled={!rule}
                  value={conditionValue || ''}
                  onChange={(event) => this.setState({ conditionValue: event.target.value })}
                />
                <mui.IconButton tooltip="Ajouter une condition"
                                disabled={!rule || !conditionField || !conditionOperator || !conditionValue}
                                onClick={() => this.addCondition()}>
                  <icons.actions.New />
                </mui.IconButton>
              </fieldset>
            </fieldset>
          </div>
        </mui.Dialog>
      </base.Theme>
    );
  }
}

EditorDialog.propTypes = {
  show: React.PropTypes.bool,            // from confirmable. indicates if the dialog is shown or not.
  proceed: React.PropTypes.func,         // from confirmable. call to close the dialog with promise resolved.
  cancel: React.PropTypes.func,          // from confirmable. call to close the dialog with promise rejected.
  dismiss: React.PropTypes.func,         // from confirmable. call to only close the dialog.
  confirmation: React.PropTypes.string,  // arguments of your confirm function
  options: React.PropTypes.object        // arguments of your confirm function
};

const edit = createConfirmation(confirmable(EditorDialog));

export default (group, done) => {
  group = JSON.parse(JSON.stringify(group));
  edit({ options: { group, rules: parseRules(group.rules) } }).then(
    ({ group, rules }) => (done(null, { ...group , rules: serializeRules(rules)})),
    () => {});
};
