import C from '../constants';
import fetch from 'isomorphic-fetch';
import {add_workitem} from "./actions_workitems";

export const reset_activities = () => {
    return {
        type: C.RESET_ACTIVITIES
    };
};

export const set_activities = (error,activities) => {
    return {
        type: C.SET_ACTIVITIES,
        payload: {
            error,
            list : activities
        }
    };
};

export const fetch_activities = () => (dispatch, getState) => {

    let app_keys = getState().app_keys;

    let app = app_keys.list.find((key) => key.client_id===app_keys.currentApp);

    if(!app) {
        return;
    }

    if(!app_keys.token) {
        console.log('no token setup');
        return;
    }

    if(getState().activities.loading===true) {
        console.log('already fetching activities');
        return;
    }


    dispatch({
        type: C.FETCH_ACTIVITIES
    });

    fetch('/api/activities', {
        method: 'GET',
        headers: {
            Authorization : 'Bearer ' + app_keys.token,
            environment : app_keys.environment
        }
    }).then(function (response){
        if(response.status === 200) {
            return response.json();
        } else {
            return Promise.reject(new Error('failed to get activities'));
        }
    }).then(function (object){
        dispatch(set_activities(null, object.activities));
    }).catch(function(err) {
        dispatch(set_activities(err,null));
    });
};


export const submit_activity = (payload)  => {

    return (dispatch, getState) => {

        let app_keys = getState().app_keys;

        let app = app_keys.list.find((key) => key.client_id === app_keys.currentApp);

        if (!app) {
            return;
        }

        if (!app_keys.token) {
            console.log('no token setup');
            return;
        }

        fetch('/api/activities', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + app_keys.token,
                environment: app_keys.environment
            },
            body: JSON.stringify(payload)
        }).then(function (response) {
            if (response.status === 200) {
                return response.json();
            } else {
                return Promise.reject(new Error('failed to create activity'));
            }
        }).then(function (status) {
            console.log(status);

            dispatch({
                type: C.RESET_ACTIVITIES,
            });

        }).catch(function (err) {
            console.log(err);
        });

    };
};



export const delete_activity = (activity) => {

    return (dispatch, getState) => {

        let app_keys = getState().app_keys;

        let app = app_keys.list.find((key) => key.client_id === app_keys.currentApp);

        if (!app) {
            return;
        }

        if (!app_keys.token) {
            console.log('no token setup');
            return;
        }

        fetch('/api/activities/' + activity, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + app_keys.token,
                environment: app_keys.environment
            }
        }).then(function (response) {
            if (response.status === 200) {
                dispatch({
                    type: C.RESET_ACTIVITIES,
                });
            } else {
                return Promise.reject(new Error('failed to delete activity'));
            }
        }).catch(function (err) {
            console.log(err);
        });

    };
};

