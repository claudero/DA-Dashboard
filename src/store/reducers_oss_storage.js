import C from '../constants';


const initialBucketState = {
    list : [],
    error : null,
    loaded : false,
    fetching : false
};



export const bucket = (state=initialBucketState, action) => {
    switch(action.type) {
        case C.ADD_BUCKET :
            return Object.assign( {}, state, { ...action.payload});
        case C.FETCH_BUCKET :
            return Object.assign({},state, { fetching : true});
        case C.ADD_OBJECTS :
            return Object.assign({},state, { fetching : false, loaded : true, list : action.payload.list});

        default :
            return state;
    }
};


const initialBucketListState = {
    list : [],
    error : null,
    fetching : false
};


export default (state=initialBucketListState, action) => {
    switch(action.type) {
        case C.SET_BUCKETS :
            return Object.assign({},state, { fetching : false,  loaded : true, list : action.payload.list.map( (b) => bucket(undefined, { type : C.ADD_BUCKET, payload : b}))});
        case C.FETCH_BUCKETS :
            return Object.assign({},state, { fetching : true});
        case C.ADD_OBJECTS :
            return Object.assign({},state, { fetching : false, list : [
                                            ...state.list.map((b) => b.bucketKey===action.payload.bucketKey?bucket(b,action):b),
                                            ]});
        default :
            return state;
    }
};


