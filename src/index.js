import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import reducer from './store/reducer.js';
import App from './App';
import {add_key, reset_app_token, fetch_app_token, set_current_api_key} from './actions/actions_token';
import registerServiceWorker from './registerServiceWorker';


const initialState = (localStorage['redux-store'])?JSON.parse(localStorage['redux-store']):null;


const consoleMessage = store => next => action => {
    let result;
    console.groupCollapsed(`dispatching action => ${action.type}`);

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
    const state = JSON.stringify(store.getState().app_keys);
    localStorage['redux-store'] = state;
});



function init(dispatch) {
    if(initialState && initialState.list) {
        initialState.list.map((key) => dispatch(add_key(key.name,key.client_id, key.secret)));
    }
    dispatch(reset_app_token());
    if(initialState.currentApp) {
        dispatch(set_current_api_key(initialState.currentApp));
        dispatch(fetch_app_token());
    }
}

init(store.dispatch);

