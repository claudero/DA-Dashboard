import C from '../constants';


const initialState = {
    loaded: false,
    loading: false,
    error: null,
    list: []
};

function extractActivityIdParts(str) {

    let split1 = str.split('.');
    let parts = {
        nickname : '',
        name : '',
        alias : ''
    };

    if(split1.length === 2) {
        parts.nickame = split1[0];

        let split2 = split1[1].split('+');

        if(split2.length === 2) {
            parts.name = split2[0];
            parts.alias = split2[1];
        }
    }

    return parts;

}

export const activities = (state=[], action) => {
    switch(action.type) {
        case C.SET_ACTIVITIES :
            return (action.payload.error)?[]:action.payload.list.map((activity) => {
                return {
                    ...activity,
                    id_parts : extractActivityIdParts(activity.id)

                };});
        default :
            return state;
    }
};

export default (state=initialState, action) => {
    switch(action.type) {
        case C.SET_ACTIVITIES :
            return Object.assign({},state, {list : activities(state.list, action), loaded : true, loading : false, error : action.payload.error});
        case C.FETCH_ACTIVITIES :
            return Object.assign({},state, {loaded : false, loading : true, error : null});
        case C.SET_TOKEN :
        case C.FETCH_TOKEN :
        case C.RESET_TOKEN :
        case C.RESET_ACTIVITIES :
        case C.SET_CURRENT_API_KEY :
            return initialState;
        default :
            return state;
    }
};


