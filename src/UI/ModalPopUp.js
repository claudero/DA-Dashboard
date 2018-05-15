/*global Props*/ // eslint-disable-line no-unused-vars
// @flow
import React, { Component } from 'react';
import 'hig-react/lib/hig-react.css';
//import '../css/text.css';

import { Modal } from 'react-bootstrap';
import { Button } from 'hig-react';

type Props = {
    title: string,
    body?: string,
    handleYes: Function,
    yesText?: string,
    handleNo: Function,
    noText?: string
};

class ModalPopUp extends Component<Props> {
    render() {
        return (
            <Modal show onHide={this.props.handleNo}>
                <Modal.Header closeButton>
                    <Modal.Title>{this.props.title}</Modal.Title>
                </Modal.Header>
                {this.props.body &&
                    <Modal.Body>
                        <p className="hig__typography">{this.props.body}</p>
                    </Modal.Body>
                }
                <Modal.Footer>
                    <Button
                        title={this.props.noText || 'No'}
                        width="shrink"
                        type="secondary"
                        onClick={this.props.handleNo}
                    />
                    <Button
                        title={this.props.yesText || 'Yes'}
                        width="shrink"
                        onClick={this.props.handleYes}
                    />
                </Modal.Footer>
            </Modal>
        );
    }
}

export default ModalPopUp;
