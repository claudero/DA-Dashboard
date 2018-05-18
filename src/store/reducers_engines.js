import C from '../constants';


const initialState = {
    loaded: false,
    loading: false,
    error: false,
    list: []
};

export const engines = (state=[], action) => {
    switch(action.type) {
        case C.SET_ENGINES :

            return (action.payload.error)?[]:action.payload.list;
        default :
            return state;
    }
};

export default (state=initialState, action) => {
    switch(action.type) {
        case C.SET_ENGINES :
            return Object.assign({},state, {list : engines(state.list, action), loaded : true, loading : false, error : action.payload.error});
        case C.FETCH_ENGINES :
            return Object.assign({},state, {loaded : false, loading : true, error : null});
        case C.RESET_ENGINES :
        case C.SET_TOKEN :
        case C.FETCH_TOKEN :
        case C.RESET_TOKEN :
        case C.SET_CURRENT_API_KEY :
            return initialState;
        default :
            return state;
    }
};


