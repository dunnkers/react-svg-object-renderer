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
    nodeRef: PropTypes.any
  }

  static defaultProps = {
    x: 0,
    y: 0,
    width: 50,
    height: 50,
    style: {},
    nodeRef: null
  }

  shouldComponentUpdate = (nextProps) => {
    const equal = Object.entries(nextProps).every(([key, value]) => {
      if (value instanceof Function) {
        return true; // we won't change functions
      }

      return this.props[key] === value;
    })

    return !equal; // only update if a prop actually changed
  }

  render() {
    const {
      x,
      y,
      width,
      height,
      style,
      nodeRef,
      ...otherProps
    } = this.props;

    return (
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={style}
        ref={nodeRef}
        {...otherProps}
      />
    );
  }
}
