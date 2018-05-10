import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Container, H3, Spacer } from 'hig-react';

class Section extends PureComponent {
  render() {
    return (
      <section>
        <Container>
          {this.props.children}
        </Container>
      </section>
    );
  }
}

Section.propTypes = {
  children: PropTypes.node.isRequired
};

export default Section;
