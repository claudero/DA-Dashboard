import C from '../constants';


const initialState = {
    list : [],
    fetching : false,
    token : null,
    currentApp : null,
    error : null
};

export const apikey = (state=null, action) => {
    if(action.type === C.ADD_API_KEY) {
        return action.payload;
    } else {
        return state;
    }
};

export const apikeys = (state=[], action) => {
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

export default (state=initialState, action) => {
    switch(action.type) {
        case C.ADD_API_KEY :
            return Object.assign({},state, {list : apikeys(state.list, action), currentApp: (state.currentApp===null)? action.payload.client_id:state.currentApp});
        case C.REMOVE_API_KEY :
            if(action.payload === state.currentApp) {
                return Object.assign({},state, {list : apikeys(state.list, action), token : null, currentApp : null, fetching : null, error : null});

            } else {
                return Object.assign({},state, {list : apikeys(state.list, action)});
            }
        case C.SET_CURRENT_API_KEY :
            return Object.assign({},state, { currentApp: action.payload, token: null , fetching : false , error : null});
        case C.SET_TOKEN :
            return Object.assign({},state, { token: action.payload.token , error : action.payload.error, fetching : false});
        case C.FETCH_TOKEN :
            return Object.assign({},state, { fetching : true});
        case C.RESET_TOKEN :
            return Object.assign({},state, { fetching : false, token : null, error: null});
        default :
            return state;
    }
};


