import C from '../constants';
import fetch from 'isomorphic-fetch';


export const set_buckets = (error, buckets) => {
    return {
        type: C.SET_BUCKETS,
        payload: {
            list : buckets,
            error
        }
    };
};


export const add_objects = (error, bucketKey, objects) => {
    return {
        type: C.ADD_OBJECTS,
        payload: {
            bucketKey,
            list : objects,
            error
        }
    };
};


export const fetch_buckets = () => (dispatch, getState) => {

    let app_keys = getState().app_keys;

    let app = app_keys.list.find((key) => key.client_id===app_keys.currentApp);

    if(!app) {
        return;
    }

    if(!app_keys.token) {
        console.log('no token setup');
        return;
    }

    if(getState().oss_storage.loading) {
        console.log('already fetching buckets');
        return;
    }

    dispatch({
        type: C.FETCH_BUCKETS
    });

    fetch('/api/buckets', {
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
        console.log(object);

        dispatch(set_buckets(null, object.body.items.map((bucket) => { return Object.assign({}, bucket, { id : bucket.bucketKey, createdDate: new Date(bucket.createdDate).toString()});})));
    }).catch(function(err) {
        dispatch(set_buckets(err,null));
    });
};



export const fetch_objects = (bucket) => {

    console.log(bucket);
    return (dispatch, getState) => {

        let app_keys = getState().app_keys;

        let app = app_keys.list.find((key) => key.client_id===app_keys.currentApp);

        if(!app) {
            return;
        }


        if(!app_keys.token) {
            console.log('no token setup');
            return;
        }

        if(bucket.fetching) {
            console.log('already fetching objects');
            return;
        }

        if(bucket.loaded) {
            console.log('already loaded objects');
            return;
        }


        dispatch({
            type: C.FETCH_BUCKET,
            payload : bucket

        });

        fetch('/api/objects/' + bucket.bucketKey, {
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
            console.log(object);
            dispatch(add_objects(null, bucket.bucketKey, object.body.items));
        }).catch(function(err) {
            dispatch(add_objects(err, bucket.bucketKey, []));
        });
    };
};
