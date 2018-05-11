import C from '../constants';
import { combineReducers } from 'redux'

export const apikey = (state=null, action) => {
    if(action.type === C.ADD_API_KEY) {
        return action.payload;
    } else {
        return state;
    }
};

export const currentApp = (state=null, action) => {
    return state;
};


export const allapikeys = (state=[], action) => {

    console.log(action);
    console.log(state);

    switch(action.type) {
        case C.ADD_API_KEY :
            return [
                ...state,
                apikey(null, action)
            ];
        case C.REMOVE_API_KEY :
            return state.filter((apikey) => apikey.client_id !== action.payload);
        default :
            return state;
    }
};


export const fetching = (state=false, action) => {
    switch(action.type) {

        case C.FETCH_ACTIVITIES :
        {
            return true;
        }
        case C.FETCH_TOKEN :
        {
            return true;
        }
        case C.FETCH_ENGINES :
        {
            return true;
        }
        case C.FETCH_APPS :
        {
            return true;
        }
        default:
        return state;
    }
};

export const change = (state=false, action) => {
    switch(action.type) {

        case C.FETCH_ACTIVITIES :
        {
            return true;
        }
        case C.FETCH_TOKEN :
        {
            return true;
        }
        case C.FETCH_ENGINES :
        {
            return true;
        }
        case C.FETCH_APPS :
        {
            return true;
        }
        default:
            return state;
    }
};


export default combineReducers({
    apps: combineReducers({
        list : allapikeys,
        currentApp
    })
});