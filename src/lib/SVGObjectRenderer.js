import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';

import HoverRect from './HoverRect';
import SelectRect from './SelectRect';
import DragRect from './DragRect';
import Surface from './Surface';
import HotKeyProvider from './HotKeyProvider';

export default class SVGObjectRenderer extends Component {
  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    objects: PropTypes.arrayOf(PropTypes.shape({
      type: PropTypes.string.isRequired
    })),
    objectTypes: PropTypes.objectOf(PropTypes.func),
    onSelectionChange: PropTypes.func,
    multipleTypeSelection: PropTypes.bool
  }

  static defaultProps = {
    width: 400,
    height: 400,
    objects: [],
    objectTypes: {},
    onSelectionChange: () => {},
    multipleTypeSelection: false
  }

  state = {
    isHovering: false,
    currentlyHovering: null,
    selectedObjects: new Set(),
    multiSelect: false,
    selectedType: null,
    dragging: false,
    dragOrigin: { x: 0, y: 0 },
    dragRect: { x: 0, y: 0, width: 0, height: 0 }
  }

  constructor(props) {
    super(props);
    this.objectRefs = Object.entries(props.objects).map(() => createRef());
    this.svgRef = createRef();
  }

  onMouseOver = (index) => {
    this.setState({ isHovering: true, currentlyHovering: index });
  }

  onMouseLeave = () => this.setState({ isHovering: false })

  selectObjects = indexes => {
    const newSelection = new Set(indexes);
    this.setState({ selectedObjects: newSelection });

    // ⚡ notify outside world of selection change. convert set to array.
    this.props.onSelectionChange(Array.from(newSelection));
  }

  onMouseDown = (index, event) => {
    event.preventDefault(); // 💡 Prevents user selecting any svg text

    const newSelection = this.computeSelection(index);

    this.setState({
      selectedObjects: newSelection
    });

    // ⚡ notify outside world of selection change. convert set to array.
    this.props.onSelectionChange(Array.from(newSelection));
  }

  /* ⚠
    * getBBox() might have insufficient browser support!
    * The function has little documentation. In case use of BBox turns out
    * problematic, consider using `target.getBoundingClientRect()` along with
    * $('<svg>').getBoundingClientRect() to correct the x and y offset.
    */
  getBBox = (index) => {
    // destruct and construct;  getBBox returns a SVGRect which does not spread.
    const { x, y, width, height } = this.objectRefs[index].current.getBBox();
    return { x, y, width, height };
  }

  isSelectedType = (index) =>
    this.props.objects[index].type === this.state.selectedType;

  shouldRenderHover = (index) => {
    const { isHovering, selectedObjects, multiSelect } = this.state;
    const { multipleTypeSelection } = this.props;

    // don't render when object already selected
    if (!isHovering || selectedObjects.has(index)) {
      return false;
    }
    
    // don't render when selecting objects of same type
    if (selectedObjects.size > 0 && multiSelect) {
      return this.isSelectedType(index) || multipleTypeSelection;
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
        nodeRef={this.objectRefs[index]}
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
      const { multipleTypeSelection } = this.props;
      const sameType = this.isSelectedType(index) || multipleTypeSelection;
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

  rectToBox = (rect) => {
    return {
      left: rect.x,
      right: rect.x + rect.width,
      top: rect.y,
      bottom: rect.y + rect.height
    };
  }

  stopDrag = (event) => {
    if (this.state.dragging) {
      const indices = this.props.objects.map((object, index) => index);
      const toSelect = indices.filter(index => {
        return this.boxOverlap(
          this.rectToBox(this.state.dragRect),
          this.rectToBox(this.getBBox(index))
        );
      });
      this.selectObjects(toSelect);
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
    const { width, height, objects } = this.props;
    const { currentlyHovering, selectedObjects, dragging } = this.state;
    const selectedObjectsArray = [...selectedObjects]; // Convert Set to Array
    const renderHover = this.shouldRenderHover(currentlyHovering);

    return (
      <HotKeyProvider width={width}
        setMultiSelect={multiSelect => this.setState({ multiSelect })}
      >
        <svg
          ref={this.svgRef}
          width={width}
          height={height}
          style={styles}
          onMouseDown={this.startDrag}
          onMouseMove={this.handleDrag}
          onMouseUp={this.stopDrag}
        >
          <Surface deselectAll={() => {
            if (this.state.selectedObjects.size > 0) {
              this.setState({
                selectedObjects: new Set()
              });
  
              // ⚡ notify outside world of selection change. convert set to array.
              this.props.onSelectionChange(Array.from(this.state.selectedObjects));
            }
          }}/>

          {objects.map(this.renderObject)}

          {renderHover && !dragging && (
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

          {dragging && <DragRect {...this.state.dragRect} />}
        </svg>
      </HotKeyProvider>
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
