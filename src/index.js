import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import reducer from './store/reducer.js';
import App from './App';
//import C from './constants'
import {add_key, set_current_api_key} from './actions/actions_token';
import {add_workitem} from './actions/actions_workitems';
import registerServiceWorker from './registerServiceWorker';


const initialAppState = (localStorage['design-automation-app-keys'])?JSON.parse(localStorage['design-automation-app-keys']):null;
const initialWIState = (localStorage['design-automation-workitems'])?JSON.parse(localStorage['design-automation-workitems']):null;


const consoleMessage = store => next => action => {
    let result;
    console.groupCollapsed(`dispatching action => ${action.type}`);

    console.log(`Payload : ${JSON.stringify(action.payload)}`);
    result = next(action);

    console.groupEnd();

    return result;
};


const store = applyMiddleware(thunk,consoleMessage)(createStore)(
    reducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>,
    document.getElementById('root'));
registerServiceWorker();


window.store = store;


store.subscribe(()=> {
    const app_state = JSON.stringify(store.getState().app_keys);
    const wi_state = JSON.stringify(store.getState().workitems);
    localStorage['design-automation-app-keys'] = app_state;
    localStorage['design-automation-workitems'] = wi_state;
});



function init(dispatch) {
    if(initialAppState && initialAppState.list) {
        initialAppState.list.forEach((key) => dispatch(add_key(key.name,key.client_id, key.secret, key.environment)));
    }
    if(initialAppState && initialAppState.currentApp) {
        dispatch(set_current_api_key(initialAppState.currentApp));
    } else {
        let apps = store.getState().app_keys;
        if(apps.list.length) {
            dispatch(set_current_api_key(apps.list[0].client_id));
        }
    }

    if(initialWIState && initialWIState.list) {

        console.log(initialWIState.list);
        initialWIState.list.forEach((wi) => dispatch(add_workitem(wi.label, wi.client_id, wi.id, wi.payload, wi.da_status)));
    }
}

init(store.dispatch);

