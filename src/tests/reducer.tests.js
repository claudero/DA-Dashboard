import C from '../constants'
import appReducer from '../store/reducer'
import {
    add_key,
    remove_key,
    set_current_api_key,
    fetch_app_token,
    set_app_token,
    reset_app_token,
    fetch_activities,
    set_activities,
    fetch_engines,
    set_engines,
    fetch_apps,
    set_apps} from '../actions/actions_token'

let state = {};

console.log(JSON.stringify(state));

console.log("Add and remove apps, set current app");
state = appReducer(state, add_key('Key1','client_id1','secret1'));
state = appReducer(state, add_key('Key2','client_id2','secret2'));
state = appReducer(state, remove_key('client_id2'));
state = appReducer(state, add_key('Key3','client_id3','secret3'));
state = appReducer(state, set_current_api_key('client_id3'));
console.log(JSON.stringify(state));


console.log("fetch app_token");
state = appReducer(state, fetch_app_token());
console.log(JSON.stringify(state));


console.log("set app_token");
state = appReducer(state, set_app_token(null, 'token result'));
console.log(JSON.stringify(state));
state = appReducer(state, set_app_token('error fetching token', null));
console.log(JSON.stringify(state));

console.log("reset app_token");
state = appReducer(state, reset_app_token());
console.log(JSON.stringify(state));

console.log("delet app with token");
console.log("before");
state = appReducer(state, set_app_token(null, 'token result'));
console.log(JSON.stringify(state));
console.log("after");
state = appReducer(state, remove_key('client_id3'));
console.log(JSON.stringify(state));

console.log("fetch activities");
state = appReducer(state, fetch_activities());
console.log(JSON.stringify(state));

console.log("set activities errors");
state = appReducer(state, set_activities("my error"));
console.log(JSON.stringify(state));

console.log("set activities good");
state = appReducer(state, set_activities(null, ['activitiy 1']));
console.log(JSON.stringify(state));

console.log("fetch engines");
state = appReducer(state, fetch_engines());
console.log(JSON.stringify(state));

console.log("set engines errors");
state = appReducer(state, set_engines("my error"));
console.log(JSON.stringify(state));

console.log("set engines good");
state = appReducer(state, set_engines(null, ['engine 1']));
console.log(JSON.stringify(state));

console.log("fetch applications");
state = appReducer(state, fetch_apps());
console.log(JSON.stringify(state));

console.log("set application errors");
state = appReducer(state, set_apps("my error"));
console.log(JSON.stringify(state));

console.log("set application good");
state = appReducer(state, set_apps(null, ['activity 1']));
console.log(JSON.stringify(state));

console.log("reset app_token");
state = appReducer(state, reset_app_token());
console.log(JSON.stringify(state));


/*
console.log(`
    Initial state
    =============
    Apps:
    currentApp: ${state.apps.currentApp}
    list: ${JSON.stringify(state.apps.list)}
    count: ${state.apps.list.length}
    
    Engines
    engines: ${JSON.stringify(state.engines.list)}
    engines count: ${state.engines.list.length}
    engines loaded: ${state.engines.loaded}
    engines loading: ${state.engines.loading}
    engines error: ${state.engines.error}
  
    Applications
    list: ${JSON.stringify(state.applications.list)}
    count: ${state.applications.list.length}
    loaded: ${state.applications.loaded}
    loading: ${state.applications.loading}
    error: ${state.applications.error}

    Activities
    list: ${JSON.stringify(state.activities.list)}
    count: ${state.activities.list.length}
    loaded: ${state.activities.loaded}
    loading: ${state.activities.loading}
    error: ${state.activities.error}
    
    
`);*/

