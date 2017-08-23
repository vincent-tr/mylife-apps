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
      { ... baseColumnStyle, flex: '0 0 80px' },
      { ... baseColumnStyle, flex: '0 0 80px' },
      { ... baseColumnStyle },
      { ... baseColumnStyle, flex: '0 0 80px' },
      { ... baseColumnStyle, flex: '0 0 80px' },
      { ... baseColumnStyle, flex: '0 0 200px' },
      { ... baseColumnStyle, flex: '0 0 200px' },
      { ... baseColumnStyle, flex: '0 0 200px' },
      { ... baseColumnStyle, flex: '0 0 250px' }, // plats
      { ... baseColumnStyle },
      { ... baseColumnStyle, flex: '0 0 150px' }
    ]
  };

})();

function enhanceItem(articleMap, typeMap, regionMap, dishMap, capacityMap, item) {
  const capacity = capacityMap.get(item.bottleCapacity);
  const article = articleMap.get(item.article);
  if(!article) {
    console.error(`article ${item.article} not found on history ${item.id}`); // eslint-disable-line no-console
    return { ...item, article: null, type: null, region: null, capacity, dishes: [], beginYear: null, endYear: null, endYearWarning: false };
  }

  const type   = typeMap.get(article.type);
  const region = regionMap.get(article.region);
  const dishes = (article.dishes || []).map(it => dishMap.get(it));

  const beginYear      = item.year + article.beginYearRelative;
  const endYear        = item.year + article.endYearRelative;
  const endYearWarning = endYear < new Date().getFullYear();

  return { ...item, article, type, region, capacity, dishes, beginYear, endYear, endYearWarning };
}

function prepareData({ criteria, stock, articles: articleMap, types: typeMap, regions: regionMap, dishes: dishMap, capacities: capacityMap }) {

  const filter = (() => {
    const { type, region, name, sparkling, dishes } = criteria;
    const dishSet = new Set(dishes);
    const typeTest      = type === null ? (() => true) : (article => article.type === type);
    const regionTest    = region === null ? (() => true) :(article => article.region === region);
    const nameTest      = name === null ? (() => true) : (article => article.name.toUpperCase().includes(name.toUpperCase()));
    const sparklingTest = sparkling === null ? (() => true) : (article => (article.sparkling === 1) === sparkling);
    const dishesTest    = dishSet.size === 0 ? (() => true) : (article => (article.dishes || []).some(dish => dishSet.has(dish)));

    return item =>
      typeTest(item.article) &&
      regionTest(item.article) &&
      nameTest(item.article) &&
      sparklingTest(item.article) &&
      dishesTest(item.article);
  })();

  return stock
    .map((item) => enhanceItem(articleMap, typeMap, regionMap, dishMap, capacityMap, item))
    .filter(filter)
    .sort((item1, item2) => item1.beginYear - item2.beginYear);
}

function renderListHeader() {
  return (
    <mui.Paper>
      <div style={{ display: 'flex', flexDirection: 'row', textAlign: 'left', padding: 16, fontWeight: 'bold' }}>
        <div style={styles.columns[0]}>Début</div>
        <div style={styles.columns[1]}>Fin</div>
        <div style={styles.columns[2]}>Appelation</div>
        <div style={styles.columns[3]}>Année</div>
        <div style={styles.columns[4]}>Nb.</div>
        <div style={styles.columns[5]}>Contenance</div>
        <div style={styles.columns[6]}>Type de spiritueux</div>
        <div style={styles.columns[7]}>Region</div>
        <div style={styles.columns[8]}>Plats</div>
        <div style={styles.columns[9]}>Propriétaire récoltant</div>
        <div style={styles.columns[10]}>Qualité</div>
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

function renderListItem(item) {
  const endYearStyle = item.endYearWarning && { color: 'red', fontWeight: 'bold' };
  return (
    <base.SelectableListItem
      key={item.id}
      value={{ value: item.id }}
      primaryText={
        <div style={{ display: 'flex', flexDirection: 'row', textAlign: 'left' }}>
          <div style={styles.columns[0]}>{item.beginYear}</div>
          <div style={Object.assign({}, styles.columns[1], endYearStyle)}>{item.endYear}</div>
          <div style={styles.columns[2]}>{item.article && item.article.name}</div>
          <div style={styles.columns[3]}>{item.year}</div>
          <div style={styles.columns[4]}>{item.bottleCount}</div>
          <div style={styles.columns[5]}><base.DataImage data={item.capacity.icon} height="20" width="20" style={{marginRight: 10}}/>{`${item.capacity.name }(${item.capacity.value} L)`}</div>
          <div style={styles.columns[6]}><base.DataImage data={item.type && item.type.icon} height="20" width="20" style={{marginRight: 10}}/>{item.article && item.type.name}</div>
          <div style={styles.columns[7]}><base.DataImage data={item.region && item.region.icon} height="20" width="20" style={{marginRight: 10}}/>{item.region && item.region.name}</div>
          <div style={styles.columns[8]}>{item.dishes && item.dishes.map(dish => (<base.DataImage key={dish.id} data={dish.icon} height="24" width="24" style={{marginRight: 2}} title={dish.name}/>))}</div>
          <div style={styles.columns[9]}>{item.article && item.article.owner}</div>
          <div style={styles.columns[10]}>{renderQuality(item)}</div>
        </div>
      }/>
  );
}

const Results = ({ stockItem, onStockItemChange, ...props }) => {
  const data = prepareData(props);

  return (
    <div style={{ height: '100%'}}>
      {renderListHeader()}
      <div style={{ position: 'relative', height: 'calc(100% - 60px)' }}>
        <base.SelectableList style={Object.assign({}, tabStyles.scrollable, { position: 'absolute', padding: 0, height: '100%', width: '100%' })}
                             selectedNode={{value: stockItem}}
                             selectedValueChanged={(obj) => onStockItemChange(obj.value)}>
          {data.map(renderListItem)}
        </base.SelectableList>
      </div>
    </div>
  );
};

Results.propTypes = {
  criteria          : PropTypes.object.isRequired,
  stock             : PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  articles          : PropTypes.object.isRequired,
  types             : PropTypes.object.isRequired,
  regions           : PropTypes.object.isRequired,
  dishes            : PropTypes.object.isRequired,
  capacities        : PropTypes.object.isRequired,
  stockItem         : PropTypes.string,
  onStockItemChange : PropTypes.func.isRequired
};

export default Results;
