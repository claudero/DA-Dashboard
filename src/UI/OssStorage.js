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
    buckets?: Array,
    fetchFailure?: boolean,
    error?: string,
    fetch_buckets?: Function,
    fetch_objects?: Function,
    fetching?: boolean,
};

class OSSStorage extends Component<Props> {

    constructor(props) {
        super(props);
        this.state = {};
    }

    static getDerivedStateFromProps(props, current_state) {

        let selectedBucket = props.buckets.find((b) => b.id ===current_state.currentBucketKey);

        if(selectedBucket && !selectedBucket.loaded && !props.fetchFailure){
            props.fetch_objects(selectedBucket);
        }

        if(!props.loaded && !props.fetchFailure) {
            props.fetch_buckets();
        }
        return {
            currentBucketKey: current_state.currentBucketKey,
            currentBucket: selectedBucket
        };
    }

    onRowChange(keys) {
        this.setState({ currentBucketKey: keys.length>=1?keys[0]: null});
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
                    {(!this.props.fetching && !this.props.fetchFailure) &&
                    <AutoResizer onResize = {this.onResize}  height={200}>
                        {({ width, height }) => (
                            <MatrixTable
                                width={width}
                                height={height}
                                selectable={true}
                                onSelectedRowsChange={(keys) => {this.onRowChange(keys);}}
                                columns={[
                                    {
                                        key: '1',
                                        title: 'Bucket',
                                        width: 250,
                                        dataKey: 'bucketKey'
                                    },
                                    {
                                        key: '2',
                                        title: 'Policy',
                                        width: 150,
                                        dataKey: 'policyKey'
                                    },
                                    {
                                        key: '3',
                                        title: 'Created Date',
                                        width: 450,
                                        dataKey: 'createdDate'
                                    }
                                ]}
                                data={this.props.buckets}
                            />)
                        }
                    </AutoResizer>
                    }
                </div>
                <div>
                    {this.state.currentBucket &&
                    <div>
                        <h1>{this.state.currentBucket.bucketKey}</h1>
                        <h3>Objects</h3>
                        <p>Count: {this.state.currentBucket.list.length}</p>
                        <AutoResizer onResize = {this.onResize}  height={800}>
                            {({ width, height }) => (
                                <MatrixTable
                                    width={width}
                                    height={height}
                                    columns={[
                                        {
                                            key: '1',
                                            dataKey: 'objectKey',
                                            title: 'Name',
                                            width: 450
                                        },
                                        {
                                            key: '2',
                                            dataKey: 'size',
                                            title: 'Size',
                                            width: 250
                                        }]}
                                    data={this.state.currentBucket.list} />
                            )}
                        </AutoResizer>
                    </div>
                    }
                </div>

            </Section>
        );
    }
}

export default OSSStorage;
