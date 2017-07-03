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

export const loggedOut = () => ({  
    type: 'LOGGED_OUT',
});

// reducers.js
export const user_data = (state = {}, action) => {  
    switch (action.type) {
        case 'LOGGED_IN':
            localStorage.setItem('user_identifier', action.user_identifier);
            
            return {...state, user_identifier: action.user_identifier};
        case 'LOGGED_OUT':
            return {};
        case 'USER_DATA':
            console.log("email:", action.user_data.email);
            return {...state, email: action.user_data.email};
        default:
            console.log("action:", action);
            const user_identifier = localStorage.getItem('user_identifier');
            console.log("user identifier is:", user_identifier);
            return {...state, user_identifier};
    }
};

export const reducers = combineReducers({  
    user_data,
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
