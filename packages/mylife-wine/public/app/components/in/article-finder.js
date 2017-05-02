'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import * as mui from 'material-ui';
import base from '../base/index';
import tabStyles from '../base/tab-styles';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: '100%'
  },
  paperCriteria: {
    flex: 2,
    height: '100%',
    textAlign: 'center',
  },
  paperList: {
    flex: 4,
    height: '100%',
    textAlign: 'center',
  },
  criteriaTitle: {
    fontWeight: 'bold',
    width: 300,
    display: 'inline-block',
    textAlign: 'left'
  }
};

function createSelectedItem(list, value) {
  if(!value) {
    return (<mui.MenuItem primaryText="-" />);
  }
  const item = list.find(item => item.id === value);
  return (<mui.MenuItem primaryText={item.name} leftIcon={<base.DataImage data={item.icon}/>} />);
}

function renderArticleListHeader() {
  return (
    <mui.Paper zDepth={1}>
      <div style={{ display: 'flex', flexDirection: 'row', textAlign: 'left', padding: 16, fontWeight: 'bold' }}>
        <div style={{ flex: 1 }}>Appelation</div>
        <div style={{ flex: 1 }}>Type de spiritueux</div>
        <div style={{ flex: 1 }}>Région</div>
        <div style={{ flex: 1 }}>Propriétaire récoltant</div>
      </div>
    </mui.Paper>
  );
}

function renderArticleListItem(article) {
  return (
    <base.SelectableListItem
      key={article.id}
      value={{ value: article.id }}
      primaryText={
        <div style={{ display: 'flex', flexDirection: 'row', textAlign: 'left' }}>
          <div style={{ flex: 1 }}>{article.name}</div>
          <div style={{ flex: 1 }}><base.DataImage data={article.type.icon} style={{marginRight: 10}}/>{article.type.name}</div>
          <div style={{ flex: 1 }}><base.DataImage data={article.region.icon} style={{marginRight: 10}}/>{article.region.name}</div>
          <div style={{ flex: 1 }}>{article.owner}</div>
        </div>
      }/>
  );
}

class ArticleFinder extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      type     : null,
      region   : null,
      articles : props.articles
    };

    this.criteria = { type: null, region: null };
  }

  componentWillReceiveProps(nextProps) {
    this.refreshArticles(nextProps.articles);
  }

  changeCriteria(newValues) {
    this.criteria = Object.assign({
      type: this.state.type,
      region: this.state.region
    }, newValues);

    this.setState(newValues);
    this.refreshArticles(this.props.articles);
    this.props.onArticleChange(null);
  }

  refreshArticles(articles) {
    if(this.criteria.type) {
      articles = articles.filter(article => article.type.id === this.criteria.type);
    }
    if(this.criteria.region) {
      articles = articles.filter(article => article.region.id === this.criteria.region);
    }

    this.setState({ articles });
  }

  render() {
    const { types, regions, article, onArticleChange } = this.props;
    const { type, region, articles } = this.state;
    const typeChange = (event, index, value) => this.changeCriteria({ type: value });
    const regionChange = (event, index, value) => this.changeCriteria({ region: value });

    return (
      <div style={styles.container}>
        <mui.Paper zDepth={1} style={styles.paperCriteria}>

          <table style={{tableLayout: 'fixed', width: '100%'}}>
            <tbody>
              <tr>
                <td><div style={styles.criteriaTitle}>Type de spiritueux</div></td>
                <td>
                  <mui.DropDownMenu
                    autoWidth={false}
                    style={{ width: 300 }}
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
                <td><div style={styles.criteriaTitle}>Region</div></td>
                <td>
                  <mui.DropDownMenu
                    autoWidth={false}
                    style={{ width: 300 }}
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
        <mui.Paper zDepth={1} style={styles.paperList}>
          <div style={{ height: '100%'}}>
            {renderArticleListHeader()}
            <div style={{ position: 'relative', height: 'calc(100% - 50px)' }}>
              <base.SelectableList style={Object.assign({}, tabStyles.scrollable, { position: 'absolute', padding: 0, height: '100%', width: '100%' })} selectedNode={{value: article}}
                                   selectedValueChanged={(obj) => onArticleChange(obj.value)}>
                {articles.map(renderArticleListItem)}
              </base.SelectableList>
            </div>
          </div>
        </mui.Paper>
      </div>
    );
  }
}

ArticleFinder.propTypes = {
  regions         : PropTypes.arrayOf(PropTypes.object),
  types           : PropTypes.arrayOf(PropTypes.object),
  articles        : PropTypes.arrayOf(PropTypes.object),
  article         : PropTypes.string,
  onArticleChange : PropTypes.func.isRequired
};

export default ArticleFinder;
