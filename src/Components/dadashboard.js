/*global PossibleStates, Props*/ // eslint-disable-line no-unused-vars
// @flow
import 'hig-react/lib/hig-react.css';
import React, { Component } from 'react';

import Applications from '../UI/Applications';
import Engines from '../UI/Engines';
import WorkItems from '../UI/WorkItems';
import ApplicationKeys from '../UI/ApplicationKeys';
import Activities from '../UI/Activities';
import { GlobalNav, } from 'hig-react';
import { fetch_engines } from '../actions/actions_engines';
import { fetch_activities } from '../actions/actions_activities';
import { fetch_applications } from '../actions/actions_applications';
import { add_key, set_current_api_key, remove_key } from '../actions/actions_token';
import logo from "../images/logo.png";
import { connect} from 'react-redux';


const mapAppStateToProps = (state) => {
    return {
        applications : state.app_keys.list,
        current_application : state.app_keys.currentApp
    };
};

const mapAppDispatchToProps = (dispatch) => {
    return {
        add_application : (n,c, s) => dispatch(add_key(n,c,s)),
        set_current_api_key : (c) => dispatch(set_current_api_key(c)),
        remove_application :  (c) => dispatch(remove_key(c))
    };
};

const mapEngineStateToProps = (state) => {
    return {
        engines : state.engines.list,
        fetching : state.engines.loading,
        error: state.engines.error,
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
        fetching : state.activities.loading,
        error: state.activities.error,
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
        fetching : state.applications.loading,
        error: state.applications.error,
        loaded : state.applications.loaded,
        token : state.app_keys.token
    };
};
const mapApplicationDispatchToProps = (dispatch) => {
    return {
        fetch : () => dispatch(fetch_applications())
    };
};

const ApplicationKeysContainer = connect(mapAppStateToProps,mapAppDispatchToProps)(ApplicationKeys);
const EngineContainer = connect(mapEngineStateToProps, mapEngineDispatchToProps)(Engines);
const ApplicationContainer = connect(mapApplicationStateToProps, mapApplicationDispatchToProps)(Applications);
const ActivitiyContainer = connect(mapActivityStateToProps, mapActivityDispatchToProps)(Activities);


type Props = {
    gotoPlayground: Function,
};

const NAV = {
    COMPONENTS : 'COMPONENTS',
    APPLICATION_KEYS : 'APPLICATION_KEYS',
    WORKITEMS : 'WORKITEMS',
    PLAYGROUND : 'PLAYGROUND',
    ENGINES : 'ENGINES',
    APPLICATIONS : 'APPLICATIONS',
    ACTIVITIES : 'ACTIVITIES'
};


const modules = [
    { id: NAV.COMPONENTS, title: 'Components', icon: 'settings' },
    { id: NAV.APPLICATION_KEYS, title: 'Application Keys', icon: 'assets' },
    { id: NAV.WORKITEMS, title: 'Workitems', icon: 'assets' },
    { id: NAV.PLAYGROUND, title: 'Playground', icon: 'assets' },
];

const submodules = [
        { moduleId: NAV.COMPONENTS, id: NAV.ENGINES, title: 'Engines' },
        { moduleId: NAV.COMPONENTS, id: NAV.APPLICATIONS, title: 'Apps' },
        { moduleId: NAV.COMPONENTS, id: NAV.ACTIVITIES, title: 'Activities' }
    ];


class DADashboard extends Component<Props> {

    constructor(props) {
        super(props);
        this.state = {
            navigation : NAV.ENGINES
        };
    }

    navigate = id => {
        this.setState({ navigation: id });
        if(id===NAV.PLAYGROUND){
            this.props.gotoPlayground();
        }
    };

    render() {
        return (
            <GlobalNav  modules={modules}
                        submodules={submodules}
                        sideNav={{
                            superHeaderLabel: 'Autodesk',
                            headerLabel: 'Design Automation Console'
                        }}
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
                                projects: this.state.applicationKeys/*,
                                accounts: [
                                    { label: 'My User Account', id: 'a1' }
                                ]*/
                            }
                        }}
                    >
                    <div>
                        {
                            this.state.navigation === NAV.APPLICATION_KEYS &&
                            <ApplicationKeysContainer/>
                        }
                        {
                            (this.state.navigation === NAV.ENGINES || this.state.nav === NAV.COMPONENTS) &&
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
                            this.state.navigation === NAV.WORKITEMS &&
                            <WorkItems/>
                        }
                    </div>
            </GlobalNav>
        );
    }
}

export default DADashboard;

