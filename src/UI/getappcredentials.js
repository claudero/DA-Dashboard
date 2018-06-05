/*global Props*/ // eslint-disable-line no-unused-vars
// @flow
import React, { Component } from 'react';
import { Button } from 'hig-react';
import 'hig-react/lib/hig-react.css';
import TextLine from './TextLine';

import { TextField, Toast, Dropdown } from 'hig-react';

type Props = {
    appname?: string,
    client_id?: string,
    environment?: string,
    secret?: string,
    failed?: boolean,
    add_application?: Function,
    cancel?: Function
};

class GetAppCredentials extends Component<Props> {


    constructor(props) {
        super(props);
        this.state = {};
    }

    static getDerivedStateFromProps(props, current_state) {
        return {
            client_id : current_state.client_id ,
            failed : current_state.failed,
            secret : current_state.secret,
            environment : current_state.environment || 'prod',
            name : current_state.name
        };
    }

    onNameChange(event) {
        this.setState ({ name : event.target.value, failed : false});
    }
    onAppIdChange(event) {
        this.setState ({ client_id : event.target.value, failed : false});
    }
    onSecretChange(event) {
        this.setState ({ secret : event.target.value, failed : false});
    }
    setEnvironment(env) {
        this.setState({ environment: env, failed : false});
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
                        id="name"
                        label="Application name"
                        value={this.state.name}
                        onChange={(e) => this.onNameChange(e)}
                    />
                    <TextField
                        id="clientId"
                        label="Client ID"
                        value={this.state.client_id}
                        onChange={(e) => this.onAppIdChange(e)}
                    />
                    <TextField
                        id="secret"
                        label="Application secret"
                        value={this.state.secret}
                        onChange={(e) => this.onSecretChange(e)}
                    />
                    <Dropdown
                        label="Environment"
                        options={[
                            { label: "Production", id: "prod", value: "prod" },
                            { label: "Staging", id: "stg", value: "stg"},
                            { label: "Development", id: "dev", value: "dev" }
                        ]}
                        value={this.state.environment}
                        onChange={(e) => this.setEnvironment(e)}
                    />
                </form>
                <div>
                    <Button size="standard" title="Add" width="shrink" onClick={() => this.props.add_application(this.state.name, this.state.client_id,this.state.secret, this.state.environment)}/>
                    <Button size="standard" title="Cancel" width="shrink" onClick={() => this.props.cancel()}/>
                </div>
            </div>
        );
    }
}

export default GetAppCredentials;
