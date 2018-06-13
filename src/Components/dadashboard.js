/*global PossibleStates, Props*/ // eslint-disable-line no-unused-vars
// @flow
import 'hig-react/lib/hig-react.css';
import React, { Component } from 'react';

import Applications from '../UI/Applications';
import Engines from '../UI/Engines';
import WorkItems from '../UI/WorkItems';
import ApplicationKeys from '../UI/ApplicationKeys';
import Activities from '../UI/Activities';
import OssStorage from '../UI/OssStorage';
import { GlobalNav, Toast} from 'hig-react';
import { fetch_engines } from '../actions/actions_engines';
import { fetch_activities } from '../actions/actions_activities';
import { fetch_applications } from '../actions/actions_applications';
import { add_key, set_current_api_key, remove_key } from '../actions/actions_token';
import { submit_workitem, remove_workitem, fetch_workitems } from '../actions/actions_workitems';
import { fetch_buckets, fetch_objects } from '../actions/actions_buckets';
import logo from '../images/logo.png';
import { connect} from 'react-redux';


const mapOssStorageStateToProps = (state) => {
    return {
        buckets : state.oss_storage.list,
        fetchFailure : state.oss_storage.error,
        fetching : state.oss_storage.loading,
        error: (state.oss_storage.error && state.oss_storage.error.message)?state.oss_storage.error.message:'Unknown error',
        loaded : state.oss_storage.loaded,
        token : state.app_keys.token
    };
};
const mapOssStorageDispatchToProps = (dispatch) => {
    return {
        fetch_buckets : () => dispatch(fetch_buckets()),
        fetch_objects : (bucket) => dispatch(fetch_objects(bucket))
    };
};

const mapAppStateToProps = (state) => {
    return {
        applications : state.app_keys.list,
        current_application : state.app_keys.currentApp
    };
};

const mapAppDispatchToProps = (dispatch) => {
    return {
        add_application : (n, c, s, e) => dispatch(add_key(n,c,s,e)),
        set_current_api_key : (c) => dispatch(set_current_api_key(c)),
        remove_application :  (c) => dispatch(remove_key(c))
    };
};

const mapEngineStateToProps = (state) => {
    return {
        engines : state.engines.list,
        fetchFailure : state.engines.error,
        fetching : state.engines.loading,
        error: (state.engines.error && state.engines.error.message)?state.engines.error.message:'Unknown error',
        loaded : state.engines.loaded,
        token : state.app_keys.token
    };
};
const mapEngineDispatchToProps = (dispatch) => {
    return {
        fetch : () => dispatch(fetch_engines())
    };
};
const mapActivityStateToProps = (state) => {
    return {
        activities : state.activities.list,
        fetchFailure : state.activities.error,
        fetching : state.activities.loading,
        error: (state.activities.error && state.activities.error.message)?state.activities.error.message:'Unknown error',
        loaded : state.activities.loaded,
        token : state.app_keys.token
    };
};
const mapActivityDispatchToProps = (dispatch) => {
    return {
        fetch : () => dispatch(fetch_activities())
    };
};
const mapApplicationStateToProps = (state) => {
    return {
        applications : state.applications.list,
        fetchFailure : state.applications.error,
        fetching : state.applications.loading,
        error: (state.applications.error && state.applications.error.message)?state.applications.error.message:'Unknown error',
        loaded : state.applications.loaded,
        token : state.app_keys.token
    };
};
const mapApplicationDispatchToProps = (dispatch) => {
    return {
        fetch : () => dispatch(fetch_applications())
    };
};

const mapWorkitemStateToProps = (state) => {
    return {
        workitems : state.workitems.list,
        activities : state.activities.list,
        client_id : state.app_keys.currentApp,
        activities_fetching : state.activities.loading,
        activities_error: state.activities.error,
        activities_loaded : state.activities.loaded,
        token : state.app_keys.token
    };
};

const mapWorkitemDispatchToProps = (dispatch) => {
    return {
        submit_workitem : (l, c, p) => dispatch(submit_workitem(l, c, p)),
        remove_workitem : (guid) => dispatch(remove_workitem(guid)),
        activities_fetch : () => dispatch(fetch_activities()),
        fetch_workitems : () => dispatch(fetch_workitems())
    };
};



const ApplicationKeysContainer = connect(mapAppStateToProps,mapAppDispatchToProps)(ApplicationKeys);
const EngineContainer = connect(mapEngineStateToProps, mapEngineDispatchToProps)(Engines);
const ApplicationContainer = connect(mapApplicationStateToProps, mapApplicationDispatchToProps)(Applications);
const ActivitiyContainer = connect(mapActivityStateToProps, mapActivityDispatchToProps)(Activities);
const WorkitemContainer = connect(mapWorkitemStateToProps, mapWorkitemDispatchToProps)(WorkItems);
const OssStorageContainer = connect(mapOssStorageStateToProps, mapOssStorageDispatchToProps)(OssStorage);


