/*global Props*/ // eslint-disable-line no-unused-vars
// @flow
import React, { Component } from 'react';
import { Button, ProgressRing, Checkbox } from 'hig-react';
import 'hig-react/lib/hig-react.css';
import TextLine from './TextLine';

import { TextField, Toast, Dropdown } from 'hig-react';

type Props = {
    engines?: Object,
    applications?: Object,
    add_activity?: Function,
    cancel?: Function,
    fetch_engines?: Function,
    fetch_applications?: Function,
};

let parameters = [
    {
        key : '1',
        name : "ada",
        description : 'my description',
        localName : 'a.max',
        zip : false,
        ondemand : false,
        required : false,
        verb : 'get'
    },
    {
        key : '2',
        name : "a33da",
        description : 'my description2',
        localName : '2a.max',
        zip : true,
        ondemand : true,
        required : true,
        verb : 'put'
    },
    {
        key : '3',
        name : "a33da",
        description : 'my description3',
        localName : '2a.max',
        zip : true,
        ondemand : true,
        required : true,
        verb : 'put'
    },
    {
        key : '4',
        name : "a33da",
        description : 'my description4',
        localName : '2a.max',
        zip : true,
        ondemand : true,
        required : true,
        verb : 'put'
    }
];


class CreateActivity extends Component<Props> {

    constructor(props) {
        super(props);
        this.state = {};
    }

    static getDerivedStateFromProps(props, current_state) {
        if(!props.engines.loaded && !props.engines.error) {
            props.fetch_engines();
        }

        if(!props.applications.loaded && !props.applications.error) {
            props.fetch_applications();
        }

        return Object.assign({}, current_state, {
            engines : props.engines.list.map((engines) => { return {
                label : engines.id,
                id : engines.id,
                value : engines.id
            };}),
            applications : props.applications.list
                        .filter((a) => (a.engine === current_state.engine))
                        .map((applications) => { return {
                label : applications.id,
                id : applications.id,
                value : applications.id
            };})
        });
    }

    add_activity() {

        let payload = {
            id: 'ListMyObjects',
            commandLine: '$(engine.path)/3dsmaxbatch.exe -sceneFile \"$(args[InputFile].path)\" myMs.ms',
            description: 'run a ms and return OutputMax file',
            apps: [
                'myNickname.ListMyObjects+test'
            ],
            engine : 'Autodesk.3dsMax+2018',
            parameters: {
                InputFile : {
                    zip: false,
                    description: 'input file on which to run the script',
                    ondemand: false,
                    required: true,
                    verb: 'get',
                    localName: 'input.max'
                },
                OutputFile: {
                    zip: false,
                    ondemand: false,
                    verb: 'put',
                    description: 'The output text file',
                    required: true,
                    localName: 'list.txt'
                }
            }
        };

        this.props.add_activity(payload);
    }

    onIDChange(event) {
        this.setState ({ id : event.target.value});
    }
    onDescriptionChange(event) {
        this.setState ({ description : event.target.value});
    }
    onCommandChange(event) {
        this.setState ({ commandline : event.target.value});
    }
    onEngineChange(engine) {
        this.setState ({ engine : engine, application : ""});
    }

    onApplicationChange(application) {
        this.setState ({ application : application});
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
                    {this.props.engines_fetching &&
                        <ProgressRing size='m'/>
                    }
                </div>
                <div>
                    {!this.props.engines_fetching &&
                        <div>
                            <TextLine>Enter your activity information</TextLine>
                            <form className="form-group">
                                <TextField
                                    id="id"
                                    label="Activity ID"
                                    value={this.state.id}
                                    onChange={(e) => this.onIDChange(e)}
                                />
                                <TextField
                                    id="description"
                                    label="Activity Description"
                                    value={this.state.description}
                                    onChange={(e) => this.onDescriptionChange(e)}
                                />
                                <TextField
                                    id="command"
                                    label="Command line"
                                    value={this.state.commandline}
                                    onChange={(e) => this.onCommandChange(e)}
                                />
                                <Dropdown
                                    label="Engine"
                                    options={this.state.engines}
                                    value={this.state.engine}
                                    onChange={(e) => this.onEngineChange(e)}
                                />
                                <Dropdown
                                    label="Application"
                                    options={this.state.applications}
                                    value={this.state.application || ""}
                                    onChange={(e) => this.onApplicationChange(e)}
                                />
                            </form>
                            <div>
                                {parameters.map(param =>
                                    <div key={param.key}>
                                        <TextLine>Parameter {param.key}</TextLine>
                                        <div style={{ display: "flex", justifyContent: "space-between"}}>
                                            <TextField
                                                id="name"
                                                label="Name"
                                                value={param.name}
                                            />
                                            <TextField
                                                id="description"
                                                label="Description"
                                                value={param.description}
                                            />
                                            <TextField
                                                id="localName"
                                                label="Local Name"
                                                value={param.localName}
                                            />
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "space-between"}}>
                                            <Checkbox label="Zip" checked = {param.zip}/>
                                            <Checkbox label="On Demand" checked = {param.ondemand}/>
                                            <Checkbox label="Required" checked = {param.required}/>
                                            <Dropdown
                                                label="verb"
                                                options={[
                                                    {
                                                        label : 'get',
                                                        value : 'get'
                                                    },
                                                    {
                                                        label : 'put',
                                                        value : 'put'
                                                    }]}
                                                value={param.verb}
                                            />
                                        </div>
                                    </div>)
                                }


                            </div>
                            <div>
                                <Button size="standard" title="Add" width="shrink" onClick={() => this.add_activity()}/>
                                <Button size="standard" title="Cancel" width="shrink" onClick={() => this.props.cancel()}/>
                            </div>
                        </div>
                    }
                </div>
            </div>
        );
    }
}

export default CreateActivity;
