import {FACEBOOK_LOGIN_FAIL, FACEBOOK_LOGIN_SUCCESS, NAVIGATE_TO_MAPS, TYPE_NOT_SPECIFIED} from "../actions/types";

const INITIAL_STATE = {token: null, user: {}, error: undefined};

export default function (state = INITIAL_STATE, action) {
    switch (action.type){
        case FACEBOOK_LOGIN_SUCCESS:
            return {...state, token: action.payload};
        case FACEBOOK_LOGIN_FAIL:
            return {...state, token:null, error: action.payload};
        case NAVIGATE_TO_MAPS:
            console.log(action.payload);
            return {...state, user: action.payload};
        case TYPE_NOT_SPECIFIED:
            return {...state, error: action.payload};
        default:
            return state;
    }
}