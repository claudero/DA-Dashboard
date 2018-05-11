import C from './constants'
import appReducer from './store/reducers'
import initialState from './intialStateL.json'

let state = initialState;
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

console.log(JSON.stringify(state.apps));

state = appReducer(state, {
    type : C.ADD_API_KEY,
    payload : {
        client_id : 'test apikey',
        secret : 'test secret',
        name : 'test application name'
    }
});

console.log(JSON.stringify(state.apps));
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

