'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import * as mui from 'material-ui';
import base from '../base/index';
import icons from '../icons';
import common from '../common/index';

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

  renderArticleProp(name, type, defaultValue) {

    if(typeof defaultValue === 'undefined') {
      defaultValue = (() => {
        switch(type) {
          case 'id'      : return null;
          case 'string'  : return '';
          case 'boolean' : return false;
          case 'number'  : return 0;
        }
      })();
    }

    const parse = (value) => {
      switch(type) {
        case 'id'      : return value;
        case 'string'  : return value;
        case 'boolean' : return value === 1 ? true : false;
        case 'number'  : return value;
      }
    };

    const { article } = this.state;
    if(!article) {
      return defaultValue;
    }
    const value = article[name];
    if(value === null || value === undefined) {
      return defaultValue;
    }
    return parse(value);
  }

  render() {
    const { article } = this.state;
    const { regions, types } = this.props;

    const nameChange                  = (event) => this.setState({ article: { ...article, name: event.target.value } });
    const typeChange                  = (event, index, value) => this.setState({ article: { ...article, type: value } });
    const regionChange                = (event, index, value) => this.setState({ article: { ...article, region: value } });
    const ownerChange                 = (event) => this.setState({ article: { ...article, owner: event.target.value } });
    const grapVarietyChange           = (event) => this.setState({ article: { ...article, grapVariety: event.target.value } });
    const beginYearRelativeChange     = (value) => this.setState({ article: { ...article, beginYearRelative: value } });
    const endYearRelativeChange       = (value) => this.setState({ article: { ...article, endYearRelative: value } });
    const sparklingChange             = (event, value) => this.setState({ article: { ...article, sparkling: value } });
    const alcoholContentChange        = (value) => this.setState({ article: { ...article, alcoholContent: value } });
    const decantingChange             = (event, value) => this.setState({ article: { ...article, decanting: value } });
    const servingTemperatureMinChange = (value) => this.setState({ article: { ...article, servingTemperatureMin: value } });
    const servingTemperatureMaxChange = (value) => this.setState({ article: { ...article, servingTemperatureMax: value } });
    const bottleCountThresholdChange  = (value) => this.setState({ article: { ...article, bottleCountThreshold: value } });
    const qualityChange               = (event, value) => this.setState({ article: { ...article, quality: value } });

    return(
      <div>
        <div style={styles.container}>
          <div style={styles.common}>
            <table style={{tableLayout: 'fixed', width: '100%'}}>
              <tbody>
                <tr>
                  <td><div style={styles.fieldTitle}>Appelation</div></td>
                  <td><mui.TextField disabled={!article} id="name" style={{ width: 300 }} value={this.renderArticleProp('name', 'string')} onChange={nameChange} /></td>
                </tr>
                <tr>
                  <td><div style={styles.fieldTitle}>Type de spiritueux</div></td>
                  <td><common.ReferenceSelector disabled={!article} id="type" autoWidth={false} style={{ width: 300 }} list={types} value={this.renderArticleProp('type', 'id')} onChange={typeChange} /></td>
                </tr>
                <tr>
                  <td><div style={styles.fieldTitle}>Region</div></td>
                  <td><common.ReferenceSelector disabled={!article} id="region" autoWidth={false} style={{ width: 300 }} list={regions} value={this.renderArticleProp('region', 'id')} onChange={regionChange} /></td>
                </tr>
                <tr>
                  <td><div style={styles.fieldTitle}>Propriétaire récoltant</div></td>
                  <td><mui.TextField disabled={!article} id="owner" style={{ width: 300 }} value={this.renderArticleProp('owner', 'string')} onChange={ownerChange} /></td>
                </tr>
                <tr>
                  <td><div style={styles.fieldTitle}>Cépage</div></td>
                  <td><mui.TextField disabled={!article} id="grapVariety" style={{ width: 300 }} value={this.renderArticleProp('grapVariety', 'string')} onChange={grapVarietyChange} /></td>
                </tr>
                <tr>
                  <td><div style={styles.fieldTitle}>Fourchette de consommation (années)</div></td>
                  <td>
                    <base.IntegerField disabled={!article} id="beginYearRelative" style={{ width: 145 }} value={this.renderArticleProp('beginYearRelative', 'number')} onChange={beginYearRelativeChange} minValue={0} />
                    <div style={{ display: 'inline-block', width: 10 }} />
                    <base.IntegerField disabled={!article} id="endYearRelative" style={{ width: 145 }} value={this.renderArticleProp('endYearRelative', 'number')} onChange={endYearRelativeChange} minValue={0} />
                  </td>
                </tr>
                <tr>
                  <td>
                    <div style={Object.assign({}, styles.fieldTitle, { width: 200 })}>Mousseux</div>
                    <mui.Checkbox disabled={!article} id="sparkling" style={{ width: 100, display: 'inline-block' }} value={this.renderArticleProp('sparkling', 'boolean')} onCheck={sparklingChange}/>
                  </td>
                  <td>
                    <div style={Object.assign({}, styles.fieldTitle, { width: 155 })}>Degré d'alcool</div>
                    <base.IntegerField disabled={!article} id="alcoholContent" style={{ width: 145 }} value={this.renderArticleProp('alcoholContent', 'number')} onChange={alcoholContentChange} minValue={0} />
                  </td>
                </tr>
                <tr>
                  <td>
                    <div style={Object.assign({}, styles.fieldTitle, { width: 200 })}>Carafage</div>
                    <mui.Checkbox disabled={!article} id="decanting" style={{ width: 100, display: 'inline-block' }} value={this.renderArticleProp('decanting', 'boolean')} onCheck={decantingChange}/>
                  </td>
                  <td>
                    <div style={Object.assign({}, styles.fieldTitle, { width: 155 })}>Température de service</div>
                    <base.IntegerField disabled={!article} id="servingTemperatureMin" style={{ width: 70 }} value={this.renderArticleProp('servingTemperatureMin', 'number')} onChange={servingTemperatureMinChange} minValue={0} />
                    <div style={{ display: 'inline-block', width: 5 }} />
                    <base.IntegerField disabled={!article} id="servingTemperatureMax" style={{ width: 70 }} value={this.renderArticleProp('servingTemperatureMax', 'number')} onChange={servingTemperatureMaxChange} minValue={0} />
                  </td>
                </tr>
                <tr>
                  <td>
                    <div style={Object.assign({}, styles.fieldTitle, { width: 200 })}>Seuil (-1 pour aucun)</div>
                    <base.IntegerField disabled={!article} id="bottleCountThreshold" style={{ width: 100 }} value={this.renderArticleProp('bottleCountThreshold', 'number', -1)} onChange={bottleCountThresholdChange} minValue={0} />
                  </td>
                  <td>
                    <div style={Object.assign({}, styles.fieldTitle, { width: 155 })}>Qualité</div>
                    <mui.Slider disabled={!article} id="quality" style={{ width: 80, height: 30, display: 'inline-block' }} value={this.renderArticleProp('quality', 'number')} onChange={qualityChange} step={1} min={0} max={10} />
                    <div style={{ display: 'inline-block', width: 15 }} />
                    <base.IntegerField disabled={true} id="qualityLabel" style={{ width: 50 }} value={this.renderArticleProp('quality', 'number')} onChange={() => {}} />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div style={styles.dishes}>
            dishes
          </div>
          <div style={styles.comment}>
            {JSON.stringify(false && article)}
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