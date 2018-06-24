/*global Props*/ // eslint-disable-line no-unused-vars
// @flow
import React, { Component } from 'react';
import { Button, ProgressRing } from 'hig-react';
import { AutoResizer}  from '@hig/table';
import 'hig-react/lib/hig-react.css';
import MatrixTable  from './MatrixTable/MatrixTable';
import TextLine from './TextLine';

import { TextField, Toast, Dropdown } from 'hig-react';

type Props = {
    activities?: Array,
    failed ?: Boolean,
    add_workitem?: Function,
    cancel?: Function,
    activities_fetching?: boolean,
    activities_error?: String,
    activities_loaded?: boolean,
    activities_fetch?: Function,
};



class CreateWorkitem extends Component<Props> {

    constructor(props) {
        super(props);
        this.state = {};
    }

    static getDerivedStateFromProps(props, current_state) {
        if(!props.activities_loaded && !props.activities_error) {
            props.activities_fetch();
        }


        let params = [];
        let currentActivity = current_state.currentActivityId? props.activities.find((a) => a.id===current_state.currentActivityId):null;
        let currentParam;

        if(currentActivity===current_state.currentActivity) {
            params = current_state.parameters;
            currentParam = current_state.currentParamId? params.find((p) => p.id===current_state.currentParamId):null;
        } else {
            if(currentActivity && currentActivity.parameters) {
                Object.keys(currentActivity.parameters).forEach(function(key) {
                    params.push( {
                        id : key,
                        ...currentActivity.parameters[key]
                    });
                });
            }
        }


        return Object.assign({}, current_state, {
            currentActivity : currentActivity,
            parameters : params,
            currentParam : currentParam,
            activities : props.activities.map((activity) => { return {
                label : activity.id,
                id : activity.id,
                value : activity.id
            };})
        });
    }

    onLabelChange(event) {
        this.setState ({ label : event.target.value});
    }
    onActivityChange(activity) {
        this.setState ({ currentActivityId : activity});
    }

    add_workitem() {


        let payload = {
            activityId : this.state.currentActivityId,
            arguments: {
            }
        };

        this.state.parameters.forEach((p) => {
            payload.arguments[p.id] = p.value;
        });


        this.props.add_workitem(this.state.label, payload);
    }

    onParamChange(key,value) {
        let params = this.state.parameters.filter((a) => a.id !== this.state.currentParamId);

        let newparam = {
            ...this.state.currentParam,
            [key] : value
        };

        let newparams = [
            ...params,
            newparam

        ];

        this.setState ({
            parameters : newparams,
            currentParamId : newparam.id
        });
    }

    render() {
        return (
            <div>
                <div>
                    {this.state.failed &&
                    <Toast status={'danger'}>
                        Error retrieving Design Automation data
                    </Toast>
                    }
                </div>
                <div>
                    {this.props.activities_fetching &&
                        <ProgressRing size='m'/>
                    }
                </div>
                <div>
                    {!this.props.activities_fetching &&
                        <div>
                            <TextLine>Enter your application information</TextLine>
                            <form className="form-group">
                                <TextField
                                    id="label"
                                    label="Workitem label"
                                    value={this.state.label}
                                    onChange={(e) => this.onLabelChange(e)}
                                />
                                <Dropdown
                                    label="Activity"
                                    options={this.state.activities}
                                    value={this.state.currentActivityId}
                                    onChange={(e) => this.onActivityChange(e)}
                                />
                                {this.state.currentActivity && this.state.parameters &&
                                    <div>
                                        <h3>Parameters</h3>
                                        <AutoResizer height={300}>
                                            {({width, height}) => (
                                                <MatrixTable
                                                    width={width}
                                                    height={height}
                                                    selectable
                                                    selectedRowKeys={this.state.currentParamId?[this.state.currentParamId]:[]}
                                                    onSelectedRowsChange={(keys) => {
                                                        this.setState({ currentParamId: keys.length>=1?keys[0]: null});
                                                    }}
                                                    columns={[
                                                        {
                                                            key: '1',
                                                            dataKey: 'id',
                                                            title: 'Name',
                                                            width: 100
                                                        },
                                                        {
                                                            key: '2',
                                                            dataKey: 'description',
                                                            title: 'Description',
                                                            width: 200
                                                        },
                                                        {
                                                            key: '3',
                                                            dataKey: 'required',
                                                            title: 'Required',
                                                            width: 75
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
                                                        },
                                                        {
                                                            key: '5',
                                                            dataKey: 'value',
                                                            title: 'value',
                                                            width: 250
                                                        }
                                                ]}
                                                    data={this.state.parameters}/>
                                            )}
                                        </AutoResizer>
                                        {this.state.currentParam &&
                                            <div>
                                                <div style={{display: "flex", justifyContent: "space-between"}}>
                                                    <TextField
                                                        id="value"
                                                        label="Value"
                                                        onChange={(e) => this.onParamChange('value', e.target.value)}
                                                        value={this.state.currentParam.value}
                                                    />
                                                </div>
                                            </div>
                                        }
                                    </div>
                                }



                            </form>
                            <div>
                                <Button size="standard" title="Add" width="shrink" onClick={() => this.add_workitem()}/>
                                <Button size="standard" title="Cancel" width="shrink" onClick={() => this.props.cancel()}/>
                            </div>
                        </div>
                    }
                </div>
            </div>
        );
    }
}

export default CreateWorkitem;
