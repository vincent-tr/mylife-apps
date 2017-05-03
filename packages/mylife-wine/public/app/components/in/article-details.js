'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import * as mui from 'material-ui';
import base from '../base/index';
import icons from '../icons';
import common from '../common/index';
import tabStyles from '../base/tab-styles';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: '100%'
  },
  common: {
    flex: 2,
    height: '100%'
  },
  dishes: {
    flex: 1,
    height: '100%'
  },
  comment: {
    flex: 3,
    height: '100%'
  },
  toolbar: {
    width: '100%',
    textAlign: 'center'
  },
  fieldTitle: {
    fontWeight: 'bold',
    width: 300,
    display: 'inline-block',
    textAlign: 'left'
  }
};

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

  renderArticleProp(name, noNull) {
    const { article } = this.state;
    if(!article) { return noNull ? '' : null; }
    return article[name];
  }

  render() {
    const { article } = this.state;
    const { regions, types } = this.props;

    const nameChange = (event) => this.setState({ article: { ...article, name: event.target.value } });
    const typeChange = (event, index, value) => this.setState({ article: { ...article, type: value } });
    const regionChange = (event, index, value) => this.setState({ article: { ...article, region: value } });

    return(
      <div>
        <div style={styles.container}>
          <div style={styles.common}>
            <table style={{tableLayout: 'fixed', width: '100%'}}>
              <tbody>
                <tr>
                  <td><div style={styles.fieldTitle}>Appelation</div></td>
                  <td>
                    <mui.TextField
                      id="name"
                      value={this.renderArticleProp('name', true)}
                      onChange={nameChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td><div style={styles.fieldTitle}>Type de spiritueux</div></td>
                  <td>
                    <common.ReferenceSelector
                      autoWidth={false}
                      style={{ width: 300 }}
                      id="type"
                      list={types}
                      value={this.renderArticleProp('type')}
                      onChange={typeChange} />
                  </td>
                </tr>
                <tr>
                  <td><div style={styles.fieldTitle}>Region</div></td>
                  <td>
                    <common.ReferenceSelector
                      autoWidth={false}
                      style={{ width: 300 }}
                      id="region"
                      list={regions}
                      value={this.renderArticleProp('region')}
                      onChange={regionChange} />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div style={styles.dishes}>
            dishes
          </div>
          <div style={styles.comment}>
            {JSON.stringify(article)}
          </div>
        </div>

        <div style={styles.toolbar}>
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
      </div>
    );
  }
}

function shallowClone({ ...fields }) {
  return { ...fields };
}

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