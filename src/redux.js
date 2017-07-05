import {  
    applyMiddleware,
    combineReducers,
    createStore,
    compose,
} from 'redux';

import thunk from 'redux-thunk';
import persistState from 'redux-localstorage'

// actions.js

export const gotMsg = msg => {
    console.log(`got a message:`, msg);
    if(msg.user_data) {
        console.log(`setting user data`, msg);
        store.dispatch(gotUserData(msg.user_data))
    }
    if (msg.characters) {
        console.log(`setting characters`, msg);
        store.dispatch(gotCharacters(msg.characters))
    }
    if (msg.available_characters) {
        console.log(`setting available_characters`, msg);
        store.dispatch(gotAvailableCharacters(msg.available_characters))
    }
    if (msg.my_drafts) {
        console.log(`setting my_drafts`, msg);
        store.dispatch(gotAvailableCharacters(msg.my_drafts))
    }
};

export const loggedIn = user_identifier => ({  
    type: 'LOGGED_IN',
    user_identifier,
});

export const gotUserData = user_data => ({  
    type: 'USER_DATA',
    user_data,
});

export const gotCharacters = characters => ({  
    type: 'CHARACTERS',
    characters,
});

export const gotAvailableCharacters = available_characters => ({  
    type: 'AVAILABLE_CHARACTERS',
    available_characters,
});

export const gotMyDrafts = my_drafts => ({  
    type: 'MY_DRAFTS',
    my_drafts,
});

export const gotWebsocket = (ws) => ({  
    type: 'CONNECT_WEBSOCKET',
    ws
});

export const loggedOut = () => ({  
    type: 'LOGGED_OUT',
});

// reducers.js
export const user_data = (state={}, action) => {  
    console.log("handing action:", action.type);
    console.log("action:", action);
    switch (action.type) {
        case 'LOGGED_IN':
            let user_identifier = undefined;
            if(state.user_identifier) {
                user_identifier = state.user_identifier;
            } else if (action.user_identifier !== 'undefined') {
                user_identifier = action.user_identifier;
            }
            return {...state, user_identifier, characters: [], available_characters: [], my_drafts: []};
        case 'LOGGED_OUT':
            return {};
        case 'USER_DATA':
            return {...state, email: action.user_data.email};
        case 'CHARACTERS':
            return {...state, characters: action.characters};
        case 'AVAILABLE_CHARACTERS':
            return {...state, available_characters: action.available_characters};
        case 'MY_DRAFTS':
            return {...state, my_drafts: action.my_drafts};
        case 'CONNECT_WEBSOCKET':
            return {...state, ws: action.ws};
        default:
            return state;
    }
};

export const reducers = combineReducers({  
    user_data
});

// store.js
export function configureStore(initialState = {}) {  
    const enhancer = compose(
        applyMiddleware(thunk),
        persistState(),
    )
    const store = createStore(
        reducers,
        initialState,
        enhancer
    )
    return store;
};

export const store = configureStore();  
