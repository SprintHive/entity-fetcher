import {combineEpics} from "redux-observable";
import {entityFetcher} from "./entityFetcher/EntityFetcher";
import entityActions from "./entityFetcher/EntityActions";
import {createEntity, fetchEntity} from "./entityFetcher/EntityEpic";
import {entityReducer} from "./entityFetcher/EntityReducer";

const entityEpics = combineEpics(createEntity, fetchEntity);

const EntityFetcher = {
  entityFetcher,
  entityEpics,
  entityReducer,
  entityActions
};

module.exports = EntityFetcher;

