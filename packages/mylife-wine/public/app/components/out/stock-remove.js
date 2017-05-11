'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import * as mui from 'material-ui';
import base from '../base/index';
import icons from '../icons';
import common from '../common/index';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: '100%'
  },
  toolbar: {
    width: '100%',
    textAlign: 'center'
  },
  fieldTitle: {
    fontWeight: 'bold',
    width: 300,
    display: 'inline-block',
    textAlign: 'left'
  },
  row: {
    height: 60
  }
};

class StockRemove extends React.Component {

  constructor(props) {
    super(props);

    this.state = { ... this.createNew() };
  }

  createNew() {
    return {
      bottleCount : 1,
      capacity    : null,
      year        : new Date().getFullYear(),
      date        : new Date().setHours(0, 0, 0, 0),
      bottlePrice : 0,
      note        : ''
    };
  }

  new() {
    this.setState(this.createNew());
  }

  save() {
    const { article, onRemove } = this.props;
    const { bottleCount, capacity, year, date, bottlePrice, note } = this.state;
    onRemove({ article, bottleCount, capacity, year, date, bottlePrice, note });
    this.new();
  }

  canSave() {
    const { article } = this.props;
    const { bottleCount, capacity, year, date } = this.state;

    if(!article) { return false; }
    if(!bottleCount) { return false; }
    if(!capacity) { return false; }
    if(!year) { return false; }
    if(!date) { return false; }
    return true;
  }

  render() {

    const { capacities } = this.props;
    const { bottleCount, capacity, year, date, bottlePrice, note } = this.state;

    const bottleCountChange = (value) => this.setState({ bottleCount: value });
    const capacityChange    = (event, index, value) => this.setState({ capacity: value });
    const yearChange        = (value) => this.setState({ year: value });
    const bottlePriceChange = (value) => this.setState({ bottlePrice: value });
    const dateChange        = (event, value) => this.setState({ bottlePrice: value.getTime() });
    const noteChange        = (event) => this.setState({ note: event.target.value || null });

    return(
      <div>
        <mui.Paper style={styles.container}>
          <table style={{tableLayout: 'fixed', width: '100%'}}>
            <tbody>
              <tr style={styles.row}>
                <td><div style={styles.fieldTitle}>Nombre de bouteilles</div></td>
                <td><base.IntegerField id="bottleCount" style={{ width: 300 }} value={bottleCount} onChange={bottleCountChange} minValue={1} /></td>

                <td><div style={styles.fieldTitle}>Date d'entrée</div></td>
                <td><mui.DatePicker id="date" style={{ width: 300 }} value={new Date(date)} onChange={dateChange} /></td>
              </tr>
              <tr style={styles.row}>
                <td><div style={styles.fieldTitle}>Capacité de bouteille</div></td>
                <td><common.ReferenceSelector id="type" autoWidth={false} style={{ width: 300 }} list={capacities} nameRender={item => `${item.name} (${item.value} L)`} value={capacity} onChange={capacityChange} /></td>

                <td><div style={styles.fieldTitle}>Prix de la bouteille</div></td>
                <td><base.NumberField id="bottlePrice" style={{ width: 300 }} value={bottlePrice} onChange={bottlePriceChange} minValue={0} /></td>
              </tr>
              <tr style={styles.row}>
                <td><div style={styles.fieldTitle}>Année des bouteilles</div></td>
                <td><base.IntegerField id="year" style={{ width: 300 }} value={year} onChange={yearChange} minValue={1} /></td>

                <td><div style={styles.fieldTitle}>Commentaire ajout stock</div></td>
                <td rowSpan={2}><mui.TextField id="note" multiLine={true} rows={3} rowsMax={3} fullWidth={true} value={note} onChange={noteChange} /></td>
              </tr>

              <tr><td colSpan={4}></td></tr>
            </tbody>
          </table>
        </mui.Paper>

        <div style={styles.toolbar}>
          <mui.IconButton onClick={() => this.new()}
                          tooltip="Nouveau">
            <icons.actions.New />
          </mui.IconButton>

          <mui.IconButton disabled={!this.canSave()}
                          onClick={() => this.save()}
                          tooltip="Enregistrer">
            <icons.actions.Save />
          </mui.IconButton>
        </div>
      </div>
    );
  }
}

StockRemove.propTypes = {
  article    : PropTypes.string,
  capacities : PropTypes.arrayOf(PropTypes.object),
  onRemove      : PropTypes.func.isRequired
};

export default StockRemove;
