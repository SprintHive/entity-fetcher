/**
 * Copyright (c) 2018 SprintHive (Pty) Ltd (buzz@sprinthive.com)
 *
 * This source code is licensed under the Apache License, Version 2.0
 * found in the LICENSE file in the root directory of this source tree.
 */

import PropTypes from "prop-types";
import {compose, setDisplayName, setPropTypes, lifecycle} from "recompose";
import {connect} from "react-redux";
import {fetchEntity, subscribeToEntity, unSubscribeFromEntity} from "./EntityActions";

export const entityFetcher = compose(
  setDisplayName("EntityFetcher"),
  setPropTypes({
    endpoint: PropTypes.string.isRequired,
    entityKey: PropTypes.string.isRequired,
    idField: PropTypes.string.isRequired,
    entityId: PropTypes.string,
    headers: PropTypes.object
  }),
  connect((state, props) => {
    const {entityKey, entityId} = props;
    let stateKey = props.stateKey || "honeycomb";
    if (state[stateKey][entityKey] && state[stateKey][entityKey][entityId]) {
      return {[entityKey]: {...state[stateKey][entityKey][entityId]}};
    } else {
      return {[entityKey]: undefined};
    }
  }),
  lifecycle({
    componentWillMount() {
      const {dispatch, entityKey, entityId, idField, endpoint, authToken} = this.props;
      dispatch(subscribeToEntity({entityKey, entityId, entityAuthToken: authToken}));
      if (this.props[entityKey] === undefined) {
        console.log(`Could not find entity, going to dispatch a fetch entity action entityKey: ${entityKey} entityId: ${entityId}`);
        dispatch(fetchEntity({entityKey, entityId, idField, endpoint, authToken}));
      } else {
        console.log("We already have it and we must already be subscribed to it")
      }
    },
    componentWillUnmount() {
      const {dispatch, entityKey, entityId} = this.props;
      dispatch(unSubscribeFromEntity({entityKey, entityId}));
    }
  })
);