type Props = {
    applications?: Array,
    currentApplication?: String,
    token_error?: String,
    set_current_api_key?: Function,
    gotoPlayground: Function
};

const NAV = {
    DESIGN_AUTOMATION : 'DESIGN_AUTOMATION',
    APPLICATION_KEYS : 'APPLICATION_KEYS',
    WORKITEMS : 'WORKITEMS',
    PLAYGROUND : 'PLAYGROUND',
    STORAGE : 'STORAGE',
    ENGINES : 'ENGINES',
    APPLICATIONS : 'APPLICATIONS',
    ACTIVITIES : 'ACTIVITIES'
};


const modules = [
    { id: NAV.DESIGN_AUTOMATION, title: 'Design Automation', icon: 'settings' },
    { id: NAV.STORAGE, title: 'Storage', icon: 'archive' },
    { id: NAV.APPLICATION_KEYS, title: 'Application Keys', icon: 'settings' },
    { id: NAV.PLAYGROUND, title: 'Playground', icon: 'visible' },
];

const submodules = [
        { moduleId: NAV.DESIGN_AUTOMATION, id: NAV.WORKITEMS, title: 'Workitems' },
        { moduleId: NAV.DESIGN_AUTOMATION, id: NAV.ENGINES, title: 'Engines' },
        { moduleId: NAV.DESIGN_AUTOMATION, id: NAV.APPLICATIONS, title: 'Bundles' },
        { moduleId: NAV.DESIGN_AUTOMATION, id: NAV.ACTIVITIES, title: 'Activities' }
    ];


function getApplicationTableData(props) {

    //console.log('application list');
    //console.log(props.applications);

    //return props.applications.map( (key)=> { return Object.assign(key, { id : key.client_id, label : key.name, selected : props.current_application===key.client_id});});
    return props.applications.map( (key)=> { return Object.assign({}, key, { id : key.client_id, label : key.name, selected : props.currentApplication===key.client_id});});
}


class DADashboard extends Component<Props> {

    constructor(props) {
        super(props);
        this.state = {
            navigation : NAV.DESIGN_AUTOMATION
        };
    }

    static getDerivedStateFromProps(props, current_state) {

        let newState =
            Object.assign({}, current_state, {
            apps : getApplicationTableData(props)
        });

        return newState;
    }

    navigate = id => {
        this.setState({ navigation: id });
        if(id===NAV.PLAYGROUND){
            this.props.gotoPlayground();
        }
    };

    projectClicked = id => {
        console.log('project clicked', id);
        this.props.set_current_api_key(id);
    };

    render() {
        return (
            <GlobalNav  modules={modules}
                        submodules={submodules}
                        sideNav={{
                            superHeaderLabel: 'Autodesk',
                            headerLabel: 'Forge Console'
                        }}
                        sideNavOpen= {true}
                        showSubNav={true}
                        activeModuleId={this.state.navigation}
                        onModuleChange={this.navigate}
                        topNav={{
                            header: 'Autodesk',
                            headerLabel: 'Design Automation Console',
                            logo,
                            projectAccountSwitcher: {
                                projectTitle : 'Application Keys',
                                accountTitles : 'Accounts',
                                activeProjectId : this.props.currentApplication,
                                onProjectClick: (id) => {this.projectClicked(id)},
                                projects: this.state.apps,/*
                                accounts: [
                                    { label: 'My User Account', id: 'a1' }
                                ]*/
                            }
                        }}
                    >
                    <div>
                        {this.props.token_error &&
                        <Toast status={'danger'}>
                            Error retrieving Forge token
                        </Toast>
                        }

                    </div>

                    <div>

                        {
                            this.state.navigation === NAV.APPLICATION_KEYS &&
                            <ApplicationKeysContainer/>
                        }
                        {
                            (this.state.navigation === NAV.ENGINES) &&
                            <EngineContainer/>
                        }
                        {
                            this.state.navigation === NAV.ACTIVITIES &&
                            <ActivitiyContainer/>
                        }
                        {
                            this.state.navigation === NAV.APPLICATIONS &&
                            <ApplicationContainer/>
                        }
                        {
                            (this.state.navigation === NAV.WORKITEMS || this.state.navigation === NAV.DESIGN_AUTOMATION) &&
                            <WorkitemContainer/>
                        }
                        {
                            this.state.navigation === NAV.STORAGE &&
                            <OssStorageContainer/>
                        }
                    </div>
            </GlobalNav>
        );
    }
}

export default DADashboard;

