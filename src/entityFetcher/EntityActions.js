
export const ENTITY_UPDATED = "ENTITY_UPDATED";

export const CREATE_ENTITY = "CREATE_ENTITY";
export function createEntity(payload) {
  return {type: CREATE_ENTITY, payload}
}

export const CREATE_ENTITY_IN_PROGRESS = "CREATE_ENTITY_IN_PROGRESS";
export function createEntityInProgress(entityKey) {
  return {type: CREATE_ENTITY_IN_PROGRESS, entityKey}
}

export const CREATE_ENTITY_COMPLETED = "CREATE_ENTITY_COMPLETED";
export function createEntityCompleted(entityKey, entityId, entityAuthToken, payload) {
  return {type: CREATE_ENTITY_COMPLETED, entityKey, entityId, entityAuthToken, payload}
}

export const CREATE_ENTITY_FAILED = "CREATE_ENTITY_FAILED";
export function createEntityFailed(payload) {
  return {type: CREATE_ENTITY_FAILED, payload}
}

export const FETCH_ENTITY = "FETCH_ENTITY";
export function fetchEntity(payload) {
  return {type: FETCH_ENTITY, payload}
}

export const FETCH_ENTITY_IN_PROGRESS = "FETCH_ENTITY_IN_PROGRESS";
export function fetchEntityInProgress(entityKey, entityId) {
  return {type: FETCH_ENTITY_IN_PROGRESS, entityKey, entityId}
}

export const FETCH_ENTITY_COMPLETED = "FETCH_ENTITY_COMPLETED";
export function fetchEntityCompleted(entityKey, entityId, payload) {
  return {type: FETCH_ENTITY_COMPLETED, entityKey, entityId, payload}
}

export const SUBSCRIBE_TO_ENTITY = "SUBSCRIBE_TO_ENTITY";
export const subscribeToEntity = ({entityKey, entityId, entityAuthToken}) => (
  {
    type: SUBSCRIBE_TO_ENTITY,
    meta: {remote: true},
    payload: {
      entityKey,
      entityId,
      entityAuthToken
    }
  }
);

export const UNSUBSCRIBE_FROM_ENTITY = "UNSUBSCRIBE_FROM_ENTITY";
export const unSubscribeFromEntity = ({entityKey, entityId}) => (
  {
    type: UNSUBSCRIBE_FROM_ENTITY,
    meta: {remote: true},
    payload: {
      entityKey,
      entityId
    }
  }
);


// public api
export default {createEntity, CREATE_ENTITY_COMPLETED}