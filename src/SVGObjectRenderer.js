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
    multiSelect: false,
    selectedType: null
  }

  constructor(props) {
    super(props);
    this.objectRefs = {};
  }

  onMouseOver = (index) => {
    this.setState({ isHovering: true, currentlyHovering: index });
  }

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

  isSelectedType = (index) =>
    this.props.objects[index].type === this.state.selectedType;

  shouldRenderHover = (index) => {
    const { isHovering, selectedObjects, multiSelect } = this.state;

    // don't render when object already selected
    if (!isHovering || selectedObjects.has(index)) {
      return false;
    }
    
    // don't render when selecting objects of same type
    if (selectedObjects.size > 0 && multiSelect) {
      return this.isSelectedType(index);
    }

    return true;
  }

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
    if (objects.has(index)) { // remove from selection
      objects.delete(index);
      return objects;
    } else { // add to selection
      // possibly, dissalow selecting another type
      const sameType = this.isSelectedType(index);
      return sameType ? objects.add(index) : objects;
    }
  }

  singleSelect(index, objects) {
    if (objects.has(index)) { // deselect
      objects.clear();
      return objects;
    } else { // select
      objects.clear();
      this.setState({
        selectedType: this.props.objects[index].type
      });
      return objects.add(index);
    }
  }

  computeSelection(index) {
    const { selectedObjects, multiSelect } = this.state;

    if (multiSelect && selectedObjects.size > 0) {
      return this.multiSelect(index, selectedObjects);
    } else {
      return this.singleSelect(index, selectedObjects);
    }
  }

  render() {
    const { width, height, objects } = this.props;
    const { currentlyHovering, selectedObjects } = this.state;
    const selectedObjectsArray = [...selectedObjects]; // Convert Set to Array
    const renderHover = this.shouldRenderHover(currentlyHovering);

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
