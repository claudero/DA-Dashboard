/*global Props*/ // eslint-disable-line no-unused-vars
// @flow
import React, { Component } from 'react';
import { Button } from 'hig-react';
import 'hig-react/lib/hig-react.css';
import TextLine from './TextLine';

import { TextField } from 'hig-react';
import { Toast } from 'hig-react';

type Props = {
    appid?: string,
    secret?: string,
    failed?: boolean,
    getToken?: Function,
};

class GetAppCredentials extends Component<Props> {


    constructor(props) {
        super(props);
        this.state = {};
    }

    static getDerivedStateFromProps(props, current_state) {
        return {
            appid : props.appid,
            failed : props.failed,
            secret : props.secret
        };
    }

    onAppIdChange(event) {
        this.setState ({ appid : event.target.value, failed : false});
    }
    onSecretChange(event) {
        this.setState ({ secret : event.target.value, failed : false});
    }

    render() {
        return (
            <div>
                {this.state.failed &&
                <Toast status={'danger'} onDismiss={() => this.setState({failed : false})}>
                    Error retrieving token
                </Toast>
                }
                <TextLine>Enter your application information</TextLine>
                <form className="form-group">
                    <TextField
                        id="appId"
                        label="Application ID"
                        value={this.state.appid}
                        onChange={(e) => this.onAppIdChange(e)}
                    />
                    <TextField
                        id="secret"
                        label="Application secret"
                        value={this.state.secret}
                        onChange={(e) => this.onSecretChange(e)}
                    />
                </form>
                <div>
                    <Button size="standard" title="Get token" width="shrink" onClick={() => this.props.getToken(this.state.appid,this.state.secret)}/>
                </div>
            </div>
        );
    }
}

GetAppCredentials.defaultProps = {
    appid : '',
    secret: ''
};


export default GetAppCredentials;
