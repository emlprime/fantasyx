import { LOGIN } from '../actions/types';
const INTIAL_STATE = { message: ''};

export default function (state = INTIAL_STATE, action) {
    switch(action.type) {
        case LOGIN:
            return { ...state, user_identifier: action.payload.user_identifier };
        default:
            return state
    }
}
