'use strict';

import React from 'react';

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

  render() {
    return (
      <div style={styles.container}>
        <div style={styles.articleFinder}>
          <ArticleFinderContainer article={this.state.article} onArticleChange={article => this.setState({ article })}/>
        </div>
        <div style={styles.articleDetails}>
          <ArticleDetailsContainer article={this.state.article} onArticleChange={ article => this.setState({ article })}/>
        </div>
        <div style={styles.stockAdd}>stock add</div>
      </div>
    );
  }
}

export default Index;