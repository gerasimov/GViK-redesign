// @flow

import { createMutation, connect } from "./../../../core/mutations";

const setIDError = createMutation("SET_VK_ID_ERROR", function(state, payload) {
  return { error: payload.error };
});

const setID = createMutation(
  "SET_VK_ID",
  function(state, payload) {
    return { userId: payload.id };
  },
  function(dispatch) {
    setTimeout(() => setIDError({ error: "LOOOOL" }), 2000);
  }
);

export default connect(
  "vk",
  {
    userId: null,
    error: null
  },
  {
    setID,
    setIDError
  }
);
