/*global Props*/ // eslint-disable-line no-unused-vars
// @flow
import React, { Component } from 'react';
import 'hig-react/lib/hig-react.css';
import Section from './Section';

import { AutoResizer}  from '@hig/table';
import '@hig/table/build/index.css';
import MatrixTable  from './MatrixTable/MatrixTable';

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
                <AutoResizer onResize = {this.onResize}  height={600}>
                    {({ width, height }) => (
                        <MatrixTable
                            width={width}
                            height={height}
                            columns={[
                                {
                                    key: '1',
                                    title: 'ID',
                                    alignment: 'left',
                                    width: 100,
                                    dataKey: 'id'
                                },
                                {
                                    key: '2',
                                    title: 'Description',
                                    width: 100,
                                    dataKey: 'description'
                                }
                            ]}
                            data={[]}
                        />
                        )}
                </AutoResizer>
            </Section>
        );
    }
}

export default WorkItems;
