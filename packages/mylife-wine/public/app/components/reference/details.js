'use strict';

import React from 'react';
import * as mui from 'material-ui';
import PropTypes from 'prop-types';
import base from '../base/index';

class Details extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      item: this.copyItem(props)
    };
  }

  copyItem(props) {
    const { item } = props;
    if(!item) { return null; }
    return Object.assign({}, item);
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.item === this.props.item) { return; }
    this.setState({ item: this.copyItem(nextProps) });
  }

  openImageFileDialog() {
    this.refs.openImageFile.click();
  }

  handleOpenImageFile(e) {
    e.stopPropagation();
    const file = e.target.files[0];
    e.target.value = '';

    const reader = new FileReader();

    reader.onloadend = () => {
      const err = reader.error;
      if(err) { alert(err); } // TODO: avoid me!

      let data = reader.result;
      const marker = 'base64,';
      const start = data.indexOf(marker) + marker.length;
      data = data.substring(start);

      this.setState({ item: Object.assign(this.state.item, { icon: data }) });
    };

    reader.readAsDataURL(file);
  }

  onCapacityValueChange(event) {
    event.stopPropagation();
    const value = parseFloat(event.target.value);
    if(!isNaN(value)) {
      this.setState({ item: Object.assign(this.state.item, { value }) });
    }
  };

  render() {
    const { type, onCreate, onUpdate, onDelete } = this.props;
    const { item } = this.state;

    return (
      <div>
        {type && item && (
        <table>
          <tbody>
            <tr>
              <td>Nom</td>
              <td>
                <mui.TextField
                  id="name"
                  value={item.name}
                  onChange={(event) => this.setState({ item: Object.assign(item, { name: event.target.value }) })}
                />
              </td>
            </tr>
            <tr>
              <td>Icone</td>
              <td>
                <base.DataImage data={item.icon} height={16} width={16} />
                <mui.RaisedButton label={'Change'} onClick={this.openImageFileDialog.bind(this)} />
              </td>
            </tr>
            {type === 'capacities' && (
            <tr>
              <td>Valeur</td>
              <td>
                <mui.TextField
                  id="Valeur"
                  value={item.value}
                  onChange={this.onCapacityValueChange.bind(this)}
                  type='number' />
              </td>
            </tr>
            )}
          </tbody>
        </table>
        )}

        <mui.RaisedButton label={'Nouveau'} onClick={onCreate} />
        {type && item && (<mui.RaisedButton label={'Modifier'} onClick={() => onUpdate(item)} />)}
        {type && item && (<mui.RaisedButton label={'Supprimer'} onClick={() => onDelete(item.id)} />)}

        <input
          ref="openImageFile"
          type="file"
          style={{display : 'none'}}
          onChange={this.handleOpenImageFile.bind(this)}/>
      </div>
    );
  }
}

Details.propTypes = {
  type     : PropTypes.string.isRequired,
  item     : PropTypes.object,
  onCreate : PropTypes.func.isRequired,
  onUpdate : PropTypes.func.isRequired,
  onDelete : PropTypes.func.isRequired
};

export default Details;
