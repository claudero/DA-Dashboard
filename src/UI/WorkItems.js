/*global Props*/ // eslint-disable-line no-unused-vars
// @flow
import React, { Component } from 'react';

import { ActionBar,
    ActionBarGroup,
    IconButton} from 'hig-react';

import 'hig-react/lib/hig-react.css';
import Section from './Section';
import CreateWorkitem from './createworkitem';
import { AutoResizer}  from '@hig/table';
import '@hig/table/build/index.css';
import MatrixTable  from './MatrixTable/MatrixTable';

type Props = {
    workitems?: Array,
    activities?: Array,
    client_id?: String,
    fetch_workitems?: Function,
    submit_workitem?: Function,
    remove_workitem?: Function,
    activities_fetching?: Boolean,
    activities_error?: Boolean,
    activities_loaded?: Boolean,
    activities_fetch?: Function
};

class WorkItems extends Component<Props> {

    constructor(props) {
        super(props);
        this.state = {
            mode : 'list'
        };
    }

    static getDerivedStateFromProps(props, current_state) {

        props.fetch_workitems();

        return Object.assign({}, current_state, {
                workitems : props.workitems.map((wi) => { return {
                    label : wi.label,
                    id : wi.id,
                    activity : wi.payload.activityId,
                    status : wi.da_status.status
                };})
        });
    }


    submit_workitem(label) {

        let payload = {
            activityId: "3dsMax.HelloWorld+Latest",
            arguments: {
            }
        };

        this.props.submit_workitem(label, this.props.client_id, payload);
        this.setState({mode : 'list'});
    }

    start_add_workitem() {
        this.setState({mode : 'add'});
    }

    cancel_add_workitem() {
        this.setState({mode : 'list'});
    }

    remove_workitem() {
        if(this.state.selectedKeys && this.state.selectedKeys.length >= 1) {
            this.props.remove_workitem(this.state.selectedKeys[0]);
        }
    }

    onSelectionChange = selectedKeys => {

        let startTime =0;
        let currentWorkitem = (selectedKeys.length !== 1) ? null : this.props.workitems.find((wi) => wi.id === selectedKeys[0]);
        let stats = (!currentWorkitem) ? [] : Object.entries(currentWorkitem.da_status.stats).map((a,x) => {

            if(x===0) {
                startTime = Date.parse(a[1]);
            }
            return {
                name : a[0],
                timing : (x===0)? a[1]: ((Date.parse(a[1]) - startTime)/1000)
            };
        });

        this.setState({
            selectedKeys: selectedKeys,
            currentWorkitem,
            stats
        });
    };

    render() {
        return (
            <Section>
                <div>

                    {
                        this.state.mode === 'list' &&
                        <div>
                            <ActionBar>
                                <ActionBarGroup>
                                    <IconButton icon="add" title="add" type="flat"
                                                onClick={() => this.start_add_workitem()}/>
                                    <IconButton icon="trash" title="delete" type="flat"
                                                onClick={() => this.remove_workitem()}/>
                                </ActionBarGroup>
                            </ActionBar>
                            <AutoResizer onResize = {this.onResize}  height={600}>
                                {({ width, height }) => (
                                    <MatrixTable
                                        width={width}
                                        height={height}
                                        onSelectedRowsChange={this.onSelectionChange}
                                        selectable
                                        columns={[
                                            {
                                                key: '1',
                                                title: 'ID',
                                                alignment: 'left',
                                                width: 300,
                                                dataKey: 'id'
                                            },
                                            {
                                                key: '2',
                                                title: 'Description',
                                                width: 200,
                                                dataKey: 'label'
                                            },
                                            {
                                                key: '3',
                                                title: 'Activity',
                                                width: 300,
                                                dataKey: 'activity'
                                            },
                                            {
                                                key: '4',
                                                title: 'Status',
                                                width: 100,
                                                dataKey: 'status'
                                            }
                                        ]}
                                        data={this.state.workitems}
                                    />
                                )}
                            </AutoResizer>
                            <div>
                                {
                                    (this.state.currentWorkitem) &&
                                    <div>
                                        <h1>{this.state.currentWorkitem.label || "No description"}</h1>
                                        <a href={this.state.currentWorkitem.da_status.reportUrl}>Report</a>
                                        <h3>Statistics</h3>
                                        <AutoResizer onResize = {this.onResize}  height={300}>
                                            {({ width, height }) => (
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
                                                            dataKey: 'timing',
                                                            title: 'Timing',
                                                            width: 250
                                                        }]}
                                                    data={this.state.stats} />
                                            )}
                                        </AutoResizer>
                                    </div>
                                }
                            </div>
                        </div>
                    }




                    {
                        this.state.mode === 'add' &&
                        <CreateWorkitem activities={this.props.activities}
                                        activities_fetching={this.props.activities_fetching}
                                        activities_error={this.props.activities_error}
                                        activities_loaded={this.props.activities_loaded}
                                        activities_fetch={() => this.props.activities_fetch()}
                                        add_workitem={(label, payload) => {this.submit_workitem(label, payload);}}
                                        cancel={() => this.cancel_add_workitem()}
                        />
                    }
                </div>
            </Section>
        );
    }
}

export default WorkItems;
