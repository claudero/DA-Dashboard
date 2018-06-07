import api_keys from './reducers_apis_keys'
import activities from './reducers_activities'
import apps from './reducers_apps'
import engines from './reducers_engines'
import workitems from './reducers_workitems'
import { combineReducers } from 'redux';



export default combineReducers({
    app_keys : api_keys,
    activities,
    engines,
    applications : apps,
    workitems
});

