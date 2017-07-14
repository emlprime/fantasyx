import {  
    applyMiddleware,
    combineReducers,
    createStore,
    compose,
} from 'redux';

import thunk from 'redux-thunk';
import {persistStore, autoRehydrate} from 'redux-persist'

// actions.js

import {
    gotUserIdentifier,
    gotUserData,
    gotCharacters,
    gotAvailableCharacters,
    gotScores,
    gotMyDrafts,
    gotCanDraft,
    loggedOut,
    removeNotification,
} from './actions';
import {
    reducer
} from './reducers';

export const gotMsg = msg => {
    console.log(`got a message:`, msg);
    if(msg.user_identifier) {
        store.dispatch(gotUserIdentifier(msg.user_identifier))
    }
    if(msg.user_data) {
        store.dispatch(gotUserData(msg.user_data))
    }
    if (msg.characters) {
        store.dispatch(gotCharacters(msg.characters))
    }
    if (msg.available_characters) {
        store.dispatch(gotAvailableCharacters(msg.available_characters))
    }
    if (msg.my_drafts) {
        store.dispatch(gotMyDrafts(msg.my_drafts))
    }
    if (msg.scores) {
        store.dispatch(gotScores(msg.scores))
    }
    if (typeof msg.can_draft !== 'undefined') {
        console.log("doing can draft");
        store.dispatch(gotCanDraft(msg.can_draft))
    }
};

export function configureStore(preloadedState = {}) {
    console.log("starting app with preloadedState:", preloadedState);
    const enhancer = compose(
        applyMiddleware(thunk),
        // autoRehydrate(),
    )
    
    const store = createStore(
        reducer,
        preloadedState,
        enhancer,
    )
    // persistStore(store);
    return store;
};

const ws = new WebSocket('ws://lot.emlprime.com/api/test');
ws.onmessage = function(evt){
    console.log("evt with data:", evt);
    const parsed_data = JSON.parse(evt.data)
    gotMsg(parsed_data);
}

const preloadedState = {
    characters: [],
    available_characters: [],
    my_drafts: [],
    can_draft: false,
    notifications: [{
                message: `Welcome to League of Thrones!`,
                key: `DraftNotice_0`,
                dismissAfter: 2000,
                action: 'dismiss',
                onClick: (notification, deactivate) => {
                    deactivate();
                    removeNotification('DraftNotice');
                },
            }],
    scores: {data: []},
    ws: ws,
}
export const store = configureStore(preloadedState);                

