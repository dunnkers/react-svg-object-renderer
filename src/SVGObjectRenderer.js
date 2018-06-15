import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { HotKeys } from 'react-hotkeys';

import HoverRect from './HoverRect';
import SelectRect from './SelectRect';

export default class SVGObjectRenderer extends Component {
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

  constructor(props) {
    super(props);
    this.objectRefs = {};
  }

  onMouseOver = (index) => this.setState({
    isHovering: true,
    currentlyHovering: index
  });

  onMouseLeave = () => this.setState({ isHovering: false })

  onMouseDown = (index, event) => {
    event.preventDefault(); // 💡 Prevents user selecting any svg text

    this.setState({
      selectedObjects: this.computeSelection(index)
    });

    // notify outside world of selection change. convert set to array.
    this.props.onSelectionChange(Array.from(this.state.selectedObjects));
  }

  /* ⚠
    * getBBox() might have insufficient browser support!
    * The function has little documentation. In case use of BBox turns out
    * problematic, consider using `target.getBoundingClientRect()` along with
    * $('<svg>').getBoundingClientRect() to correct the x and y offset.
    */
  getBBox = (index) => {
    // destruct and construct;  getBBox returns a SVGRect which does not spread.
    const { x, y, width, height } = this.objectRefs[index].getBBox();
    return { x, y, width, height };
  }

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
      />
    );
  }

  multiSelect(index, objects) {
    if (objects.has(index)) {
      objects.delete(index);
      return objects;
    } else {
      return objects.add(index);
    }
  }

  singleSelect(index, objects) {
    const hasSelection = objects.has(index);
    objects.clear();
    return hasSelection ? objects : objects.add(index);
  }

  computeSelection(index) {
    if (this.state.multiSelect) {
      return this.multiSelect(index, this.state.selectedObjects);
    } else {
      return this.singleSelect(index, this.state.selectedObjects);
    }
  }

  render() {
    const { width, height, objects } = this.props;
    const { isHovering, currentlyHovering, selectedObjects } = this.state;
    const selectedObjectsArray = [...selectedObjects]; // Convert Set to Array

    const renderHover = isHovering && 
      !this.state.selectedObjects.has(currentlyHovering);

    return (
      <HotKeys keyMap={this.map} handlers={this.handlers} focused attach={window}>
        <svg width={width} height={height} style={styles} >
          {objects.map(this.renderObject)}

          {renderHover && (
            <HoverRect
              {...this.getBBox(currentlyHovering)}
              stopHover={this.onMouseLeave}  
            />
          )}

          {selectedObjectsArray.map((objectIndex, index) => (
            <SelectRect
              {...this.getBBox(objectIndex)}
              key={index}
              select={(event) => this.onMouseDown(objectIndex, event)}
            />
          ))}
        </svg>
      </HotKeys>
    );
  }
}

export const styles = {
  backgroundImage: 'url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5'
    + 'vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0'
    + 'PSIyMCIgZmlsbD0iI2ZmZiI+PC9yZWN0Pgo8cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9I'
    + 'iNGN0Y3RjciPjwvcmVjdD4KPHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIG'
    + 'ZpbGw9IiNGN0Y3RjciPjwvcmVjdD4KPC9zdmc+)',
  backgroundSize: 'auto'
};
