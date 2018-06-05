/*global Props*/ // eslint-disable-line no-unused-vars
// @flow
import React, { Component } from 'react';
import { Toast , ProgressRing} from 'hig-react';
import 'hig-react/lib/hig-react.css';
import Section from './Section';
import { AutoResizer}  from '@hig/table';
import '@hig/table/build/index.css';
import MatrixTable  from './MatrixTable/MatrixTable';


type Props = {
    activities?: Array,
    fetchFailure?: boolean,
    error?: string,
    fetch?: Function,
    fetching?: boolean,
    loaded?: boolean,

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
            currentActivity: null
        };
    }

    static getDerivedStateFromProps(props, current_state) {
        if(!props.loaded && !props.fetchFailure) {
            props.fetch();
        }
        return {
            currentActivity: current_state.currentActivity,
            currentParams : extractParams(props.activities.find((a) => a.id ===current_state.currentActivity))
        };

    }
    onRowChange(keys) {
        this.setState({ currentActivity: keys.length>=1?keys[0]: null});
    }

    render() {
        return (
            <Section>
                <div>
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

                    </div>
                    <div>
                        {(!this.props.fetching && !this.props.fetchFailure) &&
                            <AutoResizer onResize = {this.onResize}  height={600}>
                                {({ width, height }) => (
                                   <MatrixTable
                                       width={width}
                                       height={height}
                                       selectable={true}
                                       onSelectedRowsChange={(keys) => {this.onRowChange(keys);}}
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
                                  data={this.props.activities} />
                                )}
                            </AutoResizer>
                        }
                    </div>
                </div>
                <div>
                    {this.state.currentActivity &&
                    <div>
                        <h1>{this.state.currentActivity}</h1>
                        <h3>Parameters</h3>
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
                                    data={this.state.currentParams} />
                            )}
                        </AutoResizer>
                    </div>
                    }
                </div>
        </Section>
        );
    }
}



export default ActivityList;
