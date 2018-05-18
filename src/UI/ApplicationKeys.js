/*global Props*/ // eslint-disable-line no-unused-vars
// @flow
import React, { Component } from 'react';
import { Table ,
    ActionBar,
    ActionBarGroup,
    IconButton
} from 'hig-react';
import 'hig-react/lib/hig-react.css';
import Section from './Section';
import GetAppCredentials from './getappcredentials'

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
/*
        console.log('Props (key)');
        console.log(props);
        console.log('Current state (keys)');
        console.log(current_state);*/
        let newState =
            Object.assign({current_state,
                data : getApplicationTableData(props)
            });
/*        console.log('New state (keys)');
        console.log(newState);*/


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

        this.state.data.forEach( (key)=> {

            if(key.selected) {
                console.log("delete: " + key.client_id);
                this.props.remove_application(key.client_id);
            }
        });

    }



    onSelectionChange = selectedInfo => {
        const updatedData = this.state.data.map(row => ({
            ...row,
            selected: selectedInfo.selected
        }));
        this.setState({ data: updatedData });
    };

    checkboxHandler = selectedInfo => {
        const existingData = this.state.data;
        const selectedIndex = existingData.findIndex(
            row => row.id === selectedInfo.id
        );
        existingData[selectedIndex].selected = selectedInfo.selected;
        this.setState({ data: existingData });
    };


    render() {
        return (
            <Section>
                <div style={{ minWidth: '1024px' }}>

                    {
                        this.state.mode === 'list' &&
                        <div>
                            <ActionBar>
                                <ActionBarGroup>
                                    <IconButton icon="add" title="add" type="flat" onClick={() => this.add_credentials() }/>
                                    <IconButton icon="trash" title="delete" type="flat" onClick={() => this.remove_applications() }/>
                                </ActionBarGroup>
                            </ActionBar>
                            <Table
                                density='standard'
                                onRowSelectionChange={this.checkboxHandler}
                                onSelectAllSelectionChange={this.onSelectionChange}
                                selectable
                                columns={[
                                    {
                                        id: '1',
                                        HeaderCell: 'Name',
                                        alignment: 'left',
                                        width: '1fr',
                                        accessor: 'name'
                                    },
                                    {
                                        id: '2',
                                        HeaderCell: 'Client ID',
                                        alignment: 'left',
                                        width: '1fr',
                                        accessor: 'client_id'
                                    },
                                    {
                                        id: '3',
                                        HeaderCell: 'Environment',
                                        alignment: 'left',
                                        width: '1fr',
                                        accessor: 'environment'
                                    }
                                ]}
                                data={this.state.data}
                            />
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
