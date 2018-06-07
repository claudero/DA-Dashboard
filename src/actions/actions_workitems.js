import C from '../constants';
import fetch from 'isomorphic-fetch';

const fetch_timeout = 2000;


function shouldFetchWI(dispatch, getState, wi) {
    if(!wi) {
        //wi does not exist
        return false;
    }

    if(wi.fetching) {
        return false;
    }

    let app_keys = getState().app_keys;

    if(!app_keys.token || (app_keys.currentApp !== wi.client_id)) {
        // Not in a state to start fetching for this item
        return false;
    }

    if(wi.da_status.status!=='pending') {
        return false;
    }

    return true;
}

function fetchWI(dispatch, getState, wi) {

    dispatch({
        type: C.FETCH_WORKITEM,
        payload: {
            id: wi.id
        }
    });

    setTimeout(() => {
        checkWorkitemStatus(dispatch, getState, wi.id);
    }, 0);
}
function continueFetchWI(dispatch, getState, wi) {
    let app_keys = getState().app_keys;

    if (!app_keys.token || (app_keys.currentApp !== wi.client_id)) {
        // Not in a state to start fetching for this item
        return false;
    }
    return true;
}



function checkWorkitemStatus(dispatch, getState, id) {

    let app_keys = getState().app_keys;
    // Get the work item
    let wi = getState().workitems.list.find((wi) => wi.id===id);

    if(!continueFetchWI(dispatch,getState, wi)) {
        // No need to fetch the work item, we don't have the proper token
        dispatch({
            type: C.STOPFETCH_WORKITEM,
            payload: {
                id
            }
        });
        return;
    }

    fetch('/api/workitem/' + id, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + app_keys.token,
            environment: app_keys.environment
        },
    }).then(function (response) {
        if (response.status === 200) {
            return response.json();
        } else {
            return Promise.reject(new Error('failed to get applications'));
        }
    }).then(function (object) {

        dispatch(update_workitem(id, object));

        if(object.status === 'pending') {
            setTimeout(() => {
                checkWorkitemStatus(dispatch, getState, id);
            },fetch_timeout);
        }

    }).catch(function (err) {
        console.log(err);
        setTimeout(() => {
            checkWorkitemStatus(dispatch, getState, id);
        },fetch_timeout);
    });
}

export const add_workitem = (label, client_id, id, payload, da_status) => (dispatch, getState) => {

    dispatch({
        type: C.ADD_WORKITEM,
        payload: {
            client_id,
            label,
            id,
            payload,
            da_status
        }
    });


    let wi = getState().workitems.list.find((wi) => wi.id===id);

    if(shouldFetchWI(dispatch,getState, wi)){
        fetchWI(dispatch, getState, wi);
    }


};

export const submit_workitem = (label,client_id, payload) => (dispatch, getState) => {

    let app_keys = getState().app_keys;

    let app = app_keys.list.find((key) => key.client_id===app_keys.currentApp);

    if(!app) {
        return;
    }

    if(!app_keys.token) {
        console.log('no token setup');
        return;
    }

    fetch('/api/workitem', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization : 'Bearer ' + app_keys.token,
            environment : app_keys.environment
        },
        body : JSON.stringify(payload)
    }).then(function (response){
        if(response.status === 200) {
            return response.json();
        } else {
            return Promise.reject(new Error('failed to get applications'));
        }
    }).then(function (status){
        console.log(status);

        dispatch(add_workitem(label, client_id, status.id, payload, status));

    }).catch(function(err) {
        console.log(err);
    });

};

export const remove_workitem = (id) => {
    return {
        type: C.REMOVE_WORKITEM,
        payload: id
    };
};


export const update_workitem = (id, da_status) => {
    return {
        type: C.UPDATE_WORKITEM,
        payload: {
            id,
            da_status
        }
    };
};

export const fetch_workitems = () => (dispatch, getState) => {

    let list = getState().workitems.list;
    if(!list) {
        return;
    }
    console.log("fetch item loop");
    list.forEach((wi) => {
        console.log(wi);

        if(shouldFetchWI(dispatch,getState,wi)) {
            fetchWI(dispatch,getState,wi);
        }
    });
};

