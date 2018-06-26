import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Surface extends Component {
  static propTypes = {
    deselectAll: PropTypes.func.isRequired
  }

  render() {
    return (
      <rect
        opacity="0.0"
        width="100%"
        height="100%"
        onMouseDown={(event) => {
          event.preventDefault();

          this.props.deselectAll();
        }}
      />
    );
  }
}
