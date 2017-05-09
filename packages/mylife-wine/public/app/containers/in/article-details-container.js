'use strict';

import { connect } from 'react-redux';
import { getRegions, getTypes, getDishes } from '../../selectors/references';
import { getArticle } from '../../selectors/articles';
import { createArticle, updateArticle, deleteArticle } from '../../actions/articles';

import ArticleDetails from '../../components/in/article-details';

const mapStateToProps = (state, props) => ({
  regions   : getRegions(state),
  types     : getTypes(state),
  dishes    : getDishes(state),
  articleId : props.article,
  article   : props.article && props.article.id !== 'new' && getArticle(state, { value: props.article })
});

const mapDispatchToProps = (dispatch) => ({
  onCreate : (article) => dispatch(createArticle(article)),
  onUpdate : (article) => dispatch(updateArticle(article)),
  onDelete : (article) => dispatch(deleteArticle(article.id))
});

const ArticleDetailsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ArticleDetails);

export default ArticleDetailsContainer;
