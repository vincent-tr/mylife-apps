'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import * as mui from 'material-ui';
import base from '../base/index';
import tabStyles from '../base/tab-styles';

function enhanceItem(articleMap, typeMap, regionMap, dishMap, capacityMap, item) {
  const capacity = capacityMap.get(item.capacity);
  const article = articleMap.get(item.article);
  if(!article) {
    console.error(`article ${item.article} not found on history ${item.id}`); // eslint-disable-line no-console
    return { ...item, article: null, type: null, region: null, capacity, dishes: [] };
  }
  const type = typeMap.get(article.type);
  const region = regionMap.get(article.region);
  const dishes = (article.dishes || []).map(it => dishMap.get(it));

  return { ...item, article, type, region, capacity, dishes };
}

function filter(criteria, history, articles, types, regions, dishes, capacities) {
  const { type, region, name, minDate, maxDate, isAdd } = criteria;
  const typeTest    = type === null ? (() => true) : (item => item.article && item.article.type === type);
  const regionTest  = region === null ? (() => true) :(item => item.article && item.article.region === region);
  const nameTest    = name === null ? (() => true) : (item => item.article && item.article.name.toUpperCase().includes(name.toUpperCase()));
  const minDateTest = minDate === null ? (() => true) : (item => item.date >= minDate);
  const maxDateTest = maxDate === null ? (() => true) : (item => item.date <= maxDate);
  const isAddTest   = isAdd === null ? (() => true) : (item => (item.isAdd === 1) === isAdd);

  return history
    .map(item => enhanceItem(articles, types, regions, dishes, capacities, item))
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
          <div style={{ flex: 1 }}>{item.article && item.article.name}</div>
          <div style={{ flex: 1 }}><base.DataImage data={item.type && item.type.icon} style={{marginRight: 10}}/>{item.type && item.type.name}</div>
          <div style={{ flex: 1 }}><base.DataImage data={item.region && item.region.icon} style={{marginRight: 10}}/>{item.region && item.region.name}</div>
          <div style={{ flex: 1 }}>{'plats'}</div>
          <div style={{ flex: 1 }}>{item.article && item.article.owner}</div>
          <div style={{ flex: 1 }}>{item.article && item.article.quality}</div>
          <div style={{ flex: 1 }}>{item.bottleCount}</div>
          <div style={{ flex: 1 }}>{item.bottlePrice || null}</div>
          <div style={{ flex: 1 }}>{item.year}</div>
          <div style={{ flex: 1 }}>{item.note}</div>
        </div>
      }/>
  );
}

const Results = ({ criteria, history, articles, types, regions, dishes, capacities }) => {
  const data = filter(criteria, history, articles, types, regions, dishes, capacities);

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
  criteria   : PropTypes.object.isRequired,
  history    : PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  articles   : PropTypes.object.isRequired,
  types      : PropTypes.object.isRequired,
  regions    : PropTypes.object.isRequired,
  dishes     : PropTypes.object.isRequired,
  capacities : PropTypes.object.isRequired,
};

export default Results;