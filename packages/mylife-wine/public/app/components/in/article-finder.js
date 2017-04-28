'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import * as mui from 'material-ui';
import base from '../base/index';
import tabStyles from '../base/tab-styles';

const styles = {
  div:{
    display: 'flex',
    flexDirection: 'row wrap',
    width: '100%',
    height: '100%'
  },
  paperCriteria:{
    flex: 2,
    height: '100%',
    textAlign: 'center',
  },
  paperList:{
    flex: 2,
    height: '100%',
    textAlign: 'center',
  }
};

function createSelectedItem(list, value) {
  if(!value) {
    return (<mui.MenuItem primaryText="-" />);
  }
  const item = list.find(item => item.id === value);
  return (<mui.MenuItem primaryText={item.name} leftIcon={<base.DataImage data={item.icon}/>} />);
}

class ArticleFinder extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      type: null,
      region: null
    };
  }

  render() {
    const { types, regions } = this.props;
    const { type, region } = this.state;
    const typeChange = (event, index, value) => this.setState({ type: value });
    const regionChange = (event, index, value) => this.setState({ region: value });

    return (
      <div style={styles.div}>
        <mui.Paper zDepth={1} style={Object.assign({}, styles.paperCriteria, tabStyles.fullHeight)}>

          <table style={{tableLayout: 'fixed', width: '100%'}}>
            <tbody>
              <tr>
                <td>Type de spiritueux</td>
                <td>
                  <mui.DropDownMenu
                    autoWidth={false}
                    style={{width: 300}}
                    id="type"
                    value={type}
                    onChange={typeChange}
                    selectionRenderer={value => createSelectedItem(types, value)}>
                    <mui.MenuItem value={null} primaryText="-" />
                    {types.map(type => (<mui.MenuItem key={type.id} value={type.id} primaryText={type.name} leftIcon={<base.DataImage data={type.icon}/>} />))}
                  </mui.DropDownMenu>
                </td>
              </tr>
              <tr>
                <td>Region</td>
                <td>
                  <mui.DropDownMenu
                    autoWidth={false}
                    style={{width: 300}}
                    id="region"
                    value={region}
                    onChange={regionChange}
                    selectionRenderer={value => createSelectedItem(regions, value)}>
                    <mui.MenuItem value={null} primaryText="-" />
                    {regions.map(region => (<mui.MenuItem key={region.id} value={region.id} primaryText={region.name} leftIcon={<base.DataImage data={region.icon}/>} />))}
                  </mui.DropDownMenu>
                </td>
              </tr>
            </tbody>
          </table>

        </mui.Paper>
        <mui.Paper zDepth={1} style={Object.assign({}, styles.paperList, tabStyles.scrollable, tabStyles.fullHeight)}>
          List
        </mui.Paper>
      </div>


    );
  }
}

ArticleFinder.propTypes = {
  regions  : PropTypes.arrayOf(PropTypes.object),
  types    : PropTypes.arrayOf(PropTypes.object),
  articles : PropTypes.arrayOf(PropTypes.object),
};

export default ArticleFinder;
