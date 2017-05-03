'use strict';

import React from 'react';
import base from '../base/index';

import ArticleFinderContainer from '../../containers/in/article-finder-container';
import ArticleDetailsContainer from '../../containers/in/article-details-container';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%'
  },
  articleFinder: {
    flex: 2,
    width: '100%'
  },
  articleDetails: {
    flex: 3,
    width: '100%'
  },
  stockAdd: {
    flex: 1,
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

  // TODO: 3 papers with title like nmaterial-ui website

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
          stock add
        </base.GroupBox>
      </div>
    );
  }
}

export default Index;