/*global Props*/ // eslint-disable-line no-unused-vars
// @flow
import React, { Component } from 'react';
import { ActionBar,
    ActionBarGroup,
    IconButton,
    Toast,
    ProgressRing} from 'hig-react';

import { } from 'hig-react';


import 'hig-react/lib/hig-react.css';
import Section from './Section';
import { AutoResizer}  from '@hig/table';
import '@hig/table/build/index.css';
import MatrixTable  from './MatrixTable/MatrixTable';
import CreateActivity from './createactivity';


type Props = {
    activities?: Object,
    applications?: Object,
    engines?: Object,
    fetch_activities?: Function,
    fetch_engines?: Function,
    fetch_applications?: Function,
    submit_activity?: Function
};

function extractParams(activity) {
    if(!activity || !activity.parameters) return [];

    let params =  Object.entries(activity.parameters).map((a) => {
        return       {
            name : a[0],
            description : a[1].description,
            required : a[1].required,
            verb : a[1].verb,
            zip : a[1].zip
        };

    });

    return params;
}

class ActivityList extends Component<Props> {

    constructor(props) {
        super(props);
        this.state = {
            currentActivity: null,
            mode : 'list'
        };
    }

    static getDerivedStateFromProps(props, current_state) {
        if(!props.activities.loaded && !props.activities.error) {
            props.fetch_activities();
        }
        return {
            ...current_state,
            currentActivity: current_state.currentActivity,
            currentParams : extractParams(props.activities.list.find((a) => a.id ===current_state.currentActivity))
        };

    }

    start_add_activity() {
        this.setState({mode : 'add'});
    }

    submit_activity() {

    }

    cancel_add_activity() {
        this.setState({mode : 'list'});
    }

    remove_activity() {
        //if(this.state.selectedKeys && this.state.selectedKeys.length >= 1) {
        //    this.props.remove_workitem(this.state.selectedKeys[0]);
        //}
    }



    onRowChange(keys) {
        this.setState({ currentActivity: keys.length>=1?keys[0]: null});
    }

    render() {
        return (
            <Section>
                <div>
                    <div>
                        {this.props.activities.error &&
                        <Toast status={'danger'}>
                            {this.props.activities.error}
                        </Toast>
                        }
                    </div>
                    <div>
                        {this.props.activities.loading &&
                        <ProgressRing size='m'/>
                        }
                    </div>

                    <div>
                        {this.state.mode === 'list' &&
                        <div>
                            <div>
                                {(!this.props.activities.loading && !this.props.activities.error) &&
                                <div>
                                    <ActionBar>
                                        <ActionBarGroup>
                                            <IconButton icon="add" title="add" type="flat"
                                                        onClick={() => this.start_add_activity()}/>
                                            <IconButton icon="trash" title="delete" type="flat"
                                                        onClick={() => this.remove_activity()}/>
                                        </ActionBarGroup>
                                    </ActionBar>
                                    <AutoResizer onResize={this.onResize} height={400}>
                                        {({width, height}) => (
                                            <MatrixTable
                                                width={width}
                                                height={height}
                                                selectable={true}
                                                onSelectedRowsChange={(keys) => {
                                                    this.onRowChange(keys);
                                                }}
                                                columns={[
                                                    {
                                                        key: '1',
                                                        dataKey: 'id',
                                                        title: 'ID',
                                                        width: 250,
                                                        accessor: 'id'
                                                    },
                                                    {
                                                        key: '2',
                                                        dataKey: 'description',
                                                        title: 'Description',
                                                        width: 250,
                                                        accessor: 'description'
                                                    },
                                                    {
                                                        key: '3',
                                                        dataKey: 'engine',
                                                        title: 'Engine',
                                                        width: 250,
                                                        accessor: 'engine'
                                                    },
                                                    {
                                                        key: '4',
                                                        dataKey: 'version',
                                                        title: 'Version',
                                                        width: 100,
                                                        accessor: 'version',
                                                    }]}
                                                data={this.props.activities.list}/>
                                        )}
                                    </AutoResizer>
                                </div>
                                }
                            </div>
                            <div>
                                {this.state.currentActivity &&
                                <div>
                                    <h1>{this.state.currentActivity}</h1>
                                    <h3>Parameters</h3>
                                    <AutoResizer onResize={this.onResize} height={300}>
                                        {({width, height}) => (
                                            <MatrixTable
                                                width={width}
                                                height={height}
                                                columns={[
                                                    {
                                                        key: '1',
                                                        dataKey: 'name',
                                                        title: 'Name',
                                                        width: 250
                                                    },
                                                    {
                                                        key: '2',
                                                        dataKey: 'description',
                                                        title: 'Description',
                                                        width: 250
                                                    },
                                                    {
                                                        key: '3',
                                                        dataKey: 'required',
                                                        title: 'Required',
                                                        width: 100
                                                    },
                                                    {
                                                        key: '4',
                                                        dataKey: 'verb',
                                                        title: 'Verb',
                                                        width: 50
                                                    },
                                                    {
                                                        key: '4',
                                                        dataKey: 'zip',
                                                        title: 'Zip',
                                                        width: 50
                                                    }]}
                                                data={this.state.currentParams}/>
                                        )}
                                    </AutoResizer>
                                </div>
                                }
                            </div>
                        </div>
                        }
                        {this.state.mode === 'add' &&
                            <CreateActivity engines={this.props.engines}
                                            applications={this.props.applications}
                                            fetch_engines={this.props.fetch_engines}
                                            fetch_applications={this.props.fetch_applications}
                                            add_activity={(label, payload) => {this.submit_activity(label, payload);}}
                                            cancel={() => this.cancel_add_activity()}
                            />
                        }
                    </div>
                </div>
        </Section>
        );
    }
}



export default ActivityList;
