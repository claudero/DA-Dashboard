/*global Props*/ // eslint-disable-line no-unused-vars
// @flow
import React, { Component } from 'react';
import { Table, Toast , ProgressRing} from 'hig-react';
import 'hig-react/lib/hig-react.css';
import Section from './Section';

type Props = {
    activities?: Array,
    fetchFailure?: boolean,
    error?: string,
    fetch?: Function,
    fetching?: boolean,
    loaded?: boolean,

};

class ActivityList extends Component<Props> {

    constructor(props) {
        super(props);
        this.state = {};
    }

    static getDerivedStateFromProps(props, current_state) {
        if(!props.loaded && !props.fetchFailure) {
            props.fetch();
        }
        return {};

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
                <div>
                    {this.props.fetching &&
                    <ProgressRing size='m'/>
                    }
                </div>
                <div style={{ minWidth: '1024px' }}>
                    <Table
                        density='compressed'
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
                        data={this.props.activities}
                    />
                </div>
            </Section>
        );
    }
}

export default ActivityList;
