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
    refCallback: PropTypes.func.isRequired
  }

  static defaultProps = {
    x: 0,
    y: 0,
    style: {},
    text: ''
  }

  render() {
    const {
      style,
      text,
      refCallback,
      ...otherProps
    } = this.props;

    return (
      <text style={style} ref={refCallback} {...otherProps}>
        {text}
      </text>
    );
  }
}
