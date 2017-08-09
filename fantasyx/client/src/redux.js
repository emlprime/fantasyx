import {applyMiddleware, createStore, compose, combineReducers} from "redux";
import thunk from "redux-thunk";
import {reducer as formReducer} from "redux-form";

import {removeNotification} from "./actions";
import UserReducer from "./UserReducer";
import GameReducer from "./GameReducer";

const rootReducer = combineReducers({
  user: UserReducer,
  game: GameReducer,
  form: formReducer,
});

export const gotMessage = message => {
  if (message.type) {
    store.dispatch(message);
  }
};

export function configureStore(preloadedState = {}) {
  const enhancer = compose(applyMiddleware(thunk));

  const store = createStore(rootReducer, preloadedState, enhancer);
  return store;
}

const hostname = global.location.host.split(":")[0];
const host = hostname === "localhost" ? "localhost:5000" : hostname;
const socket_address = `ws://${host}/api/test`;
const ws = new WebSocket(socket_address);
ws.onmessage = function(evt) {
  // console.log("evt with data:", evt);
  const parsed_data = JSON.parse(evt.data);
  gotMessage(parsed_data);
};

const preloadedState = {
  game: {
    introduction: ["Loading..."],
    rubric_sections: [],
    characters: [],
    scores: [],
    owners: [],
  },
  user: {
    can_draft: false,
    notifications: [
      {
        message: `Welcome to League of Thrones!`,
        key: `DraftNotice_0`,
        dismissAfter: 2000,
        action: "dismiss",
        onClick: (notification, deactivate) => {
          deactivate();
          removeNotification("DraftNotice");
        },
      },
    ],
    ws: ws,
  },
};
export const store = configureStore(preloadedState);
