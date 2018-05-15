/*global Props*/ // eslint-disable-line no-unused-vars
// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import DADashboard from './Components/dadashboard';
import Playground from './playground';

//import './css/containers.css';

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
                    <DADashboard
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
