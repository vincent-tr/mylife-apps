'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import * as mui from 'material-ui';
import icons from '../icons';
import common from '../common/index';

function checkOnArticle(articles, item, check) {
  const article = articles.get(item.article);
  if(!article) {
    console.error(`article ${item.article} not found on history ${item.id}`);
    return false;
  }

  return check(article);
}

function filter(criteria, history, articles) {
  const { type, region, name, minDate, maxDate, isAdd } = criteria;
  const typeTest   = type === null ? (() => true) : (item => checkOnArticle(articles, item, article => article.type === type));
  const regionTest = region === null ? (() => true) :(item => checkOnArticle(articles, item, article => article.region === region));
  const nameTest   = name === null ? (() => true) : (item => checkOnArticle(articles, item, article => article.name.toUpperCase().includes(name.toUpperCase())));
  const minDateTest = minDate === null ? (() => true) : (item => item.date >= minDate);
  const maxDateTest = maxDate === null ? (() => true) : (item => item.date <= maxDate);
  const isAddTest = isAdd === null ? (() => true) : (item => (item.isAdd === 1) === isAdd);

  return history.filter(item =>
    typeTest(item) &&
    regionTest(item) &&
    nameTest(item) &&
    minDateTest(item) &&
    maxDateTest(item) &&
    isAddTest(item));
}

const Results = ({ criteria, history, articles }) => {
  history = filter(criteria, history, articles);

  return (
    <div>
      <div>{JSON.stringify(history)}</div>
    </div>
  );
};

Results.propTypes = {
  criteria : PropTypes.object.isRequired,
  history  : PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  articles : PropTypes.object.isRequired,
};

export default Results;