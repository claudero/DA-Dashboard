/*global PossibleStates, Props*/ // eslint-disable-line no-unused-vars
// @flow
//import 'bootstrap/dist/css/bootstrap.css';
//import 'bootstrap/dist/css/bootstrap-theme.css';
import 'hig-react/lib/hig-react.css';
//import './css/containers.css';
import React, { Component } from 'react';

//import { Row, Grid, Panel } from 'react-bootstrap';
import TitleLine from './SubComponents/TitleLine';
import Applications from './SubComponents/Applications';
import Engines from './SubComponents/Engines';
import Activities from './SubComponents/Activities';
import GetTokenBlock from './SubComponents/getappcredentials';
import { GlobalNav, Dropdown, Checkbox, TextField } from 'hig-react';

type Props = {
    module: string,
    submodule: string,
    appData : Object,
    gotoPlayground: Function,
};

const modules = [
    { id: '1', title: 'Components', icon: 'settings' },
    { id: '2', title: 'Workitems', icon: 'assets' },
    { id: '3', title: 'Playground', icon: 'assets' },
];

const submodules = [
        { moduleId: '1', id: 'Engines', title: 'Engines' },
        { moduleId: '1', id: 'Applications', title: 'Apps' },
        { moduleId: '1', id: 'Activities', title: 'Activities' }
    ];


class DADashboard extends Component<Props> {

    constructor(props) {
        super(props);
        this.state = {
            moduleId : 'Engines',
            hasToken: false,
            failedLogin: false,
            token: undefined,
            needLoading: true,
            fetchFailure: false,
            engines: [],
            packages: [],
            activities: []
        };
    }

    getToken (appid, secret) {

        let self = this;

        fetch('/api/getAppToken?client_id=' + encodeURIComponent(appid) + '&client_secret=' + encodeURIComponent(secret) + '&token=sasd')
        .then(function (response) {
            if(response.status === 200) {
                return response.text();
            } else {
                return Promise.reject(new Error('failed to get token'));
            }
        })
        .then(function (token) {
            self.props.gotToken(token);
        })
        .catch(function() {
            self.setState({failedLogin : true});
        });
    }

    loadData () {
        let self = this;
        if(this.state.needLoading && this.props.token) {
            console.log('need loading');
            fetch('/api/getDADetails', {
                method: 'GET',
                headers: {
                    Authorization : 'Bearer ' + this.props.token
                }
            }).then(function (response){
                if(response.status === 200) {
                    return response.json();
                } else {
                    return Promise.reject(new Error('failed to get token'));
                }
            })
            .then(function (object){
                self.setState({
                    engines : object.engines,
                    activities : object.activities,
                    packages : object.packages,
                    needLoading: false
                });
            })
            .catch(function(err) {
                self.setState({
                    fetchFailure : true,
                    needLoading: false
                });
                console.log(err);
            });
        }
        return true;

    }


    navigate = id => {
        console.log("Go to", id);
        this.setState({ moduleId: id });



        if(id==='3'){
            this.props.gotoPlayground();
        }
    };

    static getDerivedStateFromProps(props, current_state) {
        return {
            token : props.token,
            needLoading : true,
            applicationKeys : props.appData.apps.map(function (app,id) {
                return {
                    label: app.name,
                    id : id.toString()
                };
            })
        };
    }
    render() {
        console.log(this.state.applicationKeys);
        return (
            <GlobalNav  modules={modules}
                        submodules={submodules}
                        sideNav={{
                            superHeaderLabel: "Autodesk",
                            headerLabel: "Design Automation Console"
                        }}
                        showSubNav={true}
                        activeModuleId={this.state.moduleId}
                        onModuleChange={this.navigate}
                        topNav={{
                            header: "Autodesk",
                            headerLabel: "Design Automaiton Console",
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
                            this.props.state === 'notoken' &&
                                <GetTokenBlock getToken={(app,secret) => this.getToken(app,secret)} failed={this.state.failedLogin}/>
                        }
                        {
                            this.state.moduleId === 'Engines' &&
                            <Engines fetchFailure={this.state.fetchFailure} engines={this.state.engines}/>
                        }
                        {
                            this.state.moduleId === 'Activities' &&
                            <Activities fetchFailure={this.state.fetchFailure} activities={this.state.activities}/>
                        }
                        {
                            this.state.moduleId === 'Applications' &&
                            <Applications fetchFailure={this.state.fetchFailure} packages={this.state.packages}/>
                        }
                    </div>
            </GlobalNav>
        );
    }
}

export default DADashboard;

