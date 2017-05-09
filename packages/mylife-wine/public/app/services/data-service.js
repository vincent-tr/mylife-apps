'use strict';

import request from 'superagent';
import { actionTypes } from '../constants/index';
import {
  getCapacities, createCapacity, updateCapacity, deleteCapacity,
  getDishes,     createDish,     updateDish,     deleteDish,
  getRegions,    createRegion,   updateRegion,   deleteRegion,
  getTypes,      createType,     updateType,     deleteType,
  getArticles,   createArticle,  updateArticle,  deleteArticle,
} from '../actions/service';

function createCrud(routerName, getConst, createConst, updateConst, deleteConst, getAction, createAction, updateAction, deleteAction) {
  return (next, action) => {
    switch (action.type) {
      case getConst:
        request
          .get(`/api/${routerName}`)
          .end((err, res) => {
            if (err) {
              return next(getAction(new Error(JSON.parse(res.text))));
            }
            const data = JSON.parse(res.text);
            return next(getAction(data));
          });
        break;

      case createConst: {
        const { newIdCallback } = action.payload;
        delete action.payload.newIdCallback;
        request
          .put(`/api/${routerName}`)
          .send(action.payload)
          .end((err, res) => {
            if (err) {
              return next(createAction(new Error(JSON.parse(res.text))));
            }
            const data = JSON.parse(res.text);
            newIdCallback(data._id);
            return next(createAction(data));
          });
        break;
      }

      case updateConst:
        request
          .post(`/api/${routerName}`)
          .send(action.payload)
          .end((err, res) => {
            if (err) {
              return next(updateAction(new Error(JSON.parse(res.text))));
            }
            const data = JSON.parse(res.text);
            return next(updateAction(data));
          });
        break;

      case deleteConst:
        request
          .delete(`/api/${routerName}`)
          .send({ id: action.payload })
          .end((err, res) => {
            if (err) {
              return next(deleteAction(new Error(JSON.parse(res.text))));
            }
            return next(deleteAction(action.payload));
          });
        break;
    }
  };
}

const capacitiesCrud = createCrud('capacity', actionTypes.QUERY_GET_CAPACITIES, actionTypes.QUERY_CREATE_CAPACITY, actionTypes.QUERY_UPDATE_CAPACITY, actionTypes.QUERY_DELETE_CAPACITY, getCapacities, createCapacity, updateCapacity, deleteCapacity);
const dishesCrud     = createCrud('dish',     actionTypes.QUERY_GET_DISHES,     actionTypes.QUERY_CREATE_DISH,     actionTypes.QUERY_UPDATE_DISH,     actionTypes.QUERY_DELETE_DISH,     getDishes,     createDish,     updateDish,     deleteDish);
const regionsCrud    = createCrud('region',   actionTypes.QUERY_GET_REGIONS,    actionTypes.QUERY_CREATE_REGION,   actionTypes.QUERY_UPDATE_REGION,   actionTypes.QUERY_DELETE_REGION,   getRegions,    createRegion,   updateRegion,   deleteRegion);
const typesCrud      = createCrud('type',     actionTypes.QUERY_GET_TYPES,      actionTypes.QUERY_CREATE_TYPE,     actionTypes.QUERY_UPDATE_TYPE,     actionTypes.QUERY_DELETE_TYPE,     getTypes,      createType,     updateType,     deleteType);
const articlesCrud   = createCrud('article',  actionTypes.QUERY_GET_ARTICLES,   actionTypes.QUERY_CREATE_ARTICLE,  actionTypes.QUERY_UPDATE_ARTICLE,  actionTypes.QUERY_DELETE_ARTICLE,  getArticles,   createArticle,  updateArticle,  deleteArticle);

const dataService = (/*store*/) => next => action => {
  next(action);

  capacitiesCrud(next, action);
  dishesCrud(next, action);
  regionsCrud(next, action);
  typesCrud(next, action);
  articlesCrud(next, action);
};

export default dataService;