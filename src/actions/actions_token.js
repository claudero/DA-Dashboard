import C from '../constants';
import fetch from 'isomorphic-fetch';



export const add_key = (name, client_id, secret) => {
    return {
        type: C.ADD_API_KEY,
        payload: {
            client_id,
            secret,
            name
        }
    };
};

export const remove_key = (client_id) => {
    return {
        type: C.REMOVE_API_KEY,
        payload: client_id
    };
};


export const set_current_api_key = (client_id) => {
    return {
        type: C.SET_CURRENT_API_KEY,
        payload: client_id
    };
};


export const set_app_token = (error,token) => {
    return {
        type: C.SET_TOKEN,
        payload: {
            error,
            token
        }
    };
};

export const fetch_app_token = () => (dispatch, getState) => {

    let app_keys = getState().app_keys;

    let app = app_keys.list.find((key) => key.client_id===app_keys.currentApp);

    if(!app) {
        return;
    }

    dispatch({
        type: C.FETCH_TOKEN
    });


    fetch('/api/getAppToken?client_id=' + encodeURIComponent(app.client_id) + '&client_secret=' + encodeURIComponent(app.secret) + '&token=sasd')
            .then(function (response) {
                if(response.status === 200) {
                    return response.text();
                } else {
                    return Promise.reject(new Error('failed to get token'));
                }
            })
            .then(function (token) {
                dispatch(set_app_token(null, token));
            })
            .catch(function() {
                dispatch(set_app_token("failue to get token"));
            });
};

export const reset_app_token = () => {
    return {
        type: C.RESET_TOKEN,
    };
};

export const fetch_activities = () => {
    return {
        type: C.FETCH_ACTIVITIES,
    };
};

export const set_activities = (error,activities) => {
    return {
        type: C.SET_ACTIVITIES,
        payload : {
            error,
            list: activities
        }
    };
};

export const fetch_engines = () => {
    return {
        type: C.FETCH_ENGINES,
    };
};

export const set_engines = (error,engines) => {
    return {
        type: C.SET_ENGINES,
        payload : {
            error,
            list: engines
        }
    };
};

export const fetch_apps = () => {
    return {
        type: C.FETCH_ENGINES,
    };
};

export const set_apps = (error,apps) => {
    return {
        type: C.SET_APPS,
        payload : {
            error,
            list: apps
        }
    };
};



