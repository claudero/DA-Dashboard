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
import CreateActivity from './submitactivity';


type Props = {
    activities?: Object,
    applications?: Object,
    engines?: Object,
    fetch_activities?: Function,
    fetch_engines?: Function,
    fetch_applications?: Function,
    submit_activity?: Function,
    delete_activity?: Function
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

        let currentActivity = props.activities.list.find((a) => a.id ===current_state.currentActivityId);
        return {
            ...current_state,
            currentActivity,
            currentParams : extractParams(currentActivity)
        };

    }

    start_add_activity() {
        this.setState({mode : 'add'});
    }

    start_edit_activity() {
        this.setState({mode : 'edit'});
    }

    submit_activity(payload) {
        this.setState({mode : 'list'});
        this.props.submit_activity(payload);

    }

    cancel_add_activity() {
        this.setState({mode : 'list'});
    }

    remove_activity() {
        this.props.delete_activity(this.state.currentActivity.id_parts.name);
    }

    onRowChange(keys) {
        this.setState({ currentActivityId: keys.length>=1?keys[0]: null});
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
                                            <IconButton icon="edit" title="edit" type="flat" disabled={!this.state.currentActivity}
                                                        onClick={() => this.start_edit_activity()}/>
                                            <IconButton icon="trash" title="delete" type="flat" disabled={!this.state.currentActivity}
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
                                                        width: 450,
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
                                    <h1>{this.state.currentActivityId}</h1>

                                    {this.state.currentActivity.commandLine && this.state.currentActivity.commandLine.length > 0 && this.state.currentActivity.commandLine[0].length > 0 &&
                                    <div>
                                        <h3>Command Line</h3>
                                        <p>{this.state.currentActivity.commandLine}</p>
                                    </div>
                                    }
                                    {this.state.currentActivity.settings &&
                                    <div>
                                        <h3>Script</h3>
                                        <p>{this.state.currentActivity.settings.script}</p>
                                    </div>
                                    }
                                    {this.state.currentActivity.apps && this.state.currentActivity.apps.length > 0 &&
                                    <div>
                                        <h3>Bundles</h3>
                                        <p>{this.state.currentActivity.apps}</p>
                                    </div>
                                    }

                                    {this.state.currentParams && this.state.currentParams.length > 0 &&
                                    <div>
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
                                }
                            </div>
                        </div>
                        }
                        { (this.state.mode === 'add' || this.state.mode === 'edit') &&
                            <CreateActivity engines={this.props.engines}
                                            applications={this.props.applications}
                                            fetch_engines={this.props.fetch_engines}
                                            fetch_applications={this.props.fetch_applications}
                                            activity = {this.state.mode === 'edit' && this.state.currentActivity}
                                            add_activity={(payload) => {this.submit_activity(payload);}}
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
