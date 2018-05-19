import C from '../constants';
import fetch from 'isomorphic-fetch';



export const add_key = (name, client_id, secret, environment) => {
    return {
        type: C.ADD_API_KEY,
        payload: {
            client_id,
            secret,
            name,
            environment
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


export const set_app_token = (error,token, environment) => {
    return {
        type: C.SET_TOKEN,
        payload: {
            error,
            token,
            environment
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

    fetch('/api/getAppToken?client_id=' + encodeURIComponent(app.client_id) + '&client_secret=' + encodeURIComponent(app.secret) + '&environment=' + encodeURIComponent(app.environment)+ '&token=sasd')
            .then(function (response) {
                if(response.status === 200) {
                    return response.text();
                } else {
                    return Promise.reject(new Error('failed to get token'));
                }
            })
            .then(function (token) {
                dispatch(set_app_token(null, token, app.environment));
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
