// @flow
import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
//import { linkTo } from '@storybook/addon-links';

import { withKnobs, text , boolean} from '@storybook/addon-knobs';

import GetApplicationCredentials from '../UI/getappcredentials';
import ApplicationKeys from '../UI/ApplicationKeys';
import Applications from '../UI/Applications';
import Engines from '../UI/Engines';
import Activities from '../UI/Activities';


let engines = [
    {
        "productVersion": "21.0.0.845",
        "description": "N845",
        "version": '1',
        "id": "Autodesk.3dsMax+2019"
    },
    {
        "productVersion": "18.0",
        "description": "Revit 2018 with support for the Revit addin bundle format",
        "version": '5',
        "id": "Autodesk.Revit+2018"
    }
];

let applications = [
    {
        "engine": "Autodesk.Inventor+22",
        "description": "Change parameters TEST",
        "version": '2',
        "id": "Inventor.ChPa+prod"
    },
    {
        "engine": "Autodesk.Inventor+22",
        "description": "A sample iLogic app package",
        "version": '1',
        "id": "Inventor.iLogicSampleAppPackage+prod"
    }
];


let activities = [
    {
        "commandLine": [
            "$(engine.path)\\accoreconsole.exe /i $(args[InventorDoc].path) /al $(apps[ChPa].path) $(args[InventorParams].path)"
        ],
        "parameters": {
            "InventorDoc": {
                "verb": "get",
                "description": "IPT file or ZIP with assembly to process"
            },
            "InventorParams": {
                "verb": "get",
                "description": "JSON with changed Inventor parameters",
                "localName": "params.json"
            },
            "OutputIpt": {
                "verb": "put",
                "description": "IPT with the changed parameters",
                "localName": "Result.ipt"
            },
            "OutputIam": {
                "verb": "put",
                "description": "ZIP with assembly with the changed parameters",
                "localName": "Result.zip"
            }
        },
        "engine": "Autodesk.Inventor+22",
        "apps": [
            "Inventor.ChPa+prod"
        ],
        "description": "TEST: Change parameters of a part or an assembly.",
        "version": '1',
        "id": "Inventor.ChPa+prod"
    },
    {
        "commandLine": [
            "$(engine.path)/3dsmaxbatch.exe -v 5 \"$(settings[script].path)\""
        ],
        "parameters": {},
        "engine": "Autodesk.3dsMax+2019",
        "apps": [],
        "settings": {
            "script": "logsystem.logEntry \"Hello World\" info:true broadcast:true"
        },
        "description": "print hello world",
        "version": '1',
        "id": "3dsMax.HelloWorld+Latest"
    }
];

/*
storiesOf('UI MockUp', module)
  .addDecorator(withKnobs)
  .add('Enter Credentials', () => <GetApplicationCredentials failed={boolean('Failed', false)}
                                                getToken={action('Get token selected')} /> );
*/
storiesOf('UI MockUp', module)
    .addDecorator(withKnobs)
    .add('Applications', () => <Applications fetchFailure={boolean('Failed', false)} applications={applications}/> );

storiesOf('UI MockUp', module)
    .addDecorator(withKnobs)
    .add('Engines', () => <Engines fetchFailure={boolean('Failed', false)} engines={engines}/> );

storiesOf('UI MockUp', module)
    .addDecorator(withKnobs)
    .add('Activities', () => <Activities fetchFailure={boolean('Failed', false)} activities={activities}/> );

storiesOf('UI MockUp', module)
    .addDecorator(withKnobs)
    .add('Application Keys', () => <ApplicationKeys applications={[{ client_id : 'my client id', secret : 'my secret 1', name : '"my name1'},{ client_id : 'my client id2', secret : 'my secret 2', name : 'my name2'}]}/> );

