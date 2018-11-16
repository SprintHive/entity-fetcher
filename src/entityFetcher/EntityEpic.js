
import axios from "axios";
import {Observable} from "rxjs";

const printError = ({e, message}) => {
  if (e.response) {
    const {status, data} = e.response;
    console.error(message, status, data)
  } else {
    console.error(message);
    console.error(e);
  }
};

import {
  FETCH_ENTITY, fetchEntityCompleted, fetchEntityInProgress,
  CREATE_ENTITY, createEntityCompleted, createEntityFailed, createEntityInProgress
} from "./EntityActions";

export const createEntity = (action$, store, deps) => {
  const honeycombHeaders = deps && deps.honeycombHeaders;
  return action$.ofType(CREATE_ENTITY)
    .flatMap(action => {
      console.log(`Processing action ${action.type}`);
      const {entityKey, idField, endpoint, data, headers} = action.payload;
      const reqHeaders = headers || honeycombHeaders;

      const inProgress$ = Observable.of(createEntityInProgress(entityKey));

      const data$ = Observable.fromPromise(axios.post(endpoint, data, {headers: reqHeaders}))
        .mergeMap(({data, headers}) => {
          const entityId = data[idField];
          const entityAuthToken = headers['x-lead-token'] || headers['x-application-token'];
          return Observable.of(createEntityCompleted(entityKey, entityId, entityAuthToken, data));
        })
        .catch((e) => {
          const message = "Something went wrong trying to create a lead";
          printError({e, message: message});
          return Observable.of(createEntityFailed({message}));
        });

      return Observable.concat(inProgress$, data$);
    });
};

export const fetchEntity = (action$, store, deps) => {
  const honeycombHeaders = deps && deps.honeycombHeaders;
  return action$.ofType(FETCH_ENTITY)
    .flatMap(({payload}) => {
      const {entityKey, entityId, idField, endpoint, authToken} = payload;
      const headers = honeycombHeaders || {};
      if (authToken) headers['Authorization'] = `Bearer ${authToken}`;
      const inProgress$ = Observable.of(fetchEntityInProgress(entityKey, entityId));
      const data$ = Observable.fromPromise(
        axios.get(`${endpoint}`, {headers}))
        .mergeMap(({data}) => {
          if (entityId) {
            return Observable.of(fetchEntityCompleted(entityKey, entityId, data));
          } else {
            const payload = data.reduce((acc, entity) => {

              const id = entity[idField];
              acc[id] = entity;
              return acc;
            }, {});
            return Observable.of(fetchEntityCompleted(entityKey, entityId, payload));
          }
        })
        .catch((e) => {
          const message = `Something went wrong trying to load the ${entityKey}`;
          printError({e, message});
          return Observable.of({type: `${FETCH_ENTITY}_FAILED`, message});
        });

      return Observable.concat(inProgress$, data$);
    });
};