import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextObject from './TextObject';
import RectObject from './RectObject';

export default class CellObject extends Component {
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

  /**
   * Getter to ensure nested defaults are attached to object
   */
  getStyle() {
    const DEFAULTS = RectObject.defaultProps.style;
    return Object.assign({}, DEFAULTS, this.props.style || {});
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
      value,
      textStyle,
      ...otherProps
    } = this.props;

    return (
      <g>
        <RectObject
          x={x}
          y={y}
          width={width}
          height={height}
          style={this.getStyle()}
          nodeRef={nodeRef}
          {...otherProps}
        />
        <TextObject
          x={x + width / 2}
          y={y + height / 2}
          text={value}
          pointerEvents="none"
          textAnchor="middle"
          dominantBaseline="middle"
          style={textStyle}
        />
      </g>
    );
  }
}
