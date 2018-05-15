/*global Props*/ // eslint-disable-line no-unused-vars
// @flow
import React, { Component } from 'react';
import { Table} from 'hig-react';
import 'hig-react/lib/hig-react.css';
import Section from './Section';

type Props = {

};

class WorkItems extends Component<Props> {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <Section>
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
                            }
                        ]}
                        data={[]}
                    />
                </div>
            </Section>
        );
    }
}

export default WorkItems;
