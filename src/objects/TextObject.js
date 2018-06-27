import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class TextObject extends Component {
  static propTypes = {
    x: PropTypes.number,
    y: PropTypes.number,
    style: PropTypes.shape({
      fill: PropTypes.string,
      stroke: PropTypes.string
    }),
    text: PropTypes.string,
    nodeRef: PropTypes.any
  }

  static defaultProps = {
    x: 0,
    y: 0,
    style: {},
    text: '',
    nodeRef: null
  }

  render() {
    const {
      style,
      text,
      nodeRef,
      ...otherProps
    } = this.props;
    delete style.stroke; // ignore stroke, only use fill.

    return (
      <text style={style} ref={nodeRef} {...otherProps}>
        {text}
      </text>
    );
  }
}
