/*global Props*/ // eslint-disable-line no-unused-vars
// @flow
import React, { Component } from 'react';
import { Toast, ProgressRing } from 'hig-react';
import 'hig-react/lib/hig-react.css';
import Section from './Section';

import { AutoResizer}  from '@hig/table';
import '@hig/table/build/index.css';
import MatrixTable  from './MatrixTable/MatrixTable';

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
                        {this.props.error}
                    </Toast>
                    }
                </div>
                <div>
                    {(this.props.fetching && !this.props.fetchFailure) &&
                    <ProgressRing size='m'/>
                    }
                </div>
                <div>
                    {!this.props.fetching &&
                    <AutoResizer onResize = {this.onResize}  height={600}>
                        {({ width, height }) => (
                            <MatrixTable
                                width={width}
                                height={height}
                                columns={[
                                    {
                                        key: '1',
                                        title: 'ID',
                                        width: 250,
                                        dataKey: 'id'
                                    },
                                    {
                                        key: '2',
                                        title: 'Description',
                                        width: 350,
                                        dataKey: 'description'
                                    },
                                    {
                                        key: '3',
                                        title: 'Product Version',
                                        alignment: 'left',
                                        width: 100,
                                        dataKey: 'productVersion'
                                    },
                                    {
                                        key: '4',
                                        title: 'Engine Version',
                                        alignment: 'left',
                                        width: 100,
                                        dataKey: 'version',
                                    }
                                ]}
                                data={this.props.engines}
                            />)
                        }
                    </AutoResizer>
                    }
                </div>
            </Section>
        );
    }
}

export default EngineList;
