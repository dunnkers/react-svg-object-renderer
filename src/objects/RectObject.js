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
    style: {
      fill: 'white',
      stroke: 'black'
    },
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

  /**
   * Getter to ensure nested defaults are attached to object
   */
  getStyle() {
    const DEFAULTS = RectObject.defaultProps.style;
    return Object.assign({}, this.props.style || {}, DEFAULTS);
  }

  render() {
    const {
      x,
      y,
      width,
      height,
      nodeRef,
      ...otherProps
    } = this.props;
    delete otherProps.type; // don't attach type as attribute

    return (
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={this.getStyle()}
        ref={nodeRef}
        {...otherProps}
      />
    );
  }
}
