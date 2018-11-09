import merge from "deepmerge";

import {
  CREATE_ENTITY_IN_PROGRESS,
  CREATE_ENTITY_COMPLETED,
  FETCH_ENTITY_COMPLETED,
  FETCH_ENTITY_IN_PROGRESS,
  ENTITY_UPDATED,
  UNSUBSCRIBE_FROM_ENTITY
} from "./EntityActions";

const bump = state => {
  const ans = {...state};
  ans.bump = (ans.bump || 0)+1;
  return ans;
};


export const entityReducer = (state, action) => {
  switch (action.type) {

    case CREATE_ENTITY_IN_PROGRESS:
      return createEntityInProgress(state, action);

    case FETCH_ENTITY_IN_PROGRESS:
      return fetchEntityInProgress(state, action);

    case CREATE_ENTITY_COMPLETED:
      return entityCompleted(state, action);

    case FETCH_ENTITY_COMPLETED:
    case ENTITY_UPDATED:
      return entityUpdated(state, action);

    case UNSUBSCRIBE_FROM_ENTITY:
      return unsubscribeFromEntity(state, action);

    case "BUMP":
      return bump(state);

    default:
      return state;
  }
};

const updateLoading = (ans, entityKey, entityId, bool) => {
  if (!ans.loading) ans.loading = {};
  if (!ans.loading[entityKey]) {ans.loading[entityKey] = {}}
  if (entityId) {
    if (!ans.loading[entityKey][entityId]) {ans.loading[entityKey][entityId] = {}}
    ans.loading[entityKey][entityId] = bool;
  } else {
    ans.loading[entityKey] = bool;
  }
};

const createEntityInProgress = (state, action) => {
  const ans = {...state};
  const {entityKey} = action;
  if (!ans[entityKey]) {ans[entityKey] = {}}
  if (!ans.loading) ans.loading = {};
  ans.loading[entityKey] = true;
  return ans;
};

const fetchEntityInProgress = (state, action) => {
  const ans = {...state};
  const {entityKey, entityId} = action;
  updateLoading(ans, entityKey, entityId, true);
  return ans;
};

const entityCompleted = (state, action) => {
  const ans = {...state};
  const {entityKey, entityId, entityAuthToken, payload} = action;
  if (!ans[entityKey]) {ans[entityKey] = {}}
  if (!ans[entityKey][entityId]) {ans[entityKey][entityId] = {}}

  if (!ans.loading) ans.loading = {};
  ans.loading[entityKey] = false;
  ans[entityKey][entityId] = payload;

  if (!ans.authTokens) ans.authTokens = {};
  if (!ans.authTokens[entityKey]) ans.authTokens[entityKey] = {};
  if (!ans.authTokens[entityKey][entityId]) ans.authTokens[entityKey][entityId] = {};
  ans.authTokens[entityKey][entityId] = entityAuthToken;
  return ans;
};

const entityUpdated = (state, action) => {
  const ans = {...state};
  const {entityKey, entityId, payload} = action;
  if (entityId) {
    let found = ans[entityKey] && ans[entityKey][entityId];
    if (found) {
      ans[entityKey][entityId] = merge(found, payload, {arrayMerge: (destinationArray, sourceArray) => sourceArray})
    } else {
      ensureCollectionExists(entityKey, ans);
      ans[entityKey][entityId] = {...payload};
    }
  } else {
    let found = ans[entityKey];
    if (found) {
      ans[entityKey] = {...found, ...payload}
    } else {
      console.log(payload)
      ans[entityKey] = {...payload}
    }
  }
  updateLoading(ans, entityKey, entityId, false);
  return ans;
};

const unsubscribeFromEntity = (state, action) => {
  const ans = {...state};
  const {entityKey, entityId} = action.payload;
  if (ans.authTokens && ans.authTokens[entityKey] && ans.authTokens[entityKey][entityId]) {
    delete ans.authTokens[entityKey][entityId];
  }
  return ans;
};

function ensureCollectionExists(entityKey, entities) {
  // ensure that the entityKey is in the entities object
  if (!entities[entityKey]) {
    entities[entityKey] = {};
  }
}
