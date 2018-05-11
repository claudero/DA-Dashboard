/*global Props*/ // eslint-disable-line no-unused-vars
// @flow
import React, { Component } from 'react';
import { H1 } from 'hig-react';
//import 'hig-react/lib/hig-react.css';
//import '../css/text.css';

type Props = {
    children: Component,
    className?: string
};

class TitleLine extends Component<Props> {
    render() {
        return (
            <H1 className={this.props.className} style={{marginTop: '5px'}}>
                {this.props.children}
            </H1>
        );
    }
}

export default TitleLine;
