import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class HoverRect extends Component {
  static propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    stopHover: PropTypes.func.isRequired
  }

  render() {
    const offset = 0;
    const margin = offset * 2;
    const rect = {
      x: this.props.x - offset,
      y: this.props.y - offset,
      width: this.props.width + margin,
      height: this.props.height + margin
    };

    return (
      <g>
        <rect
          {...rect}
          style={{
            stroke: 'white',
            fill: 'none',
            strokeWidth: '3px'
          }}
        />
        <rect
          {...rect}
          style={{
            stroke: 'rgb(77, 117, 183)',
            fill: 'none',
            strokeWidth: '3px',
            strokeDasharray: '5,5'
          }}
          onMouseLeave={this.props.stopHover}
        />
      </g>
    );
  }
}
