import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { HotKeys } from 'react-hotkeys';

export default class SVGEditableCanvas extends Component {
  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    objects: PropTypes.arrayOf(PropTypes.shape({
      type: PropTypes.string.isRequired
    })),
    objectTypes: PropTypes.objectOf(PropTypes.func),
    onSelectionChange: PropTypes.func
  }

  static defaultProps = {
    width: 400,
    height: 400,
    objects: [],
    objectTypes: {},
    onSelectionChange: () => {}
  }

  state = {
    isHovering: false,
    currentlyHovering: null,
    selectedObjects: new Set(),
    multiSelect: false
  }

  componentWillMount() {
    this.objectRefs = {};
  }

  onMouseOver = (index) => this.setState({
    isHovering: true,
    currentlyHovering: index
  });

  onMouseLeave = () => this.setState({ isHovering: false })

  onMouseDown = (index, event) => {
    event.preventDefault();
    const { selectedObjects } = this.state;

    if (selectedObjects.has(index)) {
      if (!this.state.multiSelect && selectedObjects.size > 1) {
        selectedObjects.clear();
        selectedObjects.add(index);
      } else {
        selectedObjects.delete(index); // de-select
      }
    } else {
      if (!this.state.multiSelect) {
        selectedObjects.clear();
      }

      selectedObjects.add(index); // select
    }

    this.setState({ selectedObjects });

    // notify outside world of selection change. convert set to array.
    this.props.onSelectionChange(Array.from(selectedObjects));
  }

  /* ⚠
    * getBBox() might have insufficient browser support!
    * The function has little documentation. In case use of BBox turns out
    * problematic, consider using `target.getBoundingClientRect()` along with
    * $('<svg>').getBoundingClientRect() to correct the x and y offset.
    */
  getBBox = (index) => this.objectRefs[index].getBBox()

  handlers = {
    multiSelectOn: () => this.setState({ multiSelect: true }),
    multiSelectOff: () => this.setState({ multiSelect: false })
  };

  map = {
    multiSelectOn: { sequence: 'ctrl', action: 'keydown' },
    multiSelectOff: { sequence: 'ctrl', action: 'keyup' }
  };

  renderObject = (object, index) => {
    const { objectTypes } = this.props;
    const ObjectComponent = objectTypes[object.type];

    return (
      <ObjectComponent
        {...object}
        key={index}
        refCallback={ref => {
          this.objectRefs[index] = ref;
        }} // 💡 We should use `createRef` from React ^v16.x onwards instead.
        onMouseOver={() => this.onMouseOver(index)}
        onMouseDown={event => this.onMouseDown(index, event)}
        onMouseLeave={this.onMouseLeave}
        onFocus={() => { }} // 🔨 disable eslint rule that requires this
      />
    );
  }

  renderHoveringObject = (objectIndex) => {
    if (this.state.selectedObjects.has(objectIndex)) {
      return;
    }

    const box = this.getBBox(objectIndex);
    const offset = 0;
    const margin = offset * 2;
    const rect = {
      x: box.x - offset,
      y: box.y - offset,
      width: box.width + margin,
      height: box.height + margin
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
          onMouseLeave={this.onMouseLeave}
        />
      </g>
    );
  }

  renderSelectedObject = (objectIndex, index) => {
    const {
      x,
      y,
      width,
      height
    } = this.getBBox(objectIndex);

    return (
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          stroke: '#4285f4',
          fill: 'none',
          strokeWidth: '3px'
        }}
        onMouseDown={(event) => this.onMouseDown(objectIndex, event)}
        key={index}
      />
    );
  }

  render() {
    const { width, height, objects } = this.props;
    const { isHovering, currentlyHovering, selectedObjects } = this.state;
    const selectedObjectsArray = [...selectedObjects]; // Convert Set to Array

    return (
      <HotKeys keyMap={this.map} handlers={this.handlers} focused attach={window}>
        <svg
          width={width}
          height={height}
          style={styles}
          onKeyDown={this.keyDown}
        >
          {objects.map(this.renderObject)}

          {isHovering && this.renderHoveringObject(currentlyHovering)}

          {selectedObjectsArray.map(this.renderSelectedObject)}
        </svg>
      </HotKeys>
    );
  }
}

export const styles = {
  backgroundImage: 'url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5' +
    'vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0' +
    'PSIyMCIgZmlsbD0iI2ZmZiI+PC9yZWN0Pgo8cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9I' +
    'iNGN0Y3RjciPjwvcmVjdD4KPHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIG' +
    'ZpbGw9IiNGN0Y3RjciPjwvcmVjdD4KPC9zdmc+)',
  backgroundSize: 'auto'
};
