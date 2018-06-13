import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class RectObject extends Component {
  static propTypes = {
    x: PropTypes.number,
    y: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
    style: PropTypes.shape({
      fill: PropTypes.string,
      stroke: PropTypes.string
    }),
    refCallback: PropTypes.func.isRequired
  }

  static defaultProps = {
    x: 0,
    y: 0,
    width: 50,
    height: 50,
    style: {}
  }

  render() {
    const {
      x,
      y,
      width,
      height,
      style,
      refCallback,
      ...otherProps
    } = this.props;

    return (
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={style}
        ref={refCallback}
        {...otherProps}
      />
    );
  }
}
