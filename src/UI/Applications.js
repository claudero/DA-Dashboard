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
    applications?: Array,
    fetchFailure?: boolean,
    error?: string,
    fetch?: Function,
    fetching?: boolean,
    loaded?: boolean,
};

class ApplicationList extends Component<Props> {

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
                    {this.props.fetching &&
                    <ProgressRing size='m'/>
                    }
                </div>
                <div>
                    {(!this.props.fetching && !this.props.fetchFailure) &&
                    <AutoResizer onResize={this.onResize} height={600}>
                        {({width, height}) => (
                            <MatrixTable
                                width={width}
                                height={height}
                                columns={[
                                    {
                                        key: '1',
                                        title: 'ID',
                                        width: 200,
                                        dataKey: 'id'
                                    },
                                    {
                                        key: '2',
                                        title: 'Description',
                                        width: 200,
                                        dataKey: 'description'
                                    },
                                    {
                                        key: '3',
                                        title: 'Engine',
                                        width: 200,
                                        dataKey: 'engine'
                                    },
                                    {
                                        key: '4',
                                        title: 'Version',
                                        alignment: 'left',
                                        width: 100,
                                        dataKey: 'version',
                                    }
                                ]}
                                data={this.props.applications}/>
                        )}
                    </AutoResizer>
                    }
                </div>
            </Section>
        );
    }
}

export default ApplicationList;
