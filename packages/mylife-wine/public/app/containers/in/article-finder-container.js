'use strict';

import { connect } from 'react-redux';
import { getRegions, getTypes } from '../../selectors/references';
import { getArticles } from '../../selectors/articles';

import ArticleFinder from '../../components/in/article-finder';

const mapStateToProps = (state) => ({
  regions  : getRegions(state),
  types    : getTypes(state),
  articles : getArticles(state)
});

const ArticleFinderContainer = connect(
  mapStateToProps
)(ArticleFinder);

export default ArticleFinderContainer;
