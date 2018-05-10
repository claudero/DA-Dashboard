/*global Props*/ // eslint-disable-line no-unused-vars
// @flow
import React, { Component } from 'react';
import { Table, Toast } from 'hig-react';
import 'hig-react/lib/hig-react.css';
import Section from './Section';

type Props = {
    fetchFailure?: boolean,
    activities?: Array,
};

class ApplicationDetails extends Component<Props> {

    constructor(props) {
        super(props);
        this.state = {};
    }

    static getDerivedStateFromProps(props, current_state) {
        console.log("app props");
        console.log(props);
        return {
            activities : props.activities,
            failed : props.fetchFailure
        };
    }


    render() {
        return (
            <Section>
                <div>
                    {this.state.failed &&
                    <Toast status={'danger'}>
                        Error retrieving Design Automation data
                    </Toast>
                    }
                </div>
                <div style={{ minWidth: '1024px' }}>
                    <Table
                        density='standard'
                        columns={[
                            {
                                id: '1',
                                HeaderCell: 'ID',
                                alignment: 'left',
                                width: '1fr',
                                accessor: 'id'
                            },
                            {
                                id: '2',
                                HeaderCell: 'Description',
                                alignment: 'left',
                                width: '1fr',
                                accessor: 'description'
                            },
                            {
                                id: '3',
                                HeaderCell: 'Engine',
                                alignment: 'left',
                                width: '1fr',
                                accessor: 'engine'
                            },
                            {
                                id: '4',
                                HeaderCell: 'Version',
                                alignment: 'left',
                                width: '1fr',
                                accessor: 'version',
                            }
                        ]}
                        data={this.state.activities}
                    />
                </div>
            </Section>
        );
    }
}

export default ApplicationDetails;
