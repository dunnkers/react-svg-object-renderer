import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class SelectRect extends Component {
  static propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    select: PropTypes.func.isRequired
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
        style={{
          stroke: '#4285f4',
          fill: 'none',
          strokeWidth: '3px'
        }}
        onMouseDown={this.props.select}
      />
    );
  }
}
