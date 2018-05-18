import C from '../constants';
import fetch from 'isomorphic-fetch';

export const reset_engines = () => {
    return {
        type: C.RESET_ENGINES
    };
};

export const set_engines = (error,engines) => {
    return {
        type: C.SET_ENGINES,
        payload: {
            error,
            list : engines
        }
    };
};

export const fetch_engines = () => (dispatch, getState) => {

    let app_keys = getState().app_keys;

    let app = app_keys.list.find((key) => key.client_id===app_keys.currentApp);

    if(!app) {
        return;
    }

    if(!app_keys.token) {
        console.log('no token setup');
        return;
    }

    if(getState().engines.loading) {
        console.log('already fetching engines');
        return;
    }

    dispatch({
        type: C.FETCH_ENGINES
    });

    fetch('/api/getengines', {
        method: 'GET',
        headers: {
            Authorization : 'Bearer ' + app_keys.token,
            environment : app_keys.environment
        }
    }).then(function (response){
        if(response.status === 200) {
            return response.json();
        } else {
            return Promise.reject(new Error('failed to get engines'));
        }
    }).then(function (object){
        dispatch(set_engines(null, object.engines));
    }).catch(function(err) {
        dispatch(set_engines(err,null));
    });
};

