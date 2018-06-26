import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';

import DragRect from './indicators/DragRect';

export default class SVGRoot extends Component {
  static propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
  }

  state = {
    dragging: false,
    dragOrigin: {
      x: 0,
      y: 0
    },
    dragRect: {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    }
  }

  constructor(props) {
    super(props);
    this.svgRef = createRef();
  }

  startDrag = (event) => {
    this.setState({
      dragInitiated: true,
      dragOrigin: this.computeCoordinates(event)
    });
  }

  handleDrag = (event) => {
    const { dragInitiated, dragOrigin } = this.state;
    let { dragging } = this.state;

    if (dragInitiated && !dragging) {
      dragging = true;
    }

    if (dragging) {
      const current = this.computeCoordinates(event);
      this.setState({
        dragging: true,
        dragRect: {
          x: Math.min(current.x, dragOrigin.x),
          y: Math.min(current.y, dragOrigin.y),
          width: Math.abs(current.x - dragOrigin.x),
          height: Math.abs(current.y - dragOrigin.y)
        }
      });
    }
  }

  overlaps(a, b, x, y) {
    return Math.max(a, x) < Math.min(b, y);
  }

  boxOverlap(a, b) {
    return this.overlaps(a.left, a.right, b.left, b.right) &&
      this.overlaps(a.top, a.bottom, b.top, b.bottom)
  }

  rectToBox = rect => {
    return {
      left: rect.x,
      right: rect.x + rect.width,
      top: rect.y,
      bottom: rect.y + rect.height
    };
  }

  stopDrag = (event) => {
    if (this.state.dragging) {
      // const indices = this.props.objects.map((object, index) => index);
      // const toSelect = indices.filter(index => {
      //   return this.boxOverlap(
      //     this.rectToBox(this.state.dragRect),
      //     this.rectToBox(this.getBBox(index))
      //   );
      // });
      // this.selectObjects(toSelect);
    }

    this.setState({
      dragging: false,
      dragInitiated: false,
      dragRect: { x: 0, y: 0, width: 0, height: 0 }
    });
  }

  computeCoordinates(mouseEvent) {
    const dim = this.svgRef.current.getBoundingClientRect();

    return {
      x: mouseEvent.clientX - dim.left,
      y: mouseEvent.clientY - dim.top
    }
  }

  render() {
    const { width, height } = this.props;
    const { dragging, dragRect } = this.state;
    const styles = {
      backgroundImage: 'url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5'
        + 'vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0'
        + 'PSIyMCIgZmlsbD0iI2ZmZiI+PC9yZWN0Pgo8cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9I'
        + 'iNGN0Y3RjciPjwvcmVjdD4KPHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIG'
        + 'ZpbGw9IiNGN0Y3RjciPjwvcmVjdD4KPC9zdmc+)',
      backgroundSize: 'auto'
    };

    return (
      <svg
        ref={this.svgRef}
        width={width}
        height={height}
        style={styles}
        onMouseDown={this.startDrag}
        onMouseMove={this.handleDrag}
        onMouseUp={this.stopDrag}
      >
        {this.props.children}
        {dragging && <DragRect {...dragRect} />}
      </svg>
    );
  }
}
