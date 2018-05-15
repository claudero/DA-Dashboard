/*global Props*/ // eslint-disable-line no-unused-vars
// @flow
import React, { Component } from 'react';
import { Table, Toast, ProgressRing } from 'hig-react';
import 'hig-react/lib/hig-react.css';
import Section from './Section';

type Props = {
    engines?: Array,
    fetchFailure?: boolean,
    error?: string,
    fetch?: Function,
    fetching?: boolean,
    string?: token,
    loaded?: boolean,
};

class EngineList extends Component<Props> {

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
                    {this.props.fetchFailure &&
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
                                HeaderCell: 'Product Version',
                                alignment: 'left',
                                width: '1fr',
                                accessor: 'productVersion'
                            },
                            {
                                id: '4',
                                HeaderCell: 'Engine Version',
                                alignment: 'left',
                                width: '1fr',
                                accessor: 'version',
                            }
                        ]}
                        data={this.props.engines}
                    />
                </div>
            </Section>
        );
    }
}

export default EngineList;
