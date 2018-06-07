import C from '../constants';

/*
function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = Math.random() * 16 | 0;
        let v = (c === 'x') ? r : ((r & 0x3) | 0x8);
        return v.toString(16);
    });
}*/


const initialState_WorkItem = {
    guid : null,
    id : null,
    label:  null,
    da_status : null,
    fetching : false,
    client_id : null,
    payload : {}
};



const initialState_WorkItemList = {
    list : []
};

export const workitem = (state=initialState_WorkItem, action) => {
    switch(action.type) {
        case C.ADD_WORKITEM:
            return Object.assign({}, state, action.payload);
        case C.FETCH_WORKITEM :
            return Object.assign({}, state, { fetching : true, errors : []});
        case C.STOPFETCH_WORKITEM :
            return Object.assign({}, state, { fetching : false, errors : []});
        case C.UPDATE_WORKITEM :
            return Object.assign({}, state, { errors : action.payload.errors || [], da_status : action.payload.da_status});
        default :
            return state;
    }
};

export const workitems = (state=[], action) => {
    switch(action.type) {
        case C.ADD_WORKITEM :
            return [
                ...state,
                workitem(null, action)
            ];
        case C.REMOVE_WORKITEM :
            return state.filter((wi) => wi.id !== action.payload);
        case C.FETCH_WORKITEM :
        case C.STOPFETCH_WORKITEM :
        case C.UPDATE_WORKITEM :
            return state.map((wi) => wi.id === action.payload.id? workitem(wi,action): wi);
        default :
            return state;
    }
};

export default (state=initialState_WorkItemList, action) => {
    switch(action.type) {
        case C.ADD_WORKITEM :
        case C.REMOVE_WORKITEM :
        case C.FETCH_WORKITEM :
        case C.STOPFETCH_WORKITEM :
        case C.UPDATE_WORKITEM :
            return Object.assign({},state, {list : workitems(state.list, action)});
        default :
            return state;
    }
};


