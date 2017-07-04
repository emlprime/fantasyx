import {  
    applyMiddleware,
    combineReducers,
    createStore,
} from 'redux';

import thunk from 'redux-thunk';

// actions.js
export const loggedIn = user_identifier => ({  
    type: 'LOGGED_IN',
    user_identifier,
});

export const gotUserData = user_data => ({  
    type: 'USER_DATA',
    user_data,
});

export const gotAvailableCharacters = available_characters => ({  
    type: 'AVAILABLE_CHARACTERS',
    available_characters,
});

export const gotMyDrafts = my_drafts => ({  
    type: 'MY_DRAFTS',
    my_drafts,
});

export const loggedOut = () => ({  
    type: 'LOGGED_OUT',
});

// reducers.js
export const user_data = (state = {available_characters: [], my_drafts: []}, action) => {  
    console.log("handing action:", action.type);
    switch (action.type) {
        case 'LOGGED_IN':
            const socket = new WebSocket('ws://127.0.0.1:5000/test');
            socket.onmessage = function(evt){
                const parsed_data = JSON.parse(evt.data)
                console.log("evt got_user_data:", parsed_data);
                store.dispatch(gotUserData(parsed_data.user_data));
            }

            console.log("user_identifier:", action.user_identifier);
            const msg = JSON.stringify({type: 'user_data', user_identifier: action.user_identifier})
            socket.onopen = () => socket.send(msg);
            return {...state, user_identifier: action.user_identifier};
        case 'LOGGED_OUT':
            return {};
        case 'USER_DATA':
            return {...state, email: action.user_data.email};
        case 'AVAILABLE_CHARACTERS':
            return {...state, available_characters: action.available_characters};
        case 'MY_DRAFTS':
            return {...state, my_drafts: action.my_drafts};
        default:
            return state;
    }
};

export const reducers = combineReducers({  
    user_data
});

// store.js
export function configureStore(initialState = {}) {  
    const store = createStore(
        reducers,
        initialState,
        applyMiddleware(thunk)
    )
    return store;
};

export const store = configureStore();  
