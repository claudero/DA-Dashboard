/*global Props*/ // eslint-disable-line no-unused-vars
// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import DADashboard from './dadashboard';
import { Row } from 'react-bootstrap';
//import config from './config';

import './css/containers.css';

type Props = {
    dispatch: Function,
    state: any,
    value?: string,
    icon?: string,
};


class App extends Component<Props> {

    getToken(appid, secret) {
        this.props.dispatch({type: 'GET_TOKEN'});
    }

    reset() {
        this.props.dispatch({type: 'RESET'});
    }

    render() {
        return (
            <Row>
                <DADashboard
                    name="Design Automation Dashboard"
                    state={this.props.state}
                    value={this.props.value}
                    icon={this.props.icon}
                    getToken={(appid, secret) => this.getToken(appid,secret)}
                    reset={() => this.reset()}
                />
            </Row>
        );
    }
}

const mapStateToProps = state => {
    return state;
};

export default connect(mapStateToProps)(App);
