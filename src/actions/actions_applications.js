import C from '../constants';
import fetch from 'isomorphic-fetch';

export const reset_applications = () => {
    return {
        type: C.RESET_APPS
    };
};

export const set_applications = (error,applications) => {
    return {
        type: C.SET_APPS,
        payload: {
            error,
            list : applications
        }
    };
};

export const fetch_applications = () => (dispatch, getState) => {

    let app_keys = getState().app_keys;

    let app = app_keys.list.find((key) => key.client_id===app_keys.currentApp);

    if(!app) {
        return;
    }

    if(!app_keys.token) {
        console.log('no token setup');
        return;
    }

    if(getState().applications.loading) {
        console.log('already fetching applications');
        return;
    }

    dispatch({
        type: C.FETCH_APPS
    });

    fetch('/api/getapplications', {
        method: 'GET',
        headers: {
            Authorization : 'Bearer ' + app_keys.token,
            environment : app_keys.environment
        }
    }).then(function (response){
        if(response.status === 200) {
            return response.json();
        } else {
            return Promise.reject(new Error('failed to get applications'));
        }
    }).then(function (object){
        dispatch(set_applications(null, object.applications));
    }).catch(function(err) {
        dispatch(set_applications(err,null));
    });
};

