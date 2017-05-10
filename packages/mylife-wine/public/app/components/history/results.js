'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import * as mui from 'material-ui';
import base from '../base/index';
import tabStyles from '../base/tab-styles';

function getArticle(articles, item) {
  const article = articles.get(item.article);
  if(!article) {
    console.error(`article ${item.article} not found on history ${item.id}`); // eslint-disable-line no-console
  }
  return article;
}

function filter(criteria, history, articles) {
  const { type, region, name, minDate, maxDate, isAdd } = criteria;
  const typeTest    = type === null ? (() => true) : (item => item.article && item.article.type === type);
  const regionTest  = region === null ? (() => true) :(item => item.article && item.article.region === region);
  const nameTest    = name === null ? (() => true) : (item => item.article && item.article.name.toUpperCase().includes(name.toUpperCase()));
  const minDateTest = minDate === null ? (() => true) : (item => item.date >= minDate);
  const maxDateTest = maxDate === null ? (() => true) : (item => item.date <= maxDate);
  const isAddTest   = isAdd === null ? (() => true) : (item => (item.isAdd === 1) === isAdd);

  return history
    .map(item => ({ ...item, article: getArticle(articles, item) }))
    .filter(item =>
      typeTest(item) &&
      regionTest(item) &&
      nameTest(item) &&
      minDateTest(item) &&
      maxDateTest(item) &&
      isAddTest(item));
}

function renderListHeader() {
  return (
    <mui.Paper>
      <div style={{ display: 'flex', flexDirection: 'row', textAlign: 'left', padding: 16, fontWeight: 'bold' }}>
        <div style={{ flex: 1 }}>Date</div>
        <div style={{ flex: 1 }}>Type</div>
        <div style={{ flex: 1 }}>Appelation</div>
        <div style={{ flex: 1 }}>Type de spiritueux</div>
        <div style={{ flex: 1 }}>Region</div>
        <div style={{ flex: 1 }}>Plats</div>
        <div style={{ flex: 1 }}>Propriétaire récoltant</div>
        <div style={{ flex: 1 }}>Qualité</div>
        <div style={{ flex: 1 }}>Quantité</div>
        <div style={{ flex: 1 }}>Prix</div>
        <div style={{ flex: 1 }}>Année</div>
        <div style={{ flex: 1 }}>Commentaire</div>
      </div>
    </mui.Paper>
  );
}

function renderListItem(item) {
  return (
    <mui.ListItem
      key={item.id}
      value={{ value: item.id }}
      primaryText={
        <div style={{ display: 'flex', flexDirection: 'row', textAlign: 'left' }}>
          <div style={{ flex: 1 }}>{item.date}</div>
          <div style={{ flex: 1 }}>{item.isAdd}</div>
          <div style={{ flex: 1 }}>{item.name}</div>
          <div style={{ flex: 1 }}><base.DataImage data={item.article && item.article.type.icon} style={{marginRight: 10}}/>{item.article && item.article.type.name}</div>
          <div style={{ flex: 1 }}><base.DataImage data={item.article && item.article.region.icon} style={{marginRight: 10}}/>{item.article && item.article.region.name}</div>
          <div style={{ flex: 1 }}>{'plats'}</div>
          <div style={{ flex: 1 }}>{item.owner}</div>
          <div style={{ flex: 1 }}>{'qualite'}</div>
          <div style={{ flex: 1 }}>{'quantite'}</div>
          <div style={{ flex: 1 }}>{'prix'}</div>
          <div style={{ flex: 1 }}>{'annee'}</div>
          <div style={{ flex: 1 }}>{'commentaire'}</div>
        </div>
      }/>
  );
}

const Results = ({ criteria, history, articles }) => {
  const data = filter(criteria, history, articles);

  return (
    <div style={{ height: '100%'}}>
      {renderListHeader()}
      <div style={{ position: 'relative', height: 'calc(100% - 50px)' }}>
        <mui.List style={Object.assign({}, tabStyles.scrollable, { position: 'absolute', padding: 0, height: '100%', width: '100%' })}>
          {data.map(renderListItem)}
        </mui.List>
      </div>
    </div>
  );
};

Results.propTypes = {
  criteria : PropTypes.object.isRequired,
  history  : PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  articles : PropTypes.object.isRequired,
};

export default Results;