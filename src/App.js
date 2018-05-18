/*global Props*/ // eslint-disable-line no-unused-vars
// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import DADashboard from './Components/dadashboard';
import Playground from './playground';
import { set_current_api_key, fetch_app_token } from './actions/actions_token';


const mapAppStateToProps = (state, ownProps) => {
    return {
        applications : state.app_keys.list,
        currentApplication : state.app_keys.currentApp,
        token_error : state.app_keys.error,
        gotoPlayground : ownProps.gotoPlayground

    };
};

const mapAppDispatchToProps = (dispatch) => {
    return {
        set_current_api_key : (c) => {
            dispatch(set_current_api_key(c));
            dispatch(fetch_app_token());
        }
    };
};
const DashboardContainer = connect(mapAppStateToProps,mapAppDispatchToProps)(DADashboard);

type Props = {
};


class App extends Component<Props> {


    constructor(props) {
        super(props);
        this.state = {
            playground : false
        };
    }


    exitPlayground() {
        this.setState( { playground : false});
    }
    gotoPlayground() {
        this.setState( { playground : true});
    }


    render() {
        return (
            <div>
                {
                    this.state.playground &&
                    <Playground
                        onExitPlayground = { () => this.exitPlayground()}
                    />
                }
                {
                    (!this.state.playground) &&
                    <DashboardContainer
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
