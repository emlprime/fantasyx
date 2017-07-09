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
    /* console.log(`got a message:`, msg);*/
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
        store.dispatch(gotCanDraft(msg.can_draft))
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

export const gotScores = scores => ({  
    type: 'SCORES',
    scores,
});

export const gotMyDrafts = my_drafts => ({  
    type: 'MY_DRAFTS',
    my_drafts,
});

export const gotCanDraft = can_draft => ({  
    type: 'CAN_DRAFT',
    can_draft,
});

export const gotWebsocket = (ws) => ({  
    type: 'CONNECT_WEBSOCKET',
    ws
});

export const loggedOut = () => ({  
    type: 'LOGGED_OUT',
});

export const removeNotification = key => ({
    type: 'REMOVE_NOTIFICATION',
    key
});

// reducers.js
export const user_data = (state={}, action) => {  
    /* console.log("handing action:", action.type);
     * console.log("action:", action);*/
    switch (action.type) {
        case 'LOGGED_IN':
            let user_identifier = undefined;
            if(state.user_identifier) {
                user_identifier = state.user_identifier;
            } else if (action.user_identifier !== 'undefined') {
                user_identifier = action.user_identifier;
            }
            return {...state, user_identifier, characters: [], available_characters: [], my_drafts: [], can_draft: false, notifications: [], scores: {data: []}};
        case 'LOGGED_OUT':
            return {};
        case 'USER_DATA':
            return {...state, email: action.user_data.email};
        case 'CHARACTERS':
            return {...state, characters: action.characters};
        case 'SCORES':
            return {...state, scores: action.scores};
        case 'AVAILABLE_CHARACTERS':
            return {...state, available_characters: action.available_characters};
        case 'MY_DRAFTS':
            console.log("got my drafts");
            return {...state, my_drafts: action.my_drafts};
        case 'REMOVE_NOTIFICATION':
            console.log("removing notification");
            let notifications = [];
            if(state.notifications) {
                notifications = state.notifications.filter(notification => notification.key !== action.key);
            } 
            return {...state, notifications};
        case 'CAN_DRAFT':
            console.log("got can draft", state.notifications.length,state.can_draft, action.can_draft);
            if( (state.can_draft !== action.can_draft) && action.can_draft ) {
                notifications = [...state.notifications, {
                    message: `It's your turn to draft!`,
                    key: `DraftNotice_${state.notifications.length + 1}`,
                    dismissAfter: 2000,
                    action: 'dismiss',
                    onClick: (notification, deactivate) => {
                        deactivate();
                        removeNotification('DraftNotice');
                    },
                }];
            } else {
                notifications = [...state.notifications];
            }
            return {...state, can_draft: action.can_draft, notifications};
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
