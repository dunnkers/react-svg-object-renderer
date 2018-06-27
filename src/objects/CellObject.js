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
    nodeRef: PropTypes.any.isRequired
  }

  static defaultProps = {
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    style: {
      fill: 'white',
      stroke: 'black'
    }
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
      ...otherProps
    } = this.props;

    return (
      <g>
        <RectObject
          x={x}
          y={y}
          width={width}
          height={height}
          style={style}
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
        />
      </g>
    );
  }
}
