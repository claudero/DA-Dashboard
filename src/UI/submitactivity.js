/*global Props*/ // eslint-disable-line no-unused-vars
// @flow
import React, { Component } from 'react';
import { Button, ProgressRing, Checkbox , ActionBarGroup, ActionBar, IconButton} from 'hig-react';
import 'hig-react/lib/hig-react.css';
import TextLine from './TextLine';
import { AutoResizer}  from '@hig/table';
import '@hig/table/build/index.css';
import MatrixTable  from './MatrixTable/MatrixTable';


import { TextField, Toast, Dropdown } from 'hig-react';

type Props = {
    engines?: Object,
    applications?: Object,
    activity?: Object,
    add_activity?: Function,
    cancel?: Function,
    fetch_engines?: Function,
    fetch_applications?: Function,
};

class CreateActivity extends Component<Props> {

    constructor(props) {
        super(props);
        this.state = {
              //  parameters: parameters
        };
    }

    static getDerivedStateFromProps(props, current_state) {
        if(!props.engines.loaded && !props.engines.error) {
            props.fetch_engines();
        }

        if(!props.applications.loaded && !props.applications.error) {
            props.fetch_applications();
        }

        let props_commandline = "";
        let props_description = "";
        let props_id = "Undefined";
        let props_alias = "test";
        let props_script = "";
        let props_engine = "";
        let props_app = "";
        let props_parameters = [];

        if(props.activity) {
            props_description = props.activity.description;
            props_id = props.activity.id_parts.name;
            props_alias = props.activity.id_parts.alias;
            props_engine = props.activity.engine;
            props_commandline = props.activity.commandLine?props.activity.commandLine[0]:'';
            if(props.activity.settings && props.activity.settings.script) {
                props_script = props.activity.settings.script;
            }
            if(props.activity.apps && props.activity.apps.length >= 1) {
                props_app = props.activity.apps[0];
            }
            if(props.activity.parameters) {

                Object.keys(props.activity.parameters).forEach(function(key, i) {
                    props_parameters.push( {
                        id : key,
                        ...props.activity.parameters[key]
                    });
                });

            }
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
            };}),
            currentParam : current_state.parameters?current_state.parameters.find((a) => a.id === current_state.currentParamId):null,
            id : current_state.id || props_id,
            alias : current_state.alias || props_alias,
            description : current_state.description ||props_description,
            commandline : current_state.commandline || props_commandline,
            script : current_state.script || props_script,
            engine : current_state.engine || props_engine,
            application : current_state.application || props_app,
            parameters : current_state.parameters || props_parameters,
        });
    }

    add_activity() {

        let payload = {
            id: this.state.id,
            alias : this.state.alias,
            commandLine: [this.state.commandline],
            description: this.state.description,
            apps: this.state.application? [this.state.application]:[],
            engine : this.state.engine,
            parameters: {}
        };
        if(this.state.script) {
            payload.settings = {
                script : this.state.script
            };
        }
        this.state.parameters.forEach((p) => {
            payload.parameters[p.id] = {
                    zip : p.zip,
                    description : p.description,
                    ondemand : p.ondemand,
                    required : p.required,
                    verb : p.verb,
                    localName : p.localName
            };
        });


        this.props.add_activity(payload);
    }

    onChange(key, value) {
        this.setState ({ [key] : value});
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

    remove_parameter() {
        let params = this.state.parameters.filter((a) => a.id !== this.state.currentParamId);

        this.setState ({
            parameters : params,
            currentParamId : null
        });
    }

    add_parameter() {

        let newparams = [
            ...this.state.parameters,
            {
                id : "Undefined"
            }

        ];

        this.setState ({
            parameters : newparams,
            currentParamId : "Undefined"
        });
    }
    onRowChange(keys) {
        this.setState({ currentParamId: keys.length>=1?keys[0]: null});
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
                                    onChange={(e) => this.onChange('id', e.target.value)}
                                />
                                <TextField
                                    id="alias"
                                    label="Activity Alias"
                                    value={this.state.alias}
                                    onChange={(e) => this.onChange('alias', e.target.value)}
                                />
                                <TextField
                                    id="description"
                                    label="Activity Description"
                                    value={this.state.description}
                                    onChange={(e) => this.onChange('description', e.target.value)}
                                />
                                <TextField
                                    id="command"
                                    label="Command line"
                                    value={this.state.commandline}
                                    onChange={(e) => this.onChange('commandline', e.target.value)}
                                />
                                <TextField
                                    id="script"
                                    label="Script"
                                    value={this.state.script}
                                    onChange={(e) => this.onChange('script', e.target.value)}
                                />
                                <div style = {{display : 'flex'}}>
                                    <Dropdown
                                        label="Engine"
                                        options={this.state.engines}
                                        value={this.state.engine}
                                        onChange={(value) => {
                                            this.onChange('engine', value);
                                            this.onChange('application', '');
                                        }}
                                    />
                                    {this.props.engines.loading &&
                                        <ProgressRing size='s'/>
                                    }
                                </div>
                                <div style = {{display : 'flex'}}>
                                    <Dropdown
                                        label="Application"
                                        options={this.state.applications}
                                        value={this.state.application || ''}
                                        onChange={(value) => this.onChange('application', value)}
                                    />
                                    {this.props.applications.loading &&
                                    <ProgressRing size='s'/>
                                    }
                                </div>
                                <h3>Parameters</h3>
                                <ActionBar>
                                    <ActionBarGroup>
                                        <IconButton icon="add" title="add" type="flat"
                                                    onClick={() => this.add_parameter()}/>
                                        <IconButton icon="trash" title="delete" type="flat"
                                                    onClick={() => this.remove_parameter()}/>
                                    </ActionBarGroup>
                                </ActionBar>
                                <AutoResizer height={300}>
                                    {({width, height}) => (
                                        <MatrixTable
                                            width={width}
                                            height={height}
                                            selectable
                                            selectedRowKeys={this.state.currentParamId?[this.state.currentParamId]:[]}
                                            onSelectedRowsChange={(keys) => {
                                                this.onRowChange(keys);
                                            }}
                                            columns={[
                                                {
                                                    key: '1',
                                                    dataKey: 'id',
                                                    title: 'Name',
                                                    width: 250
                                                }]}
                                            data={this.state.parameters}/>
                                    )}
                                </AutoResizer>
                                {this.state.currentParam &&
                                    <div>
                                        <div style={{ display: "flex", justifyContent: "space-between"}}>
                                            <TextField
                                                id="name"
                                                label="Name"
                                                onChange={(e) => this.onParamChange('id',e.target.value)}
                                                value={this.state.currentParam.id}
                                            />
                                            <TextField
                                                id="description"
                                                label="Description"
                                                value={this.state.currentParam.description}
                                                onChange={(e) => this.onParamChange('description',e.target.value)}
                                            />
                                            <TextField
                                                id="localName"
                                                label="Local Name"
                                                value={this.state.currentParam.localName}
                                                onChange={(e) => this.onParamChange('localName',e.target.value)}
                                            />
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "space-between"}}>
                                            <Checkbox label="Zip"
                                                      onChange={(e) => this.onParamChange('zip',e.target.checked)}
                                                      checked = {this.state.currentParam.zip}/>
                                            <Checkbox label="On Demand"
                                                      onChange={(e) => this.onParamChange('ondemand',e.target.checked)}
                                                      checked = {this.state.currentParam.ondemand}/>
                                            <Checkbox label="Required"
                                                      onChange={(e) => this.onParamChange('required',e.target.checked)}
                                                      checked = {this.state.currentParam.required}/>
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
                                                onChange={(e) => this.onParamChange('verb', e)}
                                                value={this.state.currentParam.verb}
                                            />
                                        </div>
                                    </div>
                                }
                            </form>
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
