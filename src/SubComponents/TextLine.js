/*global Props*/ // eslint-disable-line no-unused-vars
// @flow
import React, { Component } from 'react';
import 'hig-react/lib/hig-react.css';
//import '../css/text.css';

type Props = {
    children: Component,
    className?: string
};

class TextLine extends Component<Props> {
    render() {
        return (
            <p className={`hig__typography ${this.props.className || ''}`}>
                <strong>
                    {this.props.children}
                </strong>
            </p>
        );
    }
}

export default TextLine;
