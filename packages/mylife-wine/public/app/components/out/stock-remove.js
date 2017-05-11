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
      date        : new Date().setHours(0, 0, 0, 0),
      note        : null
    };
  }

  new() {
    this.setState(this.createNew());
  }

  save() {
    const { stockItem, onRemove } = this.props;
    const { bottleCount, date, note } = this.state;
    onRemove({ stock: stockItem.id, bottleCount, date, note });
    this.new();
  }

  canSave() {
    const { stockItem } = this.props;
    const { bottleCount, date } = this.state;

    if(!stockItem) { return false; }
    if(!bottleCount) { return false; }
    if(bottleCount > stockItem.bottleCount)  { return false; }
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

                <td><div style={styles.fieldTitle}>Commentaire retrait stock</div></td>
              </tr>
              <tr style={styles.row}>
                <td><div style={styles.fieldTitle}>Date de sortie</div></td>
                <td><mui.DatePicker id="date" style={{ width: 300 }} value={new Date(date)} onChange={dateChange} /></td>

                <td rowSpan={2}><mui.TextField id="note" multiLine={true} rows={3} rowsMax={3} fullWidth={true} value={note || ''} onChange={noteChange} /></td>
              </tr>

              <tr><td colSpan={3}></td></tr>
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
  stockItem : PropTypes.object,
  onRemove  : PropTypes.func.isRequired
};

export default StockRemove;
