'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import * as mui from 'material-ui';
import base from '../base/index';
import tabStyles from '../base/tab-styles';

const styles = (() => {

  const baseColumnStyle = {
    flex: 1,
    lineHeight: '24px',
  };

  return {
    columns: [
      { ... baseColumnStyle, flex: '0 0 100px' },
      { ... baseColumnStyle, flex: '0 0 30px' },
      { ... baseColumnStyle },
      { ... baseColumnStyle, flex: '0 0 200px' },
      { ... baseColumnStyle, flex: '0 0 200px' },
      { ... baseColumnStyle, flex: '0 0 250px' }, // plats
      { ... baseColumnStyle },
      { ... baseColumnStyle, flex: '0 0 120px' },
      { ... baseColumnStyle, flex: '0 0 200px' },
      { ... baseColumnStyle, flex: '0 0 80px' },
      { ... baseColumnStyle, flex: '0 0 80px' },
      { ... baseColumnStyle, flex: 3 }
    ]
  };

})();

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
        <div style={styles.columns[0]}>Date</div>
        <div style={styles.columns[1]}>T.</div>
        <div style={styles.columns[2]}>Appelation</div>
        <div style={styles.columns[3]}>Type de spiritueux</div>
        <div style={styles.columns[4]}>Region</div>
        <div style={styles.columns[5]}>Plats</div>
        <div style={styles.columns[6]}>Propriétaire récoltant</div>
        <div style={styles.columns[7]}>Qualité</div>
        <div style={styles.columns[8]}>Quantité</div>
        <div style={styles.columns[9]}>Prix</div>
        <div style={styles.columns[10]}>Année</div>
        <div style={styles.columns[11]}>Commentaire</div>
      </div>
    </mui.Paper>
  );
}

function renderQuality(item) {
  if(!item.article) {
    return null;
  }

  const stars = [
    key => <img key={key} src="images/misc/star-empty-48.png" height="20" width="20" />, // eslint-disable-line react/display-name
    key => <img key={key} src="images/misc/star-half-48.png" height="20" width="20" />, // eslint-disable-line react/display-name
    key => <img key={key} src="images/misc/star-filled-48.png" height="20" width="20" /> // eslint-disable-line react/display-name
  ];

  const stack = [];
  let value = item.article.quality;
  for(let i=0; i<5; ++i) {
    stack.push(stars[Math.min(value, 2)](i));
    value = Math.max(value - 2, 0);
  }
  return stack;
}

const dateFormatter = new Intl.DateTimeFormat('fr-FR');

function renderListItem(item) {
  const isAddImage = [
    <img src="images/misc/arrow-left-red-256.png" height="20" width="20" />,
    <img src="images/misc/arrow-right-green-256.png" height="20" width="20" />
  ];

  const capacityText = item.capacity ? `${item.capacity.value}L x ${item.bottleCount} = ${item.capacity.value * item.bottleCount}L` : `${item.bottleCount} bouteilles`;

  return (
    <mui.ListItem
      key={item.id}
      value={{ value: item.id }}
      primaryText={
        <div style={{ display: 'flex', flexDirection: 'row', textAlign: 'left' }}>
          <div style={styles.columns[0]}>{dateFormatter.format(new Date(item.date))}</div>
          <div style={styles.columns[1]}>{isAddImage[item.isAdd]}</div>
          <div style={styles.columns[2]}>{item.article && item.article.name}</div>
          <div style={styles.columns[3]}><base.DataImage data={item.type && item.type.icon} height="20" width="20" style={{marginRight: 10}}/>{item.type && item.type.name}</div>
          <div style={styles.columns[4]}><base.DataImage data={item.region && item.region.icon} height="20" width="20" style={{marginRight: 10}}/>{item.region && item.region.name}</div>
          <div style={styles.columns[5]}>{item.dishes.map(dish => (<base.DataImage key={dish.id} data={dish.icon} height="24" width="24" style={{marginRight: 2}} title={dish.name}/>))}</div>
          <div style={styles.columns[6]}>{item.article && item.article.owner}</div>
          <div style={styles.columns[7]}>{renderQuality(item)}</div>
          <div style={styles.columns[8]}><base.DataImage data={item.capacity && item.capacity.icon} height="20" width="20" style={{marginRight: 10}}/>{capacityText}</div>
          <div style={styles.columns[9]}>{item.bottlePrice ? `${item.bottlePrice.toFixed(2)} €` : null}</div>
          <div style={styles.columns[10]}>{item.year}</div>
          <div style={styles.columns[11]}>{item.note}</div>
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