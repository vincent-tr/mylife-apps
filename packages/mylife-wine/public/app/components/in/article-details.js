'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import * as mui from 'material-ui';
import base from '../base/index';
import icons from '../icons';
import tabStyles from '../base/tab-styles';

function newArticle(props) {
  const { regions, types } = props;

  return {
    id                    : 'new',
    name                  : 'Nouveau',
    type                  : types[0].id,
    region                : regions[0].id,
    alcoholContent        : 11.5,
    beginYearRelative     : 0,
    endYearRelative       : 3,
    servingTemperatureMin : 0,
    servingTemperatureMax : 0,
    sparkling             : 0,
    decanting             : 0,
    quality               : 5,
    bottleCountThreshold  : -1,
    comment               : null
  };
}

class ArticleDetails extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      article : null
    };
  }

  componentWillReceiveProps(nextProps) {
    const nextArticleId = nextProps.articleId;
    if(this.state.article && this.state.article.id === nextArticleId) { return; }
    if(!this.state.article && !nextArticleId) { return; }

    switch(nextArticleId) {
      case 'new':
        this.setState({ article: newArticle(this.props) });
        break;

      case null:
        this.setState({ article: null });
        break;

      default:
        this.setState({ article: shallowClone(nextProps.article) });
        break;
    }
  }

  create() {
    const { onArticleChange } = this.props;

    onArticleChange('new');
  }

  save() {
    const { article } = this.state;
    const { onCreate, onUpdate, onArticleChange } = this.props;

    if(article.id !== 'new') {
      return onUpdate(article);
    }

    const { id, ...others } = article;
    void id; // linter
    onCreate({ newIdCallback: onArticleChange, ...others });
  }

  delete() {
    const { article } = this.state;
    const { onDelete, onArticleChange } = this.props;

    if(article.id !== 'new') { onDelete(article); }
    onArticleChange(null);
  }

  render() {
    const { article } = this.state;
    return(
      <div>
        {JSON.stringify(article)}

        <mui.IconButton onClick={() => this.create()}
                        tooltip="Nouveau">
          <icons.actions.New />
        </mui.IconButton>

        {article && (
          <mui.IconButton onClick={() => this.save()}
                          tooltip="Enregistrer">
            <icons.actions.Save />
          </mui.IconButton>
        )}

        {article && (
          <mui.IconButton onClick={() => this.delete()}
                          tooltip="Supprimer">
            <icons.actions.Delete />
          </mui.IconButton>
        )}
      </div>
    );
    // onCreate -> articleChange('new');
  }
}

function shallowClone(obj) {
  return Object.assign({}, obj);
}

ArticleDetails.propTypes = {
  regions         : PropTypes.arrayOf(PropTypes.object),
  types           : PropTypes.arrayOf(PropTypes.object),
  articleId       : PropTypes.string,
  article         : PropTypes.object,
  onCreate        : PropTypes.func.isRequired,
  onUpdate        : PropTypes.func.isRequired,
  onDelete        : PropTypes.func.isRequired,
  onArticleChange : PropTypes.func.isRequired,
};

export default ArticleDetails;