/* eslint-disable no-console */
import React, { PureComponent } from "react";
import PlaygroundSection from "../PlaygroundSection";
import { Button } from 'hig-react';

class ButtonSection extends PureComponent {
  render() {
    return (
      <PlaygroundSection title="Button">
        <Button
          size="standard"
          title="Grow Width Button"
          width="grow"
          onClick={() => {
            console.log("Small Button on click");
          }}
        />

        <Button
          size="small"
          title="Small Button"
          onClick={() => {
            console.log("Small Button on click");
          }}
        />

        <Button
          size="standard"
          title="Standard Button"
          onClick={() => {
            console.log("Small Button on click");
          }}
        />

        <Button
          size="large"
          title="Large Button"
          onClick={() => {
            console.log("Large Button on click");
          }}
        />

        <Button
          size="small"
          title="Disabled Button"
          disabled
          onClick={() => {
            console.log("Large Button on click");
          }}
          onBlur={() => console.log("onblur")}
          onFocus={() => console.log("focus")}
          onHover={() => console.log("hover")}
        />

        <Button
          size="small"
          type="primary"
          title="Primary Button"
          onClick={() => {
            console.log("Small Primary Button on click");
          }}
        />

        <Button
          size="small"
          type="secondary"
          title="Secondary Button"
          onClick={() => {
            console.log("Small Secondary Button on click");
          }}
        />

        <Button
          size="small"
          type="flat"
          title="Flat Button"
          onClick={() => {
            console.log("Small Flat Button on click");
          }}
        />

        <Button
          size="small"
          type="primary"
          title="Small Button with Icon"
          icon="settings"
          onClick={() => {
            console.log("Small button with icon on click");
          }}
        />

        <Button
          size="standard"
          type="primary"
          title="Standard Button with Icon"
          icon="settings"
          onClick={() => {
            console.log("Standard button with icon on click");
          }}
        />

        <Button
          size="large"
          type="primary"
          title="Large Button with Icon"
          icon="settings"
          onClick={() => {
            console.log("Large button with icon on click");
          }}
        />

        <Button
          size="standard"
          type="primary"
          title="Standard Button with Listeners Attached"
          onClick={() => {
            console.log("Button with icon on click");
          }}
          onBlur={() => {
            console.log("onblur");
          }}
          onFocus={() => {
            console.log("focus");
          }}
          onHover={() => {
            console.log("hover");
          }}
        />
      </PlaygroundSection>
    );
  }
}
export default ButtonSection;
