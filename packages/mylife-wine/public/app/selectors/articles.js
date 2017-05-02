'use strict';

export const getArticles = (state) => state.articles.valueSeq().sortBy(item => item.name).toArray();

export const getArticle = (state, { value }) => state.articles.get(value);
