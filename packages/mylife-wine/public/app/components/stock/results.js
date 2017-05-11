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
      { ... baseColumnStyle },
      { ... baseColumnStyle, flex: '0 0 200px' },
      { ... baseColumnStyle, flex: '0 0 200px' },
      { ... baseColumnStyle, flex: '0 0 250px' }, // plats
      { ... baseColumnStyle },
      { ... baseColumnStyle, flex: '0 0 150px' },
      { ... baseColumnStyle, flex: '0 0 150px' },
      { ... baseColumnStyle, flex: '0 0 150px' },
      { ... baseColumnStyle }
    ]
  };

})();

function prepareData({ criteria, stock, articles, types: typeMap, regions: regionMap, dishes: dishMap, capacities: capacityMap }) {

  const filter = (() => {
    const { type, region, name, sparkling, dishes } = criteria;
    const dishSet = new Set(dishes);
    const typeTest      = type === null ? (() => true) : (article => article.type === type);
    const regionTest    = region === null ? (() => true) :(article => article.region === region);
    const nameTest      = name === null ? (() => true) : (article => article.name.toUpperCase().includes(name.toUpperCase()));
    const sparklingTest = sparkling === null ? (() => true) : (article => (article.sparkling === 1) === sparkling);
    const dishesTest    = dishSet.size === 0 ? (() => true) : (article => (article.dishes || []).some(dish => dishSet.has(dish)));

    return article =>
      typeTest(article) &&
      regionTest(article) &&
      nameTest(article) &&
      sparklingTest(article) &&
      dishesTest(article);
  })();

  const articlesList = articles
    .filter(filter)
    .map(article => ({
      ...article,
      type   : typeMap.get(article.type),
      region : regionMap.get(article.region),
      dishes : (article.dishes || []).map(it => dishMap.get(it)),
      stock  : []
    }));

  const articlesMap = new Map();
  for(const article of articlesList) {
    articlesMap.set(article.id, article);
  }

  for(const item of stock) {
    const article = articlesMap.get(item.article);
    if(!article) { continue; } // filtered

    article.stock.push({
      ...item,
      capacity : capacityMap.get(item.capacity),
    });
  }

  return articlesList;
}

function renderListHeader() {
  return (
    <mui.Paper>
      <div style={{ display: 'flex', flexDirection: 'row', textAlign: 'left', padding: 16, fontWeight: 'bold' }}>
        <div style={styles.columns[0]}>Appelation</div>
        <div style={styles.columns[1]}>Type de spiritueux</div>
        <div style={styles.columns[2]}>Region</div>
        <div style={styles.columns[3]}>Plats</div>
        <div style={styles.columns[4]}>Propriétaire récoltant</div>
        <div style={styles.columns[5]}>Qualité</div>
        <div style={styles.columns[6]}>Nb. bouteilles</div>
        <div style={styles.columns[7]}>Contenance</div>
        <div style={styles.columns[8]}>Détail stock</div>
      </div>
    </mui.Paper>
  );
}

function renderQuality(article) {
  if(!article.quality) {
    return null;
  }

  const stars = [
    key => <img key={key} src="images/misc/star-empty-48.png" height="20" width="20" />, // eslint-disable-line react/display-name
    key => <img key={key} src="images/misc/star-half-48.png" height="20" width="20" />, // eslint-disable-line react/display-name
    key => <img key={key} src="images/misc/star-filled-48.png" height="20" width="20" /> // eslint-disable-line react/display-name
  ];

  const stack = [];
  let value = article.quality;
  for(let i=0; i<5; ++i) {
    stack.push(stars[Math.min(value, 2)](i));
    value = Math.max(value - 2, 0);
  }
  return stack;
}

function renderDetails(article) {
  return article.stock.map(item => (
    <div key={item.id} style={{ display: 'inline-block', marginRight: 10 }}>
      <base.DataImage data={item.capacity.icon} height="20" width="20" style={{marginRight: 10}}/>{`${item.capacity.value} x ${item.bottleCount} (${item.year})`}
    </div>
  ));
}

function renderListItem(article) {

  const bottleCount = article.stock.reduce((acc, item) => acc + item.bottleCount, 0);
  const volume = article.stock.reduce((acc, item) => acc + item.bottleCount * item.capacity.value, 0);

  return (
    <mui.ListItem
      key={article.id}
      value={{ value: article.id }}
      primaryText={
        <div style={{ display: 'flex', flexDirection: 'row', textAlign: 'left' }}>
          <div style={styles.columns[0]}>{article.name}</div>
          <div style={styles.columns[1]}><base.DataImage data={article.type.icon} height="20" width="20" style={{marginRight: 10}}/>{article.type.name}</div>
          <div style={styles.columns[2]}><base.DataImage data={article.region.icon} height="20" width="20" style={{marginRight: 10}}/>{article.region.name}</div>
          <div style={styles.columns[3]}>{article.dishes.map(dish => (<base.DataImage key={dish.id} data={dish.icon} height="24" width="24" style={{marginRight: 2}} title={dish.name}/>))}</div>
          <div style={styles.columns[4]}>{article.owner}</div>
          <div style={styles.columns[5]}>{renderQuality(article)}</div>
          <div style={styles.columns[6]}>{bottleCount}</div>
          <div style={styles.columns[7]}>{`${volume}L`}</div>
          <div style={styles.columns[8]}>{renderDetails(article)}</div>
        </div>
      }/>
  );
}

const Results = (props) => {
  const data = prepareData(props);

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
  stock      : PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  articles   : PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  types      : PropTypes.object.isRequired,
  regions    : PropTypes.object.isRequired,
  dishes     : PropTypes.object.isRequired,
  capacities : PropTypes.object.isRequired,
};

export default Results;
