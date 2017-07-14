import {removeNotification} from './actions';

export const reducer = (state={}, action) => {  
    console.log("handing action:", action.type);
    console.log("action:", action);
    switch (action.type) {
    case 'USER_IDENTIFIER':
        if (state.user_identifier && !action.user_identifier) {
            console.log("clearing user identifier");
        }
        return {...state, user_identifier: action.user_identifier};
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
                message: `It is your turn to draft!`,
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
        console.log("setting web socket to state:", action.ws);
        return {...state, ws: action.ws};
    default:
        return state;
    }
};
