/*global Props*/ // eslint-disable-line no-unused-vars
// @flow
import React, { Component } from 'react';
import {
    ActionBar,
    ActionBarGroup,
    IconButton
} from 'hig-react';
import 'hig-react/lib/hig-react.css';
import Section from './Section';
import GetAppCredentials from './getappcredentials';

import { AutoResizer}  from '@hig/table';
import '@hig/table/build/index.css';
import MatrixTable  from './MatrixTable/MatrixTable';

type Props = {
    applications?: Array,
    current_application?: String,
    add_application?: Function,
    remove_application?: Function,
};

function getApplicationTableData(props) {
    return props.applications.map( (key,idx)=> { return Object.assign({}, key, { id : idx, selected : props.current_application===key.client_id});});
}

class ApplicationKeys extends Component<Props> {

    constructor(props) {
        super(props);
        this.state = {
            mode : 'list'
        };
    }

    static getDerivedStateFromProps(props, current_state) {

        let newState =
            Object.assign({current_state,
                data : getApplicationTableData(props)
            });
        return newState;
    }

    add_application(name,client, secret, env) {
        this.props.add_application(name, client, secret, env);
        this.setState({mode : 'list'});
    }

    add_credentials() {
        this.setState({mode : 'add'});
    }


    cancel_add_key() {
        this.setState({mode : 'list'});
    }

    remove_applications() {

        if(this.state.selectedKeys && this.state.selectedKeys.length >= 1) {

            this.state.selectedKeys.forEach( (key)=> {

                    console.log("delete: " + this.props.applications[key].client_id);
                    this.props.remove_application(this.props.applications[key].client_id);
            });


        }

    }

    onSelectionChange = selectedKeys => {
        console.log(selectedKeys);
        this.setState({ selectedKeys: selectedKeys });
    };

    render() {
        return (
            <Section>
                <div>

                    {
                        this.state.mode === 'list' &&
                        <div>
                            <ActionBar>
                                <ActionBarGroup>
                                    <IconButton icon="add" title="add" type="flat" onClick={() => this.add_credentials() }/>
                                    <IconButton icon="trash" title="delete" type="flat" disabled={!(this.state.selectedKeys &&this.state.selectedKeys.length >= 1)} onClick={() => this.remove_applications() }/>
                                </ActionBarGroup>
                            </ActionBar>
                            <AutoResizer onResize={this.onResize} height={600}>
                                {({width, height}) => (
                                    <MatrixTable
                                        width={width}
                                        height={height}
                                        onSelectedRowsChange={this.onSelectionChange}
                                        selectable
                                        columns={[
                                            {
                                                key: '1',
                                                title: 'Name',
                                                width: 300,
                                                dataKey: 'name'
                                            },
                                            {
                                                key: '2',
                                                title: 'Client ID',
                                                width: 300,
                                                dataKey: 'client_id'
                                            },
                                            {
                                                key: '3',
                                                title: 'Environment',
                                                width: 300,
                                                dataKey: 'environment'
                                            }
                                        ]}
                                        data={this.state.data}
                                    />
                                )}
                            </AutoResizer>
                        </div>
                    }
                    {
                        this.state.mode === 'add' &&
                        <GetAppCredentials add_application={(name, clientid, secret, environment) => {this.add_application(name, clientid, secret, environment);}} cancel={() =>{this.cancel_add_key()}}/>
                    }
                </div>
            </Section>
        );
    }
}

export default ApplicationKeys;
