/*global Props*/ // eslint-disable-line no-unused-vars
// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import DADashboard from './dadashboard';
import Playground from './playground';

//import './css/containers.css';

type Props = {
    dispatch: Function,
    module: string,
    submodule: string,
    token: string
};


let myApplicationData = {
    apps : [
        {
            name : 'MyApp1',
            client_id : 'asdfasd',
            secret : 'asdfasdf'
        },
        {
            name : 'MyApp2',
            client_id : 'asdfasd',
            secret : 'asdfasdf'
        }
    ],
    currentApp : 0
};




class App extends Component<Props> {

/*    gotToken(token) {
        this.props.dispatch({type: 'GOT_TOKEN', token : token});
    }

  */
    exitPlayground() {
        this.props.dispatch({type: 'DA_HOME'});
    }
    gotoPlayground() {
        this.props.dispatch({type: 'PLAYGROUND_HOME'});
    }


    render() {
        console.log("app props");
        console.log(this.props);
        return (
            <div>
                {
                    this.props.module === 'ReferencePlayground' &&
                    <Playground
                        onExitPlayground = { () => this.exitPlayground()}
                    />
                }
                {
                    this.props.module !== 'ReferencePlayground' &&
                    <DADashboard
                        name="Design Automation Dashboard"
                        module={this.props.module}
                        submodule={this.props.submodule}
                        gotoPlayground={ () => this.gotoPlayground()}
                    />
                }
            </div>
        );
    }
}

const mapStateToProps = state => {
    return state;
};

export default connect(mapStateToProps)(App);
