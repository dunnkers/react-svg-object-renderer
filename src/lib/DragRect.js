import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class DragRect extends Component {
  static propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
  }

  render() {
    const rect = {
      x: this.props.x,
      y: this.props.y,
      width: this.props.width,
      height: this.props.height
    };

    return (
      <rect
        {...rect}
        fill="none"
        style={{
          stroke: '#4285f4',
          fill: 'none',
          strokeWidth: '2px'
        }}
      />
    );
  }
}
