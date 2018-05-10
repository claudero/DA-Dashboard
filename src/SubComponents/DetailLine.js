/*global Props*/ // eslint-disable-line no-unused-vars
// @flow
import React, { Component } from 'react';
import 'hig-react/lib/hig-react.css';
//import '../css/text.css';

type Props = {
    children: Component,
    className?: string
};

class DetailLine extends Component<Props> {
    render() {
        return (
            <p className={`detail-text hig__typography ${this.props.className || ''}`}>{this.props.children}</p>
        );
    }
}

export default DetailLine;
