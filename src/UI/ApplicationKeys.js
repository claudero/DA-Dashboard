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

class ApplicationKeys extends Component<Props> {

    constructor(props) {
        super(props);
        this.state = {
            mode : 'list'
        };
    }

    add_application(name,client, secret) {
        console.log("adding new credentiasl")
        console.log(name);
        console.log(client);
        console.log(secret);
        this.props.add_application(name, client, secret);
        this.setState({mode : 'list'});
    }

    add_credentials() {
        this.setState({mode : 'add'});
    }


    cancel_add_key() {
        this.setState({mode : 'list'});
    }

    getApplicationTableData() {
        let self = this;
        console.log ("current application");
        console.log (this.props.current_application);
        console.log (this.props);
        return this.props.applications.map( (key,idx)=> { return Object.assign(key, { id : idx, selected : self.props.current_application===key.client_id});});
    }

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
                                </ActionBarGroup>
                            </ActionBar>
                            <Table
                                density='standard'
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
                                    }
                                ]}
                                data={this.getApplicationTableData()}
                            />
                        </div>
                    }
                    {
                        this.state.mode === 'add' &&
                        <GetAppCredentials add_application={(name, clientid, secret) => {this.add_application(name, clientid, secret);}} cancel={() =>{this.cancel_add_key()}}/>
                    }
                </div>
            </Section>
        );
    }
}

export default ApplicationKeys;
