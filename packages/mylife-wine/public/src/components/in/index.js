'use strict';

import React from 'react';
import base from '../base/index';

import ArticleFinderContainer from '../../containers/in/article-finder-container';
import ArticleDetailsContainer from '../../containers/in/article-details-container';
import StockAddContainer from '../../containers/in/stock-add-container';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%'
  },
  articleFinder: {
    flex: 1,
    width: '100%'
  },
  articleDetails: {
    flex: '0 0 580px',
    width: '100%'
  },
  stockAdd: {
    flex: '0 0 335px',
    width: '100%'
  }
};

class Index extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      article: null
    };
  }

  render() {
    return (
      <div style={styles.container}>
        <base.GroupBox style={styles.articleFinder} title={'Rechercher un article'}>
          <ArticleFinderContainer article={this.state.article} onArticleChange={article => this.setState({ article })}/>
        </base.GroupBox>
        <base.GroupBox style={styles.articleDetails} title={'Description de l\'article'}>
          <ArticleDetailsContainer article={this.state.article} onArticleChange={ article => this.setState({ article })}/>
        </base.GroupBox>
        <base.GroupBox style={styles.stockAdd} title={'Ajout de stock'}>
          <StockAddContainer article={this.state.article}/>
        </base.GroupBox>
      </div>
    );
  }
}

export default Index;