/*global Props*/ // eslint-disable-line no-unused-vars
// @flow
import React, { Component } from 'react';
import { Button, ProgressRing } from 'hig-react';
import 'hig-react/lib/hig-react.css';
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

let testPayload = {
    activityId: "farandj2.ListMyObjects+test",
    arguments: {
        InputFile: {
            url: "https://s3.amazonaws.com/maxio-demo.dev.3dsmax.autodesk.com/stingrayTest/input/DemoDAS/demo.max",
            verb: "get"
        },
        OutputFile: {
            url: "https://s3.amazonaws.com/maxio-demo.dev.3dsmax.autodesk.com/stingrayTest/output/DemoDAS/list.txt",
            verb: "put"
        }
    }
}

class CreateWorkitem extends Component<Props> {

    constructor(props) {
        super(props);
        this.state = {};
    }

    static getDerivedStateFromProps(props, current_state) {
        if(!props.activities_loaded && !props.activities_error) {
            props.activities_fetch();
        }

        console.log(current_state);
        return Object.assign({}, current_state, {
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
        this.setState ({ activity : activity});
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
                                    value={this.state.activity}
                                    onChange={(e) => this.onActivityChange(e)}
                                />
                            </form>
                            <div>
                                <Button size="standard" title="Add" width="shrink" onClick={() => this.props.add_workitem(this.state.label, testPayload)}/>
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
