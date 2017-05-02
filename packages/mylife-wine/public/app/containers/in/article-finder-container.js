'use strict';

import { connect } from 'react-redux';
import { getRegions, getRegion, getTypes, getType } from '../../selectors/references';
import { getArticles } from '../../selectors/articles';

import ArticleFinder from '../../components/in/article-finder';

const mapStateToProps = (state) => ({
  regions  : getRegions(state),
  types    : getTypes(state),
  articles : getArticles(state).map(article => ({
    ...article,
    type   : getType(state, { value: article.type }),
    region : getRegion(state, { value: article.region })
  }))
});

const ArticleFinderContainer = connect(
  mapStateToProps
)(ArticleFinder);

export default ArticleFinderContainer;
